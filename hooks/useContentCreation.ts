import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAllImages as clearAllImagesAction,
  clearError as clearErrorAction,
  downloadImage as downloadImageAction,
  generateImage as generateImageAction,
  resetUIState as resetUIStateAction,
  setActiveExampleIndex as setActiveExampleIndexAction,
  setActivityIndicatorColor as setActivityIndicatorColorAction,
  setErrorMessage as setErrorMessageAction,
  setExamplesModalVisible as setExamplesModalVisibleAction,
  setImageViewerVisible as setImageViewerVisibleAction,
  setLocalImageUri as setLocalImageUriAction,
  setOriginalImageForResult as setOriginalImageForResultAction,
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
    // UI State
    localImageUri,
    originalImageForResult,
    errorMessage,
    isImageViewerVisible,
    isExamplesModalVisible,
    activeExampleIndex,
  } = useAppSelector((state) => state.contentCreation);

  // console.log("🔧 useContentCreation - state güncellendi:");
  // console.log("🔧 useContentCreation - status:", status);
  // console.log("🔧 useContentCreation - createdImageUrl:", createdImageUrl);
  // console.log("🔧 useContentCreation - imageStorageUrl:", imageStorageUrl);
  // console.log(
  //   "🔧 useContentCreation - storageUploadProcessingStatus:",
  //   storageUploadProcessingStatus,
  // );
  // console.log(
  //   "🔧 useContentCreation - aiToolProcessingStatus:",
  //   aiToolProcessingStatus,
  // );
  // console.log("🔧 useContentCreation - error:", error);

  // Actions

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

  // UI State Actions
  const setLocalImageUri = (uri: string | null) => {
    dispatch(setLocalImageUriAction(uri));
  };

  const setOriginalImageForResult = (uri: string | null) => {
    dispatch(setOriginalImageForResultAction(uri));
  };

  const setErrorMessage = (message: string | null) => {
    dispatch(setErrorMessageAction(message));
  };

  const setImageViewerVisible = (visible: boolean) => {
    dispatch(setImageViewerVisibleAction(visible));
  };

  const setExamplesModalVisible = (visible: boolean) => {
    dispatch(setExamplesModalVisibleAction(visible));
  };

  const setActiveExampleIndex = (index: number) => {
    dispatch(setActiveExampleIndexAction(index));
  };

  const resetUIState = () => {
    dispatch(resetUIStateAction());
  };

  // New Actions
  const generateImage = async (
    servicePrompt: string,
    aiRequestUrl: string,
    aiStatusUrl: string,
    aiResultUrl: string,
  ) => {
    if (!localImageUri) {
      throw new Error("Görsel seçilmemiş");
    }

    return await dispatch(
      generateImageAction({
        localImageUri,
        servicePrompt,
        aiRequestUrl,
        aiStatusUrl,
        aiResultUrl,
      }),
    );
  };

  const downloadImage = async () => {
    if (!createdImageUrl) {
      throw new Error("İndirilecek görsel bulunamadı");
    }

    return await dispatch(downloadImageAction({ imageUrl: createdImageUrl }));
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
    // UI State
    localImageUri,
    originalImageForResult,
    errorMessage,
    isImageViewerVisible,
    isExamplesModalVisible,
    activeExampleIndex,
    // Actions
    clearError,
    clearAllImages,
    setActivityIndicatorColor,
    // UI Actions
    setLocalImageUri,
    setOriginalImageForResult,
    setErrorMessage,
    setImageViewerVisible,
    setExamplesModalVisible,
    setActiveExampleIndex,
    resetUIState,
    // New Actions
    generateImage,
    downloadImage,
  };
}
