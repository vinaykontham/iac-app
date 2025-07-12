 "use client";

import React, { useState } from "react";
import { WizardData } from "../InfraWizard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Server, Database, Container } from "lucide-react";

interface Props {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const services = {
  GCP: [
    {
      id: "compute-engine",
      name: "Compute Engine",
      description: "Scalable virtual machines running in Google's data centers",
      icon: Server,
      category: "Compute",
    },
    {
      id: "gke",
      name: "Google Kubernetes Engine",
      description: "Managed Kubernetes service for containerized applications",
      icon: Container,
      category: "Container",
    },
    {
      id: "cloud-sql",
      name: "Cloud SQL",
      description: "Fully managed relational database service",
      icon: Database,
      category: "Database",
    },
  ],
  AWS: [
    {
      id: "ec2",
      name: "Amazon EC2",
      description: "Secure and resizable compute capacity in the cloud",
      icon: Server,
      category: "Compute",
    },
    {
      id: "eks",
      name: "Amazon EKS",
      description: "Managed Kubernetes service",
      icon: Container,
      category: "Container",
    },
    {
      id: "rds",
      name: "Amazon RDS",
      description: "Managed relational database service",
      icon: Database,
      category: "Database",
    },
  ],
  Azure: [
    {
      id: "virtual-machines",
      name: "Virtual Machines",
      description: "On-demand, scalable computing resources",
      icon: Server,
      category: "Compute",
    },
    {
      id: "aks",
      name: "Azure Kubernetes Service",
      description: "Managed Kubernetes service",
      icon: Container,
      category: "Container",
    },
    {
      id: "cosmos-db",
      name: "Azure Cosmos DB",
      description: "Globally distributed, multi-model database service",
      icon: Database,
      category: "Database",
    },
  ],
};

const ServiceSelectionStep: React.FC<Props> = ({ data, updateData, nextStep, prevStep }) => {
  const [error, setError] = useState("");
  const availableServices = services[data.cloudProvider as keyof typeof services] || [];

  const handleNext = () => {
    if (!data.service) {
      setError("Please select a service.");
      return;
    }
    setError("");
    nextStep();
  };

  const handleServiceSelect = (serviceId: string) => {
    updateData({ service: serviceId });
    setError("");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Compute":
        return "from-blue-500 to-purple-500";
      case "Container":
        return "from-green-500 to-teal-500";
      case "Database":
        return "from-orange-500 to-red-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getCategoryAccent = (category: string) => {
    switch (category) {
      case "Compute":
        return "border-blue-500/50 shadow-blue-500/20";
      case "Container":
        return "border-green-500/50 shadow-green-500/20";
      case "Database":
        return "border-orange-500/50 shadow-orange-500/20";
      default:
        return "border-gray-500/50 shadow-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-4">
          <Server className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">
          Select Infrastructure Service
        </h3>
        <p className="text-gray-400">
          Choose the {data.cloudProvider} service you want to deploy
        </p>
      </div>

      {/* Service Selection */}
      <div className="space-y-4">
        <div className="grid gap-4">
          {availableServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all duration-300 group hover:scale-[1.02] ${
                  data.service === service.id
                    ? `glass-card border-cyan-400 shadow-lg shadow-cyan-400/20 ${getCategoryAccent(service.category)}`
                    : "glass-card border-white/20 hover:border-white/40"
                }`}
                onClick={() => handleServiceSelect(service.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${getCategoryColor(
                        service.category
                      )} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors">
                          {service.name}
                        </h4>
                        <span className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-white/10 to-white/5 text-gray-300 border border-white/10">
                          {service.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{service.description}</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                        data.service === service.id
                          ? "border-cyan-400 bg-cyan-400 shadow-lg shadow-cyan-400/50"
                          : "border-gray-400 group-hover:border-cyan-300"
                      }`}
                    >
                      {data.service === service.id && (
                        <div className="w-full h-full rounded-full bg-cyan-400 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

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

export default ServiceSelectionStep;
