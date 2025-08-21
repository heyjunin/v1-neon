# Migrating from v3

> What's new in v4, how to migrate, and breaking changes.

## What's new in v4?

| Feature                                                              | Description                                                                                                                                                                                                |
| :------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Wait for token](/wait-for-token)                                    | Create and wait for tokens to be completed, enabling approval workflows and waiting for arbitrary external conditions.                                                                                     |
| Wait idempotency                                                     | Skip waits if the same idempotency key is used again when using [wait for](/wait-for#wait-idempotency), [wait until](/wait-until#wait-idempotency), or [wait for token](/wait-for-token#wait-idempotency). |
| [Priority](/runs/priority)                                           | Specify a priority when triggering a task.                                                                                                                                                                 |
| [Global lifecycle hooks](/tasks/overview#global-lifecycle-hooks)     | Register global lifecycle hooks that are executed for all runs, regardless of the task.                                                                                                                    |
| [onWait and onResume](/tasks/overview#onwait-and-onresume-functions) | Run code when a run is paused or resumed because of a wait.                                                                                                                                                |
| [onComplete](/tasks/overview#oncomplete-function)                    | Run code when a run completes, regardless of whether it succeeded or failed.                                                                                                                               |
| [onCancel](/tasks/overview#oncancel-function)                        | Run code when a run is cancelled.                                                                                                                                                                          |
| [Hidden tasks](/hidden-tasks)                                        | Create tasks that are not exported from your trigger files but can still be executed.                                                                                                                      |
| [Middleware & locals](#middleware-and-locals)                        | The middleware system runs at the top level, executing before and after all lifecycle hooks. The locals API allows sharing data between middleware and hooks.                                              |
| [useWaitToken](/realtime/react-hooks/use-wait-token)                 | Use the useWaitToken hook to complete a wait token from a React component.                                                                                                                                 |
| [ai.tool](/tasks/schemaTask#ai-tool)                                 | Create an AI tool from an existing `schemaTask` to use with the Vercel [AI SDK](https://vercel.com/docs/ai-sdk).                                                                                           |

## Node.js support

Trigger.dev runs your tasks on specific Node.js versions:

### v3

* Node.js `21.7.3`

### v4

* Node.js `21.7.3` (default)
* Node.js `22.16.0` (`node-22`)
* Bun `1.2.20` (`bun`)

You can change the runtime by setting the `runtime` field in your `trigger.config.ts` file.

```ts
import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  // "node", "node-22" or "bun"
  runtime: "node-22",
  project: "<your-project-ref>",
});
```

## How to migrate to v4

First read the deprecations and breaking changes sections below.

We recommend the following steps to migrate to v4:

1. Install the v4 package.
2. Run the `trigger dev` CLI command and test your tasks locally, fixing any breaking changes.
3. Deploy to the staging environment and test your tasks in staging, fixing any breaking changes. (this step is optional, but highly recommended)
4. Once you've verified that v4 is working as expected, you should deploy your application backend with the updated v4 package.
5. Once you've deployed your application backend, you should deploy your tasks to the production environment.

Note that between steps 4 and 5, runs triggered with the v4 package will continue using v3, and only new runs triggered after step 5 is complete will use v4.

<Warning>
  Once v4 is activated in your environment, there will be a period of time where old runs will
  continue to execute using v3, while new runs will use v4. Because these engines use completely
  different underlying queues and concurrency models, it's possible you may have up to double the
  amount of concurrently executing runs. Once the runs drain from the old run engine, the
  concurrency will return to normal.
</Warning>

## Migrate using AI

Use the prompt in the accordion below to help you migrate your v3 tasks to v4. The prompt gives good results when using Claude 4 Sonnet. You’ll need a relatively large token limit.

<Accordion title="Copy paste this prompt in full" icon="sparkles">
  ```md

  I would like you to help me migrate my v3 task code to v4. Here are the important differences:

  We've deprecated the `@trigger.dev/sdk/v3` import path and moved to a new path:

  // This is the old path
  import { task } from "@trigger.dev/sdk/v3";

  // This is the new path, use this instead
  import { task } from "@trigger.dev/sdk";

  We've renamed the `handleError` hook to `catchError`. Use this instead of `handleError`.

  `init` was previously used to initialize data used in the run function. This is the old version:

  import { task } from "@trigger.dev/sdk";

  const myTask = task({
    init: async () => {
      return {
        myClient: new MyClient(),
      };
    },
    run: async (payload: any, { ctx, init }) => {
      const client = init.myClient;
      await client.doSomething();
    },
  });

  This is the new version using middleware and locals:

  import { task, locals, tasks } from "@trigger.dev/sdk";

  // Create a local for your client
  const MyClientLocal = locals.create<MyClient>("myClient");

  // Set up middleware to initialize the client
  tasks.middleware("my-client", async ({ next }) => {
    const client = new MyClient();
    locals.set(MyClientLocal, client);
    await next();
  });

  // Helper function to get the client
  function getMyClient() {
    return locals.getOrThrow(MyClientLocal);
  }

  const myTask = task({
    run: async (payload: any, { ctx }) => {
      const client = getMyClient();
      await client.doSomething();
    },
  });

  We’ve deprecated the `toolTask` function and replaced it with the `ai.tool` function, which creates an AI tool from an existing `schemaTask`. This is the old version:

  import { toolTask, schemaTask } from "@trigger.dev/sdk";
  import { z } from "zod";
  import { generateText } from "ai";

  const myToolTask = toolTask({
    id: "my-tool-task",
    run: async (payload: any, { ctx }) => {},
  });

  export const myAiTask = schemaTask({
    id: "my-ai-task",
    schema: z.object({
      text: z.string(),
    }),
    run: async (payload, { ctx }) => {
      const { text } = await generateText({
        prompt: payload.text,
        model: openai("gpt-4o"),
        tools: {
          myToolTask,
        },
      });
    },
  });

  This is the new version:

  import { schemaTask, ai } from "@trigger.dev/sdk";
  import { z } from "zod";
  import { generateText } from "ai";

  // Convert toolTask to schemaTask with a schema
  const myToolTask = schemaTask({
    id: "my-tool-task",
    schema: z.object({
      // Add appropriate schema for your tool's payload
      input: z.string(),
    }),
    run: async (payload, { ctx }) => {},
  });

  // Create an AI tool from the schemaTask
  const myTool = ai.tool(myToolTask);

  export const myAiTask = schemaTask({
    id: "my-ai-task",
    schema: z.object({
      text: z.string(),
    }),
    run: async (payload, { ctx }) => {
      const { text } = await generateText({
        prompt: payload.text,
        model: openai("gpt-4o"),
        tools: {
          myTool, // Use the ai.tool created from schemaTask
        },
      });
    },
  });

  We've made several breaking changes that require code updates:

  **Queue changes**: Queues must now be defined ahead of time using the `queue` function. You can no longer create queues "on-demand" when triggering tasks. This is the old version:


  // Old v3 way - creating queue on-demand
  await myTask.trigger({ foo: "bar" }, { queue: { name: "my-queue", concurrencyLimit: 10 } });


  This is the new version:


  // New v4 way - define queue first
  import { queue, task } from "@trigger.dev/sdk";

  const myQueue = queue({
    name: "my-queue",
    concurrencyLimit: 10,
  });

  export const myTask = task({
    id: "my-task",
    queue: myQueue, // Set queue on task
    run: async (payload: any, { ctx }) => {},
  });

  // Now trigger without queue options
  await myTask.trigger({ foo: "bar" });

  // Or specify queue by name
  await myTask.trigger({ foo: "bar" }, { queue: "my-queue" });


  **Lifecycle hooks**: Function signatures have changed to use a single object parameter instead of separate parameters. This is the old version:


  // Old v3 way
  export const myTask = task({
    id: "my-task",
    onStart: (payload, { ctx }) => {},
    onSuccess: (payload, output, { ctx }) => {},
    onFailure: (payload, error, { ctx }) => {},
    catchError: (payload, { ctx, error, retry }) => {},
    run: async (payload, { ctx }) => {},
  });


  This is the new version:


  // New v4 way - single object parameter for hooks
  export const myTask = task({
    id: "my-task",
    onStart: ({ payload, ctx }) => {},
    onSuccess: ({ payload, output, ctx }) => {},
    onFailure: ({ payload, error, ctx }) => {},
    catchError: ({ payload, ctx, error, retry }) => {},
    run: async (payload, { ctx }) => {}, // run function unchanged
  });


  **BatchTrigger changes**: The `batchTrigger` function no longer returns runs directly. This is the old version:


  // Old v3 way
  const batchHandle = await tasks.batchTrigger([
    [myTask, { foo: "bar" }],
    [myOtherTask, { baz: "qux" }],
  ]);

  console.log(batchHandle.runs); // Direct access


  This is the new version:


  // New v4 way
  const batchHandle = await tasks.batchTrigger([
    [myTask, { foo: "bar" }],
    [myOtherTask, { baz: "qux" }],
  ]);

  const runs = await batchHandle.runs.list(); // Use runs.list()
  console.log(runs);


  Can you help me convert the following code from v3 to v4? Please include the full converted code in the answer, do not truncate it anywhere.

  ```
</Accordion>

## Installation

To opt-in to using v4, you will need to update your dependencies to the latest version:

<CodeGroup>
  ```bash npx
  npx trigger.dev@latest update
  ```

  ```bash yarn
  yarn dlx trigger.dev@latest update
  ```

  ```bash pnpm
  pnpm dlx trigger.dev@latest update
  ```
</CodeGroup>

This command should update all of your `@trigger.dev/*` packages to a `4.x` version.

## Deprecations

We've deprecated the following APIs:

### @trigger.dev/sdk/v3

We've deprecated the `@trigger.dev/sdk/v3` import path and moved to a new path:

```ts
// This still works, but will be removed in a future version
import { task } from "@trigger.dev/sdk/v3";

// This is the new path
import { task } from "@trigger.dev/sdk";
```

### `handleError` and `init`

We've renamed the `handleError` hook to `catchError` to better reflect that it can catch and react to errors. `handleError` will be removed in a future version.

`init` was previously used to initialize data used in the run function:

```ts
import { task } from "@trigger.dev/sdk";

const myTask = task({
  init: async () => {
    return {
      myClient: new MyClient(),
    };
  },
  run: async (payload: any, { ctx, init }) => {
    const client = init.myClient;
    await client.doSomething();
  },
});
```

This has now been deprecated in favor of the `locals` API and middleware. See the [Improved middleware and locals](/tasks/overview#middleware-and-locals-functions) section for more details.

### toolTask

We've deprecated the `toolTask` function, which created both a Trigger.dev task and a tool compatible with the Vercel [AI SDK](https://vercel.com/docs/ai-sdk):

```ts
import { toolTask, schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";
import { generateText } from "ai";

const myToolTask = toolTask({
  id: "my-tool-task",
  run: async (payload: any, { ctx }) => {},
});

export const myAiTask = schemaTask({
  id: "my-ai-task",
  schema: z.object({
    text: z.string(),
  }),
  run: async (payload, { ctx }) => {
    const { text } = await generateText({
      prompt: payload.text,
      model: openai("gpt-4o"),
      tools: {
        myToolTask,
      },
    });
  },
});
```

We've replaced the `toolTask` function with the `ai.tool` function, which creates an AI tool from an existing `schemaTask`. See the [ai.tool](/tasks/schemaTask#ai-tool) page for more details.

## Breaking changes

### Queue changes

Previously, it was possible to specify a queue name of a queue that did not exist, along with a concurrency limit. The queue would then be created "on-demand" with the specified concurrency limit. If the queue did exist, the concurrency limit of the queue would be updated to the specified value:

```ts
await myTask.trigger({ foo: "bar" }, { queue: { name: "my-queue", concurrencyLimit: 10 } });
```

This is no longer possible, and queues must now be defined ahead of time using the `queue` function:

```ts
import { queue } from "@trigger.dev/sdk";

const myQueue = queue({
  name: "my-queue",
  concurrencyLimit: 10,
});
```

Now when you trigger a task, you can only specify the queue by name:

```ts
await myTask.trigger({ foo: "bar" }, { queue: "my-queue" });
```

Or you can set the queue on the task:

```ts
import { queue, task } from "@trigger.dev/sdk";

const myQueue = queue({
  name: "my-queue",
  concurrencyLimit: 10,
});

export const myTask = task({
  id: "my-task",
  queue: myQueue,
  run: async (payload: any, { ctx }) => {},
});

// You can optionally specify the queue directly on the task
export const myTask2 = task({
  id: "my-task-2",
  queue: {
    name: "my-queue-2",
    concurrencyLimit: 50,
  },
  run: async (payload: any, { ctx }) => {},
});
```

Now you can trigger these tasks without having to specify the queue name in the trigger options:

```ts
await myTask.trigger({ foo: "bar" }); // Will use the queue defined on the task
await myTask2.trigger({ foo: "bar" }); // Will use the queue defined on the task
```

If you're using `concurrencyKey` you can specify the `queue` and `concurrencyKey` like this:

```ts
const handle = await generatePullRequest.trigger(data, {
  queue: "paid-users",
  concurrencyKey: data.userId,
});
```

For each unique value of `concurrencyKey`, a new queue will be created using the `concurrencyLimit` from the queue. This allows you to have a queue per user.

### Lifecycle hooks

We've changed the function signatures of the lifecycle hooks to be more consistent and easier to use, by unifying all the parameters into a single object that can be destructured.

Previously, hooks received a payload as the first argument and then an additional object as the second argument:

```ts
import { task } from "@trigger.dev/sdk";

export const myTask = task({
  id: "my-task",
  onStart: (payload, { ctx }) => {},
  run: async (payload, { ctx }) => {},
});
```

Now, all the parameters are passed in a single object:

```ts
import { task } from "@trigger.dev/sdk";

export const myTask = task({
  id: "my-task",
  onStart: ({ payload, ctx }) => {},
  // The run function still uses separate parameters
  run: async (payload, { ctx }) => {},
});
```

This is true for all the lifecycle hooks:

```ts
import { task } from "@trigger.dev/sdk";

export const myTask = task({
  id: "my-task",
  onStart: ({ payload, ctx, task }) => {},
  onSuccess: ({ payload, ctx, task, output }) => {},
  onFailure: ({ payload, ctx, task, error }) => {},
  onWait: ({ payload, ctx, task, wait }) => {},
  onResume: ({ payload, ctx, task, wait }) => {},
  onComplete: ({ payload, ctx, task, result }) => {},
  catchError: ({ payload, ctx, task, error, retry, retryAt, retryDelayInMs }) => {},
  run: async (payload, { ctx }) => {},
});
```

### Context changes

We've made a few small changes to the `ctx` object:

* `ctx.attempt.id` and `ctx.attempt.status` have been removed. `ctx.attempt.number` is still available.
* `ctx.task.exportName` has been removed (since we no longer require tasks to be exported to be triggered).

### BatchTrigger changes

The `batchTrigger` function no longer returns a `runs` list directly. In v3, you could access the runs directly from the batch handle:

```ts
// In v3
const batchHandle = await tasks.batchTrigger([
  [myTask, { foo: "bar" }],
  [myOtherTask, { baz: "qux" }],
]);

// You could access runs directly
console.log(batchHandle.runs);
```

In v4, you now need to use the `runs.list()` method to get the list of runs:

```ts
// In v4
const batchHandle = await tasks.batchTrigger([
  [myTask, { foo: "bar" }],
  [myOtherTask, { baz: "qux" }],
]);

// Now you need to call runs.list()
const runs = await batchHandle.runs.list();
console.log(runs);
```

### OpenTelemetry

We are now using newer versions of the OpenTelemetry packages. This means that if you're using custom exporters you may need to update the packages:

| Package                                   | Previous Version | New Version | Change Type  |
| ----------------------------------------- | ---------------- | ----------- | ------------ |
| `@opentelemetry/api-logs`                 | 0.52.1           | 0.203.0     | Major update |
| `@opentelemetry/exporter-logs-otlp-http`  | 0.52.1           | 0.203.0     | Major update |
| `@opentelemetry/exporter-trace-otlp-http` | 0.52.1           | 0.203.0     | Major update |
| `@opentelemetry/instrumentation`          | 0.52.1           | 0.203.0     | Major update |
