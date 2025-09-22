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

  console.log("🔧 useContentCreation - state güncellendi:");
  console.log("🔧 useContentCreation - status:", status);
  console.log("🔧 useContentCreation - createdImageUrl:", createdImageUrl);
  console.log("🔧 useContentCreation - imageStorageUrl:", imageStorageUrl);
  console.log(
    "🔧 useContentCreation - storageUploadProcessingStatus:",
    storageUploadProcessingStatus,
  );
  console.log(
    "🔧 useContentCreation - aiToolProcessingStatus:",
    aiToolProcessingStatus,
  );
  console.log("🔧 useContentCreation - error:", error);

  // Actions
  const uploadImageToStorage = async (fileUri: string) => {
    console.log(
      "🔧 useContentCreation - uploadImageToStorage çağrıldı:",
      fileUri,
    );
    const result = await dispatch(uploadImageToStorageAction({ fileUri }));
    console.log("🔧 useContentCreation - uploadImageToStorage sonucu:", result);
    return result.payload;
  };

  const uploadImageToAITool = async (
    imageUrl: string,
    prompt: string,
    aiToolRequest: string,
    requestId: string,
  ) => {
    console.log("🔧 useContentCreation - uploadImageToAITool çağrıldı:");
    console.log("🔧 useContentCreation - imageUrl:", imageUrl);
    console.log("🔧 useContentCreation - prompt:", prompt);
    console.log("🔧 useContentCreation - aiToolRequest:", aiToolRequest);
    console.log("🔧 useContentCreation - requestId:", requestId);

    const result = await dispatch(
      uploadImageToAIToolAction({ imageUrl, prompt, aiToolRequest, requestId }),
    );
    console.log("🔧 useContentCreation - uploadImageToAITool sonucu:", result);
    return result.payload;
  };

  const pollAiToolStatus = async (
    requestId: string,
    aiToolStatus: string,
    aiToolResult: string,
  ) => {
    console.log("🔧 useContentCreation - pollAiToolStatus çağrıldı:");
    console.log("🔧 useContentCreation - requestId:", requestId);
    console.log("🔧 useContentCreation - aiToolStatus:", aiToolStatus);
    console.log("🔧 useContentCreation - aiToolResult:", aiToolResult);

    const result = await dispatch(
      pollAiToolStatusAction({ requestId, aiToolStatus, aiToolResult }),
    );
    console.log("🔧 useContentCreation - pollAiToolStatus sonucu:", result);
    return result.payload;
  };

  const clearError = () => {
    console.log("🔧 useContentCreation - clearError çağrıldı");
    dispatch(clearErrorAction());
  };

  const clearAllImages = () => {
    console.log("🔧 useContentCreation - clearAllImages çağrıldı");
    dispatch(clearAllImagesAction());
  };

  const setActivityIndicatorColor = (color: string) => {
    console.log(
      "🔧 useContentCreation - setActivityIndicatorColor çağrıldı:",
      color,
    );
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
