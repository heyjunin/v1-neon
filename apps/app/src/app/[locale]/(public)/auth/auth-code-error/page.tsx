import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Authentication Error",
};

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Authentication Error</CardTitle>
            <CardDescription>
              There was a problem with your authentication link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>This could happen for several reasons:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>The link has expired (links expire after 1 hour)</li>
                <li>The link has already been used</li>
                <li>The link is invalid or corrupted</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/login">Try signing in again</Link>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/magic-link">Send new magic link</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
