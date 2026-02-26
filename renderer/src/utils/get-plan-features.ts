import { Plan } from "@/types";

export function getPlanFeatures(plan: Plan): string[] {
  return [
    plan.maxUsers > 0 ? `Até ${plan.maxUsers} usuários` : "Usuários ilimitados",
    plan.maxStores > 0 ? `Até ${plan.maxStores} loja(s)` : "Lojas ilimitadas",
    plan.features.canExportSaft && "Exportação SAFT",
    plan.order === 0 ? "Relatórios Básicos" : "Relatórios Avançados",
    plan.features.hasStock && "Gestão de estoque",
    plan.features.hasSuppliers && "Gestão de fornecedores",
    plan.features.hasPos && "Gestão de POS",
    plan.features.hasInvoices && "Faturas Ilimitadas",
    plan.features.hasAppearance && "Personalização de aparência",
    plan.features.hasPrintFormats && "Múltiplos Formatos de impressão",
  ].filter((feature): feature is string => Boolean(feature));
}
