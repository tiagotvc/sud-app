"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";
import { UserRole } from "@/lib/user-role";

interface NavItem {
  href: string;
  label: string;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { href: "/bispado", label: "Dashboard" },
  {
    href: "/bispado/agendas-sacramentais",
    label: "Agendas Sacramentais",
    roles: [UserRole.BISPADO],
  },
  { href: "#", label: "Avisos", roles: [UserRole.ADMIN, UserRole.BISPADO] },
];

interface AdminLayoutProps {
  children: ReactNode;
  userName: string;
  userRole: UserRole;
}

function pageTitle(pathname: string): string {
  if (pathname === "/bispado") return "Dashboard";
  if (pathname.includes("/apresentacao")) return "Apresentação";
  if (pathname.startsWith("/bispado/agendas-sacramentais/nova")) return "Nova agenda";
  if (pathname.match(/\/agendas-sacramentais\/[^/]+$/)) return "Editar agenda";
  if (pathname.startsWith("/bispado/agendas-sacramentais")) return "Agendas sacramentais";
  return "Painel";
}

export function AdminLayout({ children, userName, userRole }: AdminLayoutProps) {
  const pathname = usePathname();
  const title = pageTitle(pathname);

  const visibleNav = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole),
  );

  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-[240px] flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-4">
          <Link href="/bispado" className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Zion Connect" width={28} height={28} className="rounded" />
            <div>
              <span className="block text-sm font-semibold text-slate-900">Zion Connect</span>
              <span className="block text-[10px] uppercase tracking-wide text-slate-500">
                Ala Novo Hamburgo
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 px-2 py-3">
          {visibleNav.map((item) => {
            const isActive =
              item.href !== "#" &&
              (pathname === item.href || pathname.startsWith(`${item.href}/`));
            const isDisabled = item.href === "#";

            if (isDisabled) {
              return (
                <span
                  key={item.label}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-slate-400"
                >
                  {item.label}
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium uppercase">
                    Em breve
                  </span>
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#1a3a6b] text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 px-4 py-3">
          <p className="truncate text-sm font-medium text-slate-900">{userName}</p>
          <p className="text-xs text-slate-500">
            {userRole === UserRole.BISPADO ? "Bispado" : "Administrador"}
          </p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pl-[240px]">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
          <h1 className="text-sm font-semibold text-slate-800">{title}</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="crm-btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              Site público
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="crm-btn-ghost"
            >
              Sair
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
