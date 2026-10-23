import { cn } from "../../lib/cn";
import Icon from "./Icon";

export default function EmptyState({ icon = "inbox", title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center gap-2 px-6 py-12 text-center", className)}>
      <span className="mb-2 flex size-14 items-center justify-center rounded-2xl bg-surface-2 text-primary">
        <Icon name={icon} size={26} />
      </span>
      <h2 className="heading text-xl">{title}</h2>
      {description && <p className="max-w-xs text-sm text-muted">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
