import { createSlice, nanoid } from "@reduxjs/toolkit";

const MAX_TOASTS = 4;
const DEFAULT_DURATION = { success: 3000, info: 3500, warning: 4500, error: 5000 };

const toastSlice = createSlice({
  name: "toast",
  initialState: { items: [] },
  reducers: {
    showToast: {
      reducer(state, { payload }) {
        // Same message already on screen: restart it instead of stacking a copy
        state.items = state.items.filter((t) => !(t.type === payload.type && t.message === payload.message));
        state.items.push(payload);
        if (state.items.length > MAX_TOASTS) state.items.shift();
      },
      prepare({ type = "info", message, title, duration }) {
        return {
          payload: { id: nanoid(), type, title, message, duration: duration ?? DEFAULT_DURATION[type] ?? 3500 },
        };
      },
    },
    dismissToast(state, { payload: id }) {
      state.items = state.items.filter((t) => t.id !== id);
    },
    clearToasts(state) {
      state.items = [];
    },
  },
});

export const { showToast, dismissToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;

// Shorthands for thunks: dispatch(toast.error("..."))
export const toast = {
  success: (message, opts) => showToast({ ...opts, type: "success", message }),
  error: (message, opts) => showToast({ ...opts, type: "error", message }),
  info: (message, opts) => showToast({ ...opts, type: "info", message }),
  warning: (message, opts) => showToast({ ...opts, type: "warning", message }),
};
