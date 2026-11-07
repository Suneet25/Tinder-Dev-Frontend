import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, Icon, IconButton } from "../common";
import { messageSent } from "../../features/chat/chatSlice";
import { selectThread } from "../../features/chat/selectors";
import { fullName } from "../../lib/avatar";
import { cn } from "../../lib/cn";
import { formatClock } from "../../lib/time";

const QUICK_REPLIES = ["Hey, nice to match!", "What are you building these days?", "Pair on something this weekend?"];
const GROUP_GAP_MS = 5 * 60 * 1000;

// Messages from the same sender within 5 minutes share a group: tighter
// corners between them and one timestamp under the last.
function groupMessages(messages) {
  const groups = [];
  for (const m of messages) {
    const last = groups.at(-1);
    const prev = last?.messages.at(-1);
    if (last && last.fromMe === m.fromMe && new Date(m.createdAt) - new Date(prev.createdAt) < GROUP_GAP_MS) {
      last.messages.push(m);
    } else {
      groups.push({ fromMe: m.fromMe, messages: [m] });
    }
  }
  return groups;
}

// As in the design: the first bubble of a group tucks its bottom corner on the
// sender's side, the ones after it tuck the top corner.
function bubbleShape(fromMe, index) {
  if (fromMe) return index === 0 ? "rounded-[20px] rounded-br-md" : "rounded-[20px] rounded-tr-md";
  return index === 0 ? "rounded-[20px] rounded-bl-md" : "rounded-[20px] rounded-tl-md";
}

const subtitle = (user) => [user.age, user.gender].filter(Boolean).join(" · ") || "Friend";

/**
 * One chat thread: header, messages, composer.
 * `infoOpen` reflects the /chat/:id/info route; the info button toggles it.
 */
export default function Conversation({ friend, infoOpen }) {
  const dispatch = useDispatch();
  const me = useSelector((s) => s.user.data);
  const messages = useSelector((s) => selectThread(s, friend._id));
  const [draft, setDraft] = useState("");
  const endRef = useRef(null);
  const basePath = `/chat/${friend._id}`;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, friend._id]);

  const send = (text) => {
    const message = text.trim();
    if (!message) return;
    dispatch(messageSent(friend._id, message));
    setDraft("");
  };

  const groups = groupMessages(messages);
  const hasDraft = draft.trim().length > 0;

  return (
    <section aria-label={`Chat with ${friend.firstName}`} className="flex h-full min-h-0 flex-1 flex-col">
      <header className="flex items-center gap-2 border-b border-surface-2 py-3 pr-2 pl-1 lg:gap-3 lg:px-6 lg:py-4">
        <IconButton as={Link} to="/chats" icon="back" label="Back to chats" variant="ghost" iconSize={22} className="lg:hidden" />
        <Link to={`/user/${friend._id}`} className="flex min-w-0 flex-1 items-center gap-2.5 lg:gap-3">
          <Avatar user={friend} size="xs" shape="circle" className="lg:hidden" />
          <Avatar user={friend} size="sm" shape="circle" className="max-lg:hidden" />
          <span className="flex min-w-0 flex-col gap-px">
            <h1 className="truncate text-base font-semibold lg:text-[17px] lg:font-bold">{fullName(friend)}</h1>
            <span className="truncate text-xs font-medium text-muted capitalize lg:text-[13px]">{subtitle(friend)}</span>
          </span>
        </Link>
        <IconButton
          as={Link}
          to={infoOpen ? basePath : `${basePath}/info`}
          icon={infoOpen ? "panel" : "info"}
          label={infoOpen ? "Hide chat info" : "Chat info"}
          variant={infoOpen ? "inverse" : "ghost"}
        />
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-[3px] overflow-y-auto px-3.5 pt-4 pb-3 lg:px-[clamp(16px,4vw,56px)] lg:pt-6" aria-live="polite">
        <section className="flex flex-col items-center gap-2 self-center pt-1.5 pb-3.5 text-center">
          <span className="flex">
            <Avatar user={me} size="xs" shape="circle" className="rounded-full border-[3px] border-bg" />
            <Avatar user={friend} size="xs" shape="circle" className="-ml-3 rounded-full border-[3px] border-bg" />
          </span>
          <span className="text-sm font-semibold">You and {friend.firstName} are friends</span>
          <span className="text-xs text-muted">Say hi and start the conversation</span>
        </section>

        {groups.length > 0 && <span className="mt-1 mb-2.5 self-center text-xs font-semibold text-muted">Today</span>}

        {groups.map((group, g) => {
          const lastMessage = group.messages.at(-1);
          const isLastGroup = g === groups.length - 1;
          return (
            <div key={lastMessage.id} className={cn("flex flex-col gap-[3px]", group.fromMe ? "items-end" : "items-start")}>
              {group.messages.map((m, i) => (
                <p
                  key={m.id}
                  className={cn(
                    "max-w-[76%] px-3.5 py-2.5 text-[15px] leading-[1.4] wrap-break-word whitespace-pre-wrap lg:max-w-[min(520px,76%)] lg:px-4 lg:py-[11px]",
                    group.fromMe ? "bg-primary text-on-primary" : "bg-surface-2",
                    bubbleShape(group.fromMe, i),
                  )}
                >
                  {m.text}
                </p>
              ))}
              <span className={cn("mt-0.5 mb-2.5 flex items-center gap-1 text-[11px] text-subtle", group.fromMe ? "mr-1.5" : "ml-1.5")}>
                {isLastGroup && group.fromMe ? "Just now" : formatClock(lastMessage.createdAt)}
                {group.fromMe && <Icon name="doubleCheck" size={16} strokeWidth={2.2} label="Sent" />}
              </span>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {!hasDraft && messages.length === 0 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-3.5 pt-1.5 pb-2 lg:px-[clamp(16px,4vw,56px)]">
          {QUICK_REPLIES.map((text) => (
            <button
              key={text}
              type="button"
              onClick={() => send(text)}
              className="h-9 shrink-0 rounded-full border border-border px-3.5 text-[13px] font-medium hover:bg-surface"
            >
              {text}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
        className="flex items-center gap-2 px-2.5 pt-2 pb-7 lg:gap-2.5 lg:px-[clamp(16px,4vw,56px)] lg:pt-3.5 lg:pb-[22px]"
      >
        <label className="flex min-w-0 flex-1">
          <span className="sr-only">Message {friend.firstName}</span>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message"
            autoComplete="off"
            className="h-11.5 w-full rounded-[23px] border border-transparent bg-surface-2 px-4.5 text-[15px] text-text focus:border-border-strong focus:outline-none lg:h-12 lg:rounded-3xl lg:px-5"
          />
        </label>
        {/* Mobile: round icon that appears once you type. Desktop: always-visible "Send" pill. */}
        <button
          type="submit"
          aria-label="Send"
          disabled={!hasDraft}
          className={cn(
            "flex size-11.5 shrink-0 items-center justify-center gap-2 rounded-full bg-primary font-bold text-on-primary hover:bg-primary-hover disabled:opacity-50 lg:h-12 lg:w-auto lg:px-5.5",
            !hasDraft && "max-lg:hidden",
          )}
        >
          <span className="hidden lg:inline">Send</span>
          <Icon name="send" size={20} strokeWidth={2.4} className="lg:hidden" />
          <Icon name="arrowRight" size={16} strokeWidth={2.4} className="max-lg:hidden" />
        </button>
      </form>
    </section>
  );
}
