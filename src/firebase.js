// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA7GXun9Kpds4uaqKf4GSmOhYHGdiUrzlU",
    authDomain: "ferguson-leaderboard.firebaseapp.com",
    projectId: "ferguson-leaderboard",
    storageBucket: "ferguson-leaderboard.appspot.com",
    messagingSenderId: "675799105986",
    appId: "1:675799105986:web:025876609802a7bead165b",
    measurementId: "G-6YKMNYZW4T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;
