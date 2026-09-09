export function PageTitle({ title, subtitle, action }) {
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

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

  export function Button({
    children,
    variant = "primary",
    className = "",
    ...props
  }) {
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

export function Input({ label, error, ...props }) {
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

export function Empty({ children }) {
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
