import { ReactNode } from "react";

export default function BispadoAuthLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-brand-bg">{children}</div>;
}
