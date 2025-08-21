import { logger } from "@v1/logger";
import { createR2Storage } from "@v1/storage/server";
import { NextRequest, NextResponse } from "next/server";

const storage = createR2Storage({
  accountId: process.env.R2_ACCOUNT_ID!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  bucketName: process.env.R2_BUCKET_NAME!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const key = formData.get("key") as string;
    const contentType = formData.get("contentType") as string;
    const metadata = formData.get("metadata") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Parse metadata if provided
    const parsedMetadata = metadata ? JSON.parse(metadata) : {};

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate key if not provided
    const fileKey = key || `uploads/${Date.now()}-${file.name}`;

    // Upload to R2
    const result = await storage.upload(fileKey, buffer, {
      contentType: contentType || file.type,
      public: true,
      metadata: {
        originalName: file.name,
        size: file.size.toString(),
        uploadedAt: new Date().toISOString(),
        ...parsedMetadata,
      },
    });

    logger.info("File uploaded successfully:", {
      key: fileKey,
      size: file.size,
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix") || "";
    const maxKeys = parseInt(searchParams.get("maxKeys") || "100");

    const result = await storage.list({ prefix, maxKeys });

    return NextResponse.json(result);
  } catch (error) {
    logger.error("List files error:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 },
    );
  }
}
