import { db, auth, firebaseConfigured } from '../config/firebase';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import {
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';

export const FirebaseService = {
  isAvailable() {
    return firebaseConfigured;
  },

  async saveUserProgress(userId, progress) {
    if (!firebaseConfigured) return;
    try {
      await setDoc(doc(db, 'users', userId, 'progress', 'data'), progress);
    } catch (error) {
      console.error('Firebase save progress error:', error);
    }
  },

  async getUserProgress(userId) {
    if (!firebaseConfigured) return null;
    try {
      const snap = await getDoc(doc(db, 'users', userId, 'progress', 'data'));
      return snap.exists() ? snap.data() : null;
    } catch (error) {
      console.error('Firebase get progress error:', error);
      return null;
    }
  },

  async saveUserProfile(userId, profile) {
    if (!firebaseConfigured) return;
    try {
      await setDoc(doc(db, 'users', userId), profile, { merge: true });
    } catch (error) {
      console.error('Firebase save profile error:', error);
    }
  },

  async signInWithGoogle(idToken) {
    if (!firebaseConfigured) return null;
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      return null;
    }
  },

  async signOut() {
    if (!firebaseConfigured) return;
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  onAuthStateChanged(callback) {
    if (!firebaseConfigured) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  },

  getCurrentUser() {
    if (!firebaseConfigured) return null;
    return auth.currentUser;
  },
};
