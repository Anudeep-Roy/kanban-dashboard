import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   // Replace with your Firebase config
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyAO4g_Xb1ayV4boczzmHX3xOGmLrIiIJEM",
  authDomain: "kanban-dashoard.firebaseapp.com",
  projectId: "kanban-dashoard",
  storageBucket: "kanban-dashoard.firebasestorage.app",
  messagingSenderId: "815167259965",
  appId: "1:815167259965:web:495ecccc55368c759c7154",
  measurementId: "G-1CH0QME4RP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);