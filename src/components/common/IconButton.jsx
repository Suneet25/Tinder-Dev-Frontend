import { cn } from "../../lib/cn";
import Icon from "./Icon";

const VARIANTS = {
  soft: "border border-border bg-surface text-text hover:bg-surface-2",
  ghost: "bg-transparent text-text hover:bg-surface-2",
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
};

const SIZES = { md: "size-11 rounded-[14px]", lg: "size-16 rounded-action" };

// Icon-only control: `label` is required so screen readers can announce it.
export default function IconButton({ as: Component = "button", icon, label, variant = "soft", size = "md", iconSize, className, ...props }) {
  return (
    <Component
      {...(Component === "button" ? { type: "button" } : {})}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      <Icon name={icon} size={iconSize ?? (size === "lg" ? 26 : 20)} strokeWidth={2.2} />
    </Component>
  );
}
