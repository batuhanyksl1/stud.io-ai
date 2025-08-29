import { storage } from "@/firebase.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

/**
 * Upload a local file (file:// or content:// URI) to Firebase Storage and return its download URL.
 * Works with Expo/React Native using the web Firebase SDK.
 *
 * @param fileUri      Local file URI (e.g., file:///..., content://...)
 * @param pathPrefix   Optional folder path in your bucket (default: "uploads")
 */
export async function sendStorage(
  fileUri: string,
  pathPrefix: string = "uploads",
): Promise<string> {
  try {
    // Fetch the local file and convert to Blob (Expo/React Native supports this)
    const response = await fetch(fileUri);
    const blob = await response.blob();

    // Create a unique filename with extension if possible
    const rawName = fileUri.split("/").pop() || `file-${Date.now()}`;
    const ext = rawName.includes(".") ? rawName.split(".").pop() : "jpg";
    const fileName = `${Date.now()}.${ext}`;

    // Create a storage reference (e.g., uploads/1699999999999.jpg)
    const reference = ref(storage, `${pathPrefix}/${fileName}`);

    // Upload with resumable upload
    const task = uploadBytesResumable(reference, blob);

    await new Promise<void>((resolve, reject) => {
      task.on(
        "state_changed",
        // progress callback (optional): (snap) => console.log(snap.bytesTransferred, '/', snap.totalBytes),
        undefined,
        (err) => reject(err),
        () => resolve(),
      );
    });

    // Optional cleanup for some environments
    // @ts-ignore - close may not exist on all Blob implementations
    blob.close?.();

    // Get the public download URL
    const downloadURL = await getDownloadURL(reference);
    return downloadURL;
  } catch (error) {
    console.error("Storage upload error:", error);
    throw error;
  }
}
