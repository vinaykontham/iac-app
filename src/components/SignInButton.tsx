"use client";

import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, isDemoMode } from "@/lib/firebase";
import { useDemoAuth } from "./DemoAuthProvider";
import { Button } from "@/components/ui/button";
import { LogIn, Loader2, AlertCircle, TestTube } from "lucide-react";

const SignInButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const demoAuth = isDemoMode ? useDemoAuth() : null;

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    
    try {
      if (isDemoMode) {
        // Use demo authentication
        await demoAuth?.signIn();
      } else {
        // Use Firebase authentication
        if (!auth || !googleProvider) {
          throw new Error("Firebase is not properly configured");
        }
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Handle specific Firebase auth errors
      let errorMessage = "Failed to sign in. Please try again.";
      
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in was cancelled. Please try again.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Pop-up was blocked. Please allow pop-ups and try again.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please wait a moment and try again.";
      } else if (error.message === "Firebase is not properly configured") {
        errorMessage = "Authentication service is not configured. Please check your Firebase settings.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {isDemoMode && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm">
          <TestTube className="w-4 h-4 flex-shrink-0" />
          <span>Demo Mode: Firebase not configured. Using demo authentication.</span>
        </div>
      )}
      
      <Button 
        onClick={handleSignIn}
        disabled={loading}
        className="glass-button px-8 py-3 rounded-lg text-white font-medium hover:neon-glow hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            {isDemoMode ? "Sign in (Demo Mode)" : "Sign in with Google"}
          </>
        )}
      </Button>
      
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default SignInButton;
