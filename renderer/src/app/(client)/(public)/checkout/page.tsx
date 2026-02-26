import {
  HeaderSubscription,
  HeroSubscription,
  SubscriptionPageContent,
} from "@/components";

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen min-w-screen bg-gray-50 dark:bg-background">
      <HeaderSubscription />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <HeroSubscription description="O MindGest centraliza finanças, estoque, vendas e relatórios em um só lugar. Simples, rápido e inteligente — a solução ideal para empresas que querem crescer com sustentabilidade." />
          <SubscriptionPageContent />
        </div>
      </div>
    </div>
  );
}
