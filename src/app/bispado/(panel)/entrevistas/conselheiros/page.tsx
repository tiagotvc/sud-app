import { ConselheirosManager } from "@/components/entrevistas/ConselheirosManager";
import { AdminPageHeader } from "@/components/layout/AdminBreadcrumb";

export default function ConselheirosPage() {
  return (
    <div className="page-shell w-full">
      <AdminPageHeader
        title="Conselheiros"
        description="Cada conselheiro recebe login próprio para configurar a agenda de entrevistas."
      />
      <ConselheirosManager />
    </div>
  );
}
