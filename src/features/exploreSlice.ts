import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../api/base';

// Define the structure of a user
interface User {
  id: number;
  telegramId: string;
  username: string;
  firstName: string;
  lastName: string | null;
  city: string;
  country: string;
  languages: string[];
  interests: string[];
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
  profileViews: number[] | null;
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
  photos: { id: number; large: string; small: string; order: number }[];
}

interface ExploreState {
  data: User[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  secondLoading: boolean;
}

const initialState: ExploreState = {
  data: null,
  loading: true,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  secondLoading: false,
};

// Utility to build query parameters from non-empty values.
const buildQueryParams = (params: { [key: string]: any }) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value);
    }
  });
  return queryParams.toString();
};

// Thunk to fetch filtered users (with pagination)
export const fetchFilteredExplore = createAsyncThunk(
  'explore/fetchFilteredExplore',
  async (
    {
      ageRange,
      city,
      country,
      languages,
      page,
      limit,
    }: {
      ageRange?: string;
      city?: string;
      country?: string;
      languages?: string;
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = buildQueryParams({ ageRange, city, country, languages, page, limit });
      const response = await axios.get(`/users/filter?${queryParams}`);
      return response.data as { users: User[]; total: number };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch filtered users');
    }
  }
);

const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {
    // Optionally remove a user (if needed)
    removeUserFromState: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data = state.data.filter((user) => user.id !== action.payload);
      }
    },
    // Optional action to clear the explore data entirely.
    resetExploreData: (state) => {
      state.data = null;
      state.page = 1;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredExplore.pending, (state) => {
        if (state.page === 1) {
          state.loading = true;
        }
        state.secondLoading = true;
        state.error = null;
        
      })
      .addCase(
        fetchFilteredExplore.fulfilled,
        (state, action: PayloadAction<{ users: User[]; total: number }>) => {
          state.loading = false;
          state.secondLoading = false;
          state.total = action.payload.total;
          // Replace previous data with new data to reduce memory usage.
          state.data = action.payload.users;
          state.page += 1;
        }
      )
      .addCase(fetchFilteredExplore.rejected, (state, action) => {
        state.loading = false;
        state.secondLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch filtered users';
      });
  },
});

export const { removeUserFromState, resetExploreData } = exploreSlice.actions;
export default exploreSlice.reducer;
