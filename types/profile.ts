export interface UserImage {
  id: string;
  url: string;
  timestamp: number;
  filterName: string;
  isFavorite: boolean;
  downloads: number;
  fileName?: string;
  contentType?: string;
  fileSize?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  joinDate: Date;
  totalCreations: number;
  remainingTokens: number;
}

