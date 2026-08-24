export interface HotkeyDefinition {
  key: string;
  code: string;
  label: string;
  description: string;
  category: "Geral" | "Vendas" | "Itens" | "Caixa";
  requiresPermission?: boolean;
}

export const POS_HOTKEYS: HotkeyDefinition[] = [
  {
    key: "F1",
    code: "F1",
    label: "Ajuda & Atalhos",
    description: "Abre o mapa completo de atalhos do teclado.",
    category: "Geral",
  },
  {
    key: "F2",
    code: "F2",
    label: "Pesquisar Produto",
    description: "Foca o campo de busca de produtos ou leitura de código de barras.",
    category: "Vendas",
  },
  {
    key: "F3",
    code: "F3",
    label: "Selecionar Cliente",
    description: "Abre o seletor rápido de cliente para emissão de fatura.",
    category: "Vendas",
  },
  {
    key: "F4",
    code: "F4",
    label: "Finalizar Venda (Checkout)",
    description: "Abre o modal de pagamento para escolher a forma de pagamento e concluir a venda.",
    category: "Vendas",
  },
  {
    key: "F5",
    code: "F5",
    label: "Dinheiro Exato",
    description: "Conclui a venda imediatamente no valor exato em numerário.",
    category: "Vendas",
  },
  {
    key: "F8",
    code: "F8",
    label: "Guardar / Suspender Venda",
    description: "Guarda a venda atual em espera para atender outro cliente.",
    category: "Vendas",
  },
  {
    key: "F9",
    code: "F9",
    label: "Abrir Gaveta de Dinheiro",
    description: "Dispara o pulso para abrir a gaveta (Requer permissão de Gerente/Owner para caixas).",
    category: "Caixa",
    requiresPermission: true,
  },
  {
    key: "F10",
    code: "F10",
    label: "Limpar Carrinho",
    description: "Remove todos os itens do carrinho ativo.",
    category: "Vendas",
  },
  {
    key: "Delete",
    code: "Delete",
    label: "Remover Item",
    description: "Remove o produto selecionado do carrinho.",
    category: "Itens",
  },
  {
    key: "+",
    code: "NumpadAdd",
    label: "Aumentar Quantidade",
    description: "Incrementa em 1 a quantidade do último item adicionado.",
    category: "Itens",
  },
  {
    key: "-",
    code: "NumpadSubtract",
    label: "Diminuir Quantidade",
    description: "Decrementa em 1 a quantidade do último item adicionado.",
    category: "Itens",
  },
  {
    key: "ESC",
    code: "Escape",
    label: "Cancelar / Fechar",
    description: "Fecha janelas modais, cancela ações ou retira o foco dos campos.",
    category: "Geral",
  },
];
