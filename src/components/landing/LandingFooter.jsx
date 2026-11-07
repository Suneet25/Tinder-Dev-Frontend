import { Link } from "react-router-dom";
import { Logo } from "../common";
import { SECTION_LINKS } from "./content";

export default function LandingFooter() {
  return (
    <footer className="border-t border-surface-2 bg-black/20">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-6 pt-14 pb-7">
        <div className="flex flex-wrap gap-10">
          <div className="flex flex-[2_1_260px] flex-col gap-4">
            <Logo />
            <p className="max-w-[320px] text-sm leading-[1.6] text-muted">Find people to code with, train with, date and travel with. Made in Bengaluru.</p>
          </div>
          <nav aria-label="Product" className="flex flex-[1_1_140px] flex-col gap-3 text-sm">
            <span className="text-[13px] font-bold">Product</span>
            {SECTION_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-muted hover:text-text">
                {link.label}
              </a>
            ))}
          </nav>
          <nav aria-label="Account" className="flex flex-[1_1_140px] flex-col gap-3 text-sm">
            <span className="text-[13px] font-bold">Account</span>
            <Link to="/login?mode=signup" className="text-muted hover:text-text">
              Sign up
            </Link>
            <Link to="/login" className="text-muted hover:text-text">
              Log in
            </Link>
          </nav>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-surface-2 pt-5.5 text-[13px] text-muted">
          <span>© {new Date().getFullYear()} Tinder-Dev. All rights reserved.</span>
          <a href="#top" className="hover:text-text">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
