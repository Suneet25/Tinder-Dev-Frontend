import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, Button, Icon } from "../common";
import { selectThread } from "../../features/chat/selectors";
import { THEMES } from "../../features/theme/themeSlice";
import { fullName } from "../../lib/avatar";

/**
 * Details about the person you're chatting with. Rendered as a full screen
 * on mobile (/chat/:id/info) and as the right-hand panel on desktop.
 */
export default function ChatInfo({ friend }) {
  const messageCount = useSelector((s) => selectThread(s, friend._id).length);
  const themeId = useSelector((s) => s.theme.current);
  const themeName = THEMES.find((t) => t.id === themeId)?.name ?? "Midnight";
  const meta = [friend.age, friend.gender].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col items-center gap-2 text-center">
        <Avatar user={friend} size="xl" shape="circle" />
        <h2 className="heading text-[22px]">{fullName(friend)}</h2>
        {meta && <span className="text-[13px] text-muted capitalize">{meta}</span>}
        <span className="flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary">
          <Icon name="userCheck" size={14} strokeWidth={2.2} />
          Friends
        </span>
      </section>

      <Button as={Link} to={`/user/${friend._id}`} variant="soft" leftIcon={<Icon name="user" size={18} />}>
        View profile
      </Button>

      <section className="overflow-hidden rounded-card bg-surface">
        <div className="flex items-center gap-3 border-b border-surface-2 px-4 py-3.5">
          <span className="flex-1 text-[15px] font-medium">Messages sent</span>
          <span className="text-sm font-semibold text-muted">{messageCount}</span>
        </div>
        <Link to="/appearance" className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-2">
          <span className="flex-1 text-[15px] font-medium">Chat theme</span>
          <span className="text-[13px] text-muted">{themeName}</span>
          <Icon name="chevronRight" size={18} className="text-subtle" />
        </Link>
      </section>
    </div>
  );
}
