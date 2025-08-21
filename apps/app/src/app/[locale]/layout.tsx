import { Footer } from "@/components/footer";
import { TRPCProvider } from "@/lib/trpc";
import { cn } from "@v1/ui/cn";
import "@v1/ui/globals.css";
import { Toaster } from "@v1/ui/toaster";
import { GeistMono, GeistSans } from "geist/font";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "V1 App",
  description: "V1 App",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${GeistSans.variable} ${GeistMono.variable}`,
          "antialiased",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCProvider>
            {children}

            <Footer />
            <Toaster />
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
