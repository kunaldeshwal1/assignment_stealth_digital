import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, BarChart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold text-primary">
            Lead Tracker
          </div>
          <div className="flex gap-2 sm:gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="sm:size-default">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="sm:size-default">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            AI-Enhanced Lead Management
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            Track, manage, and nurture your leads with AI-powered insights.
            Built for modern sales teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="text-base sm:text-lg w-full sm:w-auto"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg w-full sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 md:mt-20 max-w-5xl mx-auto px-4">
          {/* Feature 1 */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">
              AI-Powered
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Get intelligent follow-up suggestions powered by advanced AI
              models
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">
              Secure
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Enterprise-grade security with JWT authentication
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="bg-purple-100 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center mb-4">
              <BarChart className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">
              Analytics
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Track your pipeline with real-time dashboard insights
            </p>
          </div>
        </div>
      </main>

      {/* Footer Section (Optional) */}
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12 sm:mt-16">
        <div className="text-center text-gray-600 text-sm">
          <p>© 2024 Lead Tracker. Built with Next.js & MongoDB.</p>
        </div>
      </footer>
    </div>
  );
}
