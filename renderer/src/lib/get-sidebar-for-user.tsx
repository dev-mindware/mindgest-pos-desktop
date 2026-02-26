import { Icon } from "@/components";
import { MenuItem } from "@/constants/menu-items";
import { Role, PlanType, Subscription, SubscriptionStatus } from "@/types";

export function getSidebarForUser(
  items: MenuItem[],
  role: Role,
  subscription: Subscription,
  plan?: PlanType,
): MenuItem[] {

  if (subscription.status === SubscriptionStatus.PENDING) {
    return items
      .filter((item) => !item.roles || item.roles.includes(role))
      .map((item) => {
        const isPlans = item.url === "/plans";
        const isSettings = item.url === "/settings";

        if (isPlans || isSettings) return item;

        return {
          ...item,
          showUpgrade: true,
        };
      });
  }

  return items  
    .filter((item) => {
      const roleOk = !item.roles || item.roles.includes(role);
      const planOk = !item.minPlan || plan! >= item.minPlan;

      if (!planOk && item.showUpgrade) return roleOk;

      return roleOk && planOk;
    })
    .map((item) => ({
      ...item,
      items: item.items?.filter((sub) => {
        const roleOk = !sub.roles || sub.roles.includes(role);
        const planOk = !sub.minPlan || plan! >= sub.minPlan;
        return roleOk && planOk;
      }),
    }));
}
