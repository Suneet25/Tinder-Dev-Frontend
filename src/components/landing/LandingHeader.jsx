import { Link } from "react-router-dom";
import { Logo } from "../common";
import { SECTION_LINKS } from "./content";

export default function LandingHeader() {
  return (
    <header className="border-b border-surface-2">
      <nav aria-label="Main" className="mx-auto flex w-full max-w-[1200px] items-center gap-3 px-4 py-4 sm:gap-7 sm:px-6">
        <a href="#top" className="mr-auto shrink-0">
          <Logo />
        </a>
        <div className="hidden gap-5.5 text-[15px] font-medium text-text-soft md:flex">
          {SECTION_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="py-2.5 hover:text-text">
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex gap-2 whitespace-nowrap sm:gap-2.5">
          <Link to="/login" className="flex h-11 items-center rounded-xl border border-border px-3 text-sm font-semibold hover:bg-surface sm:px-4 sm:text-[15px]">
            Log in
          </Link>
          <Link to="/login?mode=signup" className="flex h-11 items-center rounded-xl bg-primary px-3 text-sm font-bold text-on-primary hover:bg-primary-hover sm:px-4 sm:text-[15px]">
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
