import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../api/base';


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

interface shortuser {
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
  profileViews: shortuser[] | null;
  lastActive: string | null;
  verifiedAccount: boolean;
  photos: Photo[];
  isBlocked:boolean;
  blockedUsers: shortuser[] | null;
  favoriteUsers: shortuser[] | null;
  age: number;
  languagePreferences: string[] | null;
  isDeleted: boolean;
  language: string;
  lat: string;
  lon: string;
  profileViewsIds?: number[];
  giftUsers?: number[] | shortuser[] | null;
  rewardPoints?: number;
  profileStage: string;
  question1?: string;
  question2?: string;
  instagram?: string;
}

// Define the user state
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

// Initial state
const initialState: UserState = {
  data: null,
  loading: false,
  updateUserData: false,
  uploadProfileLoading: false,
  uploadProfileError: null,
  error: null,
  userPageData: null,
  userPageLoading: true,
  verifiedAccountLoading: false,
  verifiedAccountStatus: false,
};

export const fetchUserDataId = createAsyncThunk(
  'user/fetchDataById',
  async (userId:string) => {
    const response = await axios.get(`/users/${userId}`);
    return response.data as UserData;
  }
);

// Thunk to fetch user data
export const fetchUserData = createAsyncThunk(
  'user/fetchData',
  async (userId: string) => {
    const response = await axios.get(`/users/telegram/${userId}`);
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    return response.data.user as UserData;
  }
);

// Thunk to update user data
export const updateUserData = createAsyncThunk(
  'user/updateData',
  async ({ updatedData }: { updatedData: any }) => {
    const response = await axios.patch(`/users/`, updatedData);
    console.log(response.data);
    return response.data as Partial<UserData>;
  }
);

export const updateUserProfileViews = createAsyncThunk(
  'user/updateUserProfileViews',
  async ({ userId, updatedData }: { userId: string; updatedData: any }) => {
    const response = await axios.patch(`/users/${userId}`, updatedData);
    console.log(response.data);
    return response.data as Partial<UserData>;
  }
);

export const updateUserPhoto = createAsyncThunk(
  'user/updatePhoto',
  async ({ userId ,photoFile }: { userId:string ,photoFile: any }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', photoFile);
      const response = await axios.patch(`/photo/update-file/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
      return response.data as Photo;
    } catch (error: any) {
      return rejectWithValue(error.response.data || 'Failed to update photo');
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  'auth/uploadProfileImage',
  async ({ userId, imageFile, order }: any) => {
    let fileBlob;
    if (typeof imageFile === 'string') {
      const imageResponse = await fetch(imageFile);
      fileBlob = await imageResponse.blob();
    } else {
      fileBlob = imageFile;
    }
    const formData = new FormData();
    formData.append('file', fileBlob, 'image.jpg');
    formData.append('userId', userId);
    formData.append('order', order);
    const response = await axios.post(`/photo/upload/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    return response.data;
  }
);


export const fetchUserPhotoFromTelegram = createAsyncThunk(
  'user/fetchDataUserTeegram',
  async ({ userId, image }: { userId: string; image: string }) => {
    const response = await axios.get(`/photo/fetch-image?imageUrl=${image}&userId=${userId}`);
    return response.data as UserData;
  }
);

export const verifyUserPhoto = createAsyncThunk(
  'user/verifyPhoto',
  async ({ userId, photoFile }: { userId: string; photoFile: File }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('file', photoFile);
      const response = await axios.post('/photo/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        maxBodyLength: Infinity,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// NEW: Thunk to activate premium subscription
export const activatePremium = createAsyncThunk(
  'user/activatePremium',
  async ({ duration }: { duration: '1month' | '3months' | '1year' }) => {
    // Call the premium activation endpoint
    const response = await axios.post('/users/premium/activate', { duration });
    return response.data as Partial<UserData>;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch user data cases
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user data';
        if (action.error.code === "ERR_BAD_REQUEST") {
          state.data = null;
        }
      })

      // Handle fetching user by ID
      .addCase(fetchUserDataId.pending, (state) => {
        state.userPageLoading = true;
        state.error = null;
      })
      .addCase(fetchUserDataId.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.userPageLoading = false;
        state.userPageData = action.payload;
      })
      .addCase(fetchUserDataId.rejected, (state, action) => {
        state.userPageLoading = false;
        state.error = action.error.message || 'Failed to fetch user data';
      })

      // Handle user update cases
      .addCase(updateUserData.pending, (state) => {
        state.updateUserData = true;
        state.error = null;
      })
      .addCase(updateUserData.fulfilled, (state, action: PayloadAction<Partial<UserData>>) => {
        state.updateUserData = false;
        if (state.data) {
          state.data = { ...state.data, ...action.payload };
        } else {
          state.data = action.payload as UserData;
        }
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.updateUserData = false;
        state.error = action.error.message || 'Failed to update user data';
      })

      // Handle update user photo cases
      .addCase(updateUserPhoto.pending, (state) => {
        state.uploadProfileLoading = true;
        state.error = null;
      })
      .addCase(updateUserPhoto.fulfilled, (state, action: PayloadAction<Photo>) => {
        state.uploadProfileLoading = false;
        if (state.data) {
          const updatedPhotos = state.data.photos.map(photo =>
            photo.id === action.payload.id ? action.payload : photo
          );
          state.data.photos = updatedPhotos;
        }
      })
      .addCase(updateUserPhoto.rejected, (state) => {
        state.uploadProfileLoading = false;
        state.error = 'Failed to update photo';
      })

      // Handle upload profile image cases
      .addCase(uploadProfileImage.pending, (state) => {
        state.uploadProfileLoading = true;
        state.uploadProfileError = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action: PayloadAction<Photo>) => {
        state.uploadProfileLoading = false;
        if (state.data) {
          state.data.photos.push(action.payload);
        }
      })
      .addCase(uploadProfileImage.rejected, (state) => {
        state.uploadProfileLoading = false;
        state.error = 'Failed to upload profile image';
      })

      // Handle verify user photo cases
      .addCase(verifyUserPhoto.pending, (state) => {
        state.verifiedAccountLoading = true;
        state.error = null;
        state.verifiedAccountStatus = false;
      })
      .addCase(verifyUserPhoto.fulfilled, (state, action) => {
        state.verifiedAccountLoading = false;
        if (state.data) {
          state.data.verifiedAccount = action.payload.verified || false;
        }
      })
      .addCase(verifyUserPhoto.rejected, (state, action) => {
        state.verifiedAccountLoading = false;
        state.verifiedAccountStatus = true;
        state.error = (action.payload as string) || 'Failed to verify photo';
      })

      //////////////////

      .addCase(fetchUserPhotoFromTelegram.pending, (state) => {
        state.uploadProfileLoading = true;
      })
      .addCase(fetchUserPhotoFromTelegram.fulfilled, (state) => {
        state.uploadProfileLoading = false;
      })
      .addCase(fetchUserPhotoFromTelegram.rejected, (state) => {
        state.uploadProfileLoading = false;

      })


      // Handle activate premium cases
      .addCase(activatePremium.pending, (state) => {
        // Optionally, you can set a loading flag for premium activation here
        state.error = null;
      })
      .addCase(activatePremium.fulfilled, (state, action: PayloadAction<Partial<UserData>>) => {
        // Update user data with premium info from the response
        if (state.data) {
          state.data = { ...state.data, ...action.payload };
        }
      })
      .addCase(activatePremium.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to activate premium';
      });
  },
});

export default userSlice.reducer;
