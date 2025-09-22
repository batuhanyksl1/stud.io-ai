import { router } from 'expo-router';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  displayName?: string;
}

interface MockUser {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

type AuthMode = 'signin' | 'signup';
type SocialProvider = 'google' | 'apple';

// Constants
const MOCK_API_DELAY = 2000;
const MOCK_SOCIAL_DELAY = 1500;

export default function AuthPage() {
  // Redirect to signin by default
  router.replace('/auth/signin');
  return null;
}
