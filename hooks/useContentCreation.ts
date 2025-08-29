import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAllImages as clearAllImagesAction,
  clearError as clearErrorAction,
  uploadImageToStorage as uploadImageToStorageAction,
} from "@/store/slices/contentCreationSlice";

export function useContentCreation() {
  const dispatch = useAppDispatch();

  // Redux store'dan state'leri al
  const {
    refImageUrl,
    createdImageUrl,
    storageUploadStatus,
    progress,
    error,
    aiToolProcessingStatus,
  } = useAppSelector((state) => state.contentCreation);

  // Actions
  const uploadImageToStorage = (fileUri: string) => {
    dispatch(uploadImageToStorageAction({ fileUri }));
  };

  const clearError = () => {
    dispatch(clearErrorAction());
  };

  const clearAllImages = () => {
    dispatch(clearAllImagesAction());
  };

  return {
    // State
    refImageUrl,
    createdImageUrl,
    storageUploadStatus,
    progress,
    error,
    aiToolProcessingStatus,
    // Actions
    uploadImageToStorage,
    clearError,
    clearAllImages,
  };
}
