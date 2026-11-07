import { createSlice, nanoid } from "@reduxjs/toolkit";

// Messages per conversation, keyed by the other user's _id. The backend has
// no chat API yet, so threads only live for this session; when it does,
// load threads with a thunk and send through the socket instead.
const chatSlice = createSlice({
  name: "chat",
  initialState: { threads: {} },
  reducers: {
    messageSent: {
      reducer(state, { payload }) {
        (state.threads[payload.userId] ??= []).push(payload.message);
      },
      prepare(userId, text) {
        return { payload: { userId, message: { id: nanoid(), text, fromMe: true, createdAt: new Date().toISOString() } } };
      },
    },
  },
});

export const { messageSent } = chatSlice.actions;
export default chatSlice.reducer;
