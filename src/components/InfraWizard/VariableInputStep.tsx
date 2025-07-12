"use client";

import React, { useState, useEffect } from "react";
import { WizardData } from "../InfraWizard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Settings, Code, TestTube } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-black/30 rounded border border-white/20 flex items-center justify-center">
      <p className="text-gray-400">Loading editor...</p>
    </div>
  ),
});

interface Props {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

// Define required variables for each service
const serviceVariables = {
  "compute-engine": [
    { name: "instance_name", label: "Instance Name", type: "text", required: true },
    { name: "machine_type", label: "Machine Type", type: "text", required: true, default: "e2-medium" },
    { name: "zone", label: "Zone", type: "text", required: true, default: "us-central1-a" },
    { name: "image", label: "Image", type: "text", required: true, default: "ubuntu-2004-lts" },
  ],
  "gke": [
    { name: "cluster_name", label: "Cluster Name", type: "text", required: true },
    { name: "location", label: "Location", type: "text", required: true, default: "us-central1" },
    { name: "node_count", label: "Node Count", type: "number", required: true, default: "3" },
    { name: "machine_type", label: "Machine Type", type: "text", required: true, default: "e2-medium" },
  ],
  "cloud-sql": [
    { name: "instance_name", label: "Instance Name", type: "text", required: true },
    { name: "database_version", label: "Database Version", type: "text", required: true, default: "POSTGRES_13" },
    { name: "tier", label: "Tier", type: "text", required: true, default: "db-f1-micro" },
    { name: "region", label: "Region", type: "text", required: true, default: "us-central1" },
  ],
  "ec2": [
    { name: "instance_name", label: "Instance Name", type: "text", required: true },
    { name: "instance_type", label: "Instance Type", type: "text", required: true, default: "t3.micro" },
    { name: "ami_id", label: "AMI ID", type: "text", required: true, default: "ami-0c02fb55956c7d316" },
    { name: "availability_zone", label: "Availability Zone", type: "text", required: true, default: "us-east-1a" },
  ],
  "eks": [
    { name: "cluster_name", label: "Cluster Name", type: "text", required: true },
    { name: "region", label: "Region", type: "text", required: true, default: "us-east-1" },
    { name: "node_group_name", label: "Node Group Name", type: "text", required: true },
    { name: "instance_types", label: "Instance Types", type: "text", required: true, default: "t3.medium" },
  ],
  "rds": [
    { name: "db_instance_identifier", label: "DB Instance Identifier", type: "text", required: true },
    { name: "engine", label: "Engine", type: "text", required: true, default: "postgres" },
    { name: "instance_class", label: "Instance Class", type: "text", required: true, default: "db.t3.micro" },
    { name: "allocated_storage", label: "Allocated Storage (GB)", type: "number", required: true, default: "20" },
  ],
  "virtual-machines": [
    { name: "vm_name", label: "VM Name", type: "text", required: true },
    { name: "vm_size", label: "VM Size", type: "text", required: true, default: "Standard_B1s" },
    { name: "location", label: "Location", type: "text", required: true, default: "East US" },
    { name: "admin_username", label: "Admin Username", type: "text", required: true, default: "azureuser" },
  ],
  "aks": [
    { name: "cluster_name", label: "Cluster Name", type: "text", required: true },
    { name: "location", label: "Location", type: "text", required: true, default: "East US" },
    { name: "node_count", label: "Node Count", type: "number", required: true, default: "3" },
    { name: "vm_size", label: "VM Size", type: "text", required: true, default: "Standard_DS2_v2" },
  ],
  "cosmos-db": [
    { name: "account_name", label: "Account Name", type: "text", required: true },
    { name: "location", label: "Location", type: "text", required: true, default: "East US" },
    { name: "consistency_level", label: "Consistency Level", type: "text", required: true, default: "Session" },
    { name: "throughput", label: "Throughput", type: "number", required: true, default: "400" },
  ],
};

const VariableInputStep: React.FC<Props> = ({ data, updateData, nextStep, prevStep }) => {
  const [error, setError] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [activeTab, setActiveTab] = useState("variables");

  const variables = serviceVariables[data.service as keyof typeof serviceVariables] || [];

  // Initialize variables with defaults
  useEffect(() => {
    const defaultVariables: Record<string, string> = {};
    variables.forEach((variable) => {
      if (variable.default && !data.variables[variable.name]) {
        defaultVariables[variable.name] = variable.default;
      }
    });
    if (Object.keys(defaultVariables).length > 0) {
      updateData({ variables: { ...data.variables, ...defaultVariables } });
    }
  }, [data.service, variables, data.variables, updateData]);

  const handleVariableChange = (name: string, value: string) => {
    updateData({
      variables: {
        ...data.variables,
        [name]: value,
      },
    });
    setError("");
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      try {
        JSON.parse(value);
        setJsonError("");
        updateData({ customConfig: value });
      } catch (err) {
        setJsonError("Invalid JSON format");
      }
    }
  };

  const handleNext = () => {
    // Validate required variables
    const missingVariables = variables
      .filter((variable) => variable.required && !data.variables[variable.name]?.trim())
      .map((variable) => variable.label);

    if (missingVariables.length > 0) {
      setError(`Please fill in required fields: ${missingVariables.join(", ")}`);
      setActiveTab("variables"); // Switch to variables tab to show errors
      return;
    }

    if (jsonError) {
      setError("Please fix the JSON configuration errors before proceeding.");
      setActiveTab("config"); // Switch to config tab to show errors
      return;
    }

    setError("");
    nextStep();
  };

  const defaultJsonConfig = {
    tags: {
      Environment: "development",
      Project: data.projectName,
      ManagedBy: "terraform",
    },
    backup_enabled: true,
    monitoring_enabled: true,
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">
          Configure Your Infrastructure
        </h3>
        <p className="text-gray-400">
          Set the required variables and optional configuration for your {data.service} deployment
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10">
          <TabsTrigger value="variables" className="data-[state=active]:bg-cyan-500/20">
            <Settings className="w-4 h-4 mr-2" />
            Variables
          </TabsTrigger>
          <TabsTrigger value="config" className="data-[state=active]:bg-cyan-500/20">
            <Code className="w-4 h-4 mr-2" />
            Custom Config
          </TabsTrigger>
          <TabsTrigger value="options" className="data-[state=active]:bg-cyan-500/20">
            <TestTube className="w-4 h-4 mr-2" />
            Options
          </TabsTrigger>
        </TabsList>

        <TabsContent value="variables" className="space-y-4">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Required Variables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {variables.map((variable) => {
                const hasError = variable.required && !data.variables[variable.name]?.trim();
                return (
                  <div key={variable.name} className="space-y-2">
                    <Label htmlFor={variable.name} className="text-white flex items-center gap-2">
                      {variable.label} 
                      {variable.required && <span className="text-red-400">*</span>}
                      {variable.default && (
                        <span className="text-xs text-gray-500 font-normal">
                          (default: {variable.default})
                        </span>
                      )}
                    </Label>
                    <Input
                      id={variable.name}
                      type={variable.type}
                      placeholder={variable.default || `Enter ${variable.label.toLowerCase()}`}
                      value={data.variables[variable.name] || ""}
                      onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                      className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 transition-all duration-200 ${
                        hasError ? "border-red-400 focus:border-red-400" : ""
                      }`}
                    />
                    {hasError && (
                      <p className="text-red-400 text-xs fade-in">This field is required</p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Custom JSON Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Add custom configuration in JSON format. This will be merged with the default Terraform variables.
                </p>
                <div className="monaco-editor-container">
                  <MonacoEditor
                    height="300px"
                    defaultLanguage="json"
                    theme="vs-dark"
                    value={data.customConfig || JSON.stringify(defaultJsonConfig, null, 2)}
                    onChange={handleEditorChange}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>
                {jsonError && (
                  <p className="text-red-400 text-sm">{jsonError}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="options" className="space-y-4">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Deployment Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Dry Run Mode</Label>
                  <p className="text-sm text-gray-400">
                    Preview the Terraform plan without applying changes
                  </p>
                </div>
                <Switch
                  checked={data.dryRun}
                  onCheckedChange={(checked) => updateData({ dryRun: checked })}
                />
              </div>
              
              {data.dryRun && (
                <div className="p-4 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                  <p className="text-yellow-400 text-sm">
                    <TestTube className="w-4 h-4 inline mr-2" />
                    Dry run mode enabled. This will only show you what would be created without actually deploying resources.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button
          onClick={prevStep}
          variant="outline"
          className="glass-button border-white/20 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="glass-button bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 hover:neon-glow"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default VariableInputStep;
