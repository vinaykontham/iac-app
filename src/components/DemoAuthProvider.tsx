"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface DemoUser {
  uid: string;
  email: string;
  displayName: string;
}

interface DemoAuthContextType {
  user: DemoUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const DemoAuthContext = createContext<DemoAuthContextType>({
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
});

export const useDemoAuth = () => {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error("useDemoAuth must be used within a DemoAuthProvider");
  }
  return context;
};

export const DemoAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const demoUser: DemoUser = {
      uid: "demo-user-123",
      email: "demo@example.com",
      displayName: "Demo User",
    };
    
    setUser(demoUser);
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    setLoading(false);
  };

  return (
    <DemoAuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </DemoAuthContext.Provider>
  );
};
