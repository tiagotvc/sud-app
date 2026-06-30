"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { ZionLogo } from "@/components/layout/PublicLayout";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/bispado";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou senha inválidos.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <ZionLogo />
        </div>

        <div className="ala-card overflow-hidden shadow-lg">
          <div className="agenda-header-banner px-6 py-5 text-center">
            <h1 className="font-display text-xl font-bold text-white">Área administrativa</h1>
            <p className="mt-1 text-sm text-white/70">Acesso restrito a líderes e administradores</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div>
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="field-input w-full"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="field-label" htmlFor="password">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field-input w-full"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Entrando..." : "Entrar no painel"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-brand-text-muted">
          <Link href="/calendario" className="font-medium text-brand-navy hover:underline">
            ← Voltar ao calendário da ala
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function BispadoLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-brand-text-muted">
          Carregando...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
