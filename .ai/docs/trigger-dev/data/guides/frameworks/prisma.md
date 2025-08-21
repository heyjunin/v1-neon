# Prisma setup guide

> This guide will show you how to set up Prisma with Trigger.dev

## Overview

This guide will show you how to set up [Prisma](https://www.prisma.io/) with Trigger.dev, test and view an example task run.

## Prerequisites

* An existing Node.js project with a `package.json` file
* Ensure TypeScript is installed
* A [PostgreSQL](https://www.postgresql.org/) database server running locally, or accessible via a connection string
* Prisma ORM [installed and initialized](https://www.prisma.io/docs/getting-started/quickstart) in your project
* A `DATABASE_URL` environment variable set in your `.env` file, pointing to your PostgreSQL database (e.g. `postgresql://user:password@localhost:5432/dbname`)

## Initial setup (optional)

Follow these steps if you don't already have Trigger.dev set up in your project.

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

## Creating a task using Prisma and deploying it to production

<Steps>
  <Step title="Writing the Prisma task">
    First, create a new task file in your `trigger` folder.

    This is a simple task that will add a new user to the database.

    <Note>
      For this task to work correctly, you will need to have a `user` model in your Prisma schema with
      an `id` field, a `name` field, and an `email` field.
    </Note>

    ```ts /trigger/prisma-add-new-user.ts
    import { PrismaClient } from "@prisma/client";
    import { task } from "@trigger.dev/sdk";

    // Initialize Prisma client
    const prisma = new PrismaClient();

    export const addNewUser = task({
      id: "prisma-add-new-user",
      run: async (payload: { name: string; email: string; id: number }) => {
        const { name, email, id } = payload;

        // This will create a new user in the database
        const user = await prisma.user.create({
          data: {
            name: name,
            email: email,
            id: id,
          },
        });

        return {
          message: `New user added successfully: ${user.id}`,
        };
      },
    });
    ```
  </Step>

  <Step title="Configuring the build extension">
    Next, configure the Prisma [build extension](https://trigger.dev/docs/config/extensions/overview) in the `trigger.config.js` file to include the Prisma client in the build.

    This will ensure that the Prisma client is available when the task runs.

    For a full list of options available in the Prisma build extension, see the [Prisma build extension documentation](https://trigger.dev/docs/config/extensions/prismaExtension).

    ```js /trigger.config.js
    export default defineConfig({
      project: "<project ref>", // Your project reference
      // Your other config settings...
      build: {
        extensions: [
          prismaExtension({
            version: "5.20.0", // optional, we'll automatically detect the version if not provided
            // update this to the path of your Prisma schema file
            schema: "prisma/schema.prisma",
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
  </Step>

  <Step title="Optional: adding Prisma instrumentation">
    We use OpenTelemetry to [instrument](https://trigger.dev/docs/config/config-file#instrumentations) our tasks and collect telemetry data.

    If you want to automatically log all Prisma queries and mutations, you can use the Prisma instrumentation extension.

    ```js /trigger.config.js
    import { defineConfig } from "@trigger.dev/sdk";
    import { PrismaInstrumentation } from "@prisma/instrumentation";
    import { OpenAIInstrumentation } from "@traceloop/instrumentation-openai";

    export default defineConfig({
      //..other stuff
      instrumentations: [new PrismaInstrumentation(), new OpenAIInstrumentation()],
    });
    ```

    This provides much more detailed information about your tasks with minimal effort.
  </Step>

  <Step title="Deploying your task">
    With the build extension and task configured, you can now deploy your task using the Trigger.dev CLI.

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

  <Step title="Adding your DATABASE_URL environment variable to Trigger.dev">
    In your Trigger.dev dashboard sidebar click "Environment Variables" <Icon icon="circle-1" iconType="solid" size={20} color="A8FF53" />, and then the "New environment variable" button <Icon icon="circle-2" iconType="solid" size={20} color="A8FF53" />.

    You can add values for your local dev environment, staging and prod. in this case we will add the `DATABASE_URL` for the production environment.

    ![Environment variables
    page](https://mintlify.s3.us-west-1.amazonaws.com/trigger/images/environment-variables-panel.jpg)
  </Step>

  <Step title="Running your task">
    To test this task, go to the 'test' page in the Trigger.dev dashboard and run the task with the following payload:

    ```json
    {
      "name": "<a-name>", // e.g. "John Doe"
      "email": "<a-email>", // e.g. "john@doe.test"
      "id": <a-number> // e.g. 12345
    }
    ```

    Congratulations! You should now see a new completed run, and a new user with the credentials you provided should be added to your database.
  </Step>
</Steps>

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
