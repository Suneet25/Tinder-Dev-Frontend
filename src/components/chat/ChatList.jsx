import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, Button, EmptyState, Icon, Spinner } from "../common";
import { selectConversations } from "../../features/chat/selectors";
import { fullName } from "../../lib/avatar";
import { cn } from "../../lib/cn";
import { formatShort } from "../../lib/time";

function ConversationRow({ friend, lastMessage, active }) {
  return (
    <li>
      <Link
        to={`/chat/${friend._id}`}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 px-5 py-2.5 transition-colors lg:mx-2 lg:rounded-2xl lg:px-2.5",
          active ? "bg-surface-2" : "hover:bg-surface",
        )}
      >
        <Avatar user={friend} size="md" shape="circle" />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-base font-semibold lg:text-[15px]">{fullName(friend)}</span>
            {lastMessage && <span className="ml-auto shrink-0 text-xs font-medium text-subtle">{formatShort(lastMessage.createdAt)}</span>}
          </span>
          <span className={cn("flex items-center gap-1.5 text-sm lg:text-[13px]", lastMessage ? "text-muted" : "text-subtle")}>
            {lastMessage && <Icon name="doubleCheck" size={16} strokeWidth={2.2} className="shrink-0 text-subtle" label="Sent" />}
            <span className="truncate">{lastMessage ? lastMessage.text : "Say hi to start chatting"}</span>
          </span>
        </span>
      </Link>
    </li>
  );
}

/**
 * Friends you can chat with, most recent first. On mobile it's the Chats
 * tab; on desktop it's the left column of the split view.
 */
export default function ChatList({ activeId, className }) {
  const conversations = useSelector(selectConversations);
  const status = useSelector((s) => s.connections.status);
  const pendingRequests = useSelector((s) => s.requests.received.length);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(({ friend, lastMessage }) => fullName(friend).toLowerCase().includes(q) || lastMessage?.text.toLowerCase().includes(q));
  }, [conversations, query]);

  const loading = status === "idle" || (status === "loading" && conversations.length === 0);

  return (
    <section aria-label="Chats" className={cn("flex min-h-0 flex-col", className)}>
      <header className="flex flex-col gap-3.5 px-5 pt-[18px] pb-2.5 lg:px-[18px] lg:pt-[22px]">
        <h1 className="heading text-[28px] lg:text-[26px]">Chats</h1>
        {conversations.length > 0 && (
          <label className="flex h-11 items-center gap-2.5 rounded-full bg-surface-2 px-4 text-muted focus-within:ring-2 focus-within:ring-primary">
            <Icon name="search" size={18} />
            <span className="sr-only">Search chats</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search friends and messages"
              className="min-w-0 flex-1 bg-transparent text-[15px] text-text focus:outline-none lg:text-sm"
            />
          </label>
        )}
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-3">
        {loading && (
          <div className="flex justify-center py-16 text-primary">
            <Spinner size={28} />
          </div>
        )}

        {!loading && conversations.length === 0 && (
          <EmptyState
            icon="chat"
            title="No friends yet"
            description="Chat opens once someone accepts your request, or you accept theirs."
            action={
              <Button as={Link} to="/feed">
                Find people
              </Button>
            }
          />
        )}

        <ul>
          {filtered.map(({ friend, lastMessage }) => (
            <ConversationRow key={friend._id} friend={friend} lastMessage={lastMessage} active={friend._id === activeId} />
          ))}
        </ul>

        {conversations.length > 0 && filtered.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted">No chats match “{query}”.</p>}

        {!loading && (
          <div className="mx-5 mt-3.5 flex items-center gap-3 rounded-[18px] bg-surface px-4 py-3.5 lg:mx-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-muted">
              <Icon name="userPlus" size={18} />
            </span>
            <span className="text-[13px] leading-[1.45] text-muted">
              Only friends can chat.{" "}
              {pendingRequests > 0 ? (
                <Link to="/requests" className="font-semibold text-primary-hover hover:text-primary">
                  {pendingRequests} pending {pendingRequests === 1 ? "request" : "requests"}
                </Link>
              ) : (
                <Link to="/feed" className="font-semibold text-primary-hover hover:text-primary">
                  Find people on Discover
                </Link>
              )}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
