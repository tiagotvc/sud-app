"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

interface Conselheiro {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  _count: { disponibilidadesEntrevista: number };
}

export function ConselheirosManager() {
  const [lista, setLista] = useState<Conselheiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ nome: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/entrevistas/conselheiros");
    setLista(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/entrevistas/conselheiros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Erro ao criar.");
      return;
    }

    setForm({ nome: "", email: "", password: "" });
    void load();
  }

  async function toggleAtivo(id: string, ativo: boolean) {
    await fetch(`/api/entrevistas/conselheiros/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo }),
    });
    void load();
  }

  return (
    <div className="space-y-6">
      <div className="ala-card overflow-hidden">
        <div className="panel-title-bar">
          <span className="panel-title-bar-accent" aria-hidden />
          <h2 className="panel-title-bar-text">Novo conselheiro</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="field-label">Nome</label>
            <input
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="field-input w-full"
            />
          </div>
          <div>
            <label className="field-label">Email (login)</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="field-input w-full"
            />
          </div>
          <div>
            <label className="field-label">Senha inicial</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="field-input w-full"
            />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={saving} className="crm-btn-primary w-full">
              {saving ? "Criando..." : "Criar acesso"}
            </button>
          </div>
        </form>
        {error && (
          <p className="border-t border-brand-border px-5 py-3 text-sm text-red-600">{error}</p>
        )}
      </div>

      <div className="ala-card overflow-hidden">
        <div className="panel-title-bar">
          <span className="panel-title-bar-accent" aria-hidden />
          <h2 className="panel-title-bar-text">Conselheiros cadastrados</h2>
        </div>
        {loading ? (
          <p className="p-5 text-sm text-brand-text-muted">Carregando...</p>
        ) : lista.length === 0 ? (
          <p className="p-5 text-sm text-brand-text-muted">Nenhum conselheiro cadastrado.</p>
        ) : (
          <ul className="divide-y divide-brand-border">
            {lista.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
              >
                <div>
                  <p className="font-medium text-brand-navy-dark">{c.nome}</p>
                  <p className="text-sm text-brand-text-muted">{c.email}</p>
                  <p className="text-xs text-brand-text-light">
                    {c._count.disponibilidadesEntrevista} bloco(s) de horário
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleAtivo(c.id, !c.ativo)}
                  className="crm-btn text-xs"
                >
                  {c.ativo ? "Desativar acesso" : "Reativar acesso"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-brand-text-muted">
        Cada conselheiro acessa em <strong>/bispado/login</strong> com o email e senha definidos
        aqui, e configura a própria agenda em Entrevistas → Disponibilidade.
      </p>
    </div>
  );
}
