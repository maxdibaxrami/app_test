// src/features/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../api/base';

// Define a type for the state
interface AuthState {
  user: any | null;   // You can replace `any` with a more specific type for your user
  loading: boolean;
  error: string | null;
}

// Signup Request
interface SignupPayload {
  userData: any;  // Replace 'any' with the actual type of userData if known
}

// Define the type for the response
interface SignupResponse {
  id: boolean;
  // Define the response structure from your API here
  data: any;  // Replace 'any' with the actual type of the API response
}

export const signupUser = createAsyncThunk<SignupResponse, SignupPayload>(
  'auth/signup',
  async ({ userData }) => {
    const response = await axios.put(`/users/`, userData);
    return response.data; // Assuming `response.data` is your signup data
  }
);

// Upload Profile Image Request
export const uploadProfileImage = createAsyncThunk(
  'auth/uploadProfileImage',
  async ({ userId, imageFile, order }: any) => {
    const image = await fetch(imageFile);
    const blob = await image.blob();

    const formData = new FormData();
    formData.append('file', blob);
    formData.append('userId', userId);
    formData.append('order', order);

    const response = await axios.post(`/photo/upload/`, formData);
    return response.data;
  }
);

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = { ...state.user, profileImage: action.payload };
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
