export const config = {
  port: parseInt(process.env.PORT || "3002"),
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
} as const;

export function validateConfig() {
  // App-specific validation can be added here if needed
}
