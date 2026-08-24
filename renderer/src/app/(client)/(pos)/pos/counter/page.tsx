"use client";
import { PageWrapper, CounterContent } from "@/components";

export default function Page() {
  return (
    <PageWrapper
      subRoute="Caixa"
      routeLabel="Caixa"
      variant="counter"
      onboardingTourId="pos-invoice"
    >
      <CounterContent />
    </PageWrapper>
  );
}
