import { User } from '@/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    language: string;
  };
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
  preferences: {
    notifications: true,
    emailUpdates: true,
    language: 'tr',
  },
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Burada gerçek API çağrısı yapılacak
      // Şimdilik mock data döndürüyoruz
      const mockUser: User = {
        uid: userId,
        email: 'user@example.com',
        displayName: 'Test User',
        photoURL: null, 
        emailVerified: false,
        lastLoginAt: new Date().toISOString(),
      };
      return mockUser;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Profil yüklenemedi');
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      // Burada gerçek API çağrısı yapılacak
      // Şimdilik mock response döndürüyoruz
      return userData;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Profil güncellenemedi');
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    clearUser: (state) => {
      state.profile = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload };
        }
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setProfile, updatePreferences, clearUser, clearError } = userSlice.actions;
export default userSlice.reducer;
