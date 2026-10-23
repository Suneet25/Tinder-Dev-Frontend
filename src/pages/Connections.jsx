import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, Button, EmptyState, Icon, SectionLabel, Spinner } from "../components/common";
import PageHeader from "../components/layout/PageHeader";
import { fetchConnections } from "../features/connections/connectionsSlice";
import { fullName } from "../lib/avatar";

export default function Connections() {
  const dispatch = useDispatch();
  const { list, status } = useSelector((s) => s.connections);
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchConnections());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? list.filter((u) => fullName(u).toLowerCase().includes(q)) : list;
  }, [list, query]);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Matches">
        {list.length > 0 && (
          <label className="flex h-[46px] items-center gap-2.5 rounded-[14px] border border-border bg-surface px-3.5 text-muted focus-within:border-primary">
            <Icon name="search" size={18} />
            <span className="sr-only">Search matches</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name"
              className="min-w-0 flex-1 bg-transparent text-[15px] text-text focus:outline-none"
            />
          </label>
        )}
      </PageHeader>

      <div className="flex flex-col pb-4">
        {status === "loading" && list.length === 0 && (
          <div className="flex justify-center py-16 text-primary">
            <Spinner size={28} />
          </div>
        )}

        {list.length > 0 && <SectionLabel as="h2" className="px-5 pb-1.5">Connections · {list.length}</SectionLabel>}

        <ul>
          {filtered.map((u) => (
            <li key={u._id} className="flex items-center gap-3 px-5 py-2.5">
              <Avatar user={u} />
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-[15px] font-semibold">{fullName(u)}</span>
                <span className="text-sm capitalize text-muted">{[u.age, u.gender].filter(Boolean).join(" · ") || "Connected"}</span>
              </div>
            </li>
          ))}
        </ul>

        {list.length > 0 && filtered.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted">No matches for “{query}”.</p>}

        {status !== "loading" && list.length === 0 && (
          <EmptyState
            icon="chat"
            title="No matches yet"
            description="When someone accepts your request, or you accept theirs, they show up here."
            action={
              <Button as={Link} to="/feed">
                Find people
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
