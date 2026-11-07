import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, Icon } from "../common";
import { selectConversations } from "../../features/chat/selectors";
import { fetchConnections } from "../../features/connections/connectionsSlice";
import { reviewRequest } from "../../features/requests/requestsSlice";
import { fullName } from "../../lib/avatar";
import { cn } from "../../lib/cn";

const PREVIEW_COUNT = 3;

function PanelSection({ title, linkTo, linkLabel, children }) {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">{title}</h2>
        <Link to={linkTo} className="text-[13px] font-semibold text-primary-hover hover:text-primary">
          {linkLabel}
        </Link>
      </div>
      {children}
    </section>
  );
}

function RoundAction({ label, icon, onClick, disabled, primary }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-50",
        primary ? "bg-primary text-on-primary hover:bg-primary-hover" : "bg-surface-2 text-text hover:bg-border",
      )}
    >
      <Icon name={icon} size={16} strokeWidth={2.5} />
    </button>
  );
}

function RequestRow({ request }) {
  const dispatch = useDispatch();
  const reviewing = useSelector((s) => s.requests.reviewing[request._id]);
  const from = request.fromUserId ?? {};
  const name = from.firstName ?? "them";
  const review = (status) => dispatch(reviewRequest({ request, status }));

  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-surface p-2.5">
      <Avatar user={from} size="xs" shape="circle" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold">{fullName(from) || "Unknown user"}</span>
        <span className="truncate text-xs text-muted capitalize">{[from.age, from.gender].filter(Boolean).join(" · ") || "Wants to connect"}</span>
      </span>
      <RoundAction label={`Decline ${name}`} icon="x" disabled={!!reviewing} onClick={() => review("rejected")} />
      <RoundAction label={`Accept ${name}`} icon="check" primary disabled={!!reviewing} onClick={() => review("accepted")} />
    </div>
  );
}

// Right-hand column on desktop Discover: pending requests and recent chats.
export default function ActivityPanel({ className }) {
  const dispatch = useDispatch();
  const requests = useSelector((s) => s.requests.received);
  const connectionsStatus = useSelector((s) => s.connections.status);
  const conversations = useSelector(selectConversations);

  useEffect(() => {
    if (connectionsStatus === "idle") dispatch(fetchConnections());
  }, [dispatch, connectionsStatus]);

  return (
    <aside aria-label="Activity" className={cn("w-[300px] shrink-0 flex-col gap-6.5 border-l border-surface-2 px-5.5 py-7", className)}>
      <PanelSection title="Friend requests" linkTo="/requests" linkLabel="See all">
        {requests.length === 0 ? (
          <p className="text-[13px] text-muted">No pending requests.</p>
        ) : (
          requests.slice(0, PREVIEW_COUNT).map((r) => <RequestRow key={r._id} request={r} />)
        )}
      </PanelSection>

      <PanelSection title="Chats" linkTo="/chats" linkLabel="Open">
        {conversations.length === 0 ? (
          <p className="text-[13px] text-muted">Friends you can chat with show up here.</p>
        ) : (
          <div className="-mx-2 flex flex-col">
            {conversations.slice(0, PREVIEW_COUNT).map(({ friend, lastMessage }) => (
              <Link key={friend._id} to={`/chat/${friend._id}`} className="flex items-center gap-2.5 rounded-[14px] p-2 hover:bg-surface">
                <Avatar user={friend} size="xs" shape="circle" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-semibold">{fullName(friend)}</span>
                  <span className="truncate text-[13px] text-muted">{lastMessage ? `You: ${lastMessage.text}` : "Say hi"}</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </PanelSection>
    </aside>
  );
}
