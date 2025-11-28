import {
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from "@/config/googleSignIn.config";
import auth, {
  createUserWithEmailAndPassword,
  FirebaseAuthTypes,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut as signOutFirebase,
} from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";

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

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
  needsDisplayName: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isVerified: false,
  isLoading: false,
  error: null,
  needsDisplayName: false,
};

// Async thunks
export const deleteUserAccountBackend = createAsyncThunk(
  "auth/deleteUserAccountBackend",
  async (_, { rejectWithValue }) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error("Kullanıcı oturumu bulunamadı");
      }

      const idToken = await currentUser.getIdToken();
      if (!idToken) {
        throw new Error("Kimlik doğrulama tokenı alınamadı");
      }

      const endpoint =
        "https://europe-west1-studioai-980a7.cloudfunctions.net/deleteUserAccount";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Hesap silinemedi");
      }

      // RevenueCat'ten çıkış yap
      try {
        await Purchases.logOut();
        console.log("[Auth] RevenueCat'ten çıkış yapıldı (hesap silme)");
      } catch (rcError: any) {
        // RevenueCat configure edilmemişse bu hata normal, sessizce geç
        if (
          !rcError?.message?.includes("singleton instance") &&
          !rcError?.message?.includes("configure")
        ) {
          console.error("[Auth] RevenueCat logOut error:", rcError);
        }
      }

      // Backend başarılıysa çıkış yap
      await signOutFirebase(auth());
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Hesap silme başarısız");
    }
  },
);
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (credentials: SignInCredentials, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth(),
        credentials.email,
        credentials.password,
      );

      // Check if display name is empty
      const needsDisplayName =
        !userCredential.user.displayName ||
        userCredential.user.displayName.trim() === "";

      // RevenueCat'e kullanıcı ID'sini bağla
      try {
        await Purchases.logIn(userCredential.user.uid);
        console.log(
          "[Auth] RevenueCat'e kullanıcı ID'si bağlandı (signIn):",
          userCredential.user.uid,
        );
      } catch (rcError: any) {
        // RevenueCat configure edilmemişse bu hata normal, sessizce geç
        if (
          !rcError?.message?.includes("singleton instance") &&
          !rcError?.message?.includes("configure")
        ) {
          console.error("[Auth] RevenueCat logIn error (signIn):", rcError);
        }
      }

      return {
        user: userCredential.user,
        needsDisplayName,
      };
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

        // Send email verification
        await sendEmailVerification(userCredential.user);

        // Create user document in Firestore Account collection
        try {
          await firestore()
            .collection("Account")
            .doc(userCredential.user.uid)
            .set({
              id: credentials.displayName, // Kullanıcı adı
              email: credentials.email,
              displayName: credentials.displayName,
              createdAt: firestore.FieldValue.serverTimestamp(),
              emailVerified: false,
              lastLoginAt: null,
              currentToken: 12, // Başlangıç token sayısı (eski sistem için geriye dönük uyumluluk)
              isPremium: false,
              premiumPlan: "free",
              premiumExpirationDate: null,
              premiumPlanStartDate: null,
              premiumPlanEndDate: null,
              premiumPlanStatus: null,
              premiumPlanType: null,
              premiumPlanAmount: null,
              premiumPlanCurrency: null,
            });
        } catch (firestoreError) {
          console.error("Firestore'a kullanıcı kaydedilemedi:", firestoreError);
          // Firestore hatası olsa bile kullanıcı oluşturma işlemini devam ettir
        }

        // RevenueCat'e kullanıcı ID'sini bağla
        try {
          await Purchases.logIn(userCredential.user.uid);
          console.log(
            "[Auth] RevenueCat'e kullanıcı ID'si bağlandı (signUp):",
            userCredential.user.uid,
          );
        } catch (rcError: any) {
          // RevenueCat configure edilmemişse bu hata normal, sessizce geç
          if (
            !rcError?.message?.includes("singleton instance") &&
            !rcError?.message?.includes("configure")
          ) {
            console.error("[Auth] RevenueCat logIn error (signUp):", rcError);
          }
        }
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
      // RevenueCat'ten çıkış yap
      try {
        await Purchases.logOut();
        console.log("[Auth] RevenueCat'ten çıkış yapıldı");
      } catch (rcError: any) {
        // RevenueCat configure edilmemişse bu hata normal, sessizce geç
        if (
          !rcError?.message?.includes("singleton instance") &&
          !rcError?.message?.includes("configure")
        ) {
          console.error("[Auth] RevenueCat logOut error:", rcError);
        }
      }

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

export const resendEmailVerification = createAsyncThunk(
  "auth/resendEmailVerification",
  async (_, { rejectWithValue }) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error("Kullanıcı oturumu bulunamadı");
      }

      await sendEmailVerification(currentUser);
      return null;
    } catch (error: any) {
      let errorMessage = "Doğrulama e-postası gönderilemedi";

      switch (error.code) {
        case "auth/too-many-requests":
          errorMessage =
            "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin";
          break;
        case "auth/user-not-found":
          errorMessage = "Kullanıcı bulunamadı";
          break;
        default:
          errorMessage =
            error.message ||
            "Doğrulama e-postası gönderilirken bir hata oluştu";
      }

      return rejectWithValue(errorMessage);
    }
  },
);

export const signInAsGuest = createAsyncThunk(
  "auth/signInAsGuest",
  async (_, { rejectWithValue }) => {
    try {
      const userCredential = await signInAnonymously(auth());

      // Misafir kullanıcı için display name kontrolü
      const needsDisplayName = true; // Misafir kullanıcılar her zaman display name girmeli

      // RevenueCat'e kullanıcı ID'sini bağla
      try {
        await Purchases.logIn(userCredential.user.uid);
        console.log(
          "[Auth] RevenueCat'e kullanıcı ID'si bağlandı (signInAsGuest):",
          userCredential.user.uid,
        );
      } catch (rcError: any) {
        // RevenueCat configure edilmemişse bu hata normal, sessizce geç
        if (
          !rcError?.message?.includes("singleton instance") &&
          !rcError?.message?.includes("configure")
        ) {
          console.error(
            "[Auth] RevenueCat logIn error (signInAsGuest):",
            rcError,
          );
        }
      }

      return {
        user: userCredential.user,
        needsDisplayName,
      };
    } catch (error: any) {
      let errorMessage = "Misafir girişi yapılamadı";

      switch (error.code) {
        case "auth/operation-not-allowed":
          errorMessage =
            "Misafir girişi Firebase Console'da etkinleştirilmemiş";
          break;
        default:
          errorMessage =
            error.message || "Misafir girişi yapılırken bir hata oluştu";
      }

      return rejectWithValue(errorMessage);
    }
  },
);

export const updateDisplayName = createAsyncThunk(
  "auth/updateDisplayName",
  async (displayName: string, { rejectWithValue }) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error("Kullanıcı oturumu bulunamadı");
      }

      await currentUser.updateProfile({
        displayName: displayName,
      });

      // Güncellenmiş kullanıcı bilgilerini döndür
      return currentUser;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Display name güncellenirken bir hata oluştu",
      );
    }
  },
);

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      // Google Sign-In'i yapılandır
      if (!GOOGLE_WEB_CLIENT_ID) {
        throw new Error(
          "Google Web Client ID yapılandırılmamış. Lütfen config/googleSignIn.config.ts dosyasını kontrol edin.",
        );
      }

      // Platform'a göre yapılandırma
      const config: any = {
        webClientId: GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
      };

      // iOS için iosClientId ekle (zorunlu)
      // Eğer GOOGLE_IOS_CLIENT_ID yoksa, Web Client ID'yi kullan (geçici çözüm)
      // Not: Firebase Console'dan yeni GoogleService-Info.plist indirip CLIENT_ID'yi almanız önerilir
      if (Platform.OS === "ios") {
        config.iosClientId = GOOGLE_IOS_CLIENT_ID || GOOGLE_WEB_CLIENT_ID;

        if (!config.iosClientId) {
          throw new Error(
            "iOS için Google Client ID yapılandırılmamış. Lütfen config/googleSignIn.config.ts dosyasına GOOGLE_IOS_CLIENT_ID ekleyin veya Firebase Console'dan GoogleService-Info.plist dosyasını indirip CLIENT_ID değerini alın.",
          );
        }
      }

      GoogleSignin.configure(config);

      // Önce mevcut oturumu kontrol et ve varsa kapat
      await GoogleSignin.signOut();

      const signInResponse = await GoogleSignin.signIn();

      if (signInResponse.type === "success" && signInResponse.data.idToken) {
        // User signed in
        const googleCredential = auth.GoogleAuthProvider.credential(
          signInResponse.data.idToken,
        );
        const userCredential =
          await auth().signInWithCredential(googleCredential);

        // Check if display name is empty
        const needsDisplayName =
          !userCredential.user.displayName ||
          userCredential.user.displayName.trim() === "";

        // RevenueCat'e kullanıcı ID'sini bağla
        try {
          await Purchases.logIn(userCredential.user.uid);
          console.log(
            "[Auth] RevenueCat'e kullanıcı ID'si bağlandı (signInWithGoogle):",
            userCredential.user.uid,
          );
        } catch (rcError: any) {
          // RevenueCat configure edilmemişse bu hata normal, sessizce geç
          if (
            !rcError?.message?.includes("singleton instance") &&
            !rcError?.message?.includes("configure")
          ) {
            console.error(
              "[Auth] RevenueCat logIn error (signInWithGoogle):",
              rcError,
            );
          }
        }

        return {
          user: userCredential.user,
          needsDisplayName,
        };
      } else {
        return rejectWithValue("Google Sign-In başarısız oldu.");
      }
    } catch (error: any) {
      let errorMessage = "Google Girişi yapılamadı";

      // Kullanıcı iptal ettiyse
      if (error.code === "SIGN_IN_CANCELLED") {
        errorMessage = "Google girişi iptal edildi";
      } else if (error.code === "IN_PROGRESS") {
        errorMessage = "Google girişi zaten devam ediyor";
      } else if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
        errorMessage = "Google Play Services kullanılamıyor";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Google girişi Firebase Console'da etkinleştirilmemiş.";
      } else {
        errorMessage =
          error.message || "Google girişi yapılırken bir hata oluştu";
      }
      return rejectWithValue(errorMessage);
    }
  },
);

export const signInWithApple = createAsyncThunk(
  "auth/signInWithApple",
  async (_, { rejectWithValue }) => {
    try {
      // Apple Sign-In için placeholder
      // Not: Apple authentication implementasyonu için expo-apple-authentication paketi gerekebilir
      // veya Firebase'in kendi Apple authentication provider'ı kullanılabilir
      
      if (Platform.OS !== "ios") {
        return rejectWithValue("Apple girişi sadece iOS'ta kullanılabilir");
      }

      // TODO: Apple authentication implementasyonu
      // Şimdilik placeholder - gerçek implementasyon için:
      // 1. expo-apple-authentication paketini yükleyin
      // 2. Apple credential'ı alın
      // 3. Firebase Auth ile signInWithCredential kullanın
      
      return rejectWithValue("Apple girişi henüz implement edilmemiş. Lütfen Google ile giriş yapın.");
    } catch (error: any) {
      let errorMessage = "Apple ile giriş yapılamadı";
      
      if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Apple girişi Firebase Console'da etkinleştirilmemiş.";
      } else {
        errorMessage = error.message || "Apple girişi yapılırken bir hata oluştu";
      }
      return rejectWithValue(errorMessage);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isVerified = action.payload.emailVerified;
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isVerified = false;
      state.needsDisplayName = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Sign In
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isVerified = action.payload.user.emailVerified;
        state.needsDisplayName = action.payload.needsDisplayName;
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
        state.isVerified = action.payload.emailVerified;
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
        state.isVerified = false;
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
        state.isVerified = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Resend Email Verification
    builder
      .addCase(resendEmailVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendEmailVerification.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resendEmailVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign In As Guest
    builder
      .addCase(signInAsGuest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInAsGuest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isVerified = action.payload.user.emailVerified;
        state.needsDisplayName = action.payload.needsDisplayName;
        state.error = null;
      })
      .addCase(signInAsGuest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Display Name
    builder
      .addCase(updateDisplayName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDisplayName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as AuthUser;
        state.needsDisplayName = false;
        state.error = null;
      })
      .addCase(updateDisplayName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign In With Google
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isVerified = action.payload.user.emailVerified;
        state.needsDisplayName = action.payload.needsDisplayName;
        state.error = null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign In With Apple
    builder
      .addCase(signInWithApple.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithApple.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isVerified = action.payload.user.emailVerified;
        state.needsDisplayName = action.payload.needsDisplayName;
        state.error = null;
      })
      .addCase(signInWithApple.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Account via Backend
    builder
      .addCase(deleteUserAccountBackend.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserAccountBackend.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isVerified = false;
        state.error = null;
      })
      .addCase(deleteUserAccountBackend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearAuth, clearError, setLoading } = authSlice.actions;

export default authSlice.reducer;
