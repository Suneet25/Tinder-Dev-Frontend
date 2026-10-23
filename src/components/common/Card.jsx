import { cn } from "../../lib/cn";

export default function Card({ as: Component = "section", className, children, ...props }) {
  return (
    <Component className={cn("rounded-card border border-border bg-surface p-4", className)} {...props}>
      {children}
    </Component>
  );
}

export function SectionLabel({ as: Component = "h3", className, children }) {
  return <Component className={cn("text-[13px] font-semibold uppercase tracking-[0.06em] text-muted", className)}>{children}</Component>;
}
