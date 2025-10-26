"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import Navbar from "@/components/Navbar";
import DashboardStats from "@/components/DashboardStats";
import LeadForm from "@/components/LeadForm";
import LeadTable from "@/components/LeadTable";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const { setLeads, setIsLoading } = useStore();

  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/leads");
        const data = await response.json();

        if (data.success) {
          setLeads(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch leads:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, [setLeads, setIsLoading]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage and track your leads</p>
          </div>

          <div className="space-y-8">
            <DashboardStats />

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <LeadTable />
              </div>
              <div>
                <LeadForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
