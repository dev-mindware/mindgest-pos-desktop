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
      name: "Clientes",
      url: "/clients",
      icon: <Icon name="Users" className="w-5 h-5" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "Base",
    },
    {
      name: "Items",
      url: "/items",
      icon: <Icon name="ShoppingBasket" className="w-5 h-5" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "Base",
    },
    {
      name: "Documentos",
      url: "/documents",
      icon: <Icon name="ScrollText" className="w-5 h-5" />,
      roles: ["MANAGER", "OWNER"],
      minPlan: "Base",
    },
    {
      name: "Ponto de Venda",
      url: "/pos/counter",
      icon: <Icon name="Computer" className="w-5 h-5" />,
      roles: ["CASHIER", "MANAGER", "OWNER"],
      minPlan: "Base",
    },
    {
      name: "Movimentações",
      url: "/pos/movements",
      icon: <Icon name="Wallet" className="w-5 h-5" />,
      roles: ["CASHIER", "MANAGER", "OWNER"],
      minPlan: "Base",
    },
  ],
};