
'use client';

import type { User as FirebaseUser } from 'firebase/auth';
// Firebase imports are commented out or removed for mock implementation
// import { onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '@/lib/firebase'; 
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthFormInput } from '@/components/auth/AuthForm';

// Define a simpler User type for mock purposes if needed, or use FirebaseUser with mock data
interface MockUser {
  uid: string;
  email: string | null;
  // Add other properties if your app expects them
}

interface AuthContextType {
  user: MockUser | null; // Using MockUser or FirebaseUser with mock data
  loading: boolean;
  token: string | null;
  loginWithEmail: (data: AuthFormInput) => Promise<MockUser | null>;
  signupWithEmail: (data: AuthFormInput) => Promise<MockUser | null>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate initial auth check for mock environment
    // For a real app, onAuthStateChanged would be here.
    // In a mock setup, we can assume no user is logged in initially,
    // or simulate a logged-in user for testing specific scenarios.
    const mockAuthCheck = setTimeout(() => {
      // Example: Check localStorage for a mock session
      // const storedUser = localStorage.getItem('mockUser');
      // if (storedUser) {
      //   setUser(JSON.parse(storedUser));
      //   setToken('mock-persistent-token');
      // }
      setLoading(false);
    }, 500); // Simulate a short delay

    return () => clearTimeout(mockAuthCheck);
  }, []);

  const loginWithEmail = async (data: AuthFormInput): Promise<MockUser | null> => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: MockUser = {
          uid: `mock-uid-${Date.now()}`,
          email: data.email,
        };
        setUser(mockUser);
        setToken('mock-jwt-token-login');
        // localStorage.setItem('mockUser', JSON.stringify(mockUser)); // Optional: for mock persistence
        setLoading(false);
        router.push('/');
        resolve(mockUser);
      }, 1000); // Simulate network delay
    });
  };

  const signupWithEmail = async (data: AuthFormInput): Promise<MockUser | null> => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: MockUser = {
          uid: `mock-uid-${Date.now()}`,
          email: data.email,
        };
        setUser(mockUser);
        setToken('mock-jwt-token-signup');
        // localStorage.setItem('mockUser', JSON.stringify(mockUser)); // Optional: for mock persistence
        setLoading(false);
        router.push('/');
        resolve(mockUser);
      }, 1000); // Simulate network delay
    });
  };

  const logoutUser = async () => {
    setLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(null);
        setToken(null);
        // localStorage.removeItem('mockUser'); // Optional: for mock persistence
        setLoading(false);
        router.push('/login');
        resolve();
      }, 500); // Simulate network delay
    });
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
