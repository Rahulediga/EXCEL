import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAJwtChXdGsnSpVjc8SFI-Y_CCdGHJ6B40",
  authDomain: "devoops-fc055.firebaseapp.com",
  databaseURL: "https://devoops-fc055-default-rtdb.firebaseio.com",
  projectId: "devoops-fc055",
  storageBucket: "devoops-fc055.firebasestorage.app",
  messagingSenderId: "518177707574",
  appId: "1:518177707574:web:6a5fc8221cf079a055aa97",
  measurementId: "G-VGE4425L0R"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getDatabase(app);
