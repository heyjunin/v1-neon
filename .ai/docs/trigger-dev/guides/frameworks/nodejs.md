# Node.js setup guide

> This guide will show you how to setup Trigger.dev in your existing Node.js project, test an example task, and view the run.

export const framework_0 = "Node.js"

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
