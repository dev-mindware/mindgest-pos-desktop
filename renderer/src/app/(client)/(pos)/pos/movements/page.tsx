"use client";
import { PageWrapper, MovementsContent } from "@/components";

export default function Page() {
  return (
    <PageWrapper
      routeLabel="Movimentos de Caixa"
      subRoute="Movimentos de Caixa"
      onboardingTourId="pos-movements"
    >
      <MovementsContent />
    </PageWrapper>
  );
}
