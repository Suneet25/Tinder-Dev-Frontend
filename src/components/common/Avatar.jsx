import { avatarFill, initials } from "../../lib/avatar";
import { cn } from "../../lib/cn";

const SIZES = {
  xs: "size-10 text-sm",
  sm: "size-11 text-sm",
  md: "size-13 text-lg",
  lg: "size-21 text-[32px]",
  xl: "size-22 text-[30px]",
};

// Rounded-square corners per size; shape="circle" overrides them
const CORNERS = {
  xs: "rounded-xl",
  sm: "rounded-[14px]",
  md: "rounded-2xl",
  lg: "rounded-[26px]",
  xl: "rounded-[28px]",
};

// Initials avatar with a stable color per user (no photo API yet).
export default function Avatar({ user, size = "md", shape = "square", online, className }) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn("flex items-center justify-center font-display font-bold text-ink", SIZES[size], shape === "circle" ? "rounded-full" : CORNERS[size])}
        style={{ background: avatarFill(user?._id ?? user?.firstName) }}
        aria-hidden="true"
      >
        {initials(user)}
      </span>
      {online && <span className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-[3px] border-bg bg-secondary" aria-label="Online" />}
    </span>
  );
}
