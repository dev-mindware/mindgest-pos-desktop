import { Icon } from "@/components";

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex flex-col items-center group transition-all duration-300 hover:-translate-y-1">
      <div className="bg-primary-50 dark:bg-primary-900/10 rounded-2xl p-5 mb-4 shadow-sm group-hover:shadow-md group-hover:bg-primary-100 dark:group-hover:bg-primary-900/20 transition-all">
        <Icon
          name={icon as any}
          className="h-8 w-8 text-primary-600 animate-in fade-in zoom-in duration-500"
        />
      </div>
      <h3 className="font-bold text-lg mb-2 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
        {description}
      </p>
    </div>
  );
}

export function PlanInclusionFeatures() {
  const features = [
    {
      icon: "Shield",
      title: "Segurança Garantida",
      description:
        "Seus dados protegidos com criptografia de ponta a ponta e backups diários.",
    },
    {
      icon: "Headphones",
      title: "Suporte Dedicado",
      description:
        "Equipe especializada pronta para ajudar seu negócio a crescer em qualquer canal.",
    },
    {
      icon: "RefreshCw",
      title: "Atualizações Contínuas",
      description:
        "Novos recursos e melhorias de performance constantes inclusos em seu plano.",
    },
  ];

  return (
    <div className="mt-20 py-16 border-t border-border/50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Todos os planos incluem
        </h2>
        <div className="h-1.5 w-16 bg-primary-500 rounded-full mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto px-4">
        {features.map((feature) => (
          <FeatureItem key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  );
}
