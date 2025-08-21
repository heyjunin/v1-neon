import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Verificar se as variáveis de ambiente necessárias estão configuradas
    const requiredEnvVars = ["RESEND_API_KEY", "SEND_EMAIL_HOOK_SECRET"];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName],
    );

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing environment variables",
          missing: missingVars,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "email-service",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Service unavailable",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
