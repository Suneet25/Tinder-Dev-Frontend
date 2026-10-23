import { cn } from "../../lib/cn";
import Icon from "./Icon";

/**
 * Tag  – monospace skill pill (Node.js, MongoDB)
 * Chip – rounded pill; `onRemove` adds an ✕ button
 * Badge – small solid status pill (e.g. "Verified", "91% match")
 */
export function Tag({ children, onRemove, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[8px] border border-border bg-surface-2 font-mono text-xs text-text-soft",
        onRemove ? "py-1 pl-2.5 pr-1" : "px-2.5 py-1.5",
        className,
      )}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${children}`}
          className="inline-flex size-7 items-center justify-center rounded-[6px] text-muted hover:bg-border hover:text-text"
        >
          <Icon name="x" size={14} strokeWidth={2.4} />
        </button>
      )}
    </span>
  );
}

const BADGE_TONES = {
  primary: "bg-primary text-on-primary",
  secondary: "bg-secondary text-on-secondary",
  dark: "bg-ink text-white",
  surface: "bg-surface-2 text-text",
};

export function Badge({ tone = "surface", className, children }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", BADGE_TONES[tone], className)}>
      {children}
    </span>
  );
}

// Toggleable choice pill (filters, "Looking for")
export function ChoiceChip({ selected, onClick, children, className }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-control border px-4 text-sm font-semibold transition-colors",
        selected ? "border-primary bg-primary text-on-primary" : "border-border bg-surface text-text hover:border-border-strong",
        className,
      )}
    >
      {children}
    </button>
  );
}
