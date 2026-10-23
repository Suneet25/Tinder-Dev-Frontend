import { cn } from "../../lib/cn";

// Pill tabs from the design (Log in / Sign up). options: [{ value, label }]
export default function SegmentedControl({ options, value, onChange, label, className }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn("grid gap-1 rounded-[14px] border border-border bg-surface p-1", className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-10 rounded-[10px] text-sm font-semibold transition-colors",
              active ? "bg-border text-text" : "text-muted hover:text-text",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
