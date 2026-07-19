"use client";

import { useState } from "react";

interface RestrictedSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  allowCustom?: boolean;
}

const CUSTOM_VALUE = "__custom__";

export function RestrictedSelect({
  label,
  value,
  onChange,
  options,
  allowCustom = false,
}: RestrictedSelectProps) {
  const [showCustomInput, setShowCustomInput] = useState(
    allowCustom && value.trim() !== "" && !options.includes(value),
  );

  const selectValue = showCustomInput ? CUSTOM_VALUE : value;

  return (
    <div>
      <label className="field-label">{label}</label>
      <select
        value={selectValue}
        onChange={(event) => {
          const next = event.target.value;
          if (next === CUSTOM_VALUE) {
            setShowCustomInput(true);
            onChange("");
          } else {
            setShowCustomInput(false);
            onChange(next);
          }
        }}
        className="field-input field-select w-full"
      >
        <option value="">—</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        {allowCustom && <option value={CUSTOM_VALUE}>+ Adicionar outro…</option>}
      </select>
      {showCustomInput && (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Nome completo"
          className="field-input mt-2 w-full"
          autoFocus
        />
      )}
    </div>
  );
}
