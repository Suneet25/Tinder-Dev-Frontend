import { cn } from "../../lib/cn";

const FILLS = {
  silver: "fill-silver-muted stroke-silver-ink",
  gold: "fill-gold stroke-gold-ink",
};

// Scalloped verified tick in the membership tier's color.
export default function TierBadge({ tier, size = 22, label, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0", className)}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <path
        className={FILLS[tier]}
        strokeWidth="0.8"
        d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
      />
      <path d="M9 12l2 2 4-4" fill="none" className="stroke-ink" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
