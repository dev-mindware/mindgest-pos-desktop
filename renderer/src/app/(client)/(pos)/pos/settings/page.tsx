
"use client";
import { PageWrapper } from "@/components";
import { PosSettingsSetup } from "@/components/client/pos";

export default function PosSettingsPage() {
    return (
        <PageWrapper routeLabel="Configurações" subRoute="Configurações" onboardingTourId="pos-settings">
            <PosSettingsSetup />
        </PageWrapper>
    );
}
