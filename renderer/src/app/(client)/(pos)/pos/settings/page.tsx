import { PageWrapper } from "@/components";
import { PosSettingsSetup } from "@/components/client/pos";

export default function PosSettingsPage() {
    return (
        <PageWrapper subRoute="Definições" routeLabel="Configurações">
            <PosSettingsSetup />
        </PageWrapper>
    );
}
