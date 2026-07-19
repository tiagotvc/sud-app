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
  /** When true, only values that already exist can be kept — no new entries are created. */
  restrict?: boolean;
}

function parseHymnSuggestion(option: string): { number: string; title: string } {
  const match = option.trim().match(/^(\d+)\s*[-–—]?\s*(.+)$/);
  if (match) {
    return { number: match[1], title: match[2].trim() };
  }
  return { number: "", title: option };
}

export function AutocompleteInput({
  label,
  value,
  onChange,
  apiPath,
  placeholder,
  hint,
  variant = "default",
  restrict = false,
}: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const valueAtFocusRef = useRef(value);
  const isHymn = variant === "hymn";

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
    valueAtFocusRef.current = value;
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

    if (restrict) {
      if (trimmed === valueAtFocusRef.current.trim()) return;
      const match = suggestions.find((option) => option.toLowerCase() === trimmed.toLowerCase());
      onChange(match ?? "");
      return;
    }

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

  const inputElement = (
    <input
      type="text"
      value={value}
      onChange={(event) => handleChange(event.target.value)}
      onFocus={handleFocus}
      onBlur={() => {
        void handleBlur();
        setTimeout(() => setOpen(false), 150);
      }}
      placeholder={placeholder ?? (isHymn ? "Ex: 73 — Onde encontrar a paz" : undefined)}
      className={isHymn ? "hymn-input" : "field-input w-full"}
    />
  );

  return (
    <div ref={containerRef} className={`relative ${open ? "z-30" : ""}`}>
      <label className={isHymn ? "hymn-label field-label" : "field-label"}>
        {isHymn && <span className="hymn-label-icon">♪</span>}
        {label}
      </label>

      {isHymn ? <div className="hymn-field">{inputElement}</div> : inputElement}

      {hint && <p className="mt-1.5 text-xs text-brand-text-muted">{hint}</p>}

      {open && (suggestions.length > 0 || loading) && (
        <ul
          className={
            isHymn
              ? "hymn-suggestions"
              : "absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border border-brand-border bg-white py-1 shadow-lg"
          }
        >
          {loading && (
            <li className="px-3 py-2 text-sm text-brand-text-muted">Carregando...</li>
          )}
          {!loading &&
            suggestions.map((option) => {
              const hymn = isHymn ? parseHymnSuggestion(option) : null;

              return (
                <li key={option}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(option)}
                    className={
                      isHymn
                        ? "hymn-suggestion-item"
                        : "block w-full px-3 py-2 text-left text-sm text-brand-text hover:bg-brand-cream-warm"
                    }
                  >
                    {isHymn && hymn ? (
                      <>
                        {hymn.number && (
                          <span className="hymn-suggestion-number">{hymn.number}</span>
                        )}
                        {hymn.title}
                      </>
                    ) : (
                      option
                    )}
                  </button>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
