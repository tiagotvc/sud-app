import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BispadoShell } from "@/components/layout/BispadoShell";

export default async function BispadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <BispadoShell userName={session.user.name ?? "Usuário"} userRole={session.user.role}>
      {children}
    </BispadoShell>
  );
}
