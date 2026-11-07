import { cn } from "../../lib/cn";
import { MARQUEE } from "./content";

function Strip({ hidden }) {
  return (
    <ul className="flex shrink-0 gap-3.5 pr-3.5" aria-hidden={hidden || undefined}>
      {MARQUEE.map((item) => (
        <li key={item.label} className="flex h-11 items-center gap-2.5 rounded-full border border-border bg-surface px-4 text-[15px] font-semibold whitespace-nowrap">
          <span className={cn("size-3 rounded-full", item.color)} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

// Endless strip of modes. The list is rendered twice and the track slides by
// half its width, so the loop has no seam.
export default function ModesMarquee() {
  return (
    <div aria-label="Ways to meet people" className="overflow-hidden border-y border-surface-2 py-3.5">
      <div className="flex w-max motion-safe:animate-marquee">
        <Strip />
        <Strip hidden />
      </div>
    </div>
  );
}
