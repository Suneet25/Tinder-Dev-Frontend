import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { fetchReceivedRequests } from "../../features/requests/requestsSlice";
import { cn } from "../../lib/cn";
import BottomNav from "./BottomNav";
import { isCompactRoute, isImmersiveRoute } from "./navigation";
import SideNav from "./SideNav";

// Signed-in shell.
//   Mobile (< lg): a phone-width column with the tab bar pinned below.
//   Desktop (lg+): sidebar on the left; each page lays out the rest.
export default function AppLayout() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const requestsStatus = useSelector((s) => s.requests.status);

  // Load requests once so the nav badge has a count
  useEffect(() => {
    if (requestsStatus === "idle") dispatch(fetchReceivedRequests());
  }, [dispatch, requestsStatus]);

  return (
    <div className="flex min-h-dvh bg-bg">
      <SideNav compact={isCompactRoute(pathname)} className="hidden lg:flex" />
      <div className="mx-auto flex w-full max-w-md min-w-0 flex-1 flex-col md:border-x md:border-surface-2 lg:mx-0 lg:max-w-none lg:border-0">
        <main className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </main>
        <BottomNav className={cn("lg:hidden", isImmersiveRoute(pathname) && "hidden")} />
      </div>
    </div>
  );
}
