import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "../../lib/cn";
import Icon from "../common/Icon";

const ITEMS = [
  { to: "/feed", label: "Discover", icon: "compass" },
  { to: "/requests", label: "Requests", icon: "inbox", countKey: "requests" },
  { to: "/connections", label: "Matches", icon: "chat" },
  { to: "/profile", label: "Profile", icon: "user" },
];

export default function BottomNav() {
  const requestCount = useSelector((s) => s.requests.received.length);

  return (
    <nav
      aria-label="Main"
      className="sticky bottom-0 z-10 grid grid-cols-4 border-t border-surface-2 bg-bg px-2 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 py-1.5 text-[11px] transition-colors",
              isActive ? "font-semibold text-primary" : "font-medium text-muted hover:text-text",
            )
          }
        >
          <span className="relative">
            <Icon name={item.icon} size={24} />
            {item.countKey && requestCount > 0 && (
              <span className="absolute -right-2.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-on-primary">
                {requestCount > 9 ? "9+" : requestCount}
              </span>
            )}
          </span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
