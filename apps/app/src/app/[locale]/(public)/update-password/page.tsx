import { UpdatePasswordForm } from '@/components/auth/update-password-form';
import Image from 'next/image';

export const metadata = {
  title: 'Update Password',
};

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image src="/logo.png" alt="logo" width={200} height={200} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Update your password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your new password below
          </p>
        </div>

        <UpdatePasswordForm />
      </div>
    </div>
  );
}
