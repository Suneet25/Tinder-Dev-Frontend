import { Icon } from "../common";
import { FAQ } from "./content";

// Native <details> keeps it accessible and keyboard-friendly with no state
export default function Faq() {
  return (
    <section id="faq" className="mx-auto flex w-full max-w-[860px] scroll-mt-6 flex-col gap-7 px-6 py-18">
      <h2 className="text-center font-display text-[clamp(32px,4vw,48px)] leading-[1.08] font-bold tracking-[-0.03em]">Questions, answered</h2>
      <div className="flex flex-col gap-2.5">
        {FAQ.map((item, i) => (
          <details key={item.q} open={i === 0} className="group rounded-[18px] border border-border bg-surface px-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4.5 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
              {item.q}
              <Icon name="plus" size={20} className="shrink-0 text-muted transition-transform group-open:rotate-45" />
            </summary>
            <p className="mb-4.5 text-[15px] leading-[1.6] text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
