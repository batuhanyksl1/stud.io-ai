export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  displayName: string;
}

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
