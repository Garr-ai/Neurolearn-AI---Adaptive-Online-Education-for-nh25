// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLbHNYt8enqCQEopr2Yjd_xvq7mAptI58",
  authDomain: "neurocalm-8a63a.firebaseapp.com",
  projectId: "neurocalm-8a63a",
  storageBucket: "neurocalm-8a63a.firebasestorage.app",
  messagingSenderId: "666645721893",
  appId: "1:666645721893:web:404930d5f99fb3e8f2a0cc",
  measurementId: "G-T2GTY9XTDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Analytics (only in browser, not in Node.js)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;


