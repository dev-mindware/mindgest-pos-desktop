export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  trialEndsAt: string;
  periodStartsAt: string;
  periodEndsAt: string;
  canceledAt: string;
  createdAt?: string;
  updatedAt?: string;
  billingInterval: string;
  paymentProvider: string;
  providerClientId: string;
  providerSubscriptionId: string;
  billingPeriodInMonths: string | null;
  plan: Plan;
}

export type PlanType = "Base" | "Pro" | "Smart";

export enum SubscriptionStatus {
  TRIALING = "TRIALING",
  ACTIVE = "ACTIVE",
  PAST_DUE = "PAST_DUE",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
  PENDING = "PENDING",
}

/* export interface Plan {
  id: string;
  name: PlanType;
  priceMonthly: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  maxUsers: number;
  maxStores: number;
  trialPeriodInDays: number | null;
  billingIntervals: any[];
  features: Features;
} */

/* export interface Features {
  hasPOS: boolean;
  hasGestAI: boolean;
  canExportSaft: boolean;
  hasStockManagement: boolean;
  hasAdvancedReporting: boolean;
  hasSupplierManagement: boolean;
  hasSimplifiedReporting: boolean;
} */

export interface Plan {
  id: string
  name: PlanType
  priceMonthly: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  order: number
  maxUsers: number
  maxStores: number
  trialPeriodInDays?: number
  features: Features
}

export interface Features {
  hasPos: boolean
  canExportSaft: boolean
  hasStock: boolean
  hasInvoices: boolean
  hasReporting: boolean
  hasSuppliers: boolean
  hasAppearance?: boolean
  hasPrintFormats?: boolean
}