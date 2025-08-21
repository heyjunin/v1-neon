# CLI update command

> Use these options when using the `update` CLI command.

Run the command like this:

<CodeGroup>
  ```bash npm
  npx trigger.dev@latest update
  ```

  ```bash pnpm
  pnpm dlx trigger.dev@latest update
  ```

  ```bash yarn
  yarn dlx trigger.dev@latest update
  ```
</CodeGroup>

## Options

### Common options

These options are available on most commands.

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
