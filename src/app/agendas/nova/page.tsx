import Link from "next/link";
import { AgendaForm } from "@/components/AgendaForm";

export default function NovaAgendaPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm font-medium text-blue-700 hover:underline">
          ← Voltar para agendas
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Nova agenda sacramental</h1>
      </div>
      <AgendaForm mode="create" />
    </main>
  );
}
