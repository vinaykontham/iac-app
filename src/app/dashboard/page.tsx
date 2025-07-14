"use client";

import React from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth, isDemoMode } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Server, Activity, Clock, User, Settings } from "lucide-react";
import InfraTable from "@/components/InfraTable";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      if (isDemoMode) {
        // Handle demo mode logout
        window.location.href = "/";
      } else {
        await auth.signOut();
        router.push("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to home
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card p-6 rounded-lg mb-8 fade-in">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome back, {user.displayName || "User"}
                </h1>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="glass-button border-red-500/30 text-red-400 hover:bg-red-500/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Server className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Infrastructure</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Deployments</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Last Deployment</p>
                <p className="text-2xl font-bold text-white">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="glass-card p-6 rounded-lg mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Infrastructure Management
              </h2>
              <p className="text-gray-400">
                Create and manage your cloud infrastructure deployments
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => router.push("/cloud-config")}
                variant="outline"
                className="glass-button border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure Providers
              </Button>
              <Button 
                onClick={() => router.push("/create-infra")}
                className="glass-button bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 hover:neon-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Infrastructure
              </Button>
            </div>
          </div>
        </div>

        {/* Infrastructure Table */}
        <div className="glass-card p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">
            Infrastructure History
          </h3>
          <InfraTable userId={user.uid} />
        </div>
      </div>
    </div>
  );
}
