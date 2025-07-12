"use client";

import React, { useState } from "react";
import { WizardData } from "../InfraWizard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, ArrowRight } from "lucide-react";

interface Props {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  nextStep: () => void;
}

const CloudProviderStep: React.FC<Props> = ({ data, updateData, nextStep }) => {
  const [error, setError] = useState("");

  const providers = [
    {
      id: "GCP",
      name: "Google Cloud Platform",
      description: "Scalable and secure cloud computing services",
      color: "from-blue-500 to-green-500",
      bgImage: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400",
      accent: "border-blue-500/50 shadow-blue-500/20",
    },
    {
      id: "AWS",
      name: "Amazon Web Services",
      description: "Comprehensive cloud computing platform",
      color: "from-orange-500 to-yellow-500",
      bgImage: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400",
      accent: "border-orange-500/50 shadow-orange-500/20",
    },
    {
      id: "Azure",
      name: "Microsoft Azure",
      description: "Intelligent cloud and edge platform",
      color: "from-blue-600 to-cyan-500",
      bgImage: "https://images.pexels.com/photos/1643385/pexels-photo-1643385.jpeg?auto=compress&cs=tinysrgb&w=400",
      accent: "border-cyan-500/50 shadow-cyan-500/20",
    },
  ];

  const handleNext = () => {
    if (!data.projectName.trim()) {
      setError("Please enter a project name.");
      return;
    }
    if (!data.cloudProvider) {
      setError("Please select a cloud provider.");
      return;
    }
    setError("");
    nextStep();
  };

  const handleProviderSelect = (providerId: string) => {
    updateData({ cloudProvider: providerId });
    setError("");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Cloud className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-white mb-2">
          Choose Your Cloud Platform
        </h3>
        <p className="text-gray-400">
          Select the cloud provider where you want to deploy your infrastructure
        </p>
      </div>

      {/* Project Name Input */}
      <div className="space-y-2">
        <Label htmlFor="projectName" className="text-white">
          Project Name *
        </Label>
        <Input
          id="projectName"
          type="text"
          placeholder="Enter a name for your infrastructure project"
          value={data.projectName}
          onChange={(e) => updateData({ projectName: e.target.value })}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
        />
      </div>

      {/* Cloud Provider Selection */}
      <div className="space-y-4">
        <div className="grid gap-4">
          {providers.map((provider) => (
            <Card
              key={provider.id}
              className={`cursor-pointer transition-all duration-300 overflow-hidden group ${
                data.cloudProvider === provider.id
                  ? `glass-card border-cyan-400 shadow-lg shadow-cyan-400/20 ${provider.accent}`
                  : "glass-card border-white/20 hover:border-white/40 hover:scale-[1.02]"
              }`}
              onClick={() => handleProviderSelect(provider.id)}
            >
              <div className="relative">
                <div 
                  className="absolute inset-0 opacity-10 bg-cover bg-center transition-opacity duration-300 group-hover:opacity-20"
                  style={{ backgroundImage: `url(${provider.bgImage})` }}
                />
                <CardContent className="relative p-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${provider.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <Cloud className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors">
                        {provider.name}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">{provider.description}</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                        data.cloudProvider === provider.id
                          ? "border-cyan-400 bg-cyan-400 shadow-lg shadow-cyan-400/50"
                          : "border-gray-400 group-hover:border-cyan-300"
                      }`}
                    >
                      {data.cloudProvider === provider.id && (
                        <div className="w-full h-full rounded-full bg-cyan-400 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-end">
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

export default CloudProviderStep;
