# Create Env Var

> Create a new environment variable for a specific project and environment.

## OpenAPI

````yaml v3-openapi POST /api/v1/projects/{projectRef}/envvars/{env}
paths:
  path: /api/v1/projects/{projectRef}/envvars/{env}
  method: post
  servers:
    - url: https://api.trigger.dev
      description: Trigger.dev API
  request:
    security:
      - title: secretKey
        parameters:
          query: {}
          header:
            Authorization:
              type: http
              scheme: bearer
              description: >
                Use your project-specific Secret API key. Will start with
                `tr_dev_`, `tr_prod`, `tr_stg`, etc.


                You can find your Secret API key in the API Keys section of your
                Trigger.dev project dashboard.


                Our TypeScript SDK will default to using the value of the
                `TRIGGER_SECRET_KEY` environment variable if it is set. If you
                are using the SDK in a different environment, you can set the
                key using the `configure` function.


                ```typescript

                import { configure } from "@trigger.dev/sdk/v3";


                configure({ accessToken: "tr_dev_1234" });

                ```
          cookie: {}
      - title: personalAccessToken
        parameters:
          query: {}
          header:
            Authorization:
              type: http
              scheme: bearer
              description: >
                Use your user-specific Personal Access Token, which you can
                generate from the Trigger.dev dashboard in your account
                settings. (It will start with `tr_pat_`.)


                Our TypeScript SDK will default to using the value of the
                `TRIGGER_ACCESS_TOKEN` environment variable if it is set. If you
                are using the SDK in a different environment, you can set the
                key using the `configure` function.


                ```typescript

                import { configure } from "@trigger.dev/sdk/v3";


                configure({ accessToken: "tr_pat_1234" });

                ```
          cookie: {}
    parameters:
      path:
        projectRef:
          schema:
            - type: string
              required: true
              description: >-
                The external ref of the project. You can find this in the
                project settings. Starts with `proj_`.
        env:
          schema:
            - type: enum<string>
              enum:
                - dev
                - staging
                - prod
              required: true
              description: The environment of the project to list variables for.
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              name:
                allOf:
                  - type: string
                    example: SLACK_API_KEY
              value:
                allOf:
                  - type: string
                    example: slack_123456
            required: true
            refIdentifier: '#/components/schemas/EnvVar'
            requiredProperties:
              - name
              - value
        examples:
          example:
            value:
              name: SLACK_API_KEY
              value: slack_123456
    codeSamples:
      - label: Outside of a task
        lang: typescript
        source: |-
          import { envvars } from "@trigger.dev/sdk/v3";

          await envvars.create("proj_yubjwjsfkxnylobaqvqz", "dev", {
            name: "SLACK_API_KEY",
            value: "slack_123456"
          });
      - label: Inside a task
        lang: typescript
        source: |-
          import { envvars, task } from "@trigger.dev/sdk/v3";

          export const myTask = task({
            id: "my-task",
            run: async () => {
              // projectRef and env are automatically inferred from the task context
              await envvars.create({
                name: "SLACK_API_KEY",
                value: "slack_123456"
              });
            }
          })
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              success:
                allOf:
                  - type: boolean
            refIdentifier: '#/components/schemas/SucceedResponse'
            requiredProperties:
              - success
        examples:
          example:
            value:
              success: true
        description: Environment variable created successfully
    '400':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - type: string
              issues:
                allOf:
                  - type: array
                    items:
                      type: object
              variableErrors:
                allOf:
                  - type: array
                    items:
                      type: object
            refIdentifier: '#/components/schemas/InvalidEnvVarsRequestResponse'
        examples:
          example:
            value:
              error: <string>
              issues:
                - {}
              variableErrors:
                - {}
        description: Invalid request parameters or body
    '401':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - type: string
        examples:
          example:
            value:
              error: <string>
        description: Unauthorized request
    '404':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - type: string
        examples:
          example:
            value:
              error: <string>
        description: Resource not found
  deprecated: false
  type: path
components:
  schemas: {}

````