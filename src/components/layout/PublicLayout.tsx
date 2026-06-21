import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

const DISCLAIMER =
  "Ferramenta independente de organização da ala. Não possui afiliação oficial com A Igreja de Jesus Cristo dos Santos dos Últimos Dias.";

export function ZionLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <Image src="/logo.svg" alt="Zion Connect" width={36} height={36} className="rounded-lg shadow-md" />
      <span>
        <span className="block text-base font-bold tracking-tight text-[#0c1f3d] group-hover:text-[#1a3a6b]">
          Zion Connect
        </span>
        <span className="block text-[10px] font-medium uppercase tracking-widest text-slate-500">
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
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <ZionLogo />
          <Link
            href="/login"
            className="rounded-lg border border-[#1a3a6b]/20 bg-white px-4 py-2 text-sm font-semibold text-[#1a3a6b] transition-colors hover:border-[#1a3a6b]/40 hover:bg-slate-50"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Disclaimer />
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Zion Connect</p>
        </div>
      </footer>
    </div>
  );
}
