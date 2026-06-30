import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SemanaEditor } from "@/components/comunicacao/SemanaEditor";

export default async function SemanaAdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/bispado/login");

  return (
    <div className="page-shell space-y-6">
      <div>
        <Link href="/bispado/comunicacao" className="crm-btn-ghost -ml-3">
          ← Comunicação
        </Link>
        <h1 className="text-page-title mt-2">Semana e calendário</h1>
        <p className="mt-1 text-sm text-brand-text-muted">
          Destaques da semana e eventos do calendário público.
        </p>
      </div>
      <SemanaEditor />
    </div>
  );
}
