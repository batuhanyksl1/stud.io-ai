import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAllImages as clearAllImagesAction,
  clearError as clearErrorAction,
  pollAiToolStatus as pollAiToolStatusAction,
  setActivityIndicatorColor as setActivityIndicatorColorAction,
  uploadImageToAITool as uploadImageToAIToolAction,
  uploadImageToStorage as uploadImageToStorageAction,
} from "@/store/slices/contentCreationSlice";

export function useContentCreation() {
  const dispatch = useAppDispatch();

  // Redux store'dan state'leri al
  const {
    status,
    createdImageUrl,
    imageStorageUrl,
    storageUploadProcessingStatus,
    aiToolProcessingStatus,
    error,
    activityIndicatorColor,
  } = useAppSelector((state) => state.contentCreation);

  // Actions
  const uploadImageToStorage = async (fileUri: string) => {
    const result = await dispatch(uploadImageToStorageAction({ fileUri }));
    return result.payload;
  };

  const uploadImageToAITool = async (imageUrl: string, prompt: string) => {
    const result = await dispatch(
      uploadImageToAIToolAction({ imageUrl, prompt }),
    );
    return result.payload;
  };

  const pollAiToolStatus = async (requestId: string) => {
    const result = await dispatch(pollAiToolStatusAction({ requestId }));
    return result.payload;
  };

  const clearError = () => {
    dispatch(clearErrorAction());
  };

  const clearAllImages = () => {
    dispatch(clearAllImagesAction());
  };

  const setActivityIndicatorColor = (color: string) => {
    dispatch(setActivityIndicatorColorAction(color));
  };

  return {
    // State
    imageStorageUrl,
    createdImageUrl,
    storageUploadProcessingStatus,
    aiToolProcessingStatus,
    error,
    status,
    activityIndicatorColor,
    setActivityIndicatorColor,
    // Actions
    uploadImageToStorage,
    uploadImageToAITool,
    clearError,
    clearAllImages,
    pollAiToolStatus,
  };
}
