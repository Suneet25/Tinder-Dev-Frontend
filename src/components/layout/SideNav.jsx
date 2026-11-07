import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Avatar, Icon, Logo, TierBadge } from "../common";
import { cn } from "../../lib/cn";
import { CountBadge } from "./BottomNav";
import { isNavActive, NAV_ITEMS, SIDEBAR_EXTRA_ITEMS } from "./navigation";

function NavItem({ item, active, compact, count }) {
  return (
    <Link
      to={item.to}
      aria-current={active ? "page" : undefined}
      aria-label={compact ? item.label : undefined}
      title={compact ? item.label : undefined}
      className={cn(
        "relative flex items-center rounded-xl transition-colors",
        compact ? "size-12 justify-center rounded-[14px]" : "h-11 gap-3 px-3 text-[15px]",
        active ? "bg-surface-2 font-semibold text-text" : "font-medium text-text-soft hover:bg-surface hover:text-text",
      )}
    >
      <Icon name={item.icon} size={compact ? 22 : 20} className={active ? "text-primary" : undefined} />
      {!compact && item.label}
      {count > 0 && (compact ? <CountBadge count={count} className="absolute top-1 right-1" /> : <CountBadge count={count} className="ml-auto h-[22px] min-w-[22px] px-1.5 text-xs" />)}
    </Link>
  );
}

function UpgradeCard() {
  return (
    <div className="flex flex-col gap-2.5 rounded-[18px] border border-gold-border bg-gold-soft/60 p-4">
      <span className="flex items-center gap-2 font-bold text-gold">
        <TierBadge tier="gold" size={20} />
        Go Gold
      </span>
      <span className="text-[13px] leading-[1.45] text-muted">Unlimited profiles, chat and a gold tick on your profile.</span>
      <Link to="/premium" className="flex h-10 items-center justify-center rounded-[10px] bg-gold text-sm font-bold text-ink hover:opacity-90">
        See plans
      </Link>
    </div>
  );
}

// Desktop sidebar. `compact` collapses it to an icon rail (used by Chats).
export default function SideNav({ compact, className }) {
  const { pathname } = useLocation();
  const user = useSelector((s) => s.user.data);
  const premium = useSelector((s) => s.premium);
  const counts = { requests: useSelector((s) => s.requests.received.length) };
  const tier = premium.isPremium ? premium.membershipType?.toLowerCase() : null;
  const showUpgrade = premium.status === "ready" && !premium.isPremium;

  return (
    <aside
      className={cn(
        "sticky top-0 h-dvh shrink-0 flex-col gap-6 border-r border-surface-2 py-6",
        compact ? "w-[76px] items-center px-3" : "w-[232px] px-4",
        className,
      )}
    >
      <Link to="/feed" aria-label="Tinder-Dev home" className={cn(!compact && "px-2")}>
        <Logo withText={!compact} markClassName={compact ? "size-11 rounded-[13px]" : undefined} />
      </Link>

      <nav aria-label="Main" className={cn("flex flex-col gap-1", compact && "items-center gap-2.5")}>
        {[...NAV_ITEMS, ...SIDEBAR_EXTRA_ITEMS].map((item) => (
          <NavItem key={item.to} item={item} compact={compact} active={isNavActive(item, pathname)} count={item.badge ? counts[item.badge] : 0} />
        ))}
      </nav>

      <div className={cn("mt-auto flex flex-col gap-3", compact && "items-center")}>
        {showUpgrade &&
          (compact ? (
            <Link to="/premium" aria-label="Go Gold" title="Go Gold" className="flex size-12 items-center justify-center rounded-[14px] bg-gold-soft">
              <TierBadge tier="gold" size={24} />
            </Link>
          ) : (
            <UpgradeCard />
          ))}

        {user && (
          <Link
            to="/profile"
            aria-label={compact ? "Your profile" : undefined}
            className={cn("flex items-center gap-2.5 rounded-[14px] hover:bg-surface", compact ? "p-1" : "p-2")}
          >
            <Avatar user={user} size="xs" shape="circle" />
            {!compact && (
              <span className="flex min-w-0 flex-col">
                <span className="flex items-center gap-1 truncate text-sm font-semibold">
                  {user.firstName}
                  {tier && <TierBadge tier={tier} size={14} />}
                </span>
                <span className="text-xs text-muted">{premium.isPremium ? `${premium.membershipType} member` : "Free plan"}</span>
              </span>
            )}
          </Link>
        )}
      </div>
    </aside>
  );
}
