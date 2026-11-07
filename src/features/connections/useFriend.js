import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConnections } from "./connectionsSlice";

/**
 * const { friend, loading } = useFriend(userId);
 * Loads your connections once and finds `userId` among them. `friend` stays
 * null for anyone you aren't connected with: only friends can chat.
 */
export function useFriend(userId) {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.connections.status);
  const friend = useSelector((s) => (userId ? s.connections.list.find((u) => u._id === userId) : null)) ?? null;

  useEffect(() => {
    if (status === "idle") dispatch(fetchConnections());
  }, [dispatch, status]);

  return { friend, loading: !friend && (status === "idle" || status === "loading") };
}
