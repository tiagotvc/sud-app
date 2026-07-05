"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { AdminBreadcrumb } from "@/components/layout/AdminBreadcrumb";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { roleLabel, UserRole } from "@/lib/user-role";

interface AdminLayoutProps {
  children: ReactNode;
  userName: string;
  userRole: UserRole;
}

const COLLAPSE_KEY = "zion-sidebar-collapsed";

export function AdminLayout({ children, userName, userRole }: AdminLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  // Fecha o drawer ao navegar
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Trava o scroll do body enquanto o drawer está aberto
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-brand-bg lg:flex-row">
      {/* ── Top bar mobile (com hambúrguer) ── */}
      <header className="admin-mobile-bar flex shrink-0 items-center gap-3 px-4 py-2.5 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/85 transition-colors hover:bg-white/10"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        </button>
        <Link href="/bispado" className="flex min-w-0 items-center gap-2">
          <Image src="/logo.svg" alt="Zion Connect" width={28} height={28} className="shrink-0 rounded-md" />
          <span className="font-display truncate text-sm font-semibold text-white">Zion Connect</span>
        </Link>
      </header>

      {/* ── Drawer mobile ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="admin-drawer-backdrop absolute inset-0"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="admin-sidebar admin-drawer-panel absolute inset-y-0 left-0 w-[82%] max-w-[300px]">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Fechar menu"
              className="absolute right-3 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <AdminSidebar
              userName={userName}
              userRole={userRole}
              variant="drawer"
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* ── Sidebar desktop ── */}
      <aside
        className={`admin-sidebar hidden shrink-0 transition-[width] duration-300 ease-in-out lg:flex ${
          collapsed ? "w-[76px]" : "w-[248px]"
        }`}
      >
        <AdminSidebar
          userName={userName}
          userRole={userRole}
          variant="desktop"
          collapsed={collapsed}
          onToggleCollapse={toggleCollapsed}
        />
      </aside>

      {/* ── Conteúdo ── */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="admin-page-header sticky top-0 z-20 hidden h-[66px] items-center justify-between gap-4 px-7 lg:flex">
          <AdminBreadcrumb />
          <div className="flex items-center gap-4">
            <span className="admin-header-icon" aria-label="Notificações">
              <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.078 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </span>
            <span className="h-8 w-px bg-brand-border" aria-hidden="true" />
            <div className="min-w-[118px]">
              <p className="truncate text-xs font-semibold text-brand-navy-dark">{userName}</p>
              <p className="mt-0.5 text-[11px] text-brand-text-muted">{roleLabel(userRole)}</p>
            </div>
            <svg className="h-4 w-4 text-brand-text-muted" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </header>

        <main className="ds-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="admin-main">{children}</div>
        </main>
      </div>
    </div>
  );
}
