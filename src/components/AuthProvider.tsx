"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, isDemoMode } from "@/lib/firebase";
import { DemoAuthProvider, useDemoAuth } from "./DemoAuthProvider";

interface AuthContextType {
  user: User | any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error("Authentication error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const DemoAuthWrapper = ({ children }: { children: ReactNode }) => {
  const demoAuth = useDemoAuth();
  
  return (
    <AuthContext.Provider value={{ user: demoAuth.user, loading: demoAuth.loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  if (isDemoMode) {
    return (
      <DemoAuthProvider>
        <DemoAuthWrapper>
          {children}
        </DemoAuthWrapper>
      </DemoAuthProvider>
    );
  }

  return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>;
};
