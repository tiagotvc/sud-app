import { ReservasAgenda } from "@/components/entrevistas/ReservasAgenda";
import { AdminPageHeader } from "@/components/layout/AdminBreadcrumb";

export default function AgendaEntrevistasPage() {
  return (
    <div className="page-shell w-full">
      <AdminPageHeader
        title="Minha agenda"
        description="Entrevistas confirmadas com você. Ao cancelar, o horário volta a ficar disponível."
      />
      <ReservasAgenda />
    </div>
  );
}
