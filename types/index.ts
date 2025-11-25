// Firebase Auth User type'ını import ediyoruz
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

// Auth types - authSlice'tan export ediliyor
export type {
  AuthUser,
  DeleteAccountData,
  SignInCredentials,
  SignUpCredentials,
  UpdateProfileData,
} from "@/store/slices/authSlice";

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
  facing: "front" | "back";
  flash: "on" | "off" | "auto";
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

export type RequestStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "completed"
  | "error"
  | "canceled";
export type ServiceKey = "serviceA" | "serviceB" | "serviceC";
export type ServiceStatus = Exclude<RequestStatus, "uploading"> | "uploading";
export type ServiceState = {
  status: ServiceStatus;
  progress: number;
  resultUrl?: string;
  error?: string;
};

export interface RequestData {
  id: string;
  imageUri: string;
  timestamp: number;
  overall: RequestStatus;
  services: Record<ServiceKey, ServiceState>;
  canceled?: boolean;
}

export interface RefImage {
  id: string;
  uri: string;
  downloadURL?: string;
  fileName?: string;
  status:
    | "idle"
    | "uploading"
    | "uploaded"
    | "processing"
    | "completed"
    | "error";
  error?: string;
  processingResult?: any;
  progress?: number;
  createdAt: string; // ISO string olarak saklayacağız
}

export interface AiToolStatus {
  status: string;
  request_id: string;
  response_url: string;
  status_url: string;
  cancel_url: string;
  logs: null | any;
  metrics: {
    inference_time: number;
  } | null;
}

export interface AiToolResult {
  has_nsfw_concepts: boolean[];
  images: {
    content_type: string;
    file_name: string | null;
    file_size: number | null;
    height: number;
    url: string;
    width: number;
  }[];
}

// Profile types
export type { UserImage, UserProfile } from "./profile";
