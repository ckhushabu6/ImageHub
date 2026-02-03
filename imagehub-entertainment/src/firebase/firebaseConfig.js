// src/firebase/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXLitwMW9cin5-vwyuJvaZb3Ss71WF5M0",
  authDomain: "imagehub-entertainment.firebaseapp.com",
  projectId: "imagehub-entertainment",
  storageBucket: "imagehub-entertainment.appspot.com", // ✅ FIXED
  messagingSenderId: "781339501485",
  appId: "1:781339501485:web:a9ee64ee7e797768187724", // ✅ ImageHub appId
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
