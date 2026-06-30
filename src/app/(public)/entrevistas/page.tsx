import { EntrevistaBooking } from "@/components/entrevistas/EntrevistaBooking";
import { PublicPageHeader, PublicShell } from "@/components/layout/PublicPageHeader";

export const dynamic = "force-dynamic";

export default function EntrevistasPage() {
  return (
    <PublicShell>
      <PublicPageHeader
        variant="compact"
        title="Agendar entrevista"
        description="Escolha com quem deseja conversar e selecione um horário."
        crumbs={[
          { href: "/calendario", label: "Início" },
          { label: "Entrevistas" },
        ]}
      />
      <EntrevistaBooking />
    </PublicShell>
  );
}
