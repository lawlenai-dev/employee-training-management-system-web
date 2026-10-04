import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

type PageTitleProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
};

export function PageTitle({ title, subtitle, action }: PageTitleProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const styles =
    variant === "secondary"
      ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      : variant === "danger"
        ? "bg-red-600 text-white hover:bg-red-700"
        : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm";
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  error?: ReactNode;
};

export function Input({ label, error, ...props }: InputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <input
        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        {...props}
      />
      {error && (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}

export function Empty({ children }: { children?: ReactNode }) {
  return (
    <div className="px-6 py-14 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
    </div>
  );
}

export type MultiSelectOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

type MultiSelectChipsProps = {
  label: ReactNode;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  helperText?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  className?: string;
};

export function MultiSelectChips({
  label,
  options,
  value,
  onChange,
  helperText,
  error,
  disabled = false,
  className = "",
}: MultiSelectChipsProps) {
  const toggleOption = (optionValue: string) => {
    const next = new Set(value);

    if (next.has(optionValue)) {
      next.delete(optionValue);
    } else {
      next.add(optionValue);
    }

    onChange(Array.from(next));
  };

  return (
    <fieldset disabled={disabled} className={`min-w-0 ${className}`}>
      <legend className="text-sm font-medium text-slate-700">{label}</legend>

      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value.includes(option.value);

          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled || option.disabled}
              aria-pressed={selected}
              onClick={() => toggleOption(option.value)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                selected
                  ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                  : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              {selected && (
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              )}

              {option.label}
            </button>
          );
        })}
      </div>

      {error ? (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-2 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </fieldset>
  );
}
