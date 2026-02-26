import { PackageOpen, LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
}

export function EmptyState({
  title = "Nenhum item adicionado",
  description = "Adicione novos itens para começar.",
  icon: Icon = PackageOpen,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full p-8 text-center border-2 border-dashed rounded-xl bg-card">
     {/*  <Icon className="w-12 h-12 mb-4 text-foreground" /> */}
     <h1>ICONE</h1>
      <h2 className="text-lg font-semibold text-foreground">
        {title}
      </h2>
      <p className="mt-1 text-sm text-foreground">
        {description}
      </p>
    </div>
  );
}