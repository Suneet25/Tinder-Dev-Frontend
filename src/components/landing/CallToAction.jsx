import { Link } from "react-router-dom";
import { Icon } from "../common";

export default function CallToAction() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 pt-6 pb-24">
      <div className="relative flex flex-wrap items-center justify-between gap-7 overflow-hidden rounded-[36px] bg-primary p-[clamp(32px,5vw,64px)] text-ink">
        {/* Decorative rings, slowly turning */}
        <div className="absolute -top-20 -right-15 size-80 rounded-full border-2 border-dashed border-ink opacity-20 motion-safe:animate-orbit" aria-hidden="true">
          <span className="absolute inset-[50px] rounded-full border-2 border-ink" />
          <span className="absolute top-1/2 -right-2.5 size-5 rounded-full bg-ink" />
        </div>
        <div className="relative flex max-w-[560px] flex-col gap-3">
          <h2 className="font-display text-[clamp(30px,4vw,48px)] leading-[1.05] font-bold tracking-[-0.03em]">Your next coding buddy is one swipe away.</h2>
          <p className="text-[17px] leading-normal opacity-80">Or your next spotter. Or your next date. Join free today.</p>
        </div>
        <div className="relative flex flex-wrap gap-3">
          <Link to="/login?mode=signup" className="flex h-14 items-center gap-2.5 rounded-2xl bg-ink px-6 text-base font-bold text-white hover:opacity-90">
            Create your account
            <Icon name="arrowRight" size={18} strokeWidth={2.4} />
          </Link>
          <Link to="/login" className="flex h-14 items-center rounded-2xl border-2 border-ink/80 px-6 text-base font-semibold hover:bg-ink/10">
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
}
