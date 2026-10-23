import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, Button, EmptyState, Spinner } from "../components/common";
import PageHeader from "../components/layout/PageHeader";
import { fetchReceivedRequests, reviewRequest } from "../features/requests/requestsSlice";
import { fullName } from "../lib/avatar";

function RequestCard({ request }) {
  const dispatch = useDispatch();
  const reviewing = useSelector((s) => s.requests.reviewing[request._id]);
  const from = request.fromUserId ?? {};
  const meta = [from.age, from.gender].filter(Boolean).join(" · ");
  const review = (status) => dispatch(reviewRequest({ request, status }));

  return (
    <article className="flex flex-col gap-3 rounded-card border border-border bg-surface p-3.5">
      <div className="flex items-center gap-3">
        <Avatar user={from} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-base font-semibold">{fullName(from) || "Unknown user"}</span>
          <span className="text-[13px] capitalize text-muted">{meta || "Wants to connect"}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" disabled={!!reviewing} loading={reviewing === "rejected"} onClick={() => review("rejected")}>
          Decline
        </Button>
        <Button disabled={!!reviewing} loading={reviewing === "accepted"} onClick={() => review("accepted")}>
          Accept
        </Button>
      </div>
    </article>
  );
}

export default function Requests() {
  const dispatch = useDispatch();
  const { received, status } = useSelector((s) => s.requests);

  // Always refresh on visit; the list may have changed since the badge loaded
  useEffect(() => {
    dispatch(fetchReceivedRequests());
  }, [dispatch]);

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Requests" eyebrow={received.length ? `${received.length} pending` : undefined} />
      <div className="flex flex-col gap-3 px-4 pb-5">
        {status === "loading" && received.length === 0 && (
          <div className="flex justify-center py-16 text-primary">
            <Spinner size={28} />
          </div>
        )}
        {received.map((r) => (
          <RequestCard key={r._id} request={r} />
        ))}
        {status !== "loading" && received.length === 0 && (
          <EmptyState
            title="Inbox zero"
            description="No pending requests. Go swipe on some devs."
            action={
              <Button as={Link} to="/feed">
                Open Discover
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
