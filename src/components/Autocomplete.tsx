import { ChevronDown, Search } from "lucide-react";
import { createPortal } from "react-dom";
import type { Key, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

export type AutocompleteProps<T extends object> = {
  label?: ReactNode;
  required?: boolean;
  placeholder?: string;
  options?: readonly T[];
  value?: T | null;
  onChange: (option: T | null) => void;
  getOptionLabel?: (option: T) => string;
  getOptionKey?: (option: T, index: number) => Key;
  disabled?: boolean;
};

function defaultOptionLabel<T extends object>(option: T): string {
  const record = option as Record<string, unknown>;
  return String(record.name ?? record.label ?? "");
}

function defaultOptionKey<T extends object>(option: T, index: number): Key {
  const record = option as Record<string, unknown>;
  const key = record.id ?? record.code ?? record.value ?? record.name;
  return typeof key === "string" || typeof key === "number" ? key : index;
}

export default function Autocomplete<T extends object>({
  label,
  required = false,
  placeholder = "ค้นหา...",
  options = [],
  value,
  onChange,
  getOptionLabel = defaultOptionLabel,
  getOptionKey = defaultOptionKey,
  disabled = false,
}: AutocompleteProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<DropdownPosition | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    const keyword = search.toLowerCase();

    return options.filter((option) =>
      getOptionLabel(option).toLowerCase().includes(keyword),
    );
  }, [options, search, getOptionLabel]);

  const updatePosition = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-heading">
          {label}
          {required && <span className="ml-1 text-danger-600">*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          updatePosition();
          setOpen((previous) => !previous);
        }}
        className="flex w-full items-center justify-between rounded-control border border-border bg-white px-3 py-2.5 text-left text-sm outline-none transition hover:border-brand-400 focus:border-brand-500"
      >
        <span className={value ? "text-heading" : "text-muted"}>
          {value ? getOptionLabel(value) : placeholder}
        </span>

        <ChevronDown
          size={17}
          className={`shrink-0 text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            className="fixed z-[9999] overflow-hidden rounded-xl border border-border bg-white shadow-xl"
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
            }}
          >
            <div className="border-b border-border p-2">
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3">
                <Search size={16} className="shrink-0 text-muted" />

                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหา..."
                  className="w-full bg-transparent py-2 text-sm outline-none"
                />
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto overscroll-contain p-1">
              {filteredOptions.map((option, optionIndex) => {
                const optionKey = getOptionKey(option, optionIndex);
                const selectedKey = value
                  ? getOptionKey(value, optionIndex)
                  : undefined;

                return (
                  <button
                    key={optionKey}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      selectedKey === optionKey
                        ? "bg-brand-50 text-brand-700"
                        : "text-heading hover:bg-brand-50"
                    }`}
                  >
                    {getOptionLabel(option)}
                  </button>
                );
              })}

              {filteredOptions.length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-muted">
                  ไม่พบข้อมูล
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
