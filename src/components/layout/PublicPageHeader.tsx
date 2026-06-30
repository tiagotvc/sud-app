import Link from "next/link";
import { ReactNode } from "react";

interface Crumb {
  href?: string;
  label: string;
}

interface PublicPageHeaderProps {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
  variant?: "hero" | "compact";
}

function BreadcrumbNav({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="public-breadcrumb">
      <ol className="public-breadcrumb-list">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="public-breadcrumb-item">
              {index > 0 && (
                <span className="public-breadcrumb-sep" aria-hidden>
                  /
                </span>
              )}
              {crumb.href && !isLast ? (
                <Link href={crumb.href} className="public-breadcrumb-link">
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast ? "public-breadcrumb-current" : "public-breadcrumb-link-static"
                  }
                >
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

export function PublicPageHeader({
  title,
  description,
  crumbs,
  children,
  variant = "hero",
}: PublicPageHeaderProps) {
  if (variant === "compact") {
    return (
      <header className="public-page-intro">
        {crumbs && crumbs.length > 0 && <BreadcrumbNav crumbs={crumbs} />}
        <h1 className="public-page-intro-title">{title}</h1>
        {description && <p className="public-page-intro-desc">{description}</p>}
        {children && <div className="public-page-intro-actions">{children}</div>}
      </header>
    );
  }

  return (
    <header className="public-page-hero">
      <div className="public-page-hero-main">
        {crumbs && crumbs.length > 0 && <BreadcrumbNav crumbs={crumbs} />}
        <h1 className="public-page-heading">{title}</h1>
        {description && <p className="public-page-desc">{description}</p>}
      </div>
      {children && <div className="public-page-hero-actions">{children}</div>}
    </header>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  return <div className="public-shell">{children}</div>;
}
