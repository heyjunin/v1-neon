# Import Env Vars

> Upload mulitple environment variables for a specific project and environment.

## OpenAPI

````yaml v3-openapi POST /api/v1/projects/{projectRef}/envvars/{env}/import
paths:
  path: /api/v1/projects/{projectRef}/envvars/{env}/import
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
              variables:
                allOf:
                  - type: array
                    items:
                      $ref: '#/components/schemas/EnvVar'
              override:
                allOf:
                  - type: boolean
                    description: Whether to override existing variables or not
                    default: false
            required: true
            requiredProperties:
              - variables
        examples:
          example:
            value:
              variables:
                - name: SLACK_API_KEY
                  value: slack_123456
              override: false
    codeSamples:
      - label: Import variables from an array
        lang: typescript
        source: |-
          import { envvars } from "@trigger.dev/sdk/v3";

          await envvars.upload("proj_yubjwjsfkxnylobaqvqz", "dev", {
            variables: { SLACK_API_KEY: "slack_key_1234" },
            override: false
          });
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
        description: Environment variables imported successfully
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
  schemas:
    EnvVar:
      type: object
      properties:
        name:
          type: string
          example: SLACK_API_KEY
        value:
          type: string
          example: slack_123456
      required:
        - name
        - value

````