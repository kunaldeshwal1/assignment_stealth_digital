"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Pencil, Trash2, Sparkles, Mail, X, Check } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Lead } from "@/types";

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
  const [editForm, setEditForm] = useState<{
    name: string;
    email: string;
    status: "new" | "contacted" | "qualified" | "lost";
  }>({
    name: "",
    email: "",
    status: "new",
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
        updateLead(id, editForm);
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
      const response = await fetch(`/api/leads/${id}`, { method: "DELETE" });
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
        const message = data.data.message;
        // Update in DB & Zustand
        await fetch(`/api/leads/${lead._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aiMessage: message }),
        });
        updateLead(lead._id, { aiMessage: message });
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
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <CardTitle className="text-xl sm:text-2xl">Leads</CardTitle>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="p-0 sm:p-6">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-sm">Name</th>
                <th className="text-left p-3 font-medium text-sm">Email</th>
                <th className="text-left p-3 font-medium text-sm">Status</th>
                <th className="text-left p-3 font-medium text-sm">Created</th>
                <th className="text-left p-3 font-medium text-sm">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
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
                          className="h-9"
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
                          className="h-9"
                        />
                      ) : (
                        <div className="text-gray-600 text-sm break-all">
                          {lead.email}
                        </div>
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
                                | "lost",
                            })
                          }
                          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
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

                    <td className="p-3 align-top">
                      <div className="flex gap-2 flex-wrap">
                        {editingId === lead._id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleSave(lead._id)}
                              className="h-8"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingId(null)}
                              className="h-8"
                            >
                              <X className="h-4 w-4 mr-1" />
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
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAISuggest(lead)}
                              disabled={loadingAI === lead._id}
                              title="Generate AI message"
                              className="h-8 w-8 p-0"
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
                              className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                              title="Delete lead"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>

                      {/* AI message display */}
                      {lead.aiMessage && (
                        <div className="mt-3 rounded-md border bg-muted/40 p-3 text-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-700 flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              AI Follow‑up
                            </span>
                            <div className="flex gap-2">
                              <button
                                className="text-xs text-blue-600 hover:underline"
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    lead.aiMessage || ""
                                  )
                                }
                              >
                                Copy
                              </button>
                              <button
                                className="text-xs text-green-600 hover:underline flex items-center gap-1"
                                onClick={() =>
                                  window.open(
                                    `mailto:${
                                      lead.email
                                    }?subject=Follow-up&body=${encodeURIComponent(
                                      lead.aiMessage || ""
                                    )}`,
                                    "_blank"
                                  )
                                }
                              >
                                <Mail className="h-3 w-3" /> Email
                              </button>
                            </div>
                          </div>
                          <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {lead.aiMessage}
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3 p-4">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchQuery || statusFilter !== "all"
                ? "No leads found matching your filters"
                : "No leads yet. Add your first lead!"}
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <Card key={lead._id} className="overflow-hidden">
                <CardContent className="p-4">
                  {editingId === lead._id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">
                          Name
                        </label>
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">
                          Email
                        </label>
                        <Input
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700 block mb-1">
                          Status
                        </label>
                        <select
                          value={editForm.status}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              status: e.target.value as
                                | "new"
                                | "contacted"
                                | "qualified"
                                | "lost",
                            })
                          }
                          className="h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="lost">Lost</option>
                        </select>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(lead._id)}
                          className="flex-1"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="font-semibold text-base truncate">
                            {lead.name}
                          </h3>
                          <p className="text-sm text-gray-600 break-all">
                            {lead.email}
                          </p>
                        </div>
                        <Badge
                          className={`${getStatusColor(
                            lead.status
                          )} whitespace-nowrap`}
                        >
                          {lead.status}
                        </Badge>
                      </div>

                      <p className="text-xs text-gray-500 mb-3">
                        Created: {formatDate(lead.createdAt)}
                      </p>

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(lead)}
                          className="flex-1 min-w-[80px]"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAISuggest(lead)}
                          disabled={loadingAI === lead._id}
                          className="flex-1 min-w-[80px]"
                        >
                          {loadingAI === lead._id ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mr-1" />
                          ) : (
                            <Sparkles className="h-3 w-3 mr-1" />
                          )}
                          AI Msg
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(lead._id)}
                          className="text-red-600 hover:text-red-700 min-w-[80px]"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>

                      {/* Mobile AI message display */}
                      {lead.aiMessage && (
                        <div className="mt-3 rounded-md border bg-muted/40 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-700 text-sm flex items-center gap-1">
                              <Sparkles className="h-3 w-3" />
                              AI Follow‑up
                            </span>
                            <div className="flex gap-2">
                              <button
                                className="text-xs text-blue-600 hover:underline"
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    lead.aiMessage || ""
                                  )
                                }
                              >
                                Copy
                              </button>
                              <button
                                className="text-xs text-green-600 hover:underline flex items-center gap-1"
                                onClick={() =>
                                  window.open(
                                    `mailto:${
                                      lead.email
                                    }?subject=Follow-up&body=${encodeURIComponent(
                                      lead.aiMessage || ""
                                    )}`,
                                    "_blank"
                                  )
                                }
                              >
                                <Mail className="h-3 w-3" /> Email
                              </button>
                            </div>
                          </div>
                          <p className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                            {lead.aiMessage}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
