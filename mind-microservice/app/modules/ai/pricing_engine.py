import os
import sqlite3
import json
from datetime import datetime
from app.modules.common.logger import get_logger

logger = get_logger(__name__)

class PricingEngine:
    def __init__(self, db_path: str = None):
        """
        Initialize the Mind Pricing Engine.
        """
        if db_path is None:
            # Assuming mindgest-pos-dev.db is at the root of the monorepo
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            self.db_path = os.path.join(base_dir, "mindgest-pos-dev.db")
        else:
            self.db_path = db_path

        # Default rules
        self.max_discount = 0.4
        self.critical_hours_to_close = 2
        self.high_stock_threshold = 50
        self.close_expiration_days = 2
        
        # This will be controlled by settings
        self.is_enabled = True

    def _get_db_connection(self):
        try:
            return sqlite3.connect(self.db_path)
        except Exception as e:
            logger.error(f"Failed to connect to SQLite DB at {self.db_path}: {e}")
            return None

    def _get_location_sensitivity_multiplier(self) -> float:
        """
        Phase 4: Strategic Differential.
        Calculates the average ticket size from local sales history to determine 
        the store location's price sensitivity index.
        lower average ticket = higher discount allowed (multiplier > 1)
        higher average ticket = lower discount allowed (multiplier < 1)
        """
        conn = self._get_db_connection()
        if not conn:
            return 1.0

        try:
            df = conn.execute(
                "SELECT payload FROM offline_documents WHERE type IN ('invoice-receipt', 'invoice', 'receipt')"
            ).fetchall()

            if not df:
                return 1.0

            total_revenue = 0.0
            valid_sales = 0
            
            for row in df:
                try:
                    payload = json.loads(row[0])
                    total = float(payload.get('total', 0))
                    total_revenue += total
                    valid_sales += 1
                except Exception:
                    continue

            if valid_sales == 0:
                return 1.0

            average_ticket = total_revenue / valid_sales
            logger.info(f"[PricingEngine] Average Ticket Size: {average_ticket:.2f}")

            # Adjust aggressiveness based on ticket size (example rules)
            if average_ticket < 5000:
                return 1.2
            if average_ticket > 20000:
                return 0.8
                
            return 1.0
        except Exception as e:
            logger.error(f"Error calculating sensitivity: {e}")
            return 1.0
        finally:
            conn.close()

    def recalculate_prices(self) -> dict:
        """
        Runs the deterministic algorithm to adjust product prices in the cache.
        Returns a dict with statistics of the run for the frontend or logs.
        """
        if not self.is_enabled:
            logger.info("Pricing Engine is disabled. Skipping calculation.")
            return {"status": "disabled", "items_updated": 0}

        conn = self._get_db_connection()
        if not conn:
            return {"status": "error", "message": "DB connection failed"}

        try:
            # 1. Fetch current cached products
            cursor = conn.cursor()
            rows = cursor.execute("SELECT id, data FROM cache_products").fetchall()
            
            if not rows:
                logger.info("No cached products to process.")
                return {"status": "success", "items_updated": 0}

            # 2. Determine time factor
            current_hour = datetime.now().hour
            closing_hour = 22 # Assuming store closes at 22:00
            hours_to_close = max(0, closing_hour - current_hour)
            is_critical_time = (0 < hours_to_close <= self.critical_hours_to_close)

            # Location Multiplier
            location_multiplier = self._get_location_sensitivity_multiplier()
            effective_max_discount = min(0.8, self.max_discount * location_multiplier)

            updated_count = 0

            # Begin transaction to update rows
            cursor.execute("BEGIN TRANSACTION")

            for row in rows:
                product_id = row[0]
                try:
                    product = json.loads(row[1])
                    
                    discount_pct = 0.0

                    # Base price logic (ensure we have a raw original price stored, assuming 'cost' or 'originalPrice')
                    # If 'originalPrice' doesn't exist, this is the first time we discount it. Back it up.
                    if 'originalPrice' not in product:
                        product['originalPrice'] = float(product.get('price', 0))

                    original_price = product['originalPrice']
                    if original_price <= 0:
                         continue # Can't discount free items

                    # Rule A: Time to close
                    if is_critical_time:
                        decay_rate = 0.1 # 10% base
                        discount_pct += decay_rate * (self.critical_hours_to_close - hours_to_close + 1)

                    # Rule B: Stock Levels
                    qty = float(product.get('quantity', 0))
                    if qty > self.high_stock_threshold:
                        discount_pct += 0.15

                    # Rule C: Expiration Date
                    if product.get('hasExpiry') and product.get('expiryDate'):
                        try:
                            # Try parsing YYYY-MM-DD
                            exp_date = datetime.strptime(product['expiryDate'].split('T')[0], "%Y-%m-%d")
                            days_to_expire = (exp_date - datetime.now()).days
                            if 0 <= days_to_expire <= self.close_expiration_days:
                                discount_pct += 0.20
                            elif days_to_expire < 0:
                                # Expired item. Business rules vary, maybe 100% discount or mark as unsellable.
                                # Given it's a food/perishable POS, usually it shouldn't be sellable, but let's push a high discount for now.
                                discount_pct += 0.50 
                        except ValueError:
                            pass # Invalid date format

                    # Apply location multiplier
                    discount_pct *= location_multiplier
                    
                    # Cap
                    discount_pct = min(discount_pct, effective_max_discount)

                    # Create new dynamic price
                    if discount_pct > 0:
                        new_price = original_price * (1 - discount_pct)
                        product['price'] = round(new_price, 2)
                        product['isDynamicallyPriced'] = True
                        product['appliedDiscountPct'] = round(discount_pct * 100, 2)
                    else:
                        product['price'] = original_price
                        product['isDynamicallyPriced'] = False
                        product['appliedDiscountPct'] = 0

                    # Update the row in cache_products
                    cursor.execute(
                        "UPDATE cache_products SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                        (json.dumps(product), product_id)
                    )
                    updated_count += 1

                except Exception as e:
                    logger.warning(f"Failed to process product {product_id}: {e}")
                    continue
            
            conn.commit()
            logger.info(f"Recalculated pricing for {updated_count} items. Max discount allowed: {effective_max_discount * 100:.1f}%.")
            return {
                "status": "success", 
                "items_updated": updated_count, 
                "max_discount_allowed": effective_max_discount
            }

        except Exception as e:
            conn.rollback()
            logger.error(f"Error updating prices in database: {e}")
            return {"status": "error", "message": str(e)}
        finally:
            conn.close()

pricing_engine = PricingEngine()
