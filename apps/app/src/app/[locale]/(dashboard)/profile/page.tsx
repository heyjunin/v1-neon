import { LogoutButton, ProtectedRoute } from "@/components/auth";
import {
  ChangePasswordForm,
  DeleteAccountForm,
  ProfileForm,
} from "@/components/profile";
import { useGetCurrentUser } from "@/lib/trpc";
import { Avatar, AvatarFallback, AvatarImage } from "@v1/ui/avatar";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@v1/ui/tabs";
import { formatDate } from "@v1/utils";
import {
  Calendar,
  FileText,
  Globe,
  Mail,
  MapPin,
  Settings,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Profile Settings",
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userMetadata = user?.user_metadata || {};
  const fullName = userMetadata.full_name || "Not set";
  const avatarUrl = userMetadata.avatar_url || "";
  const bio = userMetadata.bio || "No bio provided";
  const website = userMetadata.website || "";
  const location = userMetadata.location || "Not set";

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Profile Settings
            </h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>
          <LogoutButton />
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback className="text-2xl">
                  {getInitials(fullName || user?.email || "U")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{fullName}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Email verified
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {user?.email_confirmed_at ? "Verified" : "Pending"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Member since</span>
                    <span className="text-sm font-medium">
                      {formatDate(user?.created_at)}
                    </span>
                  </div>

                  {website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Website</span>
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {website}
                      </a>
                    </div>
                  )}

                  {location !== "Not set" && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Location</span>
                      <span className="text-sm font-medium">{location}</span>
                    </div>
                  )}
                </div>

                {bio !== "No bio provided" && (
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-600">Bio</span>
                      <p className="text-sm">{bio}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="danger" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Danger Zone
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileForm />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <ChangePasswordForm />
          </TabsContent>

          <TabsContent value="danger" className="space-y-6">
            <DeleteAccountForm />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common account actions and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                >
                  <Link href="/dashboard">
                    <User className="h-5 w-5 mb-2" />
                    <span className="font-medium">Dashboard</span>
                    <span className="text-sm text-muted-foreground">
                      Go to main dashboard
                    </span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                >
                  <Link href="/organizations">
                    <Globe className="h-5 w-5 mb-2" />
                    <span className="font-medium">Organizations</span>
                    <span className="text-sm text-muted-foreground">
                      Manage your organizations
                    </span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                >
                  <Link href="/posts">
                    <FileText className="h-5 w-5 mb-2" />
                    <span className="font-medium">Posts</span>
                    <span className="text-sm text-muted-foreground">
                      Manage your posts
                    </span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
