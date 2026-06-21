"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type FieldVariant = "default" | "hymn" | "person";

interface AutocompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  apiPath: "/api/pessoas" | "/api/hinos" | "/api/chamados";
  placeholder?: string;
  hint?: string;
  variant?: FieldVariant;
}

const variantStyles: Record<
  FieldVariant,
  { input: string; label: string; suggestion: string; icon?: string }
> = {
  default: {
    input: "field-input",
    label: "field-label",
    suggestion: "hover:bg-blue-50",
  },
  hymn: {
    input: "field-input hymn-input",
    label: "field-label hymn-label",
    suggestion: "hover:bg-indigo-50 text-indigo-900",
    icon: "♪",
  },
  person: {
    input: "field-input",
    label: "field-label",
    suggestion: "hover:bg-blue-50",
  },
};

export function AutocompleteInput({
  label,
  value,
  onChange,
  apiPath,
  placeholder,
  hint,
  variant = "default",
}: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const styles = variantStyles[variant];

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
      <label className={styles.label}>
        {variant === "hymn" && (
          <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs text-indigo-700">
            {styles.icon}
          </span>
        )}
        {label}
      </label>
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
        className={`w-full ${styles.input}`}
      />
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}

      {open && (suggestions.length > 0 || loading) && (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl ring-1 ring-slate-100">
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
                  className={`block w-full px-3 py-2 text-left text-sm text-slate-800 ${styles.suggestion}`}
                >
                  {variant === "hymn" && (
                    <span className="mr-2 font-mono text-xs text-indigo-500">♪</span>
                  )}
                  {option}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
