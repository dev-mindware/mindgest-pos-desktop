export interface PreferredItem {
  itemsId: string;
  itemName: string;
  quantity: number;
  revenue: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  invoices: number;
}

export interface ClientAnalytics {
  clientId: string;
  clientName: string;
  clientEmail: string;
  totalPurchases: number;
  totalRevenue: number;
  totalInvoices: number;
  averageOrderValue: number;
  lastPurchaseDate: string;
  firstPurchaseDate: string;
  loyaltyScore: number;
  preferredItems: PreferredItem[];
  monthlyTrend: MonthlyTrend[];
}

export interface ClientAnalyticsSummary {
  totalClients: number;
  totalRevenue: number;
  averageTicket: number;
  averageLoyaltyScore: number;
}

export interface ClientAnalyticsResponse {
  startDate: string;
  endDate: string;
  type: string;
  count: number;
  clients: ClientAnalytics[];
  summary: ClientAnalyticsSummary;
}

// ========================
// 📊 SALES REPORTS TYPES
// ========================

export type SalesPeriod = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export interface SalesDataPoint {
  date: string;
  totalSales: number;
  totalRevenue: number;
  transactionCount: number;
  averageTicket: number;
}

export interface SalesSummary {
  totalRevenue: number;
  totalTransactions: number;
  averageTicket: number;
}

export interface SalesReportData {
  period: SalesPeriod;
  startDate: string;
  endDate: string;
  data: SalesDataPoint[];
  summary: SalesSummary;
}
