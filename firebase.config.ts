// React Native Firebase otomatik olarak yapılandırılır
// google-services.json (Android) ve GoogleService-Info.plist (iOS) dosyaları kullanılır
// Bu dosya sadece import'lar için kullanılır

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

export { auth, firestore, storage };
