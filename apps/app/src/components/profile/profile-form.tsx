"use client";

import { useGetCurrentUser, useUpdateProfile } from "@/lib/trpc";
import { Alert, AlertDescription } from "@v1/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@v1/ui/avatar";
import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { Textarea } from "@v1/ui/textarea";
import {
  FileText,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Save,
  User,
} from "lucide-react";
import { useState } from "react";

interface ProfileFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ProfileForm({ onSuccess, onError }: ProfileFormProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: userData } = useGetCurrentUser();
  const user = userData?.user;
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    avatarUrl: user?.user_metadata?.avatar_url || "",
    bio: user?.user_metadata?.bio || "",
    website: user?.user_metadata?.website || "",
    location: user?.user_metadata?.location || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await updateProfile.mutateAsync(formData);
      setSuccess("Profile updated successfully!");
      onSuccess?.();
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to update profile";
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Update your personal information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatarUrl} alt={formData.fullName} />
              <AvatarFallback className="text-lg">
                {getInitials(formData.fullName || user?.email || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="avatarUrl"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatarUrl}
                  onChange={(e) =>
                    handleInputChange("avatarUrl", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                className="pl-10 bg-gray-50"
                disabled
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="pl-10"
                rows={3}
                maxLength={500}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                type="url"
                placeholder="https://your-website.com"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                type="text"
                placeholder="City, Country"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
