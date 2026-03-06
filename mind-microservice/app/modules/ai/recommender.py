import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
import os
import json
from app.modules.common.logger import get_logger

logger = get_logger(__name__)

class RecommenderEngine:
    def __init__(self, db_path: str = None):
        # Determine the database path. In development it's mindgest-pos-dev.db
        if db_path is None:
            # Assumes python-microservice is inside the same root directory as mindgest-pos-desktop
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
            self.db_path = os.path.join(base_dir, "mindgest-pos-dev.db")
        else:
            self.db_path = db_path
            
        self.rules_cache_path = os.path.join(os.path.dirname(__file__), "rules_cache.json")
        self.rules = None

    def train_model(self, invoices_data: list = None):
        """
        Trains the Apriori model using provided sales history, and saves association rules.
        """
        logger.info("Starting Apriori training for Recommendation Engine from provided payload...")
        
        if not invoices_data:
            logger.info("No sales history provided. Cannot train recommendation model.")
            return False

        try:
            transactions = []
            for inv in invoices_data:
                try:
                    # Ensure we only use finalized documents
                    status = inv.get('status', 'PAID')
                    if status in ['DRAFT', 'CANCELED', 'VOID', 'PENDING']:
                        continue
                        
                    # Extract list of item IDs
                    # From structure: inv['items'] consists of objects with nested 'item' objects
                    items_list = []
                    for item_req in inv.get('items', []):
                        # Safely try nested 'item.id' or fallback to 'itemsId' / 'item_id'
                        item_id = item_req.get('item', {}).get('id') or item_req.get('itemsId')
                        if item_id:
                            items_list.append(item_id)
                            
                    if items_list:
                        transactions.append(items_list)
                except Exception as e:
                    logger.warning(f"Failed to parse invoice {inv.get('id', 'unknown')}: {e}")
                    continue
                    
            if not transactions:
                logger.info("No valid transaction items found.")
                return False

            # Convert to DataFrame of booleans for Apriori
            from mlxtend.preprocessing import TransactionEncoder
            te = TransactionEncoder()
            te_ary = te.fit(transactions).transform(transactions)
            df = pd.DataFrame(te_ary, columns=te.columns_)

            # 1. Minimum Support
            frequent_itemsets = apriori(df, min_support=0.01, use_colnames=True)
            
            if frequent_itemsets.empty:
               logger.info("No frequent itemsets found with the current minimum support.")
               return False

            # 2. Association Rules
            rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.2)
            
            if rules.empty:
                logger.info("No association rules found with the current confidence threshold.")
                return False

            # Convert frozensets to lists for JSON serialization
            rules['antecedents'] = rules['antecedents'].apply(list)
            rules['consequents'] = rules['consequents'].apply(list)
            
            # Sort by confidence
            rules = rules.sort_values('confidence', ascending=False)
            
            # Save mapping to cache
            rules_dict = rules[['antecedents', 'consequents', 'confidence', 'lift']].to_dict('records')
            
            with open(self.rules_cache_path, 'w') as f:
                json.dump(rules_dict, f)
                
            self.rules = rules_dict
            logger.info(f"Successfully trained model. Generated {len(rules_dict)} rules.")
            return True

        except Exception as e:
            logger.error(f"Error training recommendation model: {e}")
            return False

    def get_recommendations(self, current_cart_items: list, max_recommendations: int = 3):
        """
        Receives the current cart items (IDs) and returns recommended items.
        """
        if self.rules is None:
            if os.path.exists(self.rules_cache_path):
                try:
                    with open(self.rules_cache_path, 'r') as f:
                        self.rules = json.load(f)
                except Exception:
                    self.rules = []
            else:
                self.rules = []
                
        if not self.rules:
            return []

        recommendations = {}
        cart_set = set(current_cart_items)

        for rule in self.rules:
            antecedents = set(rule['antecedents'])
            consequents = rule['consequents']
            
            # If the current cart contains all antecedents of a rule
            if antecedents.issubset(cart_set):
                for item in consequents:
                    if item not in cart_set: # Don't recommend what's already in the cart
                        # Use lift as a score. Keep highest score if item is recommended by multiple rules
                        score = rule['lift']
                        if item not in recommendations or score > recommendations[item]:
                            recommendations[item] = score

        # Sort recommendations by score and return top N
        sorted_recs = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)
        return [item for item, score in sorted_recs[:max_recommendations]]

recommender = RecommenderEngine()
