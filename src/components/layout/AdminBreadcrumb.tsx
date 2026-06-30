"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Crumb {
  href?: string;
  label: string;
}

function buildBreadcrumbs(pathname: string): Crumb[] {
  if (pathname === "/bispado") {
    return [{ label: "Dashboard" }];
  }

  const crumbs: Crumb[] = [{ href: "/bispado", label: "Dashboard" }];

  if (pathname.startsWith("/bispado/comunicacao")) {
    crumbs.push({ href: "/bispado/comunicacao", label: "Comunicação" });
    if (pathname.includes("/avisos/nova")) crumbs.push({ label: "Novo aviso" });
    else if (pathname.match(/\/avisos\/[^/]+$/)) crumbs.push({ label: "Editar aviso" });
    else if (pathname.includes("/avisos")) crumbs.push({ label: "Avisos" });
    else if (pathname.includes("/semana")) crumbs.push({ label: "Semana e calendário" });
    return crumbs;
  }

  if (pathname.startsWith("/bispado/agendas-sacramentais")) {
    crumbs.push({ href: "/bispado/agendas-sacramentais", label: "Agendas Sacramentais" });
    if (pathname.includes("/nova")) crumbs.push({ label: "Nova agenda" });
    else if (pathname.match(/\/[^/]+\/apresentacao/)) crumbs.push({ label: "Apresentação" });
    else if (pathname.match(/\/agendas-sacramentais\/[^/]+$/)) crumbs.push({ label: "Editar agenda" });
    return crumbs;
  }

  if (pathname.startsWith("/bispado/entrevistas")) {
    crumbs.push({ href: "/bispado/entrevistas", label: "Entrevistas" });
    if (pathname.includes("/disponibilidade")) crumbs.push({ label: "Disponibilidade" });
    else if (pathname.includes("/agenda")) crumbs.push({ label: "Minha agenda" });
    else if (pathname.includes("/conselheiros")) crumbs.push({ label: "Conselheiros" });
    return crumbs;
  }

  crumbs.push({ label: "Painel" });
  return crumbs;
}

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const crumbs = buildBreadcrumbs(pathname);

  return (
    <nav aria-label="Breadcrumb" className="admin-breadcrumb">
      <ol className="admin-breadcrumb-list">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={`${crumb.label}-${index}`} className="admin-breadcrumb-item">
              {index > 0 && (
                <span className="admin-breadcrumb-sep" aria-hidden>
                  /
                </span>
              )}
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className="admin-breadcrumb-link">
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? "admin-breadcrumb-current" : "admin-breadcrumb-link-static"}>
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function AdminPageHeader({ title, description, children }: AdminPageHeaderProps) {
  return (
    <header className="admin-page-hero">
      <div className="admin-page-hero-main">
        <h1 className="admin-page-heading">{title}</h1>
        {description && <p className="admin-page-desc">{description}</p>}
      </div>
      {children && <div className="admin-page-hero-actions">{children}</div>}
    </header>
  );
}
