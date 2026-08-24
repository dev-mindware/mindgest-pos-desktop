import { Icon } from "@/components";
import { Role, PlanType } from "@/types";

type SubMenuItem = {
  name: string;
  url: string;
  roles?: Role[];
  minPlan?: PlanType;
};

export type MenuItem = {
  name: string;
  url: string;
  icon?: React.ReactNode;
  roles?: Role[];
  minPlan?: PlanType;
  showMoreIcon?: boolean;
  showUpgrade?: boolean;
  items?: SubMenuItem[];
};

export type MenuStructure = {
  items: MenuItem[];
};

export const menuItems: MenuStructure = {
  items: [
    {
      name: "Ponto de Venda",
      url: "/pos/counter",
      icon: <Icon name="Store" className="w-5 h-5" />,
      roles: ["CASHIER", "MANAGER", "OWNER"],
      minPlan: "Smart",
    },
    {
      name: "Movimentos de Caixa",
      url: "/pos/movements",
      icon: <Icon name="Receipt" className="w-5 h-5" />,
      roles: ["CASHIER", "MANAGER", "OWNER"],
      minPlan: "Smart",
    },
    {
      name: "Clientes",
      url: "/clients",
      icon: <Icon name="Users" className="w-5 h-5" />,
      roles: ["CASHIER", "MANAGER", "OWNER"],
      minPlan: "Smart",
    },
    {
      name: "Notificações",
      url: "/pos/notifications",
      icon: <Icon name="Bell" className="w-5 h-5" />,
      roles: ["CASHIER", "MANAGER", "OWNER"],
      minPlan: "Smart",
    },
    {
      name: "Definições POS",
      url: "/pos/settings",
      icon: <Icon name="Settings" className="w-5 h-5" />,
      roles: ["CASHIER", "MANAGER", "OWNER"],
      minPlan: "Smart",
    },
  ],
};
