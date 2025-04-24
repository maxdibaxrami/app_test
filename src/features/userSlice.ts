import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../api/base';

// --- Interfaces ---
interface Photo {
  id: number;
  large?: string;
  small?: string;
  order: number;
  largeUrl?: string;
  smallUrl?: string;
}

interface ProfileData {
  lookingFor: string;
  education: string;
  work: string;
  bio: string;
}

interface MoreAboutMe {
  languages: string[];
  height: number;
  relationStatus: string;
  sexuality: string;
  kids: string | null;
  smoking: string | null;
  drink: string | null;
  pets: string | null;
}

interface ShortUser {
  id: number;
  firstName?: string;
  age?: number;
  imageUrl?: string;
  verifiedAccount?: boolean;
  premium?: boolean;
}

export interface UserData {
  id: number;
  telegramId: string;
  username: string;
  firstName: string;
  city: string;
  profileData: ProfileData;
  moreAboutMe: MoreAboutMe;
  country: string;
  interests: number[];
  premium: boolean;
  activityScore: number | null;
  gender: string;
  profileViews: ShortUser[] | null;
  lastActive: string | null;
  verifiedAccount: boolean;
  photos: Photo[];
  isBlocked: boolean;
  blockedUsers: ShortUser[] | null;
  favoriteUsers: ShortUser[] | null;
  age: number;
  languagePreferences: string[] | null;
  isDeleted: boolean;
  language: string;
  lat: string;
  lon: string;
  rewardPoints?: number;
  profileStage: string;
  question1?: string;
  question2?: string;
  instagram?: string;
  giftUsers?: any;
}

interface UserState {
  data: UserData | null;
  loading: boolean;
  updateUserData: boolean;
  uploadProfileLoading: boolean;
  uploadProfileError: string | null;
  userPageData: UserData | null;
  userPageLoading: boolean;
  error: string | null;
  verifiedAccountLoading: boolean;
  verifiedAccountStatus: boolean;
}

const initialState: UserState = {
  data: null,
  loading: false,
  updateUserData: false,
  uploadProfileLoading: false,
  uploadProfileError: null,
  userPageData: null,
  userPageLoading: true,
  error: null,
  verifiedAccountLoading: false,
  verifiedAccountStatus: false,
};

// --- Thunks ---
export const fetchUserDataId = createAsyncThunk<UserData, string>(
  'user/fetchDataById',
  async (userId) => {
    const { data } = await axios.get(`/users/?userId=${userId}`);
    return data as UserData;
  }
);

export const fetchUserData = createAsyncThunk<UserData, any>(
  'user/fetchData',
  async (initData) => {
    const response = await axios.post(`/users/telegram`, { initData });
    localStorage.setItem('access_token', response.data.access_token);
    return response.data.user as UserData;
  }
);

export const updateUserData = createAsyncThunk<Partial<UserData>, any>(
  'user/updateData',
  async (updatedData) => {
    const { data } = await axios.patch(`/users/`, updatedData.updatedData);
    return data as Partial<UserData>;
  }
);

export const updateUserProfileViews = createAsyncThunk<Partial<UserData>, { userId: string; updatedData: any }>(
  'user/updateUserProfileViews',
  async ({ userId, updatedData }) => {
    const { data } = await axios.patch(`/users/${userId}`, updatedData);
    return data as Partial<UserData>;
  }
);

export const updateUserPhoto = createAsyncThunk<Photo, { userId: string; photoFile: any }, { rejectValue: string }>(
  'user/updatePhoto',
  async ({ userId, photoFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', photoFile);
      const { data } = await axios.patch(`/photo/update-file/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
      return data as Photo;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to update photo');
    }
  }
);

export const uploadProfileImage = createAsyncThunk<Photo, { userId: string; imageFile: any; order: number }>(
  'auth/uploadProfileImage',
  async ({ userId, imageFile, order }) => {
    let fileBlob: Blob;
    if (typeof imageFile === 'string') {
      const resp = await fetch(imageFile);
      fileBlob = await resp.blob();
    } else {
      fileBlob = imageFile;
    }
    const formData = new FormData();
    formData.append('file', fileBlob, 'image.jpg');
    formData.append('userId', userId);
    formData.append('order', order.toString());
    const { data } = await axios.post(`/photo/upload/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    return data as Photo;
  }
);

export const fetchUserPhotoFromTelegram = createAsyncThunk<UserData, { userId: string; image: string }>(
  'user/fetchDataFromTelegram',
  async ({ userId, image }) => {
    const { data } = await axios.get(`/photo/fetch-image?imageUrl=${image}&userId=${userId}`);
    return data as UserData;
  }
);

export const verifyUserPhoto = createAsyncThunk<Partial<UserData>, { userId: string; photoFile: File }, { rejectValue: string }>(
  'user/verifyPhoto',
  async ({ userId, photoFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('file', photoFile);
      const { data } = await axios.post('/photo/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        maxBodyLength: Infinity,
      });
      return data as Partial<UserData>;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to verify photo');
    }
  }
);

export const activatePremium = createAsyncThunk<Partial<UserData>, { duration: '1month' | '3months' | '1year' }>(
  'user/activatePremium',
  async ({ duration }) => {
    const { data } = await axios.post('/users/premium/activate', { duration });
    return data as Partial<UserData>;
  }
);

export const increaseReferralReward = createAsyncThunk<Partial<UserData>, { amount: number }, { rejectValue: string }>(
  'user/increaseReferralReward',
  async ({ amount }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/users/increase-reward', { amount });
      return data as Partial<UserData>;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to increase reward');
    }
  }
);

export const decreaseReferralReward = createAsyncThunk<Partial<UserData>, { amount: number }, { rejectValue: string }>(
  'user/decreaseReferralReward',
  async ({ amount }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/users/decrease-reward', { amount });
      return data as Partial<UserData>;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to decrease reward');
    }
  }
);

// --- Slice ---
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- fetch user ---
      .addCase(fetchUserData.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<UserData>) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchUserData.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null; })

      // --- fetch by ID ---
      .addCase(fetchUserDataId.pending, (state) => { state.userPageLoading = true; state.error = null; })
      .addCase(fetchUserDataId.fulfilled, (state, action: PayloadAction<UserData>) => { state.userPageLoading = false; state.userPageData = action.payload; })
      .addCase(fetchUserDataId.rejected, (state, action) => { state.userPageLoading = false; state.error = action.error.message || null; })

      // --- update user ---
      .addCase(updateUserData.pending, (state) => { state.updateUserData = true; state.error = null; })
      .addCase(updateUserData.fulfilled, (state, action: PayloadAction<Partial<UserData>>) => {
        state.updateUserData = false;
        if (state.data) state.data = { ...state.data, ...action.payload };
      })
      .addCase(updateUserData.rejected, (state, action) => { state.updateUserData = false; state.error = action.error.message || action.payload as string || null; })

      // --- photo updates ---
      .addCase(updateUserPhoto.pending, (state) => { state.uploadProfileLoading = true; state.error = null; })
      .addCase(updateUserPhoto.fulfilled, (state, action: PayloadAction<Photo>) => {
        state.uploadProfileLoading = false;
        if (state.data) {
          state.data.photos = state.data.photos.map(p => p.id === action.payload.id ? action.payload : p);
        }
      })
      .addCase(updateUserPhoto.rejected, (state, action) => { state.uploadProfileLoading = false; state.error = action.payload || 'Failed to update photo'; })

      .addCase(uploadProfileImage.pending, (state) => { state.uploadProfileLoading = true; state.uploadProfileError = null; })
      .addCase(uploadProfileImage.fulfilled, (state, action: PayloadAction<Photo>) => {
        state.uploadProfileLoading = false;
        if (state.data) state.data.photos.push(action.payload);
      })
      .addCase(uploadProfileImage.rejected, (state, action) => { state.uploadProfileLoading = false; state.uploadProfileError = action.error.message || null; })

      .addCase(fetchUserPhotoFromTelegram.pending, (state) => { state.uploadProfileLoading = true; })
      .addCase(fetchUserPhotoFromTelegram.fulfilled, (state) => { state.uploadProfileLoading = false; })
      .addCase(fetchUserPhotoFromTelegram.rejected, (state) => { state.uploadProfileLoading = false; })

      // --- verify photo ---
      .addCase(verifyUserPhoto.pending, (state) => { state.verifiedAccountLoading = true; state.error = null; state.verifiedAccountStatus = false; })
      .addCase(verifyUserPhoto.fulfilled, (state, action: PayloadAction<Partial<UserData>>) => { state.verifiedAccountLoading = false; if (state.data) state.data = { ...state.data, ...action.payload }; })
      .addCase(verifyUserPhoto.rejected, (state, action) => { state.verifiedAccountLoading = false; state.verifiedAccountStatus = true; state.error = action.payload || action.error.message || null; })

      // --- premium ---
      .addCase(activatePremium.pending, (state) => { state.error = null; })
      .addCase(activatePremium.fulfilled, (state, action: PayloadAction<Partial<UserData>>) => { if (state.data) state.data = { ...state.data, ...action.payload }; })
      .addCase(activatePremium.rejected, (state, action) => { state.error = action.error.message || null; })

      // --- reward adjustments ---
      .addCase(increaseReferralReward.pending, (state) => { state.updateUserData = true; state.error = null; })
      .addCase(increaseReferralReward.fulfilled, (state, action: PayloadAction<Partial<UserData>>) => { state.updateUserData = false; if (state.data) state.data = { ...state.data, ...action.payload }; })
      .addCase(increaseReferralReward.rejected, (state, action) => { state.updateUserData = false; state.error = action.payload || action.error.message || null; })

      .addCase(decreaseReferralReward.pending, (state) => { state.updateUserData = true; state.error = null; })
      .addCase(decreaseReferralReward.fulfilled, (state, action: PayloadAction<Partial<UserData>>) => { state.updateUserData = false; if (state.data) state.data = { ...state.data, ...action.payload }; })
      .addCase(decreaseReferralReward.rejected, (state, action) => { state.updateUserData = false; state.error = action.payload || action.error.message || null; });
  }
});

export default userSlice.reducer;
