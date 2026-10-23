import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getErrorMessage } from "../../lib/api";
import { toast } from "../toast/toastSlice";

// GET /user/connections -> { data: [user, ...] }
export const fetchConnections = createAsyncThunk("connections/fetch", async (_, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.get("/user/connections");
    return (data.data ?? []).filter(Boolean);
  } catch (error) {
    const message = getErrorMessage(error, "Couldn't load your matches.");
    dispatch(toast.error(message));
    return rejectWithValue(message);
  }
});

const connectionsSlice = createSlice({
  name: "connections",
  initialState: { list: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConnections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchConnections.fulfilled, (state, { payload }) => {
        state.status = "ready";
        state.list = payload;
      })
      .addCase(fetchConnections.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default connectionsSlice.reducer;
