import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getErrorMessage } from "../../lib/api";
import { toast } from "../toast/toastSlice";
import { fetchConnections } from "../connections/connectionsSlice";

// GET /user/requests/received -> { data: [{ _id, fromUserId: {...}, status }] }
export const fetchReceivedRequests = createAsyncThunk("requests/fetchReceived", async (_, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.get("/user/requests/received");
    return data.data ?? [];
  } catch (error) {
    const message = getErrorMessage(error, "Couldn't load requests.");
    dispatch(toast.error(message));
    return rejectWithValue(message);
  }
});

// POST /request/review/:status/:requestId with status "accepted" | "rejected"
export const reviewRequest = createAsyncThunk(
  "requests/review",
  async ({ request, status }, { dispatch, rejectWithValue }) => {
    try {
      await api.post(`/request/review/${status}/${request._id}`);
      const name = request.fromUserId?.firstName ?? "them";
      if (status === "accepted") {
        dispatch(toast.success(`You and ${name} are now connected.`));
        dispatch(fetchConnections());
      } else {
        dispatch(toast.info(`Request from ${name} declined.`));
      }
    } catch (error) {
      const message = getErrorMessage(error, "Couldn't update that request.");
      dispatch(toast.error(message));
      return rejectWithValue(message);
    }
  },
);

const requestsSlice = createSlice({
  name: "requests",
  initialState: { received: [], status: "idle", reviewing: {} },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceivedRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReceivedRequests.fulfilled, (state, { payload }) => {
        state.status = "ready";
        state.received = payload;
      })
      .addCase(fetchReceivedRequests.rejected, (state) => {
        state.status = "error";
      })
      .addCase(reviewRequest.pending, (state, { meta }) => {
        state.reviewing[meta.arg.request._id] = meta.arg.status;
      })
      .addCase(reviewRequest.fulfilled, (state, { meta }) => {
        delete state.reviewing[meta.arg.request._id];
        state.received = state.received.filter((r) => r._id !== meta.arg.request._id);
      })
      .addCase(reviewRequest.rejected, (state, { meta }) => {
        delete state.reviewing[meta.arg.request._id];
      });
  },
});

export default requestsSlice.reducer;
