import { cn } from "../../lib/cn";
import Spinner from "./Spinner";

const VARIANTS = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "bg-secondary text-on-secondary hover:bg-secondary-hover",
  outline: "border border-border bg-transparent text-text hover:bg-surface-2",
  soft: "border border-border bg-surface text-text hover:bg-surface-2",
  ghost: "bg-transparent text-muted hover:text-text hover:bg-surface-2",
  danger: "border border-danger-border bg-transparent text-danger hover:bg-danger-soft",
};

const SIZES = {
  sm: "h-9 px-3.5 text-sm rounded-[10px]",
  md: "h-11 px-4 text-sm rounded-control",
  lg: "h-13 px-5 text-base rounded-[14px]",
};

/**
 * <Button variant="primary" size="lg" loading>Log in</Button>
 * Pass `as={Link} to="/x"` to render a router link styled as a button.
 */
export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  fullWidth,
  loading,
  disabled,
  leftIcon,
  className,
  children,
  ...props
}) {
  const isButton = Component === "button";
  return (
    <Component
      {...(isButton ? { type: props.type ?? "button", disabled: disabled || loading } : {})}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 font-semibold transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? <Spinner size={16} label="" /> : leftIcon}
      {children}
    </Component>
  );
}
