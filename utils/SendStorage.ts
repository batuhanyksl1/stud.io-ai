import { storage } from "@/firebase.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth } from "../firebase.auth.config";

/**
 * @param fileUri      Local file URI (e.g., file:///..., content://...)
 * @param pathPrefix   Optional folder path in your bucket (default: "uploads")
 */
export async function sendStorage(
  fileUri: string,
  pathPrefix: string = "uploads",
): Promise<string> {
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const rawName = fileUri.split("/").pop() || `file-${Date.now()}`;
    const ext = rawName.includes(".") ? rawName.split(".").pop() : "jpg";
    const fileName = `${Date.now()}.${ext}`;

    const reference = ref(
      storage,
      `${pathPrefix}/${auth.currentUser?.uid}/${fileName}`,
    );

    const task = uploadBytesResumable(reference, blob);

    await new Promise<void>((resolve, reject) => {
      task.on(
        "state_changed",
        undefined,
        (err) => reject(err),
        () => resolve(),
      );
    });

    const downloadURL = await getDownloadURL(reference);
    return downloadURL;
  } catch (error) {
    console.error("Storage upload error:", error);
    throw error;
  }
}
