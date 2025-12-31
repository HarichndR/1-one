import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../api/api";
const url = process.env.REACT_APP_BACKEND_URL;

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token) return rejectWithValue("No token");

    try {
      const response = await api.get(`/user/me`)//, {
      //  headers: {
      //   Authorization: `Bearer ${token}`,

      // },
      //};
      console.log('userslice ' + response)
      return response.data;
    } catch (error) {
      return rejectWithValue("Unauthorized");
    }
  }
);

/* =========================
   UPDATE USER PROFILE
========================= */
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    try {
      const response = await api.patch(`/user/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Profile update failed");
    }
  }
);

/* =========================
   USER SLICE
========================= */
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* Fetch Profile */
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })

      /* Update Profile */
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
