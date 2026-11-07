import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "../common/Spinner";

export function FullPageLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center text-primary">
      <Spinner size={28} />
    </div>
  );
}

// Waits for the initial /profile/view check, then requires a logged-in user
export function ProtectedRoute() {
  const { data, status } = useSelector((s) => s.user);
  const location = useLocation();
  if (status !== "ready") return <FullPageLoader />;
  if (!data) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

// Plans and checkout: members already have a plan, send them back to Profile
export function FreeOnlyRoute() {
  const { isPremium, status } = useSelector((s) => s.premium);
  if (status !== "ready") return <FullPageLoader />;
  if (isPremium) return <Navigate to="/profile" replace />;
  return <Outlet />;
}

// Login page: bounce logged-in users to where they were headed
export function PublicOnlyRoute() {
  const { data, status } = useSelector((s) => s.user);
  const location = useLocation();
  if (status !== "ready") return <FullPageLoader />;
  if (data) return <Navigate to={location.state?.from?.pathname ?? "/feed"} replace />;
  return <Outlet />;
}
