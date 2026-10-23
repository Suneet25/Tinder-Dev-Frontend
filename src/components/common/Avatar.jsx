import { avatarFill, initials } from "../../lib/avatar";
import { cn } from "../../lib/cn";

const SIZES = {
  sm: "size-11 rounded-[14px] text-sm",
  md: "size-13 rounded-2xl text-lg",
  lg: "size-21 rounded-[26px] text-[32px]",
};

// Initials avatar with a stable color per user (no photo API yet).
export default function Avatar({ user, size = "md", online, className }) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn("flex items-center justify-center font-display font-bold text-ink", SIZES[size])}
        style={{ background: avatarFill(user?._id ?? user?.firstName) }}
        aria-hidden="true"
      >
        {initials(user)}
      </span>
      {online && <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-[3px] border-bg bg-secondary" aria-label="Online" />}
    </span>
  );
}
