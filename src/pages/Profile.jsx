import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, Button, Card, Icon, IconButton, SectionLabel, Tag } from "../components/common";
import PageHeader from "../components/layout/PageHeader";
import { fetchConnections } from "../features/connections/connectionsSlice";
import { logout } from "../features/user/userSlice";
import { fullName } from "../lib/avatar";

function Detail({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm font-semibold capitalize">{value || "—"}</span>
    </div>
  );
}

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.data);
  const connectionsStatus = useSelector((s) => s.connections.status);
  const connections = useSelector((s) => s.connections.list.length);
  const requests = useSelector((s) => s.requests.received.length);

  useEffect(() => {
    if (connectionsStatus === "idle") dispatch(fetchConnections());
  }, [dispatch, connectionsStatus]);

  // Brief gap between logout and the redirect
  if (!user) return null;

  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : null;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Profile" actions={<IconButton as={Link} to="/appearance" icon="palette" label="Appearance and themes" />} />

      <div className="flex flex-col gap-4 px-5 pb-6">
        <section className="flex items-center gap-4">
          <Avatar user={user} size="lg" />
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="heading truncate text-2xl">
              {user.firstName}
              {user.age ? `, ${user.age}` : ""}
            </h2>
            <span className="flex items-center gap-1.5 truncate text-sm text-muted">
              <Icon name="mail" size={14} />
              {user.emailId}
            </span>
            {memberSince && <span className="text-[13px] font-medium text-secondary">Member since {memberSince}</span>}
          </div>
        </section>

        <Button as={Link} to="/profile/edit" variant="soft" leftIcon={<Icon name="pencil" size={16} />}>
          Edit profile
        </Button>

        <section aria-label="Your stats" className="grid grid-cols-2 gap-2">
          <Link to="/connections" className="flex flex-col gap-1 rounded-2xl border border-border bg-surface px-3 py-3.5 hover:bg-surface-2">
            <span className="font-display text-2xl font-bold">{connections}</span>
            <span className="text-xs text-muted">Matches</span>
          </Link>
          <Link to="/requests" className="flex flex-col gap-1 rounded-2xl border border-border bg-surface px-3 py-3.5 hover:bg-surface-2">
            <span className="font-display text-2xl font-bold text-secondary">{requests}</span>
            <span className="text-xs text-muted">Pending requests</span>
          </Link>
        </section>

        <Card className="grid grid-cols-3 gap-2">
          <Detail label="Name" value={fullName(user)} />
          <Detail label="Age" value={user.age} />
          <Detail label="Gender" value={user.gender} />
        </Card>

        <section className="flex flex-col gap-2.5">
          <SectionLabel>Interests &amp; skills</SectionLabel>
          {user.hobbies?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {user.hobbies.map((h) => (
                <Tag key={h}>{h}</Tag>
              ))}
            </div>
          ) : (
            <Link to="/profile/edit" className="self-start rounded-full border border-dashed border-border-strong px-3 py-1.5 text-[13px] font-medium text-muted hover:text-text">
              + Add interests
            </Link>
          )}
        </section>

        <section className="flex items-center gap-3.5 rounded-[20px] bg-surface-2 p-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-primary text-on-primary">
            <Icon name="bolt" size={22} strokeWidth={2.2} />
          </span>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-[15px] font-semibold">Go Premium</span>
            <span className="text-[13px] text-muted">Chat, unlimited profiles, gold tick</span>
          </div>
          <Link to="/premium" className="rounded-xl bg-text px-3.5 py-2.5 text-[13px] font-semibold text-bg hover:opacity-90">
            Upgrade
          </Link>
        </section>

        <Button variant="danger" className="mt-2" leftIcon={<Icon name="logout" size={18} />} onClick={() => dispatch(logout())}>
          Log out
        </Button>
      </div>
    </div>
  );
}
