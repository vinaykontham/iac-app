"use client";

import React from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SignInButton from "@/components/SignInButton";
import { Shield, Cloud, Zap, Lock } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-6xl font-bold text-white mb-6 neon-text">
            Enterprise Infrastructure
          </h1>
          <h2 className="text-4xl font-light text-cyan-400 mb-8">
            Provisioning Platform
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Deploy and manage cloud infrastructure across GCP, AWS, and Azure with enterprise-grade security and Terraform automation.
          </p>
        </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass-card p-6 rounded-lg text-center hover:neon-glow hover:scale-105 transition-all duration-300 group">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-cyan-500/50">
            <Cloud className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Multi-Cloud</h3>
          <p className="text-gray-400 text-sm">Deploy across GCP, AWS, and Azure</p>
        </div>
        
        <div className="glass-card p-6 rounded-lg text-center hover:neon-glow hover:scale-105 transition-all duration-300 group">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-green-500/50">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Enterprise Security</h3>
          <p className="text-gray-400 text-sm">Google SSO and secure authentication</p>
        </div>
        
        <div className="glass-card p-6 rounded-lg text-center hover:neon-glow hover:scale-105 transition-all duration-300 group">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/50">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Terraform Powered</h3>
          <p className="text-gray-400 text-sm">Infrastructure as Code automation</p>
        </div>
        
        <div className="glass-card p-6 rounded-lg text-center hover:neon-glow hover:scale-105 transition-all duration-300 group">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-orange-500/50">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Secure & Compliant</h3>
          <p className="text-gray-400 text-sm">Enterprise-grade compliance</p>
        </div>
      </div>

        {/* Sign In Section */}
        <div className="glass-card p-8 rounded-lg text-center slide-up">
          <h3 className="text-2xl font-semibold text-white mb-4">
            Get Started
          </h3>
          <p className="text-gray-300 mb-6">
            Sign in with your Google account to access the infrastructure provisioning platform
          </p>
          <SignInButton />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>&copy; 2024 Enterprise Infrastructure Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
