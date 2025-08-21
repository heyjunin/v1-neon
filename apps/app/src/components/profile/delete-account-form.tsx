'use client';

import { useDeleteAccount } from '@/lib/trpc';
import { Alert, AlertDescription } from '@v1/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@v1/ui/alert-dialog';
import { Button } from '@v1/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card';
import { Input } from '@v1/ui/input';
import { Label } from '@v1/ui/label';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteAccountFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function DeleteAccountForm({ onSuccess, onError }: DeleteAccountFormProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const router = useRouter();
  const deleteAccount = useDeleteAccount();

  const handleDeleteAccount = async () => {
    setError('');
    setSuccess('');

    try {
      await deleteAccount.mutateAsync();
      setSuccess('Account deleted successfully. You will be redirected to the login page.');
      onSuccess?.();
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || 'Failed to delete account';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const isConfirmationValid = confirmationText === 'DELETE';

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <Trash2 className="h-5 w-5" />
          Delete Account
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type <span className="font-mono font-bold">DELETE</span> to confirm
            </Label>
            <Input
              id="confirmation"
              type="text"
              placeholder="DELETE"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="font-mono"
            />
          </div>

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={!isConfirmationValid || deleteAccount.isPending}
                className="w-full"
              >
                {deleteAccount.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>Before deleting your account, please consider:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Downloading any data you want to keep</li>
            <li>Canceling any active subscriptions</li>
            <li>Informing your team members if you're part of any organizations</li>
            <li>This action is irreversible</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
