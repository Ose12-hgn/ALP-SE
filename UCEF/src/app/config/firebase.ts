/**
 * src/app/config/firebase.ts
 * Firebase SDK initialization and service exports for the UCEF system.
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Replace these values with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "ucef-uc.firebaseapp.com",
  projectId: "ucef-uc",
  storageBucket: "ucef-uc.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize the core Firebase App
const app = initializeApp(firebaseConfig);

// Logic Tier Exports: Modular service instances [6]
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);