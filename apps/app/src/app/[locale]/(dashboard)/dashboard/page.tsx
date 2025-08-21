import { ProtectedRoute } from "@/components/auth";
import { Navbar } from "@/components/layout/navbar";
import { useGetCurrentUser } from "@/lib/trpc";
import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { formatDate } from "@v1/utils";
import { Calendar, Mail, Settings, User } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <DashboardContent />
      </div>
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { data: userData, isLoading } = useGetCurrentUser();
  const user = userData?.user;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back!</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/profile">
                <Settings className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
            <CardDescription>
              Your account details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Member since:</span>
              <span className="font-medium">
                {formatDate(user?.created_at)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">User ID:</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {user?.id}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Posts</CardTitle>
              <CardDescription>Manage your blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Posts
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organizations</CardTitle>
              <CardDescription>Manage your organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Organizations
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Account and app settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Open Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
