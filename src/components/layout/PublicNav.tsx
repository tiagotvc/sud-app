"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/calendario", label: "Início" },
  { href: "/avisos", label: "Avisos" },
  { href: "/entrevistas", label: "Entrevistas" },
];

export function PublicNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1.5">
      {navLinks.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`public-nav-link ${isActive ? "public-nav-link-active" : "public-nav-link-idle"}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
