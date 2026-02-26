import { PlanType } from "@/types";

const planOrder: Record<PlanType, number> = {
  "Base": 1,
  "Pro": 2,
  "Smart": 3,
};

export function normalizePlan(plan: string | undefined | null): PlanType | null {
  if (!plan) return null;

  const normalized = plan.toUpperCase().replace("-", "_");

  if (normalized.includes("Smart")) return "Smart";
  if (normalized.includes("Pro")) return "Pro";
  if (normalized.includes("Base")) return "Base";

  return null;
}

export function PlanAccess(userPlan: string | null | undefined, requiredPlan: PlanType): boolean {
  const normalized = normalizePlan(userPlan);
  if (!normalized) return false;
  return planOrder[normalized] >= planOrder[requiredPlan];
}
