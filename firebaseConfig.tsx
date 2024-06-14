// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAXU6fSFq7Ezon7bE5Yv6povoEUCtYp4j4",
  authDomain: "instadaelim-62c61.firebaseapp.com",
  projectId: "instadaelim-62c61",
  storageBucket: "instadaelim-62c61.appspot.com",
  messagingSenderId: "334475471244",
  appId: "1:334475471244:web:e6d60e6c7551a2816d8ea9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firbase Authentication
// export const auth = getAuth(app); -> web

// auth for react-native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// firestore
const storage = getStorage(app);
// Storage

export { auth, storage };
