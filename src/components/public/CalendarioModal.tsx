"use client";

import { useEffect } from "react";
import { NOTAS_CALENDARIO } from "@/lib/comunicacao";
import { CalendarioLista } from "@/components/public/CalendarioLista";
import type { CalendarioDiaPublico } from "@/components/public/types";

interface CalendarioModalProps {
  open: boolean;
  onClose: () => void;
  dias: CalendarioDiaPublico[];
  semanaInicio: Date;
  semanaLabel: string;
}

export function CalendarioModal({
  open,
  onClose,
  dias,
  semanaInicio,
  semanaLabel,
}: CalendarioModalProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="calendario-modal-backdrop fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendario-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-brand-navy-dark/60 backdrop-blur-sm"
        aria-label="Fechar calendário"
        onClick={onClose}
      />

      <div className="calendario-modal-panel relative z-10 my-4 w-full max-w-3xl">
        <div className="ala-card overflow-hidden shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-brand-border bg-brand-navy px-5 py-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold-light">
                Calendário completo
              </p>
              <h2
                id="calendario-modal-title"
                className="font-display mt-1 text-xl font-bold text-white"
              >
                Semana da Ala
              </h2>
              <p className="mt-1 text-sm capitalize text-white/70">{semanaLabel}</p>
            </div>
            <button type="button" onClick={onClose} className="presentation-btn shrink-0">
              Fechar ✕
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto bg-brand-bg p-5">
            <CalendarioLista dias={dias} semanaInicio={semanaInicio} variant="full" />
          </div>

          <div className="border-t border-brand-border bg-white px-5 py-4">
            <p className="text-section-label mb-2">Notas</p>
            <ul className="space-y-1.5 text-xs text-brand-text-muted">
              {NOTAS_CALENDARIO.map((nota) => (
                <li key={nota}>{nota}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
