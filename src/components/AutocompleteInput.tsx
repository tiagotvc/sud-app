"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AutocompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  apiPath: "/api/pessoas" | "/api/hinos" | "/api/chamados";
  placeholder?: string;
  hint?: string;
}

export function AutocompleteInput({
  label,
  value,
  onChange,
  apiPath,
  placeholder,
  hint,
}: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(
    async (query: string) => {
      setLoading(true);
      try {
        const params = query ? `?q=${encodeURIComponent(query)}` : "";
        const response = await fetch(`${apiPath}${params}`);
        const data = (await response.json()) as string[];
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [apiPath],
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleChange(nextValue: string) {
    onChange(nextValue);
    setOpen(true);
    await fetchSuggestions(nextValue);
  }

  async function handleFocus() {
    setOpen(true);
    await fetchSuggestions(value);
  }

  function handleSelect(option: string) {
    onChange(option);
    setOpen(false);
  }

  async function handleBlur() {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (apiPath === "/api/pessoas") {
      await fetch("/api/pessoas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: trimmed }),
      });
    } else if (apiPath === "/api/hinos") {
      await fetch("/api/hinos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: trimmed }),
      });
    } else {
      await fetch("/api/chamados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: trimmed }),
      });
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        onFocus={handleFocus}
        onBlur={() => {
          void handleBlur();
          setTimeout(() => setOpen(false), 150);
        }}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}

      {open && (suggestions.length > 0 || loading) && (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {loading && (
            <li className="px-3 py-2 text-sm text-slate-500">Carregando...</li>
          )}
          {!loading &&
            suggestions.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(option)}
                  className="block w-full px-3 py-2 text-left text-sm text-slate-800 hover:bg-blue-50"
                >
                  {option}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
