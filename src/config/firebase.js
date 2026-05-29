import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your Firebase project config
// Go to: https://console.firebase.google.com -> Your project -> Project settings -> Your apps
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

let app;
let db;
let auth;
let firebaseConfigured = false;

try {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY') {
    console.warn('Firebase not configured. Running in offline mode.');
  } else {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
    firebaseConfigured = true;
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error);
}

export { db, auth, firebaseConfigured };
export default app;
