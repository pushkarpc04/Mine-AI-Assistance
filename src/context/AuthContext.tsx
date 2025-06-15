
'use client';

import type { User as FirebaseUser, IdTokenResult } from 'firebase/auth';
import { onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthFormInput } from '@/components/auth/AuthForm'; // Will create this

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  token: string | null;
  loginWithEmail: (data: AuthFormInput) => Promise<FirebaseUser | null>;
  signupWithEmail: (data: AuthFormInput) => Promise<FirebaseUser | null>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const idTokenResult: IdTokenResult = await firebaseUser.getIdTokenResult();
        setToken(idTokenResult.token);
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (data: AuthFormInput): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      setUser(userCredential.user);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      setToken(idTokenResult.token);
      setLoading(false);
      router.push('/');
      return userCredential.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signupWithEmail = async (data: AuthFormInput): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      setUser(userCredential.user);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      setToken(idTokenResult.token);
      setLoading(false);
      router.push('/');
      return userCredential.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setToken(null);
      setLoading(false);
      router.push('/login');
    } catch (error) {
      setLoading(false);
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, loginWithEmail, signupWithEmail, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
