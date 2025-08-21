# Remix setup guide

> This guide will show you how to setup Trigger.dev in your existing Remix project, test an example task, and view the run.

export const framework_0 = "Remix"

## Prerequisites

* Setup a project in {framework_0}
* Ensure TypeScript is installed
* [Create a Trigger.dev account](https://cloud.trigger.dev)
* Create a new Trigger.dev project

## Initial setup

<Steps>
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

## Set your secret key locally

Set your `TRIGGER_SECRET_KEY` environment variable in your `.env` file. This key is used to authenticate with Trigger.dev, so you can trigger runs from your Remix app. Visit the API Keys page in the dashboard and select the DEV secret key.

![How to find your secret key](https://mintlify.s3.us-west-1.amazonaws.com/trigger/images/api-keys.png)

For more information on authenticating with Trigger.dev, see the [API keys page](/apikeys).

## Triggering your task in Remix

<Steps>
  <Step title="Create an API route">
    Create a new file called `api.hello-world.ts` (or `api.hello-world.js`) in the `app/routes` directory like this: `app/routes/api.hello-world.ts`.
  </Step>

  <Step title="Add your task">
    Add this code to your `api.hello-world.ts` file which imports your task:

    ```ts app/routes/api.hello-world.ts
    import type { helloWorldTask } from "../../src/trigger/example";
    import { tasks } from "@trigger.dev/sdk";

    export async function loader() {
      const handle = await tasks.trigger<typeof helloWorldTask>("hello-world", "James");

      return new Response(JSON.stringify(handle), {
        headers: { "Content-Type": "application/json" },
      });
    }
    ```
  </Step>

  <Step title="Trigger your task">
    Run your Remix app:

    <CodeGroup>
      ```bash npm
      npm run dev
      ```

      ```bash pnpm
      pnpm run dev
      ```

      ```bash yarn
      yarn dev
      ```
    </CodeGroup>

    Run the dev server from Step 2. of the [Initial Setup](/guides/frameworks/remix#initial-setup) section above if it's not already running:

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

    Now visit the URL in your browser to trigger the task. Ensure the port number is the same as the one you're running your Remix app on. For example, if you're running your Remix app on port 3000, visit:

    ```bash
    http://localhost:3000/api/trigger
    ```

    You should see the CLI log the task run with a link to view the logs in the dashboard.

    ![Trigger.dev CLI showing a successful run](https://mintlify.s3.us-west-1.amazonaws.com/trigger/images/trigger-cli-run-success.png)

    Visit the [Trigger.dev dashboard](https://cloud.trigger.dev) to see your run.
  </Step>
</Steps>

## Manually add your environment variables (optional)

If you have any environment variables in your tasks, be sure to add them in the dashboard so deployed code runs successfully. In Node.js, these environment variables are accessed in your code using `process.env.MY_ENV_VAR`.

In the sidebar select the "Environment Variables" page, then press the "New environment variable"
button. ![Environment variables page](https://mintlify.s3.us-west-1.amazonaws.com/trigger/images/environment-variables-page.jpg)

You can add values for your local dev environment, staging and prod. ![Environment variables
page](https://mintlify.s3.us-west-1.amazonaws.com/trigger/images/environment-variables-panel.jpg)

You can also add environment variables in code by following the steps on the [Environment Variables page](/deploy-environment-variables#in-your-code).

## Deploying your task to Trigger.dev

For this guide, we'll manually deploy your task by running the [CLI deploy command](/cli-deploy) below. Other ways to deploy are listed in the next section.

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

### Other ways to deploy

<Tabs>
  <Tab title="GitHub Actions">
    Use GitHub Actions to automatically deploy your tasks whenever new code is pushed and when the `trigger` directory has changes in it. Follow [this guide](/github-actions) to set up GitHub Actions.
  </Tab>

  <Tab title="Vercel Integration">
    We're working on adding an official [Vercel integration](/vercel-integration) which you can follow the progress of [here](https://feedback.trigger.dev/p/vercel-integration-3).
  </Tab>
</Tabs>

## Deploying to Vercel Edge Functions

Before we start, it's important to note that:

* We'll be using a type-only import for the task to ensure compatibility with the edge runtime.
* The `@trigger.dev/sdk` package supports the edge runtime out of the box.

There are a few extra steps to follow to deploy your `/api/hello-world` API endpoint to Vercel Edge Functions.

<Steps>
  <Step title="Update your API route">
    Update your API route to use the `runtime: "edge"` option and change it to an `action()` so we can trigger the task from a curl request later on.

    ```ts app/routes/api.hello-world.ts
    import { tasks } from "@trigger.dev/sdk";
    import type { helloWorldTask } from "../../src/trigger/example";
    //      👆 **type-only** import

    // include this at the top of your API route file
    export const config = {
      runtime: "edge",
    };
    export async function action({ request }: { request: Request }) {
      // This is where you'd authenticate the request
      const payload = await request.json();
      const handle = await tasks.trigger<typeof helloWorldTask>("hello-world", payload);
      return new Response(JSON.stringify(handle), {
        headers: { "Content-Type": "application/json" },
      });
    }
    ```
  </Step>

  <Step title="Update the Vercel configuration">
    Create or update the `vercel.json` file with the following:

    ```json vercel.json
    {
      "buildCommand": "npm run vercel-build",
      "devCommand": "npm run dev",
      "framework": "remix",
      "installCommand": "npm install",
      "outputDirectory": "build/client"
    }
    ```
  </Step>

  <Step title="Update package.json scripts">
    Update your `package.json` to include the following scripts:

    ```json package.json
    "scripts": {
        "build": "remix vite:build",
        "dev": "remix vite:dev",
        "lint": "eslint --ignore-path .gitignore --cache --cache-location ./node_modules/.cache/eslint .",
        "start": "remix-serve ./build/server/index.js",
        "typecheck": "tsc",
        "vercel-build": "remix vite:build && cp -r ./public ./build/client"
    },
    ```
  </Step>

  <Step title="Deploy to Vercel">
    Push your code to a Git repository and create a new project in the Vercel dashboard. Select your repository and follow the prompts to complete the deployment.
  </Step>

  <Step title="Add your Vercel environment variables">
    In the Vercel project settings, add your Trigger.dev secret key:

    ```bash
    TRIGGER_SECRET_KEY=your-secret-key
    ```

    You can find this key in the Trigger.dev dashboard under API Keys and select the environment key you want to use.

    ![How to find your secret key](https://mintlify.s3.us-west-1.amazonaws.com/trigger/images/api-keys.png)
  </Step>

  <Step title="Deploy your project">
    Once you've added the environment variable, deploy your project to Vercel.

    <Note>
      Ensure you have also deployed your Trigger.dev task. See [deploy your task
      step](/guides/frameworks/remix#deploying-your-task-to-trigger-dev).
    </Note>
  </Step>

  <Step title="Test your task in production">
    After deployment, you can test your task in production by running this curl command:

    ```bash
    curl -X POST https://your-app.vercel.app/api/hello-world \
    -H "Content-Type: application/json" \
    -d '{"name": "James"}'
    ```

    This sends a POST request to your API endpoint with a JSON payload.
  </Step>
</Steps>

### Additional notes

The `vercel-build` script in `package.json` is specific to Remix projects on Vercel, ensuring that static assets are correctly copied to the build output.

The `runtime: "edge"` configuration in the API route allows for better performance on Vercel's Edge Network.

## Additional resources for Remix

<Card title="Remix - triggering tasks using webhooks" icon="R" href="/guides/frameworks/remix-webhooks">
  How to create a webhook handler in a Remix app, and trigger a task from it.
</Card>

## Useful next steps

<CardGroup cols={2}>
  <Card title="Tasks overview" icon="diagram-subtask" href="/tasks/overview">
    Learn what tasks are and their options
  </Card>

  <Card title="Writing tasks" icon="pen-nib" href="/writing-tasks-introduction">
    Learn how to write your own tasks
  </Card>

  <Card title="Deploy using the CLI" icon="terminal" href="/cli-deploy">
    Learn how to deploy your task manually using the CLI
  </Card>

  <Card title="Deploy using GitHub actions" icon="github" href="/github-actions">
    Learn how to deploy your task using GitHub actions
  </Card>
</CardGroup>
