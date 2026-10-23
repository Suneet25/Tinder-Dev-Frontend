import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer, { clearUser, logout } from "../features/user/userSlice";
import feedReducer from "../features/feed/feedSlice";
import requestsReducer from "../features/requests/requestsSlice";
import connectionsReducer from "../features/connections/connectionsSlice";
import toastReducer from "../features/toast/toastSlice";
import themeReducer from "../features/theme/themeSlice";

const appReducer = combineReducers({
  user: userReducer,
  feed: feedReducer,
  requests: requestsReducer,
  connections: connectionsReducer,
  toast: toastReducer,
  theme: themeReducer,
});

// On logout / expired session wipe user-scoped data, but keep toasts and theme
const rootReducer = (state, action) => {
  if (action.type === logout.fulfilled.type || action.type === clearUser.type) {
    const { toast, theme } = state;
    state = { toast, theme };
  }
  return appReducer(state, action);
};

export const store = configureStore({ reducer: rootReducer });
