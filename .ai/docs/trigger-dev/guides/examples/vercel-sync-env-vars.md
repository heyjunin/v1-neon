# Syncing environment variables from your Vercel projects

> This example demonstrates how to sync environment variables from your Vercel project to Trigger.dev.

## Build configuration

To sync environment variables, you just need to add our build extension to your `trigger.config.ts` file. This extension will then automatically run every time you deploy your Trigger.dev project.

<Note>
  You need to set the `VERCEL_ACCESS_TOKEN` and `VERCEL_PROJECT_ID` environment variables, or pass
  in the token and project ID as arguments to the `syncVercelEnvVars` build extension. If you're
  working with a team project, you'll also need to set `VERCEL_TEAM_ID`, which can be found in your
  team settings. You can find / generate the `VERCEL_ACCESS_TOKEN` in your Vercel
  [dashboard](https://vercel.com/account/settings/tokens). Make sure the scope of the token covers
  the project with the environment variables you want to sync.
</Note>

```ts trigger.config.ts
import { defineConfig } from "@trigger.dev/sdk";
import { syncVercelEnvVars } from "@trigger.dev/build/extensions/core";

export default defineConfig({
  project: "<project ref>",
  // Your other config settings...
  build: {
    // Add the syncVercelEnvVars build extension
    extensions: [
      syncVercelEnvVars({
        // A personal access token created in your Vercel account settings
        // Used to authenticate API requests to Vercel
        // Generate at: https://vercel.com/account/tokens
        vercelAccessToken: process.env.VERCEL_ACCESS_TOKEN,
        // The unique identifier of your Vercel project
        // Found in Project Settings > General > Project ID
        projectId: process.env.VERCEL_PROJECT_ID,
        // Optional: The ID of your Vercel team
        // Only required for team projects
        // Found in Team Settings > General > Team ID
        vercelTeamId: process.env.VERCEL_TEAM_ID,
      }),
    ],
  },
});
```

<Note>
  [Build extensions](/config/extensions/overview) allow you to hook into the build system and
  customize the build process or the resulting bundle and container image (in the case of
  deploying). You can use pre-built extensions or create your own.
</Note>

## Running the sync operation

To sync the environment variables, all you need to do is run our `deploy` command. You should see some output in the console indicating that the environment variables have been synced, and they should now be available in your Trigger.dev dashboard.

```bash
npx trigger.dev@latest deploy
```

## Learn more about Next.js and Trigger.dev

### Walk-through guides from development to deployment

<CardGroup cols={2}>
  <Card title="Next.js - setup guide" icon="N" href="/guides/frameworks/nextjs">
    Learn how to setup Trigger.dev with Next.js, using either the pages or app router.
  </Card>

  <Card title="Next.js - triggering tasks using webhooks" icon="N" href="/guides/frameworks/nextjs-webhooks">
    Learn how to create a webhook handler for incoming webhooks in a Next.js app, and trigger a task from it.
  </Card>
</CardGroup>

### Task examples

<CardGroup cols={2}>
  <Card title="Fal.ai with Realtime in Next.js" img="https://mintlify.s3.us-west-1.amazonaws.com/trigger/images/fal-realtime-thumbnail.png" href="/guides/examples/fal-ai-realtime">
    Generate an image from a prompt using Fal.ai and Trigger.dev Realtime.
  </Card>

  <Card title="Generate a cartoon using Fal.ai in Next.js" img="https://mintlify.s3.us-west-1.amazonaws.com/trigger/images/fal-generate-cartoon-thumbnail.png" href="/guides/examples/fal-ai-image-to-cartoon">
    Convert an image to a cartoon using Fal.ai.
  </Card>

  <Card title="Vercel sync environment variables" icon="code" href="/guides/examples/vercel-sync-env-vars">
    Learn how to automatically sync environment variables from your Vercel projects to Trigger.dev.
  </Card>

  <Card title="Vercel AI SDK" icon="code" href="/guides/examples/vercel-ai-sdk">
    Learn how to use the Vercel AI SDK, which is a simple way to use AI models from different
    providers, including OpenAI, Anthropic, Amazon Bedrock, Groq, Perplexity etc.
  </Card>
</CardGroup>
