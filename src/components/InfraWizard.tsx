"use client";

import React, { useState } from "react";
import CloudProviderStep from "./InfraWizard/CloudProviderStep";
import ServiceSelectionStep from "./InfraWizard/ServiceSelectionStep";
import VariableInputStep from "./InfraWizard/VariableInputStep";
import ReviewDeployStep from "./InfraWizard/ReviewDeployStep";
import { Progress } from "@/components/ui/progress";

export interface WizardData {
  projectName: string;
  cloudProvider: string;
  service: string;
  variables: Record<string, string>;
  customConfig?: string;
  dryRun: boolean;
}

const InfraWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardData>({
    projectName: "",
    cloudProvider: "",
    service: "",
    variables: {},
    dryRun: false,
  });

  const updateData = (data: Partial<WizardData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const steps = [
    { number: 1, title: "Cloud Provider", description: "Select your cloud platform" },
    { number: 2, title: "Service Selection", description: "Choose infrastructure services" },
    { number: 3, title: "Configuration", description: "Set variables and options" },
    { number: 4, title: "Review & Deploy", description: "Review and deploy infrastructure" },
  ];

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            Step {currentStep} of 4: {steps[currentStep - 1].title}
          </h2>
          <span className="text-sm text-gray-400">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        
        <Progress value={progressPercentage} className="h-2 bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </Progress>

        <p className="text-gray-400 text-sm">
          {steps[currentStep - 1].description}
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`flex items-center space-x-2 ${
              step.number <= currentStep ? "text-cyan-400" : "text-gray-500"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.number < currentStep
                  ? "bg-cyan-500 text-white"
                  : step.number === currentStep
                  ? "bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400"
                  : "bg-gray-500/20 border-2 border-gray-500 text-gray-500"
              }`}
            >
              {step.number}
            </div>
            <span className="text-sm font-medium hidden sm:block">
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <CloudProviderStep 
            data={formData} 
            updateData={updateData} 
            nextStep={nextStep} 
          />
        )}
        {currentStep === 2 && (
          <ServiceSelectionStep 
            data={formData} 
            updateData={updateData} 
            nextStep={nextStep} 
            prevStep={prevStep} 
          />
        )}
        {currentStep === 3 && (
          <VariableInputStep 
            data={formData} 
            updateData={updateData} 
            nextStep={nextStep} 
            prevStep={prevStep} 
          />
        )}
        {currentStep === 4 && (
          <ReviewDeployStep 
            data={formData} 
            prevStep={prevStep} 
          />
        )}
      </div>
    </div>
  );
};

export default InfraWizard;
