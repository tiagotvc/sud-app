import Link from "next/link";
import { AgendaForm } from "@/components/AgendaForm";

export default function NovaAgendaPage() {
  return (
    <main className="page-shell">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-[#1e4d8c] hover:underline"
        >
          ← Voltar para agendas
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Nova Agenda Sacramental</h1>
        <p className="mt-1 text-sm text-slate-500">
          Preencha os campos da reunião sacramental desta semana.
        </p>
      </div>
      <AgendaForm mode="create" />
    </main>
  );
}
