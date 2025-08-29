import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAllImages as clearAllImagesAction,
  clearError as clearErrorAction,
  deleteImage as deleteImageAction,
  pickImage as pickImageAction,
  processImageWithFalAI as processImageWithFalAIAction,
  setSelectedImage as setSelectedImageAction,
  takePhoto as takePhotoAction,
  uploadImageToStorage as uploadImageToStorageAction,
} from "@/store/slices/generationSlice";

export function useGeneration() {
  const dispatch = useAppDispatch();

  // Redux store'dan state'leri al
  const { images, selectedImageId, selectedImageUri, error } = useAppSelector(
    (state) => state.generation,
  );

  // Seçilmiş görseli bul
  const selectedImage =
    images.find((img) => img.id === selectedImageId) || null;

  // Tüm görselleri al
  const allImages = images;

  const pickImage = () => {
    dispatch(pickImageAction());
  };

  const takePhoto = () => {
    dispatch(takePhotoAction());
  };

  const uploadImageToStorage = (imageId: string) => {
    dispatch(uploadImageToStorageAction(imageId));
  };

  const processImageWithFalAI = (imageId: string) => {
    dispatch(processImageWithFalAIAction(imageId));
  };

  const deleteImage = (imageId: string) => {
    dispatch(deleteImageAction(imageId));
  };

  const setSelectedImage = (imageId: string | null) => {
    dispatch(setSelectedImageAction(imageId));
  };

  const clearError = () => {
    dispatch(clearErrorAction());
  };

  const clearAllImages = () => {
    dispatch(clearAllImagesAction());
  };

  return {
    // State
    images: allImages,
    selectedImage,
    selectedImageId,
    selectedImageUri,
    error,

    // Actions
    pickImage,
    takePhoto,
    uploadImageToStorage,
    processImageWithFalAI,
    deleteImage,
    setSelectedImage,
    clearError,
    clearAllImages,
  };
}
