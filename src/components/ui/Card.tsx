import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`ala-card ${hover ? "transition-all hover:border-brand-border-strong hover:shadow-md" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="ala-card-header flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="font-display text-base font-semibold text-brand-navy-dark">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-brand-text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`ala-card-body ${className}`}>{children}</div>;
}
