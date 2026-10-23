import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getErrorMessage } from "../../lib/api";
import { toast } from "../toast/toastSlice";

const PAGE_SIZE = 10;

// GET /feed?page&limit. Users you've already swiped on drop out of the feed
// server-side, so page 1 always holds the next unseen people.
export const fetchFeed = createAsyncThunk("feed/fetch", async (_, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.get("/feed", { params: { page: 1, limit: PAGE_SIZE } });
    return data;
  } catch (error) {
    const message = getErrorMessage(error, "Couldn't load your feed.");
    dispatch(toast.error(message));
    return rejectWithValue(message);
  }
});

// POST /request/send/:status/:toUserId with status "interested" | "ignored"
export const swipe = createAsyncThunk("feed/swipe", async ({ user, status }, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.post(`/request/send/${status}/${user._id}`);
    if (status === "interested") dispatch(toast.success(`Request sent to ${user.firstName}.`));
    return data;
  } catch (error) {
    const message = getErrorMessage(error, "Couldn't send that request.");
    dispatch(toast.error(message));
    return rejectWithValue(message);
  }
});

const feedSlice = createSlice({
  name: "feed",
  initialState: { users: [], status: "idle", hasMore: true },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFeed.fulfilled, (state, { payload }) => {
        state.status = "ready";
        state.users = payload;
        state.hasMore = payload.length === PAGE_SIZE;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.status = "error";
      })
      // Optimistic: drop the card as soon as the user swipes
      .addCase(swipe.pending, (state, { meta }) => {
        state.users = state.users.filter((u) => u._id !== meta.arg.user._id);
      })
      .addCase(swipe.rejected, (state, { meta, payload }) => {
        // Put the card back unless the server says it was already handled
        if (!/already sent/i.test(payload ?? "")) state.users.unshift(meta.arg.user);
      });
  },
});

export default feedSlice.reducer;
