# Claude 3.7 thinking chatbot

> This example Next.js project uses Vercel's AI SDK and Anthropic's Claude 3.7 model to create a thinking chatbot.

## Overview

This demo is a full stack example that uses the following:

* A [Next.js](https://nextjs.org/) app for the chat interface
* [Trigger.dev Realtime](/realtime/overview) to stream AI responses and thinking/reasoning process to the frontend
* [Claude 3.7 Sonnet](https://www.anthropic.com/claude) for generating AI responses
* [AI SDK](https://sdk.vercel.ai/docs/introduction) for working with the Claude model

## GitHub repo

<Card title="View the Claude thinking chatbot repo" icon="GitHub" href="https://github.com/triggerdotdev/examples/tree/main/claude-thinking-chatbot">
  Click here to view the full code for this project in our examples repository on GitHub. You can
  fork it and use it as a starting point for your own project.
</Card>

## Video

<video controls className="w-full aspect-video" src="https://github.com/user-attachments/assets/053739a5-9736-4cb5-ab1c-81c35b69f4c4" />

## Relevant code

* **Claude Stream Task**: View the Trigger.dev task code in the [src/trigger/claude-stream.ts](https://github.com/triggerdotdev/examples/tree/main/claude-thinking-chatbot/src/trigger/claude-stream.ts) file, which sets up the streaming connection with Claude.
* **Chat Component**: The main chat interface is in [app/components/claude-chat.tsx](https://github.com/triggerdotdev/examples/tree/main/claude-thinking-chatbot/app/components/claude-chat.tsx), which handles:
  * Message state management
  * User input handling
  * Rendering of message bubbles
  * Integration with Trigger.dev for streaming
* **Stream Response**: The `StreamResponse` component within the chat component handles:
  * Displaying streaming text from Claude
  * Showing/hiding the thinking process with an animated toggle
  * Auto-scrolling as new content arrives

## Learn more about Trigger.dev Realtime

To learn more, take a look at the following resources:

* [Trigger.dev Realtime](/realtime) - learn more about how to subscribe to runs and get real-time updates
* [Realtime streaming](/realtime/react-hooks/streams) - learn more about streaming data from your tasks
* [Batch Triggering](/triggering#tasks-batchtrigger) - learn more about how to trigger tasks in batches
* [React hooks](/realtime/react-hooks) - learn more about using React hooks to interact with the Trigger.dev API
