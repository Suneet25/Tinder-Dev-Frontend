import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

// The backend replies with plain strings on some routes and { message } on
// others; this turns any failed request into one readable sentence.
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;
  if (typeof data === "string" && data.trim() && !data.trim().startsWith("<")) return data;
  if (data?.message) return data.message;
  if (error?.code === "ERR_NETWORK" || error?.response?.status === 502 || error?.response?.status === 504) {
    return "Can't reach the server. Is the backend running?";
  }
  return fallback;
}

// userAuth answers 400 "Token is invalid!!" when there is no cookie and 401
// when the token is bad or expired.
export function isAuthError(error) {
  const { status, data } = error?.response ?? {};
  return status === 401 || (status === 400 && typeof data === "string" && /token is invalid/i.test(data));
}

// Wired from main.jsx so this module doesn't import the store (avoids a cycle).
export function setupInterceptors(store, { onSessionExpired }) {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const isProfileCheck = error?.config?.url === "/profile/view";
      if (isAuthError(error) && !isProfileCheck && store.getState().user.data) {
        store.dispatch(onSessionExpired());
      }
      return Promise.reject(error);
    },
  );
}
