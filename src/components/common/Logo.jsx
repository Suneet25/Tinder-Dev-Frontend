import { cn } from "../../lib/cn";
import Icon from "./Icon";

// Brand mark, optionally with the wordmark. Size the mark with `markClassName`.
export default function Logo({ withText = true, markClassName, className }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-primary text-on-primary", markClassName)}>
        <Icon name="logo" size={20} strokeWidth={2.2} />
      </span>
      {withText && <span className="font-display text-xl font-bold tracking-[-0.02em] whitespace-nowrap">Tinder-Dev</span>}
    </span>
  );
}
