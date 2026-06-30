"use client";

import { useCallback, useEffect, useState } from "react";
import { EntrevistaWeekCalendar } from "@/components/entrevistas/EntrevistaWeekCalendar";
import { SEMANAS_AGENDA, type SlotEntrevista } from "@/lib/entrevistas-constants";

export function ReservasAgenda() {
  const [semana, setSemana] = useState(0);
  const [semanaInicio, setSemanaInicio] = useState("");
  const [slots, setSlots] = useState<SlotEntrevista[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (sem: number) => {
    setLoading(true);
    const res = await fetch(`/api/entrevistas/calendario?semana=${sem}`);
    if (!res.ok) {
      setSlots([]);
      setSemanaInicio("");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setSlots(data.slots ?? []);
    setSemanaInicio(data.semanaInicio ?? "");
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(semana);
  }, [semana, load]);

  async function cancelar(id: string) {
    if (!confirm("Cancelar esta entrevista? O horário ficará disponível novamente.")) return;
    const res = await fetch(`/api/entrevistas/reservas/${id}`, { method: "DELETE" });
    if (res.ok) {
      void load(semana);
    }
  }

  if (loading) {
    return <p className="text-sm text-brand-text-muted">Carregando calendário...</p>;
  }

  return (
    <div className="admin-form-card">
      <div className="admin-form-card-body">
        <EntrevistaWeekCalendar
          semanaInicio={semanaInicio}
          slots={slots}
          mode="admin"
          onCancelReserva={cancelar}
          semana={semana}
          totalSemanas={SEMANAS_AGENDA}
          onSemanaChange={(delta) => setSemana((s) => s + delta)}
        />
      </div>
    </div>
  );
}
