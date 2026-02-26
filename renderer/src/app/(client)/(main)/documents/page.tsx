import { PageWrapper } from "@/components";
import { DocumentList } from "@/components/client";

export default function Page() {
  return (
    <PageWrapper subRoute="Documentos">
      <DocumentList />
    </PageWrapper>
  );
}
