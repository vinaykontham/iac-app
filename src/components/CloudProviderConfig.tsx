"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Cloud, 
  Key, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Trash2,
  Plus
} from "lucide-react";

interface CloudCredentials {
  id: string;
  provider: string;
  name: string;
  credentials: Record<string, string>;
  isConfigured: boolean;
  createdAt: Date;
}

const CloudProviderConfig = () => {
  const [credentials, setCredentials] = useState<CloudCredentials[]>([]);
  const [activeTab, setActiveTab] = useState("gcp");
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // Load credentials from localStorage on component mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem("cloudCredentials");
    if (savedCredentials) {
      try {
        const parsed = JSON.parse(savedCredentials);
        // Convert date strings back to Date objects
        const credentialsWithDates = parsed.map((cred: any) => ({
          ...cred,
          createdAt: new Date(cred.createdAt)
        }));
        setCredentials(credentialsWithDates);
      } catch (error) {
        console.error("Error parsing saved credentials:", error);
      }
    }
  }, []);

  // Save credentials to localStorage
  const saveCredentials = (newCredentials: CloudCredentials[]) => {
    setCredentials(newCredentials);
    localStorage.setItem("cloudCredentials", JSON.stringify(newCredentials));
  };

  const providers = [
    {
      id: "gcp",
      name: "Google Cloud Platform",
      color: "from-blue-500 to-green-500",
      fields: [
        { key: "project_id", label: "Project ID", type: "text", required: true },
        { key: "service_account_key", label: "Service Account Key (JSON)", type: "textarea", required: true, secret: true },
        { key: "region", label: "Default Region", type: "text", required: true, default: "us-central1" },
      ]
    },
    {
      id: "aws",
      name: "Amazon Web Services",
      color: "from-orange-500 to-yellow-500",
      fields: [
        { key: "access_key_id", label: "Access Key ID", type: "text", required: true, secret: true },
        { key: "secret_access_key", label: "Secret Access Key", type: "password", required: true, secret: true },
        { key: "region", label: "Default Region", type: "text", required: true, default: "us-east-1" },
        { key: "session_token", label: "Session Token (Optional)", type: "password", required: false, secret: true },
      ]
    },
    {
      id: "azure",
      name: "Microsoft Azure",
      color: "from-blue-600 to-cyan-500",
      fields: [
        { key: "subscription_id", label: "Subscription ID", type: "text", required: true },
        { key: "client_id", label: "Client ID", type: "text", required: true },
        { key: "client_secret", label: "Client Secret", type: "password", required: true, secret: true },
        { key: "tenant_id", label: "Tenant ID", type: "text", required: true },
        { key: "location", label: "Default Location", type: "text", required: true, default: "East US" },
      ]
    }
  ];

  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});

  const handleInputChange = (provider: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value
      }
    }));
  };

  const handleSaveCredentials = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return;

    const providerData = formData[providerId] || {};
    const requiredFields = provider.fields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !providerData[f.key]?.trim());

    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.map(f => f.label).join(", ")}`);
      return;
    }

    const newCredential: CloudCredentials = {
      id: `${providerId}-${Date.now()}`,
      provider: providerId,
      name: `${provider.name} Configuration`,
      credentials: providerData,
      isConfigured: true,
      createdAt: new Date()
    };

    // Remove existing credentials for this provider
    const updatedCredentials = credentials.filter(c => c.provider !== providerId);
    updatedCredentials.push(newCredential);
    
    saveCredentials(updatedCredentials);
    
    // Clear form
    setFormData(prev => ({
      ...prev,
      [providerId]: {}
    }));

    alert(`${provider.name} credentials saved successfully!`);
  };

  const handleDeleteCredentials = (credentialId: string) => {
    if (confirm("Are you sure you want to delete these credentials?")) {
      const updatedCredentials = credentials.filter(c => c.id !== credentialId);
      saveCredentials(updatedCredentials);
    }
  };

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getConfiguredProvider = (providerId: string) => {
    return credentials.find(c => c.provider === providerId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          Cloud Provider Configuration
        </h2>
        <p className="text-gray-400">
          Configure your cloud provider credentials to enable infrastructure deployment
        </p>
      </div>

      {/* Configured Providers Summary */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Configured Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {providers.map(provider => {
              const configured = getConfiguredProvider(provider.id);
              return (
                <Badge
                  key={provider.id}
                  className={`flex items-center gap-2 px-3 py-2 ${
                    configured 
                      ? "bg-green-500/20 text-green-400 border-green-500/30" 
                      : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                  }`}
                >
                  {configured ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {provider.name}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10">
          {providers.map(provider => (
            <TabsTrigger 
              key={provider.id}
              value={provider.id} 
              className="data-[state=active]:bg-cyan-500/20"
            >
              <Cloud className="w-4 h-4 mr-2" />
              {provider.id.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>

        {providers.map(provider => {
          const configured = getConfiguredProvider(provider.id);
          
          return (
            <TabsContent key={provider.id} value={provider.id} className="space-y-4">
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${provider.color} flex items-center justify-center`}>
                      <Cloud className="w-4 h-4 text-white" />
                    </div>
                    {provider.name} Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {configured && (
                    <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/30 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-medium">
                            Credentials Configured
                          </span>
                        </div>
                        <Button
                          onClick={() => handleDeleteCredentials(configured.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                      <p className="text-green-300 text-sm mt-2">
                        Configured on {configured.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {provider.fields.map(field => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key} className="text-white flex items-center gap-2">
                          {field.label}
                          {field.required && <span className="text-red-400">*</span>}
                          {field.secret && <Key className="w-3 h-3 text-gray-400" />}
                        </Label>
                        
                        <div className="relative">
                          {field.type === "textarea" ? (
                            <textarea
                              id={field.key}
                              placeholder={field.default || `Enter ${field.label.toLowerCase()}`}
                              value={formData[provider.id]?.[field.key] || ""}
                              onChange={(e) => handleInputChange(provider.id, field.key, e.target.value)}
                              className="w-full min-h-[100px] bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 rounded-md p-3 resize-vertical"
                            />
                          ) : (
                            <Input
                              id={field.key}
                              type={field.secret && !showSecrets[`${provider.id}-${field.key}`] ? "password" : "text"}
                              placeholder={field.default || `Enter ${field.label.toLowerCase()}`}
                              value={formData[provider.id]?.[field.key] || ""}
                              onChange={(e) => handleInputChange(provider.id, field.key, e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
                            />
                          )}
                          
                          {field.secret && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                              onClick={() => toggleSecretVisibility(`${provider.id}-${field.key}`)}
                            >
                              {showSecrets[`${provider.id}-${field.key}`] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-white/10" />

                  <Button
                    onClick={() => handleSaveCredentials(provider.id)}
                    className="w-full glass-button bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 hover:neon-glow"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {configured ? "Update Credentials" : "Save Credentials"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default CloudProviderConfig;
