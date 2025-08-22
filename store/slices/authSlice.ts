import { auth } from "@/config/firebase.auth.config";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  deleteUser as firebaseDeleteUser,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Types
export type AuthUser = FirebaseUser;

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface UpdateProfileData {
  displayName?: string;
  photoURL?: string;
}

export interface DeleteAccountData {
  password: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,
};

// Async thunks
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (credentials: SignInCredentials, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      );
      return userCredential.user;
    } catch (error: any) {
      let errorMessage = "Giriş yapılamadı";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı";
          break;
        case "auth/wrong-password":
          errorMessage = "Hatalı şifre";
          break;
        case "auth/invalid-email":
          errorMessage = "Geçersiz e-posta adresi";
          break;
        case "auth/user-disabled":
          errorMessage = "Bu hesap devre dışı bırakılmış";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin";
          break;
        default:
          errorMessage = error.message || "Giriş yapılırken bir hata oluştu";
      }

      return rejectWithValue(errorMessage);
    }
  },
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (credentials: SignUpCredentials, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password,
      );

      // Update display name
      if (userCredential.user) {
        await firebaseUpdateProfile(userCredential.user, {
          displayName: credentials.displayName,
        });
      }

      return userCredential.user;
    } catch (error: any) {
      let errorMessage = "Kayıt oluşturulamadı";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Bu e-posta adresi zaten kullanımda";
          break;
        case "auth/invalid-email":
          errorMessage = "Geçersiz e-posta adresi";
          break;
        case "auth/weak-password":
          errorMessage = "Şifre çok zayıf. En az 6 karakter olmalıdır";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "E-posta/şifre girişi etkin değil";
          break;
        default:
          errorMessage = error.message || "Kayıt olurken bir hata oluştu";
      }

      return rejectWithValue(errorMessage);
    }
  },
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      await firebaseSignOut(auth);
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Çıkış yapılamadı");
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return null;
    } catch (error: any) {
      let errorMessage = "Şifre sıfırlama e-postası gönderilemedi";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı";
          break;
        case "auth/invalid-email":
          errorMessage = "Geçersiz e-posta adresi";
          break;
        default:
          errorMessage =
            error.message ||
            "Şifre sıfırlama e-postası gönderilirken bir hata oluştu";
      }

      return rejectWithValue(errorMessage);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: UpdateProfileData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("Kullanıcı oturumu bulunamadı");
      }

      await firebaseUpdateProfile(currentUser, profileData);

      // Return updated user data
      return currentUser;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Profil güncellenirken bir hata oluştu",
      );
    }
  },
);

export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (data: DeleteAccountData, { rejectWithValue }) => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser || !currentUser.email) {
        throw new Error("Kullanıcı oturumu bulunamadı");
      }

      // Re-authenticate user before deletion
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        data.password,
      );

      await reauthenticateWithCredential(currentUser, credential);
      await firebaseDeleteUser(currentUser);

      return null;
    } catch (error: any) {
      let errorMessage = "Hesap silinemedi";

      switch (error.code) {
        case "auth/wrong-password":
          errorMessage = "Hatalı şifre";
          break;
        case "auth/requires-recent-login":
          errorMessage = "Hesap silmek için yeniden giriş yapmanız gerekiyor";
          break;
        default:
          errorMessage = error.message || "Hesap silinirken bir hata oluştu";
      }

      return rejectWithValue(errorMessage);
    }
  },
);

// Auth state listener
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { dispatch }) => {
    console.log("authSlice.ts: Initializing auth...");
    return new Promise<void>((resolve) => {
      try {
        console.log("authSlice.ts: Using Firebase auth instance...");
        console.log("authSlice.ts: Firebase auth instance:", auth);
        console.log("authSlice.ts: Auth current user:", auth.currentUser);
        console.log("authSlice.ts: Auth app:", auth.app);

        // Önceki listener varsa temizle
        if ((global as any).authUnsubscribe) {
          console.log("authSlice.ts: Cleaning up previous auth listener...");
          (global as any).authUnsubscribe();
        }

        console.log("authSlice.ts: Setting up new auth listener...");

        // Handle auth state change inline
        const handleAuthStateChange = (firebaseUser: FirebaseUser | null) => {
          console.log(
            "authSlice.ts: Auth state changed:",
            firebaseUser ? "User logged in" : "User logged out",
          );
          console.log("authSlice.ts: Firebase user:", firebaseUser);

          if (firebaseUser) {
            console.log("authSlice.ts: Setting user in store:", firebaseUser);
            dispatch(setUser(firebaseUser));
          } else {
            console.log("authSlice.ts: Clearing auth from store");
            dispatch(clearAuth());
          }

          console.log("authSlice.ts: Setting isInitializing to false");
          dispatch(setInitializing(false));

          // Promise'i resolve et - sadece ilk auth state değişikliğinde
          if (!(global as any).authInitialized) {
            (global as any).authInitialized = true;
            console.log("authSlice.ts: Resolving promise...");
            resolve();
          }
        };

        console.log("authSlice.ts: Calling onAuthStateChanged...");
        const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
        console.log(
          "authSlice.ts: onAuthStateChanged returned unsubscribe function:",
          unsubscribe,
        );

        // Store the unsubscribe function globally so it can be called later
        (global as any).authUnsubscribe = unsubscribe;
        console.log("authSlice.ts: Auth listener setup completed");
      } catch (error) {
        console.error("authSlice.ts: Error setting up auth listener:", error);
        dispatch(setInitializing(false));
        resolve();
      }
    });
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      console.log("authSlice.ts: setUser reducer called with:", action.payload);
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      console.log("authSlice.ts: New auth state:", {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      });
    },
    clearAuth: (state) => {
      console.log("authSlice.ts: clearAuth reducer called");
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      console.log("authSlice.ts: New auth state:", {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      });
    },
    clearError: (state) => {
      state.error = null;
    },
    setInitializing: (state, action: PayloadAction<boolean>) => {
      state.isInitializing = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    cleanupAuth: (state) => {
      console.log("authSlice.ts: cleanupAuth reducer called");
      // Cleanup auth listener
      if ((global as any).authUnsubscribe) {
        (global as any).authUnsubscribe();
        (global as any).authUnsubscribe = null;
      }
      // Reset auth initialized flag
      (global as any).authInitialized = false;
    },
  },
  extraReducers: (builder) => {
    // Initialize Auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(initializeAuth.fulfilled, (state) => {
        state.isInitializing = false;
      });

    // Sign In
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign Up
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign Out
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Account
    builder
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUser,
  clearAuth,
  clearError,
  setInitializing,
  setLoading,
  cleanupAuth,
} = authSlice.actions;

export default authSlice.reducer;
