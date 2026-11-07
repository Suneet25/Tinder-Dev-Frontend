import { Link, useMatch, useParams } from "react-router-dom";
import ChatInfo from "../components/chat/ChatInfo";
import ChatList from "../components/chat/ChatList";
import Conversation from "../components/chat/Conversation";
import { Button, EmptyState, IconButton, Spinner } from "../components/common";
import { useFriend } from "../features/connections/useFriend";
import { DESKTOP_QUERY, useMediaQuery } from "../hooks/useMediaQuery";

// Routes:  /chats                     list
//          /chat/:targetUserId        conversation
//          /chat/:targetUserId/info   chat info
// Mobile shows one of them full screen; desktop shows list + conversation,
// with the info route opening a third column.

function NotFriends() {
  return (
    <EmptyState
      icon="chat"
      title="You can't chat here"
      description="Chat opens once you're friends, after one of you accepts the other's request."
      action={
        <Button as={Link} to="/chats">
          See your chats
        </Button>
      }
    />
  );
}

function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center text-primary">
      <Spinner size={28} />
    </div>
  );
}

// Full-screen mobile page with a back button and optional title
function MobileScreen({ backTo, backLabel, title, children }) {
  return (
    <div className="flex h-dvh flex-col">
      {backTo && (
        <header className="flex items-center gap-1 px-1 pt-3 pb-1">
          <IconButton as={Link} to={backTo} icon="back" label={backLabel} variant="ghost" iconSize={22} />
          {title && <h1 className="text-[17px] font-semibold">{title}</h1>}
        </header>
      )}
      {children}
    </div>
  );
}

function MobileChats({ targetUserId, showInfo }) {
  const { friend, loading } = useFriend(targetUserId);

  if (!targetUserId) return <ChatList className="flex-1" />;

  if (loading) {
    return (
      <MobileScreen>
        <Loading />
      </MobileScreen>
    );
  }

  if (!friend) {
    return (
      <MobileScreen backTo="/chats" backLabel="Back to chats">
        <NotFriends />
      </MobileScreen>
    );
  }

  if (showInfo) {
    return (
      <MobileScreen backTo={`/chat/${friend._id}`} backLabel="Back to chat" title="Chat info">
        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-7">
          <ChatInfo friend={friend} />
        </div>
      </MobileScreen>
    );
  }

  return (
    <MobileScreen>
      <Conversation friend={friend} infoOpen={false} />
    </MobileScreen>
  );
}

function DesktopChats({ targetUserId, showInfo }) {
  const { friend, loading } = useFriend(targetUserId);

  return (
    <div className="flex h-dvh">
      <ChatList activeId={targetUserId} className="w-[320px] shrink-0 border-r border-surface-2" />

      <div className="flex min-w-0 flex-1 flex-col">
        {!targetUserId ? (
          <EmptyState icon="chat" title="Pick a chat" description="Choose a friend on the left to start talking." className="my-auto" />
        ) : loading ? (
          <Loading />
        ) : friend ? (
          <Conversation friend={friend} infoOpen={showInfo} />
        ) : (
          <NotFriends />
        )}
      </div>

      {friend && showInfo && (
        <aside aria-label="Chat info" className="w-[300px] shrink-0 overflow-y-auto border-l border-surface-2 px-5 py-7">
          <ChatInfo friend={friend} />
        </aside>
      )}
    </div>
  );
}

export default function Chats() {
  const { targetUserId } = useParams();
  const showInfo = Boolean(useMatch("/chat/:targetUserId/info"));
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const Layout = isDesktop ? DesktopChats : MobileChats;
  return <Layout targetUserId={targetUserId} showInfo={showInfo} />;
}
