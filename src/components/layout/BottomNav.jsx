import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/cn";
import Icon from "../common/Icon";
import { isNavActive, NAV_ITEMS } from "./navigation";

export function CountBadge({ count, className }) {
  if (!count) return null;
  return (
    <span className={cn("flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-on-primary", className)}>
      {count > 9 ? "9+" : count}
    </span>
  );
}

// Mobile tab bar
export default function BottomNav({ className }) {
  const { pathname } = useLocation();
  const counts = { requests: useSelector((s) => s.requests.received.length) };

  return (
    <nav
      aria-label="Main"
      className={cn("sticky bottom-0 z-10 grid grid-cols-4 border-t border-surface-2 bg-bg px-2 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]", className)}
    >
      {NAV_ITEMS.map((item) => {
        const active = isNavActive(item, pathname);
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-1 py-1.5 text-[11px] transition-colors",
              active ? "font-semibold text-primary" : "font-medium text-muted hover:text-text",
            )}
          >
            <span className="relative">
              <Icon name={item.icon} size={24} />
              {item.badge && <CountBadge count={counts[item.badge]} className="absolute -top-1.5 -right-2.5" />}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
