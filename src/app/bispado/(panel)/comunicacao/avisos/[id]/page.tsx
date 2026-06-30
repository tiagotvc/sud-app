import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { AvisoForm } from "@/components/comunicacao/AvisoForm";
import { prisma } from "@/lib/db";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditarAvisoPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/bispado/login");

  const { id } = await params;
  const aviso = await prisma.aviso.findUnique({ where: { id } });

  if (!aviso) notFound();

  return (
    <div className="page-shell space-y-6">
      <div>
        <Link href="/bispado/comunicacao/avisos" className="crm-btn-ghost -ml-3">
          ← Avisos
        </Link>
        <h1 className="text-page-title mt-2">Editar aviso</h1>
      </div>
      <AvisoForm
        mode="edit"
        initialData={{
          id: aviso.id,
          titulo: aviso.titulo,
          conteudo: aviso.conteudo,
          tipo: aviso.tipo,
          publicado: aviso.publicado,
          destaque: aviso.destaque,
          linkExterno: aviso.linkExterno ?? "",
        }}
      />
    </div>
  );
}
