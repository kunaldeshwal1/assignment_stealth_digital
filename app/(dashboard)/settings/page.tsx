"use client";

import { useStore } from "@/store/useStore";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function SettingsPage() {
  const { user } = useStore();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">
              View your account information and preferences
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      {user?.name || "Not set"}
                    </p>
                  </div>
                  <User className="h-5 w-5 text-gray-400" />
                </div>

                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      {user?.email || "Not set"}
                    </p>
                  </div>
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>

                <div className="flex justify-between items-center py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">User ID</p>
                    <p className="text-base font-mono text-gray-700 mt-1 text-sm">
                      {user?._id || "N/A"}
                    </p>
                  </div>
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your account details and status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      {user?.role || "User"}
                    </p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {user?.role || "User"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Account Status
                    </p>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      Active
                    </p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Active
                  </span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Member Since
                    </p>
                    <p className="text-base font-semibold text-gray-900 mt-1">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                    </p>
                  </div>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
