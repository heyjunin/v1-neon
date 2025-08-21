# List runs

> List runs in a specific environment. You can filter the runs by status, created at, task identifier, version, and more.

## OpenAPI

````yaml v3-openapi GET /api/v1/runs
paths:
  path: /api/v1/runs
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
    parameters:
      path: {}
      query:
        page:
          schema:
            - type: object
              properties:
                size:
                  allOf:
                    - type: integer
                      maximum: 100
                      minimum: 10
                      default: 25
                      description: Number of runs per page. Maximum is 100.
                after:
                  allOf:
                    - type: string
                      description: >-
                        The ID of the run to start the page after. This will set
                        the direction of the pagination to forward.
                before:
                  allOf:
                    - type: string
                      description: >-
                        The ID of the run to start the page before. This will
                        set the direction of the pagination to backward.
              description: >
                Use this parameter to paginate the results. You can specify the
                number of runs per page, and the ID of the run to start the page
                after or before.


                For object fields like `page`, you should use the "form"
                encoding style. For example, to get the next page of runs, you
                can use `page[after]=run_1234`.
          style: deepObject
          explode: true
        filter:
          schema:
            - type: object
              properties:
                createdAt:
                  allOf:
                    - type: object
                      properties:
                        from:
                          type: string
                          format: date-time
                          description: The start date to filter the runs by
                        to:
                          type: string
                          format: date-time
                          description: The end date to filter the runs by
                        period:
                          type: string
                          description: The period to filter the runs by
                          example: 1d
                status:
                  allOf:
                    - type: array
                      items:
                        type: string
                        description: The status of the run
                        enum:
                          - PENDING_VERSION
                          - QUEUED
                          - EXECUTING
                          - REATTEMPTING
                          - FROZEN
                          - COMPLETED
                          - CANCELED
                          - FAILED
                          - CRASHED
                          - INTERRUPTED
                          - SYSTEM_FAILURE
                taskIdentifier:
                  allOf:
                    - type: array
                      items:
                        type: string
                      description: The identifier of the task that was run
                version:
                  allOf:
                    - type: array
                      items:
                        type: string
                      description: The version of the worker that executed the run
                bulkAction:
                  allOf:
                    - type: string
                      description: The bulk action ID to filter the runs by
                      example: bulk_1234
                schedule:
                  allOf:
                    - type: string
                      description: The schedule ID to filter the runs by
                      example: schedule_1234
                isTest:
                  allOf:
                    - type: boolean
                      description: Whether the run is a test run or not
                      example: false
                tag:
                  allOf:
                    - type: array
                      items:
                        type: string
                      description: The tags that are attached to the run
              description: >
                Use this parameter to filter the runs. You can filter by created
                at, status, task identifier, and version.


                For array fields, you can provide multiple values to filter by
                using a comma-separated list. For example, to get QUEUED and
                EXECUTING runs, you can use `filter[status]=QUEUED,EXECUTING`.


                For object fields, you should use the "form" encoding style. For
                example, to filter by the period, you can use
                `filter[createdAt][period]=1d`.
          style: deepObject
          explode: true
      header: {}
      cookie: {}
    body: {}
    codeSamples:
      - label: List runs
        lang: typescript
        source: |-
          import { runs } from "@trigger.dev/sdk/v3";

          // Get the first page of runs
          let page = await runs.list({ limit: 20 });

          for (const run of page.data) {
            console.log(`Run ID: ${run.id}, Status: ${run.status}`);
          }

          // Convenience methods are provided for manually paginating:
          while (page.hasNextPage()) {
            page = await page.getNextPage();
            // Do something with the next page of runs
          }

          // Auto-paginate through all runs
          const allRuns = [];

          for await (const run of runs.list({ limit: 20 })) {
            allRuns.push(run);
          }
      - label: Filter runs
        lang: typescript
        source: |-
          import { runs } from "@trigger.dev/sdk/v3";

          const response = await runs.list({
            status: ["QUEUED", "EXECUTING"],
            taskIdentifier: ["my-task", "my-other-task"],
            from: new Date("2024-04-01T00:00:00Z"),
            to: new Date(),
          });

          for (const run of response.data) {
            console.log(`Run ID: ${run.id}, Status: ${run.status}`);
          }
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              data:
                allOf:
                  - type: array
                    items:
                      $ref: '#/components/schemas/ListRunItem'
              pagination:
                allOf:
                  - type: object
                    properties:
                      next:
                        type: string
                        description: >-
                          The run ID to start the next page after. This should
                          be used as the `page[after]` parameter in the next
                          request.
                        example: run_1234
                      previous:
                        type: string
                        description: >-
                          The run ID to start the previous page before. This
                          should be used as the `page[before]` parameter in the
                          next request.
                        example: run_5678
            refIdentifier: '#/components/schemas/ListRunsResult'
        examples:
          example:
            value:
              data:
                - id: run_1234
                  status: PENDING_VERSION
                  taskIdentifier: my-task
                  version: 20240523.1
                  env:
                    id: cl1234
                    name: dev
                    user: Anna
                  idempotencyKey: idempotency_key_1234
                  isTest: false
                  createdAt: '2023-11-07T05:31:56Z'
                  updatedAt: '2023-11-07T05:31:56Z'
                  startedAt: '2023-11-07T05:31:56Z'
                  finishedAt: '2023-11-07T05:31:56Z'
                  delayedUntil: '2023-11-07T05:31:56Z'
                  ttl: 1h42m
                  expiredAt: '2023-11-07T05:31:56Z'
                  tags:
                    - user_5df987al13
                    - org_c6b7dycmxw
                  costInCents: 0.00292
                  baseCostInCents: 0.0025
                  durationMs: 491
              pagination:
                next: run_1234
                previous: run_5678
        description: Successful request
    '400':
      application/json:
        schemaArray:
          - type: object
            properties:
              error:
                allOf:
                  - type: string
                    example: Query Error
              details:
                allOf:
                  - type: array
                    items:
                      type: object
                      required:
                        - code
                        - message
                      properties:
                        code:
                          type: string
                          description: The error code
                          example: custom
                        message:
                          type: string
                          description: The error message
                          example: 'Invalid status values: FOOBAR'
                        path:
                          type: array
                          items:
                            type: string
                          description: The relevant path in the request
                          example:
                            - filter[status]
            refIdentifier: '#/components/schemas/ErrorWithDetailsResponse'
            requiredProperties:
              - error
        examples:
          example:
            value:
              error: Query Error
              details:
                - code: custom
                  message: 'Invalid status values: FOOBAR'
                  path:
                    - filter[status]
        description: Invalid query parameters
    '401':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Unauthorized request
        examples: {}
        description: Unauthorized request
  deprecated: false
  type: path
components:
  schemas:
    TTL:
      type:
        - string
        - number
      description: >-
        The time-to-live for this run. If the run is not executed within this
        time, it will be removed from the queue and never execute. You can use a
        string in this format: `1h`, `1m`, `1h42m` or a number of seconds (min.
        1).
      example: 1h42m
    ListRunItem:
      type: object
      required:
        - id
        - status
        - taskIdentifier
        - createdAt
        - updatedAt
        - isTest
        - env
      properties:
        id:
          type: string
          description: The unique ID of the run, prefixed with `run_`
          example: run_1234
        status:
          type: string
          description: The status of the run
          enum:
            - PENDING_VERSION
            - QUEUED
            - EXECUTING
            - REATTEMPTING
            - FROZEN
            - COMPLETED
            - CANCELED
            - FAILED
            - CRASHED
            - INTERRUPTED
            - SYSTEM_FAILURE
        taskIdentifier:
          type: string
          description: The identifier of the task that was run
          example: my-task
        version:
          type: string
          example: 20240523.1
          description: The version of the worker that executed the run
        env:
          type: object
          description: The environment of the run
          required:
            - id
            - name
          properties:
            id:
              type: string
              description: The unique ID of the environment
              example: cl1234
            name:
              type: string
              description: The name of the environment
              example: dev
            user:
              type: string
              description: >-
                If this is a dev environment, the username of the user
                represented by this environment
              example: Anna
        idempotencyKey:
          type: string
          description: >-
            The idempotency key used to prevent creating duplicate runs, if
            provided
          example: idempotency_key_1234
        isTest:
          type: boolean
          description: Whether the run is a test run or not
          example: false
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
        startedAt:
          type: string
          format: date-time
          description: The time the run started
        finishedAt:
          type: string
          format: date-time
          description: The time the run finished
        delayedUntil:
          type: string
          format: date-time
          description: >-
            If the run was triggered with a delay, this will be the time the run
            will be enqueued to execute
        ttl:
          $ref: '#/components/schemas/TTL'
        expiredAt:
          type: string
          format: date-time
          description: >-
            If the run had a TTL and that time has passed, when the run
            "expired".
        tags:
          type: array
          description: >-
            Tags can be attached to a run to make it easy to find runs (in the
            dashboard or using SDK functions like `runs.list`)
          example:
            - user_5df987al13
            - org_c6b7dycmxw
          items:
            type: string
            description: >-
              A tag must be between 1 and 64 characters, a run can have up to 5
              tags attached to it.
        costInCents:
          type: number
          example: 0.00292
          description: >-
            The compute cost of the run (so far) in cents. This cost does not
            apply to DEV runs.
        baseCostInCents:
          type: number
          example: 0.0025
          description: >-
            The invocation cost of the run in cents. This cost does not apply to
            DEV runs.
        durationMs:
          type: number
          example: 491
          description: >-
            The duration of compute (so far) in milliseconds. This does not
            include waits.

````