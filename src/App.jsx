import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/common";
import AppLayout from "./components/layout/AppLayout";
import { ProtectedRoute, PublicOnlyRoute } from "./components/layout/RouteGuards";
import { persistTheme } from "./features/theme/themeSlice";
import { fetchProfile } from "./features/user/userSlice";
import Appearance from "./pages/Appearance";
import Connections from "./pages/Connections";
import EditProfile from "./pages/EditProfile";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Requests from "./pages/Requests";

export default function App() {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.theme.current);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());
    persistTheme(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/appearance" element={<Appearance />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
