import { cn } from "../../lib/cn";

// Page-width section with an eyebrow, a heading and optional intro.
export default function Section({ id, eyebrow, title, intro, centered, className, children }) {
  return (
    <section id={id} className={cn("mx-auto flex w-full max-w-[1200px] scroll-mt-6 flex-col gap-10 px-6 py-18", className)}>
      <div className={cn("flex max-w-[640px] flex-col gap-3.5", centered && "mx-auto items-center text-center")}>
        {eyebrow && <span className="text-[13px] font-bold tracking-[0.08em] text-primary uppercase">{eyebrow}</span>}
        <h2 className="font-display text-[clamp(32px,4vw,48px)] leading-[1.08] font-bold tracking-[-0.03em]">{title}</h2>
        {intro && <p className="text-[17px] leading-[1.6] text-muted">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

// Rounded card used by most landing sections
export function LandingCard({ as: Component = "article", className, children }) {
  return <Component className={cn("flex flex-col gap-3.5 rounded-[28px] border border-border bg-surface p-6.5", className)}>{children}</Component>;
}
