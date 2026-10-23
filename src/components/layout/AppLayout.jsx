import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { fetchReceivedRequests } from "../../features/requests/requestsSlice";
import BottomNav from "./BottomNav";

// Mobile-first shell: a phone-width column with the tab bar pinned below.
export default function AppLayout() {
  const dispatch = useDispatch();
  const requestsStatus = useSelector((s) => s.requests.status);

  // Load requests once so the nav badge has a count
  useEffect(() => {
    if (requestsStatus === "idle") dispatch(fetchReceivedRequests());
  }, [dispatch, requestsStatus]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-bg md:border-x md:border-surface-2">
      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
