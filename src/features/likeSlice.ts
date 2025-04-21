import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../api/base';

interface Like {
  id: number;
  telegramId: string;
  username: string;
  firstName: string;
  lastName: string | null;
  city: string;
  country: string;
  languages: string[];
  interests: number[];
  height: number;
  premium: boolean;
  activityScore: number | null;
  gender: string;
  lookingFor: string;
  relationStatus: string;
  sexuality: string;
  education: string;
  work: string;
  hobbies: string | null;
  profileViews: number;
  lastActive: string | null;
  bio: string;
  verifiedAccount: boolean;
  blockedUsers: number[] | null;
  favoriteUsers: number[] | null;
  isDeleted: boolean;
  language: string;
  lat: string | null;
  lon: string | null;
  age: number | null;
  languagePreferences: string[] | null;
  photos: any[];  // Photos array (you can define the structure as needed)
}

interface LikeState {
  data: Like[] | null;
  loading: boolean;
  requestLoading: boolean;
  error: string | null;
}

const initialState: LikeState = {
  data: null,
  loading: false,
  requestLoading: false,
  error: null,
};

// Fetch all likes for the *authenticated* user
export const fetchLikes = createAsyncThunk(
  'like/fetchLikes',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Like[]>('/like/likes');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to fetch likes');
    }
  }
);

// Send a “like” to someone (JWT provides your own userId)
export const likeUser = createAsyncThunk(
  'like/likeUser',
  async (likedUserId: number, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<{ matchCreated: boolean }>('/like', { likedUserId });
      return { likedUserId, isMatch: data.matchCreated };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to like user');
    }
  }
);

const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // —— fetchLikes —— //
      .addCase(fetchLikes.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikes.fulfilled, (state, action: PayloadAction<Like[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // —— likeUser —— //
      .addCase(likeUser.pending, state => {
        state.requestLoading = true;
        state.error = null;
      })
      .addCase(likeUser.fulfilled, (state, action: PayloadAction<{ likedUserId: number; isMatch: boolean }>) => {
        // remove them from “to‑like” list on success
        if (state.data) {
          state.data = state.data.filter(u => u.id !== action.payload.likedUserId);
        }
        state.requestLoading = false;
      })
      .addCase(likeUser.rejected, (state, action) => {
        state.requestLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default likeSlice.reducer;
