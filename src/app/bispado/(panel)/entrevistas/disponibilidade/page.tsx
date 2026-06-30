import { DisponibilidadeEditor } from "@/components/entrevistas/DisponibilidadeEditor";
import { AdminPageHeader } from "@/components/layout/AdminBreadcrumb";
import Link from "next/link";

export default function DisponibilidadePage() {
  return (
    <div className="page-shell w-full">
      <AdminPageHeader
        title="Minha disponibilidade"
        description="Configure os dias e horários em que você atende entrevistas."
      >
        <Link
          href="/entrevistas"
          className="crm-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver página pública →
        </Link>
      </AdminPageHeader>
      <DisponibilidadeEditor />
    </div>
  );
}
