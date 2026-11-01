import { cn } from "../../lib/cn";

// Full-height phone column for the Premium flow. The membership screens are
// designed dark-only, so they pin the midnight palette whatever the theme.
export default function PremiumScreen({ className, children }) {
  return (
    <div
      data-theme="midnight"
      className={cn("relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-bg font-sans text-text md:border-x md:border-surface-2", className)}
    >
      {children}
    </div>
  );
}
