# Using the Vercel AI SDK

> This example demonstrates how to use the Vercel AI SDK with Trigger.dev.

## Overview

The [Vercel AI SDK](https://www.npmjs.com/package/ai) is a simple way to use AI models from many different providers, including OpenAI, Microsoft Azure, Google Generative AI, Anthropic, Amazon Bedrock, Groq, Perplexity and [more](https://sdk.vercel.ai/providers/ai-sdk-providers).

It provides a consistent interface to interact with the different AI models, so you can easily switch between them without needing to change your code.

## Generate text using OpenAI

This task shows how to use the Vercel AI SDK to generate text from a prompt with OpenAI.

### Task code

```ts trigger/vercel-ai-sdk-openai.ts
import { logger, task } from "@trigger.dev/sdk";
import { generateText } from "ai";
// Install the package of the AI model you want to use, in this case OpenAI
import { openai } from "@ai-sdk/openai"; // Ensure OPENAI_API_KEY environment variable is set

export const openaiTask = task({
  id: "openai-text-generate",

  run: async (payload: { prompt: string }) => {
    const chatCompletion = await generateText({
      model: openai("gpt-4-turbo"),
      // Add a system message which will be included with the prompt
      system: "You are a friendly assistant!",
      // The prompt passed in from the payload
      prompt: payload.prompt,
    });

    // Log the generated text
    logger.log("chatCompletion text:" + chatCompletion.text);

    return chatCompletion;
  },
});
```

## Testing your task

To test this task in the dashboard, you can use the following payload:

```json
{
  "prompt": "What is the meaning of life?"
}
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
