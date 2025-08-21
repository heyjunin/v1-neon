'use client';

import { useSignOut } from '@/lib/trpc';
import { Button } from '@v1/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function LogoutButton({ 
  variant = 'outline', 
  size = 'default',
  className = ''
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const signOut = useSignOut();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await signOut.mutateAsync();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, redirect to login
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoggingOut || signOut.isPending}
      className={className}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoggingOut || signOut.isPending ? 'Signing out...' : 'Sign out'}
    </Button>
  );
}
