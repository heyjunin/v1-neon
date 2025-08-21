# CLI dev command

> The `trigger.dev dev` command is used to run your tasks locally.

This runs a server on your machine that can execute Trigger.dev tasks:

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

It will first perform an update check to prevent version mismatches, failed deploys, and other errors. You will always be prompted first.

You will see in the terminal that the server is running and listening for tasks. When you run a task, you will see it in the terminal along with a link to view it in the dashboard.

It is worth noting that each task runs in a separate Node process. This means that if you have a long-running task, it will not block other tasks from running.

## Options

<ParamField body="Config file" type="--config | -c">
  The name of the config file found at the project path. Defaults to `trigger.config.ts`
</ParamField>

<ParamField body="Project ref" type="--project-ref | -p">
  The project ref. Required if there is no config file.
</ParamField>

<ParamField body="Env file" type="--env-file">
  Load environment variables from a file. This will only hydrate the `process.env` of the CLI
  process, not the tasks.
</ParamField>

<ParamField body="Skip update check" type="--skip-update-check">
  Skip checking for `@trigger.dev` package updates.
</ParamField>

### Common options

These options are available on most commands.

<ParamField body="Login profile" type="--profile">
  The login profile to use. Defaults to "default".
</ParamField>

<ParamField body="API URL" type="--api-url | -a">
  Override the default API URL. If not specified, it uses `https://api.trigger.dev`. This can also be set via the `TRIGGER_API_URL` environment variable.
</ParamField>

<ParamField body="Log level" type="--log-level | -l">
  The CLI log level to use. Options are `debug`, `info`, `log`, `warn`, `error`, and `none`. This does not affect the log level of your trigger.dev tasks. Defaults to `log`.
</ParamField>

<ParamField body="Skip telemetry" type="--skip-telemetry">
  Opt-out of sending telemetry data. This can also be done via the `TRIGGER_TELEMETRY_DISABLED` environment variable. Just set it to anything other than an empty string.
</ParamField>

<ParamField body="Help" type="--help | -h">
  Shows the help information for the command.
</ParamField>

<ParamField body="Version" type="--version | -v">
  Displays the version number of the CLI.
</ParamField>

## Concurrently running the terminal

Install the concurrently package as a dev dependency:

```ts
concurrently --raw --kill-others npm:dev:remix npm:dev:trigger
```

Then add something like this in your package.json scripts:

```json
"scripts": {
  "dev": "concurrently --raw --kill-others npm:dev:*",
  "dev:trigger": "npx trigger.dev@latest dev",
  // Add your framework-specific dev script here, for example:
  // "dev:next": "next dev",
  // "dev:remix": "remix dev",
  //...
}
```
