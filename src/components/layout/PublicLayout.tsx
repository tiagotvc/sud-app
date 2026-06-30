import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { PublicNav } from "@/components/layout/PublicNav";

const DISCLAIMER =
  "Ferramenta independente de organização da ala. Não possui afiliação oficial com A Igreja de Jesus Cristo dos Santos dos Últimos Dias.";

export function ZionLogo({ className = "", inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/calendario" className={`group inline-flex items-center gap-3 ${className}`}>
      <Image src="/logo.svg" alt="Zion Connect" width={40} height={40} className="rounded-lg shadow-sm" />
      <span>
        <span
          className={`font-display block text-base font-bold tracking-tight ${
            inverted
              ? "text-white group-hover:text-brand-gold-light"
              : "text-brand-navy-dark group-hover:text-brand-navy"
          }`}
        >
          Zion Connect
        </span>
        <span
          className={`font-script block text-lg leading-none ${
            inverted ? "text-brand-gold-light" : "text-brand-gold-dark"
          }`}
        >
          Ala Novo Hamburgo
        </span>
      </span>
    </Link>
  );
}

export function Disclaimer() {
  return <p className="disclaimer max-w-3xl">{DISCLAIMER}</p>;
}

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <header className="public-site-header">
        <div className="mx-auto flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <ZionLogo inverted />
          <PublicNav />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="public-site-footer px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Disclaimer />
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <p className="text-xs text-brand-text-muted">© {new Date().getFullYear()} Zion Connect</p>
            <Link
              href="/bispado/login"
              className="text-[10px] uppercase tracking-wide text-brand-text-light hover:text-brand-navy"
            >
              Área administrativa
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
