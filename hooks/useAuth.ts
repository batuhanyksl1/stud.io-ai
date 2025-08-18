import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearAuth, clearError, signIn, signOut, signUp } from '@/store/slices/authSlice';
import { SignInCredentials, SignUpCredentials } from '@/types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = async (credentials: SignInCredentials) => {
    return await dispatch(signIn(credentials));
  };

  const register = async (credentials: SignUpCredentials) => {
    return await dispatch(signUp(credentials));
  };

  const logout = async () => {
    return await dispatch(signOut());
  };

  const clearAuthData = () => {
    dispatch(clearAuth());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearAuthData,
    clearAuthError,
  };
}
