# CLI deploy command

> Use the deploy command to deploy your tasks to Trigger.dev.

Run the command like this:

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

<Warning>
  This will fail in CI if any version mismatches are detected. Ensure everything runs locally first
  using the [dev](/cli-dev-commands) command and don't bypass the version checks!
</Warning>

It performs a few steps to deploy:

1. Optionally updates packages when running locally.
2. Compiles and bundles the code.
3. Deploys the code to the Trigger.dev instance.
4. Registers the tasks as a new version in the environment (prod by default).

## Deploying from CI

When deploying from CI/CD environments such as GitHub Actions, GitLab CI, or Jenkins, you need to authenticate non-interactively by setting the `TRIGGER_ACCESS_TOKEN` environment variable. Please see the [CI / GitHub Actions guide](/github-actions) for more information.

## Arguments

```
npx trigger.dev@latest deploy [path]
```

<ParamField body="Project path" type="[path]">
  The path to the project. Defaults to the current directory.
</ParamField>

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

<ParamField body="Environment" type="--env | -e">
  Defaults to `prod` but you can specify `staging` or `preview`. If you specify `preview` we will
  try and automatically detect the branch name from git.
</ParamField>

<ParamField body="Preview branch" type="--branch | -b">
  When using `--env preview` the branch is automatically detected from git. But you can manually
  specify it by using this option, e.g. `--branch my-branch` or `-b my-branch`.
</ParamField>

<ParamField body="Dry run" type="--dry-run">
  Create a deployable build but don't deploy it. Prints out the build path so you can inspect it.
</ParamField>

<ParamField body="Skip promotion" type="--skip-promotion">
  Skips automatically promoting the newly deployed version to the "current" deploy.
</ParamField>

<ParamField body="Skip syncing env vars" type="--skip-sync-env-vars">
  Turn off syncing environment variables with the Trigger.dev instance.
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

### Self-hosting

These options are typically used when [self-hosting](/open-source-self-hosting) or for local development.

<ParamField body="Self-hosted (builds locally)" type="--self-hosted">
  Builds and loads the image using your local docker. Use the `--registry` option to specify the
  registry to push the image to when using `--self-hosted`, or just use `--push` to push to the
  default registry.
</ParamField>

<ParamField body="Skip deploying the image" type="--skip-deploy | -D">
  Load the built image into your local docker.
</ParamField>

<ParamField body="Load image" type="--load-image">
  Loads the image into your local docker after building it.
</ParamField>

<ParamField body="Registry" type="--registry">
  Specify the registry to push the image to when using `--self-hosted`. Will automatically enable
  `--push`.
</ParamField>

<ParamField body="Push image" type="--push">
  When using the `--self-hosted` flag, push the image to the registry.
</ParamField>

<ParamField body="Namespace" type="--namespace">
  The namespace to use when pushing the image to the registry. For example, if pushing to Docker
  Hub, the namespace is your Docker Hub username.
</ParamField>

<ParamField body="Network" type="--network">
  The networking mode for RUN instructions when using `--self-hosted`.
</ParamField>

## Examples

### Push to Docker Hub (self-hosted)

An example of deploying to Docker Hub when using a self-hosted setup:

```bash
npx trigger.dev@latest deploy \
  --self-hosted \
  --load-image \
  --registry docker.io \
  --namespace mydockerhubusername
```
