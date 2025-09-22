'use client';

import { useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: unknown;
  lastLoginAt: unknown;
  provider: string;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Synchronize user with Firestore
  const syncUserWithFirestore = async (user: User, isNewUser = false) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: isNewUser ? serverTimestamp() : userSnap.exists() ? userSnap.data()?.createdAt : serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        provider: user.providerData[0]?.providerId || 'unknown',
      };

      await setDoc(userRef, userProfile, { merge: true });
      console.log('User synchronized with Firestore:', user.uid);
    } catch (error: unknown) {
      console.error('Error syncing user with Firestore:', error);
      throw error;
    }
  };

  // Google Sign In
  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      
      // Sync with Firestore
      await syncUserWithFirestore(result.user, isNewUser);
      
      return result;
    } catch (error: unknown) {
      console.error('Error signing in with Google:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: (error as Error).message || 'Failed to sign in with Google'
      }));
      throw error;
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await firebaseSignOut(auth);
      console.log('User signed out successfully');
    } catch (error: unknown) {
      console.error('Error signing out:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: (error as Error).message || 'Failed to sign out'
      }));
      throw error;
    }
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in, sync with Firestore (for existing sessions)
          await syncUserWithFirestore(user, false);
        }
        
        setAuthState({
          user,
          loading: false,
          error: null,
        });
      } catch (error: unknown) {
        console.error('Error in auth state change:', error);
        setAuthState({
          user,
          loading: false,
          error: (error as Error).message || 'Authentication error',
        });
      }
    });

    return unsubscribe;
  }, []);

  return {
    ...authState,
    signInWithGoogle,
    signOut,
  };
};
