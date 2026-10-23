import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Badge, Button, EmptyState, IconButton, Spinner, Tag } from "../components/common";
import PageHeader from "../components/layout/PageHeader";
import { fetchFeed, swipe } from "../features/feed/feedSlice";
import { avatarFill, initials } from "../lib/avatar";

function ProfileCard({ user }) {
  return (
    <article className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-card border border-border bg-surface">
      <div className="relative flex min-h-56 flex-1 items-center justify-center" style={{ background: avatarFill(user._id) }}>
        <span className="font-display text-[92px] font-bold tracking-[-0.03em] text-ink/55" aria-hidden="true">
          {initials(user)}
        </span>
        {user.gender && (
          <Badge tone="dark" className="absolute bottom-3 left-3 capitalize">
            {user.gender}
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-2 px-4 py-3.5">
        <div className="flex items-baseline gap-2">
          <h2 className="heading text-[25px]">
            {user.firstName} {user.lastName}
          </h2>
          {user.age && <span className="text-lg text-muted">{user.age}</span>}
        </div>
        {user.hobbies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {user.hobbies.map((h) => (
              <Tag key={h}>{h}</Tag>
            ))}
          </div>
        )}
      </div>
    </article>
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
    <div className="flex flex-1 flex-col">
      <PageHeader
        eyebrow={users.length > 1 ? `${users.length - 1} more in your stack` : "Discover"}
        title="Discover"
        actions={<IconButton as={Link} to="/appearance" icon="palette" label="Appearance" className="text-primary" />}
      />

      <div className="flex flex-1 flex-col px-4 pb-2">
        {status === "loading" && !current && (
          <div className="flex flex-1 items-center justify-center text-primary">
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
            description="No new developers right now. Check back later or review your requests."
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
            <ProfileCard key={current._id} user={current} />
            <div className="flex items-start justify-center gap-8 pt-4 pb-2">
              <span className="flex flex-col items-center gap-1">
                <IconButton size="lg" icon="x" label={`Pass on ${current.firstName}`} onClick={() => act("ignored")} />
                <span className="text-[11px] text-muted">Pass</span>
              </span>
              <span className="flex flex-col items-center gap-1">
                <IconButton size="lg" variant="primary" icon="heart" label={`Send request to ${current.firstName}`} onClick={() => act("interested")} />
                <span className="text-[11px] text-muted">Interested</span>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
