import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  cleanupAuth,
  clearAuth,
  clearError,
  deleteAccount,
  forgotPassword,
  initializeAuth,
  setLoading,
  signIn,
  signOut,
  signUp,
  updateProfile,
} from "@/store/slices/authSlice";
import {
  DeleteAccountData,
  SignInCredentials,
  SignUpCredentials,
  UpdateProfileData,
} from "@/types";

export function useAuth() {
  const dispatch = useAppDispatch();

  const { user, isAuthenticated, isLoading, isInitializing, error } =
    useAppSelector((state) => state.auth);

  const login = async (credentials: SignInCredentials) => {
    return await dispatch(signIn(credentials));
  };

  const register = async (credentials: SignUpCredentials) => {
    return await dispatch(signUp(credentials));
  };

  const logout = async () => {
    return await dispatch(signOut());
  };

  const resetPassword = async (email: string) => {
    return await dispatch(forgotPassword(email));
  };

  const updateUserProfile = async (profileData: UpdateProfileData) => {
    return await dispatch(updateProfile(profileData));
  };

  const deleteUserAccount = async (data: DeleteAccountData) => {
    return await dispatch(deleteAccount(data));
  };

  const clearAuthData = () => {
    dispatch(clearAuth());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const setLoadingState = (loading: boolean) => {
    dispatch(setLoading(loading));
  };

  const initializeAuthState = async () => {
    return await dispatch(initializeAuth());
  };

  const cleanupAuthState = () => {
    dispatch(cleanupAuth());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitializing,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    deleteUserAccount,
    clearAuthData,
    clearAuthError,
    setLoadingState,
    initializeAuthState,
    cleanupAuthState,
  };
}

// Export for use outside of hook
export const initializeAuthStateDirect = async () => {
  console.log("useAuth.ts: initializeAuthStateDirect called");
  try {
    const result = await store.dispatch(initializeAuth());
    console.log("useAuth.ts: initializeAuth dispatch result:", result);
    return result;
  } catch (error) {
    console.error("useAuth.ts: Error dispatching initializeAuth:", error);
    throw error;
  }
};
