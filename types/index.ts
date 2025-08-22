// Firebase Auth User type'ını import ediyoruz
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Auth types - authSlice'tan export ediliyor
export type {
  AuthUser,
  DeleteAccountData,
  SignInCredentials,
  SignUpCredentials,
  UpdateProfileData,
} from '@/store/slices/authSlice';

export type User = FirebaseAuthTypes.User;

export interface Photo {
  id: string;
  uri: string;
  width: number;
  height: number;
  timestamp: number;
}

export interface ProfilePicture {
  id: string;
  originalUri: string;
  processedUri: string;
  filterName: string;
  timestamp: number;
  settings: {
    brightness: number;
    contrast: number;
    saturation: number;
    rotation: number;
    backgroundColor: string;
  };
}

export interface ImageFilter {
  id: string;
  name: string;
  brightness: number;
  contrast: number;
  saturation: number;
  backgroundColor: string;
}

export interface CameraSettings {
  facing: 'front' | 'back';
  flash: 'on' | 'off' | 'auto';
  quality: number;
}

export interface EditorState {
  selectedImage: string | null;
  selectedFilter: ImageFilter;
  rotation: number;
  cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  adjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
    sharpness: number;
  };
}
