# CLI preview archive command

> The `trigger.dev preview archive` command can be used to archive a preview branch.

Run the command like this:

<CodeGroup>
  ```bash npm
  npx trigger.dev@latest preview archive
  ```

  ```bash pnpm
  pnpm dlx trigger.dev@latest preview archive
  ```

  ```bash yarn
  yarn dlx trigger.dev@latest preview archive
  ```
</CodeGroup>

It will archive the preview branch, automatically detecting the branch name from git. You can manually specify the branch using the `--branch` option.

## Arguments

```
npx trigger.dev@latest preview archive [path]
```

<ParamField body="Project path" type="[path]">
  The path to the project. Defaults to the current directory.
</ParamField>

## Options

<ParamField body="Preview branch" type="--branch | -b">
  When using `--env preview` the branch is automatically detected from git. But you can manually
  specify it by using this option, e.g. `--branch my-branch` or `-b my-branch`.
</ParamField>

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
