import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getErrorMessage } from "../../lib/api";
import { toast } from "../toast/toastSlice";

// GET /profile/view: restores the session from the cookie on app load
export const fetchProfile = createAsyncThunk("user/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/profile/view");
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// POST /login -> user document, sets the token cookie
export const login = createAsyncThunk("user/login", async ({ emailId, password }, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.post("/login", { emailId, password });
    dispatch(toast.success(`Welcome back, ${data.firstName}!`));
    return data;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(toast.error(message));
    return rejectWithValue(message);
  }
});

// POST /signup only creates the account, so log straight in afterwards
export const signup = createAsyncThunk("user/signup", async (form, { dispatch, rejectWithValue }) => {
  try {
    await api.post("/signup", form);
    const { data } = await api.post("/login", { emailId: form.emailId, password: form.password });
    dispatch(toast.success(`Account created. Welcome, ${data.firstName}!`));
    return data;
  } catch (error) {
    const message = getErrorMessage(error);
    dispatch(toast.error(message));
    return rejectWithValue(message);
  }
});

export const logout = createAsyncThunk("user/logout", async (_, { dispatch }) => {
  try {
    await api.post("/logout");
    dispatch(toast.info("You've been logged out."));
  } catch (error) {
    dispatch(toast.error(getErrorMessage(error, "Couldn't reach the server, logged out locally.")));
  }
});

// PATCH /profile/edit -> { message, loggedInUser }
export const updateProfile = createAsyncThunk("user/updateProfile", async (changes, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.patch("/profile/edit", changes);
    dispatch(toast.success(data.message ?? "Profile updated."));
    return data.loggedInUser;
  } catch (error) {
    const message = getErrorMessage(error, "Couldn't save your profile.");
    dispatch(toast.error(message));
    return rejectWithValue(message);
  }
});

// The backend returns the full user document (password hash included); never keep that in the store
const publicUser = (user) => {
  if (!user) return null;
  const { password, __v, ...rest } = user;
  return rest;
};

export const sessionExpired = () => (dispatch) => {
  dispatch(clearUser());
  dispatch(toast.warning("Your session expired. Please log in again."));
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    // "idle" until the first /profile/view check finishes, so routes can wait
    status: "idle",
    authStatus: "idle",
    saveStatus: "idle",
  },
  reducers: {
    clearUser(state) {
      state.data = null;
      state.status = "ready";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, { payload }) => {
        state.data = publicUser(payload);
        state.status = "ready";
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.data = null;
        state.status = "ready";
      })
      .addCase(updateProfile.pending, (state) => {
        state.saveStatus = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.saveStatus = "idle";
        if (payload) state.data = publicUser(payload);
      })
      .addCase(updateProfile.rejected, (state) => {
        state.saveStatus = "idle";
      })
      .addCase(logout.fulfilled, (state) => {
        state.data = null;
        state.status = "ready";
      });

    for (const thunk of [login, signup]) {
      builder
        .addCase(thunk.pending, (state) => {
          state.authStatus = "loading";
        })
        .addCase(thunk.fulfilled, (state, { payload }) => {
          state.authStatus = "idle";
          state.data = publicUser(payload);
          state.status = "ready";
        })
        .addCase(thunk.rejected, (state) => {
          state.authStatus = "idle";
        });
    }
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
