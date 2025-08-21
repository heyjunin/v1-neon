# Retrieve Env Var

> Retrieve a specific environment variable for a specific project and environment.

## OpenAPI

````yaml v3-openapi GET /api/v1/projects/{projectRef}/envvars/{env}/{name}
paths:
  path: /api/v1/projects/{projectRef}/envvars/{env}/{name}
  method: get
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
        name:
          schema:
            - type: string
              required: true
              description: The name of the environment variable.
      query: {}
      header: {}
      cookie: {}
    body: {}
    codeSamples:
      - label: Outside of a task
        lang: typescript
        source: >-
          import { envvars } from "@trigger.dev/sdk/v3";


          const variable = await envvars.retrieve("proj_yubjwjsfkxnylobaqvqz",
          "dev", "SLACK_API_KEY");


          console.log(`Value: ${variable.value}`);
      - label: Inside a task
        lang: typescript
        source: |-
          import { envvars, task } from "@trigger.dev/sdk/v3";

          export const myTask = task({
            id: "my-task",
            run: async () => {
              // projectRef and env are automatically inferred from the task context
              const variable = await envvars.retrieve("SLACK_API_KEY");

              console.log(`Value: ${variable.value}`);
            }
          })
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              value:
                allOf:
                  - type: string
                    example: slack_123456
            refIdentifier: '#/components/schemas/EnvVarValue'
            requiredProperties:
              - value
        examples:
          example:
            value:
              value: slack_123456
        description: Successful request
    '400':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - &ref_0
                    type: string
                    example: Something went wrong
            refIdentifier: '#/components/schemas/ErrorResponse'
            requiredProperties: &ref_1
              - error
        examples:
          example:
            value:
              error: Something went wrong
        description: Invalid request parameters or body
    '401':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - *ref_0
            refIdentifier: '#/components/schemas/ErrorResponse'
            requiredProperties: *ref_1
        examples:
          example:
            value:
              error: Something went wrong
        description: Unauthorized request
    '404':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - *ref_0
            refIdentifier: '#/components/schemas/ErrorResponse'
            requiredProperties: *ref_1
        examples:
          example:
            value:
              error: Something went wrong
        description: Resource not found
  deprecated: false
  type: path
components:
  schemas: {}

````