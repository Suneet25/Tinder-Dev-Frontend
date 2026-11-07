import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, EmptyState, Icon, IconButton, Spinner } from "../components/common";
import { useFriend } from "../features/connections/useFriend";
import { avatarFill, fullName, initials } from "../lib/avatar";

// /user/:userId: a friend's profile, with the Message button that opens chat.
// The backend only shares profiles of people you're connected with.
export default function FriendProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { friend, loading } = useFriend(userId);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-primary">
        <Spinner size={28} />
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="flex min-h-dvh flex-col justify-center">
        <EmptyState
          icon="user"
          title="Profile not available"
          description="You can see someone's profile once you're friends."
          action={
            <Button as={Link} to="/feed">
              Back to Discover
            </Button>
          }
        />
      </div>
    );
  }

  const meta = [friend.age && `${friend.age}`, friend.gender].filter(Boolean).join(" · ");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col lg:px-10 lg:py-8">
      <div
        className="relative flex h-[330px] shrink-0 items-center justify-center lg:h-[360px] lg:rounded-[28px]"
        style={{ background: avatarFill(friend._id) }}
      >
        <span className="font-display text-[120px] font-bold tracking-[-0.04em] text-ink/50" aria-hidden="true">
          {initials(friend)}
        </span>
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="absolute top-3 left-3 flex size-11 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-ink/85"
        >
          <Icon name="back" size={22} strokeWidth={2.2} />
        </button>
      </div>

      <section className="relative -mt-6 flex flex-col gap-4 rounded-t-3xl bg-bg px-5 pt-5 pb-6 lg:mt-0 lg:rounded-none lg:px-0">
        <div className="flex flex-col gap-1">
          <h1 className="heading text-[28px]">{fullName(friend)}</h1>
          {meta && <span className="text-sm text-muted capitalize">{meta}</span>}
        </div>

        <div className="flex gap-2.5">
          <Button as={Link} to={`/chat/${friend._id}`} size="lg" className="flex-1" leftIcon={<Icon name="chat" size={20} strokeWidth={2.2} />}>
            Message
          </Button>
          <span
            className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-secondary/15 text-secondary"
            role="img"
            aria-label={`You and ${friend.firstName} are friends`}
            title="Friends"
          >
            <Icon name="userCheck" size={20} strokeWidth={2.2} />
          </span>
        </div>
        <span className="text-[13px] text-muted">You're friends, so you can chat any time.</span>
      </section>
    </div>
  );
}
