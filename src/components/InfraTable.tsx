"use client";

import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { firestore, isDemoMode } from "@/lib/firebase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

interface InfraRecord {
  id: string;
  projectName: string;
  cloudProvider: string;
  service: string;
  status: "pending" | "running" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

interface InfraTableProps {
  userId: string;
}

const InfraTable: React.FC<InfraTableProps> = ({ userId }) => {
  const [records, setRecords] = useState<InfraRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        if (isDemoMode) {
          // Demo data
          const demoRecords: InfraRecord[] = [
            {
              id: "demo-1",
              projectName: "Demo Web App",
              cloudProvider: "GCP",
              service: "compute-engine",
              status: "completed",
              createdAt: new Date(Date.now() - 86400000), // 1 day ago
              updatedAt: new Date(Date.now() - 86400000),
            },
            {
              id: "demo-2",
              projectName: "Demo Database",
              cloudProvider: "AWS",
              service: "rds",
              status: "running",
              createdAt: new Date(Date.now() - 172800000), // 2 days ago
              updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
            },
            {
              id: "demo-3",
              projectName: "Demo Kubernetes Cluster",
              cloudProvider: "Azure",
              service: "aks",
              status: "failed",
              createdAt: new Date(Date.now() - 259200000), // 3 days ago
              updatedAt: new Date(Date.now() - 259200000),
            },
          ];
          
          // Simulate loading delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          setRecords(demoRecords);
        } else {
          if (!firestore) {
            setError("Database connection not available.");
            return;
          }
          
          const infraRef = collection(firestore, "infrastructure");
          const q = query(
            infraRef, 
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
          );
          const snapshot = await getDocs(q);
          const infraRecords: InfraRecord[] = [];
          
          snapshot.forEach((doc) => {
            const data = doc.data();
            infraRecords.push({
              id: doc.id,
              projectName: data.projectName || "Unnamed Project",
              cloudProvider: data.cloudProvider || "Unknown",
              service: data.service || "Unknown",
              status: data.status || "pending",
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            });
          });
          
          setRecords(infraRecords);
        }
      } catch (err) {
        console.error("Error fetching infrastructure records:", err);
        setError("Failed to load infrastructure records.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRecords();
    }
  }, [userId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "running":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-500/20 text-green-400 border-green-500/30",
      running: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      failed: "bg-red-500/20 text-red-400 border-red-500/30",
      pending: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };

    return (
      <Badge className={`${variants[status as keyof typeof variants]} flex items-center gap-1`}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-12 w-full bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No Infrastructure Yet</h3>
        <p className="text-gray-400 mb-4">
          You haven't created any infrastructure deployments yet.
        </p>
        <p className="text-sm text-gray-500">
          Click "Create New Infrastructure" to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-gray-300">Project Name</TableHead>
            <TableHead className="text-gray-300">Cloud Provider</TableHead>
            <TableHead className="text-gray-300">Service</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Created</TableHead>
            <TableHead className="text-gray-300">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow 
              key={record.id} 
              className="border-white/10 hover:bg-white/5 transition-colors"
            >
              <TableCell className="font-medium text-white">
                {record.projectName}
              </TableCell>
              <TableCell className="text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                    {record.cloudProvider.charAt(0)}
                  </div>
                  {record.cloudProvider}
                </div>
              </TableCell>
              <TableCell className="text-gray-300">{record.service}</TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
              <TableCell className="text-gray-400">
                {record.createdAt.toLocaleDateString()}
              </TableCell>
              <TableCell className="text-gray-400">
                {record.updatedAt.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InfraTable;
