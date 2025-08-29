import storage from "@react-native-firebase/storage";

export const sendStorage = async (image: string) => {
  const storageRef = storage().ref(`images/${image}`);
  await storageRef.putFile(image);
  const downloadURL = await storageRef.getDownloadURL();
  return downloadURL;
};
