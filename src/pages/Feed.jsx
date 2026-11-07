import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Badge, Button, EmptyState, Icon, IconButton, Spinner, Tag } from "../components/common";
import ActivityPanel from "../components/feed/ActivityPanel";
import PageHeader from "../components/layout/PageHeader";
import { fetchFeed, swipe } from "../features/feed/feedSlice";
import { avatarFill, fullName, initials } from "../lib/avatar";

const UP_NEXT_COUNT = 4;

// Mobile: stacked card with round buttons under it.
// Desktop: photo on the left, details and Pass / Add friend on the right.
function ProfileCard({ user, onPass, onLike }) {
  return (
    <article className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-card border border-border bg-surface lg:flex-none lg:flex-row lg:rounded-[28px]">
      <div className="relative flex min-h-56 flex-1 items-center justify-center lg:min-h-[460px] lg:basis-1/2" style={{ background: avatarFill(user._id) }}>
        <span className="font-display text-[92px] font-bold tracking-[-0.03em] text-ink/55 lg:text-[150px]" aria-hidden="true">
          {initials(user)}
        </span>
        {user.gender && (
          <Badge tone="dark" className="absolute bottom-3 left-3 capitalize lg:top-4 lg:bottom-auto lg:left-4">
            {user.gender}
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-2 px-4 py-3.5 lg:basis-1/2 lg:gap-4.5 lg:p-7">
        <div className="flex items-baseline gap-2">
          <h2 className="heading text-[25px] lg:text-[34px]">{fullName(user)}</h2>
          {user.age && <span className="text-lg text-muted lg:text-2xl">{user.age}</span>}
        </div>
        {user.hobbies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 lg:gap-2">
            {user.hobbies.map((h) => (
              <Tag key={h}>{h}</Tag>
            ))}
          </div>
        )}
        <div className="mt-auto hidden flex-wrap gap-2.5 pt-4 lg:flex">
          <Button variant="outline" size="lg" className="flex-1" leftIcon={<Icon name="x" size={18} strokeWidth={2.4} />} onClick={onPass}>
            Pass
          </Button>
          <Button size="lg" className="flex-1" leftIcon={<Icon name="userPlus" size={18} strokeWidth={2.2} />} onClick={onLike}>
            Add friend
          </Button>
        </div>
        <p className="hidden items-center gap-2 text-[13px] text-muted lg:flex">
          <Icon name="lock" size={14} />
          Chat opens once {user.firstName} accepts your request.
        </p>
      </div>
    </article>
  );
}

function UpNext({ users }) {
  if (users.length === 0) return null;
  return (
    <section className="hidden flex-col gap-3 lg:flex">
      <h2 className="text-sm font-semibold tracking-[0.06em] text-muted uppercase">Up next</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
        {users.map((u) => (
          <div key={u._id} className="overflow-hidden rounded-[18px] border border-border bg-surface">
            <div className="flex h-[110px] items-center justify-center font-display text-[34px] font-bold text-ink/50" style={{ background: avatarFill(u._id) }} aria-hidden="true">
              {initials(u)}
            </div>
            <div className="flex flex-col gap-0.5 px-3 py-2.5">
              <span className="truncate text-sm font-semibold">{u.firstName}</span>
              <span className="truncate text-xs text-muted capitalize">{[u.age, u.gender].filter(Boolean).join(" · ") || "New here"}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Feed() {
  const dispatch = useDispatch();
  const { users, status, hasMore } = useSelector((s) => s.feed);
  const current = users[0];

  useEffect(() => {
    if (status === "idle") dispatch(fetchFeed());
  }, [dispatch, status]);

  // Swiped through a full batch: ask the server for the next one.
  // hasMore stops the loop once the server returns a short/empty page.
  useEffect(() => {
    if (status === "ready" && users.length === 0 && hasMore) dispatch(fetchFeed());
  }, [dispatch, status, users.length, hasMore]);

  const act = (statusType) => current && dispatch(swipe({ user: current, status: statusType }));

  return (
    <div className="flex flex-1">
      <div className="flex min-w-0 flex-1 flex-col lg:gap-5.5 lg:px-[clamp(16px,3vw,40px)] lg:py-7">
        <PageHeader
          eyebrow={users.length > 1 ? `${users.length - 1} more in your stack` : "Discover"}
          title="Discover"
          className="lg:p-0"
          actions={<IconButton as={Link} to="/appearance" icon="palette" label="Appearance" className="text-primary lg:hidden" />}
        />

        <div className="flex flex-1 flex-col px-4 pb-2 lg:flex-none lg:gap-6 lg:p-0">
          {status === "loading" && !current && (
            <div className="flex flex-1 items-center justify-center py-16 text-primary">
              <Spinner size={28} />
            </div>
          )}

          {status === "error" && !current && (
            <EmptyState
              icon="refresh"
              title="Couldn't load the feed"
              description="Check that the backend is running, then try again."
              action={<Button onClick={() => dispatch(fetchFeed())}>Try again</Button>}
            />
          )}

          {status === "ready" && !current && (
            <EmptyState
              icon="compass"
              title="You're all caught up"
              description="No new people right now. Check back later or review your requests."
              action={
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => dispatch(fetchFeed())}>
                    Refresh
                  </Button>
                  <Button as={Link} to="/requests">
                    View requests
                  </Button>
                </div>
              }
            />
          )}

          {current && (
            <>
              <ProfileCard key={current._id} user={current} onPass={() => act("ignored")} onLike={() => act("interested")} />
              <div className="flex items-start justify-center gap-8 pt-4 pb-2 lg:hidden">
                <span className="flex flex-col items-center gap-1">
                  <IconButton size="lg" icon="x" label={`Pass on ${current.firstName}`} onClick={() => act("ignored")} />
                  <span className="text-[11px] text-muted">Pass</span>
                </span>
                <span className="flex flex-col items-center gap-1">
                  <IconButton size="lg" variant="primary" icon="heart" label={`Send request to ${current.firstName}`} onClick={() => act("interested")} />
                  <span className="text-[11px] text-muted">Interested</span>
                </span>
              </div>
              <UpNext users={users.slice(1, 1 + UP_NEXT_COUNT)} />
            </>
          )}
        </div>
      </div>

      <ActivityPanel className="hidden xl:flex" />
    </div>
  );
}
