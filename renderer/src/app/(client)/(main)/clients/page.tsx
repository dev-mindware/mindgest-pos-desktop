import { ClientsPageContent, PageWrapper } from "@/components";

export default function page() {
  return (
    <PageWrapper routeLabel="Clientes" subRoute="Clientes">
      <ClientsPageContent />
    </PageWrapper>
  );
}
