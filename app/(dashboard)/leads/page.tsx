"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import Navbar from "@/components/Navbar";
import LeadTable from "@/components/LeadTable";
import LeadForm from "@/components/LeadForm";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function LeadsPage() {
  const { leads, setLeads, setIsLoading } = useStore();

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

  const handleExport = () => {
    const csvContent = [
      ["Name", "Email", "Status", "Created At"],
      ...leads.map((lead) => [
        lead.name,
        lead.email,
        lead.status,
        new Date(lead.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Leads</h1>
              <p className="text-gray-600 mt-1">{leads.length} total leads</p>
            </div>
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <LeadTable />
            </div>
            <div>
              <LeadForm />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
