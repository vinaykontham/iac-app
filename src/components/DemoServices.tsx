"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Server, 
  Database, 
  Container, 
  Globe, 
  Shield, 
  Zap,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  HardDrive,
  Network,
  Eye,
  X
} from "lucide-react";

interface DemoService {
  id: string;
  name: string;
  type: string;
  status: "running" | "stopped" | "pending" | "error";
  provider: string;
  region: string;
  cost: string;
  specs: { [key: string]: string };
  icon: React.ComponentType<any>;
  color: string;
}

interface DemoServicesProps {
  isVisible: boolean;
  onClose: () => void;
  cloudProvider: string;
  projectName: string;
}

const DemoServices: React.FC<DemoServicesProps> = ({ 
  isVisible, 
  onClose, 
  cloudProvider, 
  projectName 
}) => {
  const [services, setServices] = useState<DemoService[]>([]);
  const [loading, setLoading] = useState(false);

  const generateDemoServices = (provider: string, project: string): DemoService[] => {
    const baseServices = {
      gcp: [
        {
          id: `${project}-web-server`,
          name: `${project}-web-server`,
          type: "Compute Engine",
          status: "running" as const,
          provider: "Google Cloud Platform",
          region: "us-central1-a",
          cost: "$24.67/month",
          specs: {
            "Machine Type": "e2-medium",
            "vCPUs": "1",
            "Memory": "4 GB",
            "Disk": "20 GB SSD",
            "Network": "10 Gbps"
          },
          icon: Server,
          color: "from-blue-500 to-green-500"
        },
        {
          id: `${project}-database`,
          name: `${project}-postgres-db`,
          type: "Cloud SQL",
          status: "running" as const,
          provider: "Google Cloud Platform",
          region: "us-central1",
          cost: "$45.30/month",
          specs: {
            "Engine": "PostgreSQL 13",
            "Instance Class": "db-f1-micro",
            "Storage": "100 GB SSD",
            "Connections": "100 max",
            "Backup": "Automated"
          },
          icon: Database,
          color: "from-green-500 to-teal-500"
        },
        {
          id: `${project}-k8s-cluster`,
          name: `${project}-gke-cluster`,
          type: "Google Kubernetes Engine",
          status: "running" as const,
          provider: "Google Cloud Platform",
          region: "us-central1",
          cost: "$73.00/month",
          specs: {
            "Nodes": "3",
            "Machine Type": "e2-medium",
            "Kubernetes": "v1.27.3",
            "Auto Scaling": "Enabled",
            "Load Balancer": "Included"
          },
          icon: Container,
          color: "from-purple-500 to-pink-500"
        }
      ],
      aws: [
        {
          id: `${project}-ec2-instance`,
          name: `${project}-web-server`,
          type: "EC2 Instance",
          status: "running" as const,
          provider: "Amazon Web Services",
          region: "us-east-1",
          cost: "$29.90/month",
          specs: {
            "Instance Type": "t3.medium",
            "vCPUs": "2",
            "Memory": "4 GB",
            "Storage": "20 GB EBS",
            "Network": "Up to 5 Gbps"
          },
          icon: Server,
          color: "from-orange-500 to-yellow-500"
        },
        {
          id: `${project}-rds-database`,
          name: `${project}-mysql-db`,
          type: "RDS Database",
          status: "running" as const,
          provider: "Amazon Web Services",
          region: "us-east-1",
          cost: "$52.20/month",
          specs: {
            "Engine": "MySQL 8.0",
            "Instance Class": "db.t3.micro",
            "Storage": "100 GB GP2",
            "Multi-AZ": "Enabled",
            "Backup": "7 days retention"
          },
          icon: Database,
          color: "from-green-500 to-teal-500"
        },
        {
          id: `${project}-eks-cluster`,
          name: `${project}-eks-cluster`,
          type: "EKS Cluster",
          status: "running" as const,
          provider: "Amazon Web Services",
          region: "us-east-1",
          cost: "$85.50/month",
          specs: {
            "Nodes": "3",
            "Instance Type": "t3.medium",
            "Kubernetes": "v1.27",
            "Auto Scaling": "Enabled",
            "Fargate": "Available"
          },
          icon: Container,
          color: "from-purple-500 to-pink-500"
        }
      ],
      azure: [
        {
          id: `${project}-vm`,
          name: `${project}-web-vm`,
          type: "Virtual Machine",
          status: "running" as const,
          provider: "Microsoft Azure",
          region: "East US",
          cost: "$31.15/month",
          specs: {
            "Size": "Standard_B2s",
            "vCPUs": "2",
            "Memory": "4 GB",
            "Storage": "30 GB Premium SSD",
            "Network": "Accelerated"
          },
          icon: Server,
          color: "from-blue-600 to-cyan-500"
        },
        {
          id: `${project}-cosmosdb`,
          name: `${project}-cosmos-db`,
          type: "Cosmos DB",
          status: "running" as const,
          provider: "Microsoft Azure",
          region: "East US",
          cost: "$48.75/month",
          specs: {
            "API": "SQL (Core)",
            "Consistency": "Session",
            "Throughput": "400 RU/s",
            "Storage": "Unlimited",
            "Global Distribution": "Available"
          },
          icon: Database,
          color: "from-green-500 to-teal-500"
        },
        {
          id: `${project}-aks-cluster`,
          name: `${project}-aks-cluster`,
          type: "AKS Cluster",
          status: "running" as const,
          provider: "Microsoft Azure",
          region: "East US",
          cost: "$78.90/month",
          specs: {
            "Nodes": "3",
            "VM Size": "Standard_DS2_v2",
            "Kubernetes": "v1.27.1",
            "Auto Scaling": "Enabled",
            "Azure CNI": "Enabled"
          },
          icon: Container,
          color: "from-purple-500 to-pink-500"
        }
      ]
    };

    return baseServices[provider as keyof typeof baseServices] || [];
  };

  useEffect(() => {
    if (isVisible && cloudProvider && projectName) {
      setLoading(true);
      // Simulate loading time
      setTimeout(() => {
        const demoServices = generateDemoServices(cloudProvider, projectName);
        setServices(demoServices);
        setLoading(false);
      }, 1500);
    }
  }, [isVisible, cloudProvider, projectName]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      running: "bg-green-500/20 text-green-400 border-green-500/30",
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      error: "bg-red-500/20 text-red-400 border-red-500/30",
      stopped: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };

    return (
      <Badge className={`${variants[status as keyof typeof variants]} flex items-center gap-1`}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const totalCost = services.reduce((sum, service) => {
    const cost = parseFloat(service.cost.replace(/[^0-9.]/g, ''));
    return sum + cost;
  }, 0);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="sticky top-0 bg-black/40 backdrop-blur-sm p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Dry Run Preview - {projectName}
                </h2>
                <p className="text-gray-400 text-sm">
                  Preview of resources that would be created on {cloudProvider.toUpperCase()}
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-white">Analyzing infrastructure plan...</p>
              <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Infrastructure Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cyan-400">{services.length}</p>
                      <p className="text-gray-400 text-sm">Resources</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">${totalCost.toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">Est. Monthly Cost</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-400">{cloudProvider.toUpperCase()}</p>
                      <p className="text-gray-400 text-sm">Cloud Provider</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Resources to be Created</h3>
                {services.map((service) => {
                  const IconComponent = service.icon;
                  return (
                    <Card key={service.id} className="glass-card border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-white text-lg">{service.name}</h4>
                              {getStatusBadge(service.status)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-400">Service Type</p>
                                <p className="text-white font-medium">{service.type}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Region</p>
                                <p className="text-white font-medium">{service.region}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Provider</p>
                                <p className="text-white font-medium">{service.provider}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Estimated Cost</p>
                                <p className="text-green-400 font-medium">{service.cost}</p>
                              </div>
                            </div>

                            <Separator className="bg-white/10 mb-4" />

                            <div>
                              <p className="text-sm text-gray-400 mb-2">Specifications</p>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {Object.entries(service.specs).map(([key, value]) => (
                                  <div key={key} className="bg-white/5 rounded-lg p-3">
                                    <p className="text-xs text-gray-400">{key}</p>
                                    <p className="text-white text-sm font-medium">{value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-500/30">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-400 font-medium">Dry Run Complete</p>
                    <p className="text-blue-300 text-sm mt-1">
                      This is a preview of the resources that would be created. No actual cloud resources have been provisioned. 
                      To deploy these resources, disable dry run mode and run the deployment.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoServices;
