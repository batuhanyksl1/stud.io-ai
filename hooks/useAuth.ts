import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAuth,
  clearError,
  deleteUserAccountBackend,
  forgotPassword,
  setLoading,
  signIn,
  signInAsGuest,
  signOut,
  signUp,
  updateDisplayName,
} from "@/store/slices/authSlice";
import { SignInCredentials, SignUpCredentials } from "@/types";

export function useAuth() {
  const dispatch = useAppDispatch();

  const { user, isAuthenticated, isLoading, error, needsDisplayName } =
    useAppSelector((state) => state.auth);

  const login = async (credentials: SignInCredentials) => {
    return await dispatch(signIn(credentials));
  };

  const register = async (credentials: SignUpCredentials) => {
    return await dispatch(signUp(credentials));
  };

  const loginAsGuest = async () => {
    return await dispatch(signInAsGuest());
  };

  const logout = async () => {
    return await dispatch(signOut());
  };

  const resetPassword = async (email: string) => {
    return await dispatch(forgotPassword(email));
  };

  const updateUserName = async (displayName: string) => {
    return await dispatch(updateDisplayName(displayName));
  };

  const deleteUserAccount = async () => {
    return await dispatch(deleteUserAccountBackend()).unwrap();
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

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    needsDisplayName,
    login,
    register,
    loginAsGuest,
    logout,
    resetPassword,
    updateUserName,
    deleteUserAccount,
    clearAuthData,
    clearAuthError,
    setLoadingState,
  };
}
