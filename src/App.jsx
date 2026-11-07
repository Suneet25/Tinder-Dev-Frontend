import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/common";
import AppLayout from "./components/layout/AppLayout";
import { FreeOnlyRoute, FullPageLoader, ProtectedRoute, PublicOnlyRoute } from "./components/layout/RouteGuards";
import { checkPremium } from "./features/premium/premiumSlice";
import { persistTheme } from "./features/theme/themeSlice";
import { fetchProfile } from "./features/user/userSlice";
import Appearance from "./pages/Appearance";
import Chats from "./pages/Chats";
import Checkout from "./pages/Checkout";
import EditProfile from "./pages/EditProfile";
import Feed from "./pages/Feed";
import FriendProfile from "./pages/FriendProfile";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";
import Premium from "./pages/Premium";
import Profile from "./pages/Profile";
import Requests from "./pages/Requests";

// Signed-in users never see the marketing page, so it loads on demand
const Landing = lazy(() => import("./pages/Landing"));

export default function App() {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.theme.current);
  const userId = useSelector((s) => s.user.data?._id);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Membership is per user: check it on every login / session restore
  useEffect(() => {
    if (userId) dispatch(checkPremium());
  }, [dispatch, userId]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());
    persistTheme(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          {/* Signed out: landing page and login. Signed-in users are sent to /feed. */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            {/* Sidebar on desktop, tab bar on mobile (hidden on full-screen routes, see navigation.js) */}
            <Route element={<AppLayout />}>
              <Route path="/feed" element={<Feed />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/chat/:targetUserId" element={<Chats />} />
              <Route path="/chat/:targetUserId/info" element={<Chats />} />
              <Route path="/user/:userId" element={<FriendProfile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/appearance" element={<Appearance />} />
              {/* Old name of the Chats tab */}
              <Route path="/connections" element={<Navigate to="/chats" replace />} />
            </Route>

            {/* Membership flow: full-screen, no navigation */}
            <Route element={<FreeOnlyRoute />}>
              <Route path="/premium" element={<Premium />} />
              <Route path="/premium/checkout" element={<Checkout />} />
            </Route>
            <Route path="/premium/success" element={<PaymentSuccess />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
}
