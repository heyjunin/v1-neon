import { Avatar, AvatarFallback, AvatarImage } from '@v1/ui/avatar'
import { Badge } from '@v1/ui/badge'
import { Button } from '@v1/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card'
import { Input } from '@v1/ui/input'
import { Label } from '@v1/ui/label'
import { Separator } from '@v1/ui/separator'
import {
    Bell,
    Calendar,
    Globe,
    Key,
    Mail,
    Save,
    Settings,
    Shield,
    User
} from 'lucide-react'

export function ProfilePage() {
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '',
    joinDate: '2024-01-15',
    role: 'admin',
    postsCount: 24,
    viewsCount: 12470,
    bio: 'Full-stack developer passionate about React, TypeScript, and modern web technologies.',
    location: 'São Paulo, Brazil',
    website: 'https://johndoe.dev'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{user.role}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Member since {new Date(user.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue={user.location} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue={user.website} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none"
                  defaultValue={user.bio}
                />
              </div>

              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Your activity and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-primary">{user.postsCount}</div>
                  <div className="text-sm text-muted-foreground">Posts Published</div>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-primary">{user.viewsCount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Views</div>
                </div>
                <div className="text-center p-4 rounded-lg border">
                  <div className="text-2xl font-bold text-primary">89%</div>
                  <div className="text-sm text-muted-foreground">Engagement Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                General Settings
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Privacy & Security
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Key className="h-4 w-4 mr-2" />
                API Keys
              </Button>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{user.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-destructive border-destructive/50 hover:bg-destructive/10">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
