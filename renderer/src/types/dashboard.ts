export interface DashboardSummaryItem {
  total?: number;
  amount?: number;
  insight: string;
}

export interface DashboardSummary {
  productsSold: DashboardSummaryItem;
  servicesRendered: DashboardSummaryItem;
  totalSales: DashboardSummaryItem;
  overallTotal: DashboardSummaryItem;
}

export interface RevenueEvolution {
  month: string;
  revenue: number;
}

export interface SalesDistribution {
  category: string;
  value: number;
  label: string;
}

export interface StoreBreakdown {
  storeId: string;
  storeName: string;
  totalSales: number;
  productsSold: number;
  servicesRendered: number;
}

export interface RecentSale {
  id: string;
  customerName: string;
  date: string;
  amount: number;
  status: "completed" | "pending" | "cancelled";
  itemsCount: number;
}

export interface UserContext {
  role: string;
  email: string;
}

export interface ManagerDashboardData {
  summary: DashboardSummary;
  revenueEvolution: RevenueEvolution[];
  salesDistribution: SalesDistribution[];
  recentSales: RecentSale[];
  userContext: UserContext;
}

export interface OwnerDashboardData extends ManagerDashboardData {
  storesBreakdown: StoreBreakdown[];
}
