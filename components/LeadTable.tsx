"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Pencil, Trash2, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Lead } from "@/types"; // Add this import

export default function LeadTable() {
  const {
    leads,
    updateLead,
    deleteLead,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  } = useStore();

  const [editingId, setEditingId] = useState<string | null>(null);

  // FIX: Use the proper type for status
  const [editForm, setEditForm] = useState<{
    name: string;
    email: string;
    status: "new" | "contacted" | "qualified" | "lost";
  }>({
    name: "",
    email: "",
    status: "new", // Give it a default value
  });

  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  // Filter leads based on search and status
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (lead: Lead) => {
    // Use Lead type instead of any
    setEditingId(lead._id);
    setEditForm({
      name: lead.name,
      email: lead.email,
      status: lead.status,
    });
  };

  const handleSave = async (id: string) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();
      if (data.success) {
        updateLead(id, editForm); // This will now work correctly
        setEditingId(null);
      } else {
        alert(data.message || "Failed to update lead");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update lead");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        deleteLead(id);
      } else {
        alert(data.message || "Failed to delete lead");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete lead");
    }
  };

  const handleAISuggest = async (lead: Lead) => {
    // Use Lead type instead of any
    setLoadingAI(lead._id);
    try {
      const response = await fetch("/api/ai/suggest-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          status: lead.status,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`AI Follow-up Message:\n\n${data.data.message}`);

        // Optionally save the message to the lead
        await fetch(`/api/leads/${lead._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aiMessage: data.data.message }),
        });

        updateLead(lead._id, { aiMessage: data.data.message });
      } else {
        alert(data.message || "Failed to generate AI message");
      }
    } catch (error) {
      console.error("AI suggestion error:", error);
      alert("Failed to generate AI message");
    } finally {
      setLoadingAI(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "qualified":
        return "bg-green-100 text-green-800";
      case "lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Created</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    {searchQuery || statusFilter !== "all"
                      ? "No leads found matching your filters"
                      : "No leads yet. Add your first lead!"}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {editingId === lead._id ? (
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="h-8"
                        />
                      ) : (
                        <div className="font-medium">{lead.name}</div>
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === lead._id ? (
                        <Input
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          className="h-8"
                        />
                      ) : (
                        <div className="text-gray-600">{lead.email}</div>
                      )}
                    </td>
                    <td className="p-3">
                      {editingId === lead._id ? (
                        <select
                          value={editForm.status}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              status: e.target.value as
                                | "new"
                                | "contacted"
                                | "qualified"
                                | "lost", // Type assertion
                            })
                          }
                          className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="lost">Lost</option>
                        </select>
                      ) : (
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        {editingId === lead._id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleSave(lead._id)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(lead)}
                              title="Edit lead"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAISuggest(lead)}
                              disabled={loadingAI === lead._id}
                              title="Generate AI message"
                            >
                              {loadingAI === lead._id ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                              ) : (
                                <Sparkles className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(lead._id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete lead"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile-friendly card view for small screens */}
        <div className="md:hidden mt-4 space-y-4">
          {filteredLeads.map((lead) => (
            <Card key={lead._id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{lead.name}</h3>
                    <p className="text-sm text-gray-600">{lead.email}</p>
                  </div>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Created: {formatDate(lead.createdAt)}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(lead)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAISuggest(lead)}
                    disabled={loadingAI === lead._id}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(lead._id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
