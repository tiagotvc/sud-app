import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AvisoForm } from "@/components/comunicacao/AvisoForm";

export default async function NovaAvisoPage() {
  const session = await auth();
  if (!session?.user) redirect("/bispado/login");

  return (
    <div className="page-shell space-y-6">
      <div>
        <Link href="/bispado/comunicacao/avisos" className="crm-btn-ghost -ml-3">
          ← Avisos
        </Link>
        <h1 className="text-page-title mt-2">Novo aviso</h1>
      </div>
      <AvisoForm mode="create" />
    </div>
  );
}
