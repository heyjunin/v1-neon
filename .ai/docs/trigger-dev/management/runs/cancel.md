# Cancel run

> Cancels an in-progress run. If the run is already completed, this will have no effect.

## OpenAPI

````yaml v3-openapi POST /api/v2/runs/{runId}/cancel
paths:
  path: /api/v2/runs/{runId}/cancel
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
    parameters:
      path:
        runId:
          schema:
            - type: string
              required: true
              description: >
                The ID of an run, starts with `run_`. The run ID will be
                returned when you trigger a run on a task.
      query: {}
      header: {}
      cookie: {}
    body: {}
    codeSamples:
      - lang: typescript
        source: |-
          import { runs } from "@trigger.dev/sdk/v3";

          await runs.cancel("run_1234");
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              id:
                allOf:
                  - type: string
                    description: The ID of the run that was canceled.
                    example: run_1234
        examples:
          example:
            value:
              id: run_1234
        description: Successful request
    '400':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - type: string
                    enum:
                      - Invalid or missing run ID
                      - Failed to create new run
        examples:
          example:
            value:
              error: Invalid or missing run ID
        description: Invalid request
    '401':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - type: string
                    enum:
                      - Invalid or Missing API key
        examples:
          example:
            value:
              error: Invalid or Missing API key
        description: Unauthorized request
    '404':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - type: string
                    enum:
                      - Run not found
        examples:
          example:
            value:
              error: Run not found
        description: Resource not found
  deprecated: false
  type: path
components:
  schemas: {}

````