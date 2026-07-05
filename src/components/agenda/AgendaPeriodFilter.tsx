"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function AgendaPeriodFilter() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get("periodo") ?? "90";

  function changePeriod(period: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (period === "90") params.delete("periodo");
    else params.set("periodo", period);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <label className="agenda-filter-control">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 9h16.5M5.25 5.25h13.5a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-12a1.5 1.5 0 011.5-1.5z" />
      </svg>
      <select
        aria-label="Período das agendas"
        value={currentPeriod}
        onChange={(event) => changePeriod(event.target.value)}
      >
        <option value="90">Últimos 90 dias</option>
        <option value="year">Este ano</option>
        <option value="all">Todas as agendas</option>
      </select>
      <svg className="agenda-filter-chevron" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );
}
