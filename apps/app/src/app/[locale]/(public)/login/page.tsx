import { AuthButtons } from "@/components/auth-buttons";
import { EmailSignInForm } from "@/components/auth/email-signin-form";
import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { OtpForm } from "@/components/auth/otp-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@v1/ui/tabs";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image src="/logo.png" alt="logo" width={200} height={200} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="otp">OTP</TabsTrigger>
            <TabsTrigger value="magic">Magic Link</TabsTrigger>
            <TabsTrigger value="oauth">OAuth</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4">
            <EmailSignInForm />
            <div className="text-center">
              <Link 
                href="/reset-password" 
                className="text-sm text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="otp" className="space-y-4">
            <OtpForm />
          </TabsContent>
          
          <TabsContent value="magic" className="space-y-4">
            <MagicLinkForm />
          </TabsContent>
          
          <TabsContent value="oauth" className="space-y-4">
            <AuthButtons />
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
