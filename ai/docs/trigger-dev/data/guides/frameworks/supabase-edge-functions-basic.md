# Triggering tasks from Supabase edge functions

> This guide will show you how to trigger a task from a Supabase edge function, and then view the run in our dashboard.

## Overview

Supabase edge functions allow you to trigger tasks either when an event is sent from a third party (e.g. when a new Stripe payment is processed, when a new user signs up to a service, etc), or when there are any changes or updates to your Supabase database.

This guide shows you how to set up and deploy a simple Supabase edge function example that triggers a task when an edge function URL is accessed.

## Prerequisites

* Ensure you have the [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) installed
* Since Supabase CLI version 1.123.4, you must have [Docker Desktop installed](https://supabase.com/docs/guides/functions/deploy#deploy-your-edge-functions) to deploy Edge Functions
* Ensure TypeScript is installed
* [Create a Trigger.dev account](https://cloud.trigger.dev)
* Create a new Trigger.dev project

## GitHub repo

<Card title="View the project on GitHub" icon="GitHub" href="https://github.com/triggerdotdev/examples/tree/main/supabase-edge-functions">
  Click here to view the full code for this project in our examples repository on GitHub. You can
  fork it and use it as a starting point for your own project.
</Card>

## Initial setup

<Steps>
  <Step title="Optional step 1: create a new Supabase project">
    <Info> If you already have a Supabase project on your local machine you can skip this step.</Info>

    You can create a new project by running the following command in your terminal using the Supabase CLI:

    ```bash
    supabase init
    ```

    <Note>
      If you are using VS Code, ensure to answer 'y' when asked to generate VS Code settings for Deno,
      and install any recommended extensions.
    </Note>
  </Step>

  <Step title="Optional step 2: create a package.json file">
    If your project does not already have `package.json` file (e.g. if you are using Deno), create it manually in your project's root folder.

    <Info> If your project has a `package.json` file you can skip this step.</Info>

    This is required for the Trigger.dev SDK to work correctly.

    ```ts package.json
    {
      "devDependencies": {
        "typescript": "^5.6.2"
      }
    }
    ```

    <Note> Update your Typescript version to the latest version available. </Note>
  </Step>

  <Step title="Run the CLI `init` command">
    The easiest way to get started is to use the CLI. It will add Trigger.dev to your existing project, create a `/trigger` folder and give you an example task.

    Run this command in the root of your project to get started:

    <CodeGroup>
      ```bash npm
      npx trigger.dev@latest init
      ```

      ```bash pnpm
      pnpm dlx trigger.dev@latest init
      ```

      ```bash yarn
      yarn dlx trigger.dev@latest init
      ```
    </CodeGroup>

    It will do a few things:

    1. Log you into the CLI if you're not already logged in.
    2. Create a `trigger.config.ts` file in the root of your project.
    3. Ask where you'd like to create the `/trigger` directory.
    4. Create the `/trigger` directory with an example task, `/trigger/example.[ts/js]`.

    Install the "Hello World" example task when prompted. We'll use this task to test the setup.
  </Step>

  <Step title="Run the CLI `dev` command">
    The CLI `dev` command runs a server for your tasks. It watches for changes in your `/trigger` directory and communicates with the Trigger.dev platform to register your tasks, perform runs, and send data back and forth.

    It can also update your `@trigger.dev/*` packages to prevent version mismatches and failed deploys. You will always be prompted first.

    <CodeGroup>
      ```bash npm
      npx trigger.dev@latest dev
      ```

      ```bash pnpm
      pnpm dlx trigger.dev@latest dev
      ```

      ```bash yarn
      yarn dlx trigger.dev@latest dev
      ```
    </CodeGroup>
  </Step>

  <Step title="Perform a test run using the dashboard">
    The CLI `dev` command spits out various useful URLs. Right now we want to visit the Test page.

    You should see our Example task in the list <Icon icon="circle-1" iconType="solid" size={20} color="F43F47" />, select it. Most tasks have a "payload" which you enter in the JSON editor <Icon icon="circle-2" iconType="solid" size={20} color="F43F47" />, but our example task doesn't need any input.

    You can configure options on the run <Icon icon="circle-3" iconType="solid" size={20} color="F43F47" />, view recent payloads <Icon icon="circle-4" iconType="solid" size={20} color="F43F47" />, and create run templates <Icon icon="circle-5" iconType="solid" size={20} color="F43F47" />.

    Press the "Run test" button <Icon icon="circle-6" iconType="solid" size={20} color="F43F47" />.

    ![Test page](https://mintlify.s3.us-west-1.amazonaws.com/trigger/images/test-dashboard.png)
  </Step>

  <Step title="View your run">
    Congratulations, you should see the run page which will live reload showing you the current state of the run.

    ![Run page](https://mintlify.s3.us-west-1.amazonaws.com/trigger/images/run-page.png)

    If you go back to your terminal you'll see that the dev command also shows the task status and links to the run log.

    ![Terminal showing completed run](https://mintlify.s3.us-west-1.amazonaws.com/trigger/images/terminal-completed-run.png)
  </Step>
</Steps>

## Create a new Supabase edge function and deploy it

<Steps>
  <Step title="Create a new Supabase edge function">
    We'll call this example `edge-function-trigger`.

    In your project, run the following command in the terminal using the Supabase CLI:

    ```bash
    supabase functions new edge-function-trigger
    ```
  </Step>

  <Step title="Update the edge function code">
    Replace the placeholder code in your `edge-function-trigger/index.ts` file with the following:

    ```ts functions/edge-function-trigger/index.ts
    // Setup type definitions for built-in Supabase Runtime APIs
    import "jsr:@supabase/functions-js/edge-runtime.d.ts";
    // Import the Trigger.dev SDK - replace "<your-sdk-version>" with the version of the SDK you are using, e.g. "3.0.0". You can find this in your package.json file.
    import { tasks } from "npm:@trigger.dev/sdk@3.0.0/v3";
    // Import your task type from your /trigger folder
    import type { helloWorldTask } from "../../../src/trigger/example.ts";
    //     👆 **type-only** import

    Deno.serve(async () => {
      await tasks.trigger<typeof helloWorldTask>(
        // Your task id
        "hello-world",
        // Your task payload
        "Hello from a Supabase Edge Function!"
      );
      return new Response("OK");
    });
    ```

    <Note>You can only import the `type` from the task.</Note>

    <Note>
      Tasks in the `trigger` folder use Node, so they must stay in there or they will not run,
      especially if you are using a different runtime like Deno. Also do not add "`npm:`" to imports
      inside your task files, for the same reason.
    </Note>
  </Step>

  <Step title="Deploy your edge function using the Supabase CLI">
    You can now deploy your edge function with the following command in your terminal:

    ```bash
    supabase functions deploy edge-function-trigger --no-verify-jwt
    ```

    <Warning>
      `--no-verify-jwt` removes the JSON Web Tokens requirement from the authorization header. By
      default this should be on, but it is not strictly required for this hello world example.
    </Warning>

    <Note>
      To learn more about how to properly configure Supabase auth for Trigger.dev tasks, please refer to
      our [Supabase Authentication guide](/guides/frameworks/supabase-authentication). It demonstrates
      how to use JWT authentication for user-specific operations or your service role key for
      admin-level access.
    </Note>

    Follow the CLI instructions and once complete you should now see your new edge function deployment in your Supabase edge functions dashboard.

    There will be a link to the dashboard in your terminal output, or you can find it at this URL:

    `https://supabase.com/dashboard/project/<your-project-id>/functions`

    <Note>Replace `your-project-id` with your actual project ID.</Note>
  </Step>
</Steps>

## Set your Trigger.dev prod secret key in the Supabase dashboard

To trigger a task from your edge function, you need to set your Trigger.dev secret key in the Supabase dashboard.

To do this, first go to your Trigger.dev [project dashboard](https://cloud.trigger.dev) and copy the `prod` secret key from the API keys page.

![How to find your prod secret key](https://mintlify.s3.us-west-1.amazonaws.com/trigger/images/api-key-prod.png)

Then, in [Supabase](https://supabase.com/dashboard/projects), select your project, navigate to 'Project settings' <Icon icon="circle-1" iconType="solid" size={20} color="A8FF53" />, click 'Edge functions' <Icon icon="circle-2" iconType="solid" size={20} color="A8FF53" /> in the configurations menu, and then click the 'Add new secret' <Icon icon="circle-3" iconType="solid" size={20} color="A8FF53" /> button.

Add `TRIGGER_SECRET_KEY` <Icon icon="circle-4" iconType="solid" size={20} color="A8FF53" /> with the pasted value of your Trigger.dev `prod` secret key.

![Add secret key in Supabase](https://mintlify.s3.us-west-1.amazonaws.com/trigger/images/supabase-keys-1.png)

## Deploy your task and trigger it from your edge function

<Steps>
  <Step title="Deploy your 'Hello World' task">
    Next, deploy your `hello-world` task to [Trigger.dev cloud](https://cloud.trigger.dev).

    <CodeGroup>
      ```bash npm
      npx trigger.dev@latest deploy
      ```

      ```bash pnpm
      pnpm dlx trigger.dev@latest deploy
      ```

      ```bash yarn
      yarn dlx trigger.dev@latest deploy
      ```
    </CodeGroup>
  </Step>

  <Step title="Trigger a prod run from your deployed edge function">
    To do this all you need to do is simply open the `edge-function-trigger` URL.

    `https://supabase.com/dashboard/project/<your-project-id>/functions`

    <Note>Replace `your-project-id` with your actual project ID.</Note>

    In your Supabase project, go to your Edge function dashboard, find `edge-function-trigger`, copy the URL, and paste it into a new window in your browser.

    Once loaded you should see ‘OK’ on the new screen.

    ![Edge function URL](https://mintlify.s3.us-west-1.amazonaws.com/trigger/images/supabase-function-url.png)

    The task will be triggered when your edge function URL is accessed.

    Check your [cloud.trigger.dev](http://cloud.trigger.dev) dashboard and you should see a succesful `hello-world` task.

    **Congratulations, you have run a simple Hello World task from a Supabase edge function!**
  </Step>
</Steps>

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
