"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { UserRole } from "@/lib/user-role";
import { AdminLayout } from "@/components/layout/AdminLayout";

interface BispadoShellProps {
  children: ReactNode;
  userName: string;
  userRole: UserRole;
}

export function BispadoShell({ children, userName, userRole }: BispadoShellProps) {
  const pathname = usePathname();
  const isPresentation = pathname.includes("/apresentacao");

  if (isPresentation) {
    return <>{children}</>;
  }

  return (
    <AdminLayout userName={userName} userRole={userRole}>
      {children}
    </AdminLayout>
  );
}
