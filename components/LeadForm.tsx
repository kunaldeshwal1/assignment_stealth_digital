"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, X } from "lucide-react";

interface LeadFormProps {
  onSuccess?: () => void;
}

export default function LeadForm({ onSuccess }: LeadFormProps) {
  const { addLead } = useStore();

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    status: "new" | "contacted" | "qualified" | "lost";
    aiMessage?: string;
  }>({
    name: "",
    email: "",
    status: "new",
  });

  const [aiSuggested, setAiSuggested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle new lead submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      addLead(data.data);
      setFormData({ name: "", email: "", status: "new" });
      setAiSuggested(false);
      onSuccess?.();
    } catch (err) {
      console.error("Lead creation error:", err);
      setError("Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  // AI suggestion fetch
  const handleAISuggest = async () => {
    if (!formData.name || !formData.email) {
      setError("Please fill in name and email first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/suggest-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        const message = data.data.message;
        // Display text area for the user to edit message
        setFormData({ ...formData, aiMessage: message });
        setAiSuggested(true);
      } else {
        setError(data.message || "Failed to generate AI suggestion");
      }
    } catch (err) {
      console.error("AI suggestion error:", err);
      setError("Failed to generate AI suggestion");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAISuggestion = () => {
    setAiSuggested(false);
    setFormData({ ...formData, aiMessage: undefined });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Lead</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {/* Name field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john@example.com"
              required
              disabled={loading}
            />
          </div>

          {/* Status dropdown */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as
                    | "new"
                    | "contacted"
                    | "qualified"
                    | "lost",
                })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              disabled={loading}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {/* AI Follow-up suggestion field */}
          {aiSuggested && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="aiMessage"
                  className="block text-sm font-medium"
                >
                  AI Follow‑up Message
                </label>
                <button
                  type="button"
                  onClick={handleRemoveAISuggestion}
                  className="text-xs text-red-500 hover:underline flex items-center"
                >
                  <X className="h-3 w-3 mr-1" />
                  Remove
                </button>
              </div>
              <Textarea
                id="aiMessage"
                value={formData.aiMessage || ""}
                onChange={(e) =>
                  setFormData({ ...formData, aiMessage: e.target.value })
                }
                rows={4}
                className="text-sm"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Add Lead"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleAISuggest}
              disabled={loading}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Suggest
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
