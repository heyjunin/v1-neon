'use client';

import { LogoutButton } from '@/components/auth';
import { NotificationDropdown } from '@/components/notifications/notification-dropdown';
import { useGetCurrentUser } from '@/lib/trpc';
import { Avatar, AvatarFallback, AvatarImage } from '@v1/ui/avatar';
import { Button } from '@v1/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@v1/ui/dropdown-menu';
import { Building2, FileText, Home, Settings, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
  const { data: userData } = useGetCurrentUser();
  const user = userData?.user;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userMetadata = user?.user_metadata || {};
  const fullName = userMetadata.full_name || user?.email || 'User';
  const avatarUrl = userMetadata.avatar_url || '';

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <span className="font-bold text-xl">V1 Neon</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4 ml-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          
          <Button asChild variant="ghost" size="sm">
            <Link href="/posts">
              <FileText className="h-4 w-4 mr-2" />
              Posts
            </Link>
          </Button>
          
          <Button asChild variant="ghost" size="sm">
            <Link href="/organizations">
              <Building2 className="h-4 w-4 mr-2" />
              Organizations
            </Link>
          </Button>
        </div>

        {/* Right side - Notifications and User Menu */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Notifications */}
          <NotificationDropdown />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} alt={fullName} />
                  <AvatarFallback>
                    {getInitials(fullName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
