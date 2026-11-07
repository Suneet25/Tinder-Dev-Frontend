import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getErrorMessage } from "../../lib/api";

// GET /payment/check-premium -> { isPremium, membershipType: "Silver" | "Gold" }
export const checkPremium = createAsyncThunk("premium/check", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/payment/check-premium");
    return { isPremium: Boolean(data.isPremium), membershipType: data.membershipType ?? null };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const premiumSlice = createSlice({
  name: "premium",
  // "idle" until the first check finishes, so premium-only routes can wait
  initialState: { isPremium: false, membershipType: null, status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkPremium.pending, (state) => {
        if (state.status === "idle") state.status = "loading";
      })
      .addCase(checkPremium.fulfilled, (state, { payload }) => {
        state.isPremium = payload.isPremium;
        state.membershipType = payload.membershipType;
        state.status = "ready";
      })
      // Keep what we knew; a failed check shouldn't lock anyone out of the plans screen
      .addCase(checkPremium.rejected, (state) => {
        state.status = "ready";
      });
  },
});

export default premiumSlice.reducer;
