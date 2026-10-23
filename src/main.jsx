import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./app/store";
import { sessionExpired } from "./features/user/userSlice";
import { setupInterceptors } from "./lib/api";
import "./index.css";

setupInterceptors(store, { onSessionExpired: sessionExpired });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
