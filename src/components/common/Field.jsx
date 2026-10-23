import { useId } from "react";
import { cn } from "../../lib/cn";

const control =
  "w-full border border-border bg-surface px-3.5 text-[15px] text-text rounded-control transition-colors " +
  "hover:border-border-strong focus:border-primary focus:outline-none aria-[invalid=true]:border-danger";

// Label + control + hint/error, wired with ids for accessibility.
function Field({ label, hint, error, className, children }) {
  const id = useId();
  const describedBy = error || hint ? `${id}-desc` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-muted">
          {label}
        </label>
      )}
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {(error || hint) && (
        <p id={describedBy} className={cn("text-xs", error ? "text-danger" : "text-subtle")}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

export function Input({ label, hint, error, className, inputClassName, ...props }) {
  return (
    <Field label={label} hint={hint} error={error} className={className}>
      {(a11y) => <input {...a11y} {...props} className={cn(control, "h-12", inputClassName)} />}
    </Field>
  );
}

export function Textarea({ label, hint, error, className, ...props }) {
  return (
    <Field label={label} hint={hint} error={error} className={className}>
      {(a11y) => <textarea rows={3} {...a11y} {...props} className={cn(control, "resize-none py-3 leading-relaxed")} />}
    </Field>
  );
}

export function Select({ label, hint, error, className, options, placeholder, ...props }) {
  return (
    <Field label={label} hint={hint} error={error} className={className}>
      {(a11y) => (
        <select {...a11y} {...props} className={cn(control, "h-12 appearance-none")}>
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}
