"use client";

import React, { useState } from "react";
import { WizardData } from "../InfraWizard";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Rocket, CheckCircle, AlertTriangle, Loader2, Eye } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore, isDemoMode } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import DemoServices from "@/components/DemoServices";

interface Props {
  data: WizardData;
  prevStep: () => void;
}

const ReviewDeployStep: React.FC<Props> = ({ data, prevStep }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [deploying, setDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "success" | "error">("idle");
  const [deploymentId, setDeploymentId] = useState<string>("");
  const [showDemoServices, setShowDemoServices] = useState(false);

  const handleDeploy = async () => {
    if (!user) return;

    // If dry run mode, show demo services instead of deploying
    if (data.dryRun) {
      setShowDemoServices(true);
      return;
    }

    setDeploying(true);
    setDeploymentStatus("idle");

    try {
      if (isDemoMode) {
        // Demo mode deployment
        const demoId = `demo-${Date.now()}`;
        setDeploymentId(demoId);
        
        // Simulate deployment process
        if (data.dryRun) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          setDeploymentStatus("success");
        } else {
          await new Promise(resolve => setTimeout(resolve, 4000));
          setDeploymentStatus("success");
        }
      } else {
        // Real Firebase deployment
        if (!firestore) {
          throw new Error("Database connection not available");
        }
        
        const infraData = {
          userId: user.uid,
          projectName: data.projectName,
          cloudProvider: data.cloudProvider,
          service: data.service,
          variables: data.variables,
          customConfig: data.customConfig,
          dryRun: data.dryRun,
          status: data.dryRun ? "dry-run-completed" : "pending",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          },
        };

        const docRef = await addDoc(collection(firestore, "infrastructure"), infraData);
        setDeploymentId(docRef.id);

        // Simulate deployment process
        if (data.dryRun) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          setDeploymentStatus("success");
        } else {
          await new Promise(resolve => setTimeout(resolve, 5000));
          setDeploymentStatus("success");
        }
      }
    } catch (error) {
      console.error("Deployment failed:", error);
      setDeploymentStatus("error");
    } finally {
      setDeploying(false);
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "GCP":
        return "from-blue-500 to-green-500";
      case "AWS":
        return "from-orange-500 to-yellow-500";
      case "Azure":
        return "from-blue-600 to-cyan-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getServiceDisplayName = (service: string) => {
    const serviceNames: Record<string, string> = {
      "compute-engine": "Compute Engine",
      "gke": "Google Kubernetes Engine",
      "cloud-sql": "Cloud SQL",
      "ec2": "Amazon EC2",
      "eks": "Amazon EKS",
      "rds": "Amazon RDS",
      "virtual-machines": "Virtual Machines",
      "aks": "Azure Kubernetes Service",
      "cosmos-db": "Azure Cosmos DB",
    };
    return serviceNames[service] || service;
  };

  if (deploymentStatus === "success") {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            {data.dryRun ? "Dry Run Completed!" : "Deployment Initiated!"}
          </h3>
          <p className="text-gray-400 mb-4">
            {data.dryRun 
              ? "Your infrastructure plan has been validated successfully."
              : "Your infrastructure deployment has been started and is being processed."
            }
          </p>
          {deploymentId && (
            <p className="text-sm text-gray-500">
              Deployment ID: {deploymentId}
            </p>
          )}
        </div>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => router.push("/dashboard")}
            className="glass-button bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30"
          >
            View Dashboard
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="glass-button border-white/20 text-white hover:bg-white/10"
          >
            Create Another
          </Button>
        </div>
      </div>
    );
  }

  if (deploymentStatus === "error") {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Deployment Failed
          </h3>
          <p className="text-gray-400 mb-4">
            There was an error processing your infrastructure deployment. Please try again.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => setDeploymentStatus("idle")}
            className="glass-button bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30"
          >
            Try Again
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="glass-button border-white/20 text-white hover:bg-white/10"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
          {data.dryRun ? <Eye className="w-8 h-8 text-white" /> : <Rocket className="w-8 h-8 text-white" />}
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">
          {data.dryRun ? "Review Dry Run" : "Review & Deploy"}
        </h3>
        <p className="text-gray-400">
          {data.dryRun 
            ? "Review your configuration and run a dry run to validate the Terraform plan"
            : "Review your configuration and deploy your infrastructure"
          }
        </p>
      </div>

      {/* Project Overview */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div 
              className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getProviderColor(data.cloudProvider)} flex items-center justify-center text-sm font-bold text-white`}
            >
              {data.cloudProvider.charAt(0)}
            </div>
            {data.projectName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Cloud Provider</p>
              <p className="text-white font-medium">{data.cloudProvider}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Service</p>
              <p className="text-white font-medium">{getServiceDisplayName(data.service)}</p>
            </div>
          </div>
          
          {data.dryRun && (
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <Eye className="w-3 h-3 mr-1" />
              Dry Run Mode
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Variables */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Configuration Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.variables).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-gray-400 capitalize">{key.replace(/_/g, " ")}</span>
                <span className="text-white font-mono text-sm bg-white/10 px-2 py-1 rounded">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Configuration */}
      {data.customConfig && (
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Custom Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-gray-300 bg-black/30 p-4 rounded border border-white/10 overflow-x-auto">
              {JSON.stringify(JSON.parse(data.customConfig), null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Deployment Warning */}
      {!data.dryRun && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="text-orange-400 font-semibold">⚠️ Important Notice</p>
              <p className="text-orange-300 text-sm mt-1 leading-relaxed">
                This will create real cloud resources that may incur costs. Make sure you understand the pricing for the selected services before proceeding.
              </p>
              <div className="mt-2 text-xs text-orange-200/80">
                💡 Tip: Use dry run mode to preview changes without creating resources.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dry Run Info */}
      {data.dryRun && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-blue-400 font-semibold">🔍 Dry Run Mode</p>
              <p className="text-blue-300 text-sm mt-1 leading-relaxed">
                This will validate your configuration and show what would be created without actually deploying resources.
              </p>
            </div>
          </div>
        </div>
      )}

      <Separator className="bg-white/10" />

      <div className="flex justify-between">
        <Button
          onClick={prevStep}
          variant="outline"
          className="glass-button border-white/20 text-white hover:bg-white/10"
          disabled={deploying}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleDeploy}
          disabled={deploying}
          className={`glass-button ${
            data.dryRun 
              ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30"
              : "bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30"
          } hover:neon-glow`}
        >
          {deploying ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {data.dryRun ? "Running Dry Run..." : "Deploying..."}
            </>
          ) : (
            <>
              {data.dryRun ? <Eye className="w-4 h-4 mr-2" /> : <Rocket className="w-4 h-4 mr-2" />}
              {data.dryRun ? "Preview Resources" : "Deploy Infrastructure"}
            </>
          )}
        </Button>
      </div>

      {/* Demo Services Modal */}
      <DemoServices
        isVisible={showDemoServices}
        onClose={() => setShowDemoServices(false)}
        cloudProvider={data.cloudProvider}
        projectName={data.projectName}
      />
    </div>
  );
};

export default ReviewDeployStep;
