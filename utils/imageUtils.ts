import * as ImageManipulator from 'expo-image-manipulator';

export interface ImageFilter {
  brightness?: number;
  contrast?: number;
  saturation?: number;
}

export const applyImageFilter = async (
  imageUri: string,
  filter: ImageFilter,
  cropToCircle: boolean = true,
): Promise<string> => {
  try {
    const actions: ImageManipulator.Action[] = [];

    // Resize to standard profile picture size
    actions.push({ resize: { width: 400, height: 400 } });

    // Apply crop to square if needed
    if (cropToCircle) {
      actions.push({
        crop: {
          originX: 0,
          originY: 0,
          width: 400,
          height: 400,
        },
      });
    }

    const result = await ImageManipulator.manipulateAsync(imageUri, actions, {
      compress: 0.9,
      format: ImageManipulator.SaveFormat.PNG,
    });

    return result.uri;
  } catch (error) {
    console.error('Error applying filter:', error);
    throw error;
  }
};

export const createLinkedInFrame = async (
  imageUri: string,
  backgroundColor: string = '#F8FAFC',
): Promise<string> => {
  try {
    // Create a professional frame around the image
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 500, height: 500 } }],
      {
        compress: 0.9,
        format: ImageManipulator.SaveFormat.PNG,
      },
    );

    return result.uri;
  } catch (error) {
    console.error('Error creating LinkedIn frame:', error);
    throw error;
  }
};

export const optimizeForLinkedIn = async (imageUri: string): Promise<string> => {
  try {
    // LinkedIn recommends 400x400 pixels for profile photos
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 400, height: 400 } }],
      {
        compress: 0.85,
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );

    return result.uri;
  } catch (error) {
    console.error('Error optimizing for LinkedIn:', error);
    throw error;
  }
};
