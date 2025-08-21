# Uploading files to Supabase Storage

> This example demonstrates how to upload files to Supabase Storage using Trigger.dev.

## Overview

This example shows how to upload a video file to Supabase Storage using two different methods.

* [Upload to Supabase Storage using the Supabase client](/guides/examples/supabase-storage-upload#example-1-upload-to-supabase-storage-using-the-supabase-storage-client)
* [Upload to Supabase Storage using the AWS S3 client](/guides/examples/supabase-storage-upload#example-2-upload-to-supabase-storage-using-the-aws-s3-client)

## Upload to Supabase Storage using the Supabase client

This task downloads a video from a provided URL and uploads it to Supabase Storage using the Supabase client.

### Task code

```ts trigger/supabase-storage-upload.ts
import { createClient } from "@supabase/supabase-js";
import { logger, task } from "@trigger.dev/sdk";
import fetch from "node-fetch";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

export const supabaseStorageUpload = task({
  id: "supabase-storage-upload",
  run: async (payload: { videoUrl: string }) => {
    const { videoUrl } = payload;

    const bucket = "my_bucket"; // Replace "my_bucket" with your bucket name
    const objectKey = `video_${Date.now()}.mp4`;

    // Download video data as a buffer
    const response = await fetch(videoUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const videoBuffer = await response.buffer();

    // Upload the video directly to Supabase Storage
    const { error } = await supabase.storage.from(bucket).upload(objectKey, videoBuffer, {
      contentType: "video/mp4",
      upsert: true,
    });

    if (error) {
      throw new Error(`Error uploading video: ${error.message}`);
    }

    logger.log(`Video uploaded to Supabase Storage bucket`, { objectKey });

    // Return the video object key and bucket
    return {
      objectKey,
      bucket: bucket,
    };
  },
});
```

### Testing your task

To test this task in the dashboard, you can use the following payload:

```json
{
  "videoUrl": "<a-video-url>" // Replace <a-video-url> with the URL of the video you want to upload
}
```

## Upload to Supabase Storage using the AWS S3 client

This task downloads a video from a provided URL, saves it to a temporary file, and then uploads the video file to Supabase Storage using the AWS S3 client.

### Key features

* Fetches a video from a provided URL
* Uploads the video file to Supabase Storage using S3

### Task code

```ts trigger/supabase-storage-upload-s3.ts
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { logger, task } from "@trigger.dev/sdk";
import fetch from "node-fetch";

// Initialize S3 client for Supabase Storage
const s3Client = new S3Client({
  region: process.env.SUPABASE_REGION, // Your Supabase project's region e.g. "us-east-1"
  endpoint: `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co/storage/v1/s3`,
  credentials: {
    // These credentials can be found in your supabase storage settings, under 'S3 access keys'
    accessKeyId: process.env.SUPABASE_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.SUPABASE_SECRET_ACCESS_KEY ?? "",
  },
});

export const supabaseStorageUploadS3 = task({
  id: "supabase-storage-upload-s3",
  run: async (payload: { videoUrl: string }) => {
    const { videoUrl } = payload;

    // Fetch the video as an ArrayBuffer
    const response = await fetch(videoUrl);
    const videoArrayBuffer = await response.arrayBuffer();
    const videoBuffer = Buffer.from(videoArrayBuffer);

    const bucket = "my_bucket"; // Replace "my_bucket" with your bucket name
    const objectKey = `video_${Date.now()}.mp4`;

    // Upload the video directly to Supabase Storage
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: videoBuffer,
      })
    );
    logger.log(`Video uploaded to Supabase Storage bucket`, { objectKey });

    // Return the video object key
    return {
      objectKey,
      bucket: bucket,
    };
  },
});
```

<Note>
  To learn more about how to properly configure Supabase auth for Trigger.dev tasks, please refer to
  our [Supabase Authentication guide](/guides/frameworks/supabase-authentication). It demonstrates
  how to use JWT authentication for user-specific operations or your service role key for
  admin-level access.
</Note>

### Testing your task

To test this task in the dashboard, you can use the following payload:

```json
{
  "videoUrl": "<a-video-url>" // Replace <a-video-url> with the URL of the video you want to upload
}
```

## Learn more about Supabase and Trigger.dev

### Full walkthrough guides from development to deployment

<CardGroup cols={1}>
  <Card title="Edge function hello world guide" icon="book" href="/guides/frameworks/supabase-edge-functions-basic">
    Learn how to trigger a task from a Supabase edge function when a URL is visited.
  </Card>

  <Card title="Database webhooks guide" icon="book" href="/guides/frameworks/supabase-edge-functions-database-webhooks">
    Learn how to trigger a task from a Supabase edge function when an event occurs in your database.
  </Card>

  <Card title="Supabase authentication guide" icon="book" href="/guides/frameworks/supabase-authentication">
    Learn how to authenticate Supabase tasks using JWTs for Row Level Security (RLS) or service role
    keys for admin access.
  </Card>
</CardGroup>

### Task examples with code you can copy and paste

<CardGroup cols={2}>
  <Card title="Supabase database operations" icon="bolt" href="/guides/examples/supabase-database-operations">
    Run basic CRUD operations on a table in a Supabase database using Trigger.dev.
  </Card>

  <Card title="Supabase Storage upload" icon="bolt" href="/guides/examples/supabase-storage-upload">
    Download a video from a URL and upload it to Supabase Storage using S3.
  </Card>
</CardGroup>
