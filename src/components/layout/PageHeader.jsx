import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";
import IconButton from "../common/IconButton";

// Top bar. `backTo` shows a back arrow; `actions` sits on the right.
export default function PageHeader({ title, eyebrow, backTo, actions, className, children }) {
  return (
    <header className={cn("flex flex-col gap-3.5 px-5 pt-5 pb-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {backTo && <IconButton as={Link} to={backTo} icon="back" label="Back" variant="ghost" className="-ml-3" />}
          <div className="flex min-w-0 flex-col gap-0.5">
            {eyebrow && <span className="text-xs font-medium text-muted">{eyebrow}</span>}
            <h1 className="heading truncate text-[26px] leading-tight lg:text-[32px]">{title}</h1>
          </div>
        </div>
        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </div>
      {children}
    </header>
  );
}
