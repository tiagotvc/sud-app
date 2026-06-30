"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";
import { UserRole, roleLabel } from "@/lib/user-role";

interface NavItem {
  href: string;
  label: string;
  roles?: UserRole[];
  icon: ReactNode;
}

const iconCls = "h-[18px] w-[18px] shrink-0";

const navItems: NavItem[] = [
  {
    href: "/bispado",
    label: "Dashboard",
    icon: (
      <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25A2.25 2.25 0 018.25 10.5H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    href: "/bispado/comunicacao",
    label: "Comunicação",
    roles: [UserRole.ADMIN, UserRole.BISPADO],
    icon: (
      <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
      </svg>
    ),
  },
  {
    href: "/bispado/agendas-sacramentais",
    label: "Agendas Sacramentais",
    roles: [UserRole.BISPADO],
    icon: (
      <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    href: "/bispado/entrevistas",
    label: "Entrevistas",
    roles: [UserRole.ADMIN, UserRole.BISPADO, UserRole.CONSELHEIRO],
    icon: (
      <svg className={iconCls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

interface AdminSidebarProps {
  userName: string;
  userRole: UserRole;
  variant?: "desktop" | "drawer";
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}

export function AdminSidebar({
  userName,
  userRole,
  variant = "desktop",
  collapsed = false,
  onToggleCollapse,
  onNavigate,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const isDrawer = variant === "drawer";
  const isCollapsed = !isDrawer && collapsed;

  const visibleNav = navItems.filter((item) => !item.roles || item.roles.includes(userRole));
  const initial = userName.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="admin-sidebar-inner flex h-full flex-col">
      {/* Brand header */}
      <div
        className={`relative flex h-16 shrink-0 items-center border-b border-white/10 ${
          isCollapsed ? "justify-center px-2" : "px-4"
        }`}
      >
        <Link
          href="/bispado"
          onClick={onNavigate}
          className="flex min-w-0 items-center gap-2.5"
          title={isCollapsed ? "Zion Connect" : undefined}
        >
          <Image
            src="/logo.svg"
            alt="Zion Connect"
            width={34}
            height={34}
            className="shrink-0 rounded-lg ring-1 ring-white/10"
          />
          {!isCollapsed && (
            <span className="min-w-0">
              <span className="font-display block truncate text-sm font-semibold leading-tight text-white">
                Zion Connect
              </span>
              <span className="font-script block truncate text-base leading-none text-brand-gold-light">
                Ala Novo Hamburgo
              </span>
            </span>
          )}
        </Link>

        {!isDrawer && !isCollapsed && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Recolher menu"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/55 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}
      </div>

      {!isDrawer && isCollapsed && onToggleCollapse && (
        <div className="flex justify-center border-b border-white/10 py-2">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Expandir menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/55 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className={`admin-sidebar-scroll flex-1 space-y-1 overflow-y-auto py-4 ${isCollapsed ? "px-2" : "px-3"}`}>
        {visibleNav.map((item) => {
          const isActive =
            item.href === "/bispado"
              ? pathname === "/bispado"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={isCollapsed ? item.label : undefined}
              className={`admin-nav-link ${isActive ? "admin-nav-link-active" : ""} ${
                isCollapsed ? "admin-nav-link-collapsed" : ""
              }`}
            >
              {item.icon}
              {!isCollapsed && <span className="min-w-0 truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`shrink-0 border-t border-white/10 ${isCollapsed ? "px-2 py-3" : "px-3 py-3"}`}>
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold text-sm font-bold text-brand-navy-dark"
              title={userName}
            >
              {initial}
            </span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/calendario" })}
              aria-label="Sair"
              title="Sair"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/55 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gold text-sm font-bold text-brand-navy-dark">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{userName}</p>
                <p className="truncate text-xs text-white/50">{roleLabel(userRole)}</p>
              </div>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <Link
                href="/calendario"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onNavigate}
                className="admin-sidebar-foot-btn"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Site público
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/calendario" })}
                className="admin-sidebar-foot-btn"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
                </svg>
                Sair
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
