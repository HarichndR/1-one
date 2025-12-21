import { createSlice, createAsyncThunk, createActionCreatorInvariantMiddleware } from '@reduxjs/toolkit';
import axios from 'axios';

const user_api = process.env.Backend_URL;


export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8001/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
      withCredentials: true,
    });
    return response.data;
  }
);
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`http://localhost:8001/user/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      // If an error occurs, reject the promise with the error message
      return rejectWithValue(error.response.data);
    }
  }
);
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials, { dispatch }) => {
    const response = await axios.post(`http://localhost:8001/user/login`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const token = response.data.token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await dispatch(fetchUserProfile());
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      axios.defaults.headers.common['Authorization'] = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = 'An error occurred during login';
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Assuming the payload contains updated user data
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Assuming the payload contains error message
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
