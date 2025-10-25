"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface LeadFormProps {
  onSuccess?: () => void;
}

export default function LeadForm({ onSuccess }: LeadFormProps) {
  const { addLead } = useStore();

  // FIX: Properly type the status field
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    status: "new" | "contacted" | "qualified" | "lost";
  }>({
    name: "",
    email: "",
    status: "new",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      onSuccess?.();
    } catch (err) {
      setError("Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

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
        alert(`AI Suggestion:\n\n${data.data.message}`);
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

          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
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

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as
                    | "new"
                    | "contacted"
                    | "qualified"
                    | "lost", // Type assertion
                })
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>
          </div>

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
