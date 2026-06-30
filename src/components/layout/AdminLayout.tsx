"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";
import { AdminBreadcrumb } from "@/components/layout/AdminBreadcrumb";
import { UserRole, roleLabel } from "@/lib/user-role";

interface NavItem {
  href: string;
  label: string;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { href: "/bispado", label: "Dashboard" },
  { href: "/bispado/comunicacao", label: "Comunicação", roles: [UserRole.ADMIN, UserRole.BISPADO] },
  {
    href: "/bispado/agendas-sacramentais",
    label: "Agendas Sacramentais",
    roles: [UserRole.BISPADO],
  },
  {
    href: "/bispado/entrevistas",
    label: "Entrevistas",
    roles: [UserRole.ADMIN, UserRole.BISPADO, UserRole.CONSELHEIRO],
  },
];

interface AdminLayoutProps {
  children: ReactNode;
  userName: string;
  userRole: UserRole;
}

export function AdminLayout({ children, userName, userRole }: AdminLayoutProps) {
  const pathname = usePathname();

  const visibleNav = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole),
  );

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <aside className="admin-sidebar">
        <div className="border-b border-white/10 px-4 py-5">
          <Link href="/bispado" className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Zion Connect" width={32} height={32} className="rounded" />
            <div>
              <span className="font-display block text-sm font-semibold text-white">
                Zion Connect
              </span>
              <span className="font-script block text-base leading-none text-brand-gold-light">
                Ala Novo Hamburgo
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 px-2 py-4">
          {visibleNav.map((item) => {
            const isActive =
              item.href !== "#" &&
              (pathname === item.href || pathname.startsWith(`${item.href}/`));
            const isDisabled = item.href === "#";

            if (isDisabled) {
              return (
                <span
                  key={item.label}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-white/40"
                >
                  {item.label}
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-medium uppercase text-white/50">
                    Em breve
                  </span>
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link ${isActive ? "admin-nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <p className="truncate text-sm font-medium text-white">{userName}</p>
          <p className="text-xs text-white/50">{roleLabel(userRole)}</p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pl-[240px]">
        <header className="admin-page-header sticky top-0 z-20 flex h-auto min-h-14 items-center justify-between gap-4 px-6 py-3">
          <AdminBreadcrumb />
          <div className="flex items-center gap-2">
            <Link
              href="/calendario"
              className="crm-btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              Site público
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/calendario" })}
              className="crm-btn-ghost"
            >
              Sair
            </button>
          </div>
        </header>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
