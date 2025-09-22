import { auth, storage } from "@/firebase.config";

/**
 * Upload a local file (file:// or content://) to Firebase Storage and return its download URL.
 *
 * @param fileUri      Local file URI (e.g., file:///..., content://...)
 * @param pathPrefix   Optional folder path in your bucket (default: "uploads")
 */
export async function sendStorage(
  fileUri: string,
  pathPrefix: string = "uploads",
): Promise<string> {
  try {
    const uid = auth().currentUser?.uid ?? "anonymous";

    // Derive a filename & extension from the URI
    const rawName = fileUri.split("/").pop() || `file-${Date.now()}`;
    const ext = rawName.includes(".") ? rawName.split(".").pop() : "jpg";
    const fileName = `${Date.now()}.${ext}`;

    const fullPath = `${pathPrefix}/${uid}/${fileName}`;
    const reference = storage().ref(fullPath);

    // Use native RNFB upload API for local files (handles file:// and content://)
    const task = reference.putFile(fileUri);

    // Await completion (optionally, attach a progress listener here if needed)
    await new Promise<void>((resolve, reject) => {
      task.on(
        "state_changed",
        // progress callback (optional)
        // (snapshot) => {
        //   const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //   console.log(`Upload is ${progress.toFixed(0)}% done`);
        // },
        undefined,
        (error) => reject(error),
        () => resolve(),
      );
    });

    const downloadURL = await reference.getDownloadURL();
    return downloadURL;
  } catch (error) {
    console.error("Storage upload error:", error);
    throw error;
  }
}
