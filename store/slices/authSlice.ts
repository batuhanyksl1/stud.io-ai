import auth, {
  createUserWithEmailAndPassword,
  FirebaseAuthTypes,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as signOutFirebase,
} from "@react-native-firebase/auth";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export type AuthUser = FirebaseAuthTypes.User;

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
  isInitializing: false,
  error: null,
};

// Async thunks
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (credentials: SignInCredentials, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth(),
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
        auth(),
        credentials.email,
        credentials.password,
      );

      // Update display name
      if (userCredential.user) {
        await userCredential.user.updateProfile({
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
      await signOutFirebase(auth());
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
      await sendPasswordResetEmail(auth(), email);
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

// export const updateProfile = createAsyncThunk(
//   "auth/updateProfile",
//   async (profileData: UpdateProfileData, { rejectWithValue }) => {
//     try {
//       const currentUser = currentUser(auth());

//       if (!currentUser) {
//         throw new Error("Kullanıcı oturumu bulunamadı");
//       }

//       await currentUser.updateProfile(profileData);

//       // Return updated user data
//       return currentUser(auth()) as AuthUser;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.message || "Profil güncellenirken bir hata oluştu",
//       );
//     }
//   },
// );

// export const deleteAccount = createAsyncThunk(
//   "auth/deleteAccount",
//   async (data: DeleteAccountData, { rejectWithValue }) => {
//     try {
//       const currentUser = currentUser(auth());

//       if (!currentUser || !currentUser.email) {
//         throw new Error("Kullanıcı oturumu bulunamadı");
//       }

//       // Re-authenticate user before deletion
//       const credential = EmailAuthProvider.credential(
//         currentUser.email,
//         data.password,
//         // NOTE: If you use phone or other providers, adapt flow accordingly
//       );

//       await currentUser.reauthenticateWithCredential(credential);
//       await currentUser.delete();

//       return null;
//     } catch (error: any) {
//       let errorMessage = "Hesap silinemedi";

//       switch (error.code) {
//         case "auth/wrong-password":
//           errorMessage = "Hatalı şifre";
//           break;
//         case "auth/requires-recent-login":
//           errorMessage = "Hesap silmek için yeniden giriş yapmanız gerekiyor";
//           break;
//         default:
//           errorMessage = error.message || "Hesap silinirken bir hata oluştu";
//       }

//       return rejectWithValue(errorMessage);
//     }
//   },
// );

// Auth state listener
// export const initializeAuth = createAsyncThunk(
//   "auth/initializeAuth",
//   async (_, { dispatch }) => {
//     return new Promise<void>((resolve) => {
//       try {
//         if ((global as any).authUnsubscribe) {
//           (global as any).authUnsubscribe();
//         }

//         const handleAuthStateChange = (firebaseUser: AuthUser | null) => {
//           if (firebaseUser) {
//             dispatch(setUser(firebaseUser));
//           } else {
//             dispatch(clearAuth());
//           }

//           dispatch(setInitializing(false));

//           if (!(global as any).authInitialized) {
//             (global as any).authInitialized = true;
//             resolve();
//           }
//         };

//         const unsubscribe = onAuthStateChanged(auth(), handleAuthStateChange);
//         (global as any).authUnsubscribe = unsubscribe;
//       } catch (error) {
//         console.error("authSlice.ts: Error setting up auth listener:", error);
//         dispatch(setInitializing(false));
//         resolve();
//       }
//     });
//   },
// );

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
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
    // cleanupAuth: (state) => {
    //   if ((global as any).authUnsubscribe) {
    //     (global as any).authUnsubscribe();
    //     (global as any).authUnsubscribe = null;
    //   }
    //   (global as any).authInitialized = false;
    // },
  },
  extraReducers: (builder) => {
    // Initialize Auth
    // builder
    //   .addCase(initializeAuth.pending, (state) => {
    //     state.isInitializing = true;
    //   })
    //   .addCase(initializeAuth.fulfilled, (state) => {
    //     state.isInitializing = false;
    //   });

    // Sign In
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as AuthUser;
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
        state.user = action.payload as AuthUser;
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
    // builder
    //   .addCase(updateProfile.pending, (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   })
    //   .addCase(updateProfile.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     state.user = action.payload as AuthUser;
    //     state.error = null;
    //   })
    //   .addCase(updateProfile.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.payload as string;
    //   });

    // Delete Account
    // builder
    //   .addCase(deleteAccount.pending, (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   })
    //   .addCase(deleteAccount.fulfilled, (state) => {
    //     state.isLoading = false;
    //     state.user = null;
    //     state.isAuthenticated = false;
    //     state.error = null;
    //   })
    //   .addCase(deleteAccount.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.payload as string;
    //   });
  },
});

export const {
  setUser,
  clearAuth,
  clearError,
  setInitializing,
  setLoading,
  //cleanupAuth,
} = authSlice.actions;

export default authSlice.reducer;
