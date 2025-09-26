import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAllImages as clearAllImagesAction,
  clearError as clearErrorAction,
  downloadImage as downloadImageAction,
  generateImage as generateImageAction,
  removeLocalImageUri as removeLocalImageUriAction,
  resetUIState as resetUIStateAction,
  setActiveExampleIndex as setActiveExampleIndexAction,
  setActivityIndicatorColor as setActivityIndicatorColorAction,
  setErrorMessage as setErrorMessageAction,
  setExamplesModalVisible as setExamplesModalVisibleAction,
  setImageViewerVisible as setImageViewerVisibleAction,
  setLocalImageUri as setLocalImageUriAction,
  setLocalImageUris as setLocalImageUrisAction,
  setOriginalImageForResult as setOriginalImageForResultAction,
  setOriginalImagesForResult as setOriginalImagesForResultAction,
} from "@/store/slices/contentCreationSlice";

export function useContentCreation() {
  const dispatch = useAppDispatch();

  // Redux store'dan state'leri al
  const {
    status,
    createdImageUrl,
    imageStorageUrl,
    imageStorageUrls,
    storageUploadProcessingStatus,
    aiToolProcessingStatus,
    error,
    activityIndicatorColor,
    // UI State
    localImageUri,
    localImageUris,
    originalImageForResult,
    originalImagesForResult,
    errorMessage,
    isImageViewerVisible,
    isExamplesModalVisible,
    activeExampleIndex,
  } = useAppSelector((state) => state.contentCreation);

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

  const setLocalImageUris = (uris: string[]) => {
    dispatch(setLocalImageUrisAction(uris));
  };

  const removeLocalImageUri = (index: number) => {
    dispatch(removeLocalImageUriAction(index));
  };

  const setOriginalImageForResult = (uri: string | null) => {
    dispatch(setOriginalImageForResultAction(uri));
  };

  const setOriginalImagesForResult = (uris: string[]) => {
    dispatch(setOriginalImagesForResultAction(uris));
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
    token?: number,
  ) => {
    if (!localImageUri && (!localImageUris || localImageUris.length === 0)) {
      throw new Error("Görsel seçilmemiş");
    }

    return await dispatch(
      generateImageAction({
        localImageUri: localImageUri || undefined,
        localImageUris: localImageUris || undefined,
        servicePrompt,
        aiRequestUrl,
        aiStatusUrl,
        aiResultUrl,
        token,
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
    imageStorageUrls,
    createdImageUrl,
    storageUploadProcessingStatus,
    aiToolProcessingStatus,
    error,
    status,
    activityIndicatorColor,
    // UI State
    localImageUri,
    localImageUris,
    originalImageForResult,
    originalImagesForResult,
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
    setLocalImageUris,
    removeLocalImageUri,
    setOriginalImageForResult,
    setOriginalImagesForResult,
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
