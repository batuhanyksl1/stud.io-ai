/**
 * View state hesaplamaları için utility fonksiyonlar
 */

export interface ViewState {
  isGenerating: boolean;
  hasImages: boolean;
  isIdle: boolean;
  isEditing: boolean;
  hasResult: boolean;
}

/**
 * Mevcut state'e göre view state'lerini hesaplar
 */
export function calculateViewState(
  status: string,
  localImageUri: string | null,
  localImageUris: string[] | null,
  createdImageUrl: string | null,
): ViewState {
  const isGenerating = status === "pending";
  const hasImages =
    !!localImageUri || (!!localImageUris && localImageUris.length > 0);
  const isIdle = !hasImages && !createdImageUrl;
  const isEditing = hasImages && !createdImageUrl;
  const hasResult = !!createdImageUrl;

  return {
    isGenerating,
    hasImages,
    isIdle,
    isEditing,
    hasResult,
  };
}

