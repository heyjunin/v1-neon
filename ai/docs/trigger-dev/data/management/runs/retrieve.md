# Retrieve run

> Retrieve information about a run, including its status, payload, output, and attempts. If you authenticate with a Public API key, we will omit the payload and output fields for security reasons.


## OpenAPI

````yaml v3-openapi GET /api/v3/runs/{runId}
paths:
  path: /api/v3/runs/{runId}
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
        source: >-
          import { runs } from "@trigger.dev/sdk/v3";


          const result = await runs.retrieve("run_1234");


          // We include boolean helpers to check the status of the run

          // (isSuccess, isFailed, isCompleted, etc.)

          if (result.isSuccess) {
            console.log("Run was successful with output", result.output);
          }


          // You also have access to the run status that includes more granular
          information

          console.log("Run status:", result.status);


          // You can access the payload and output

          console.log("Payload:", result.payload);

          console.log("Output:", result.output);


          // You can also access the attempts, which will give you information
          about errors (if they exist)

          for (const attempt of result.attempts) {
            if (attempt.status === "FAILED") {
              console.log("Attempt failed with error:", attempt.error);
            }
          }
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              id:
                allOf:
                  - &ref_2
                    type: string
                    description: The unique ID of the run, prefixed with `run_`
                    example: run_1234
              status:
                allOf:
                  - &ref_3
                    type: string
                    description: The status of the run
                    enum:
                      - PENDING_VERSION
                      - DELAYED
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
                  - &ref_4
                    type: string
                    description: The identifier of the task that was run
                    example: my-task
              version:
                allOf:
                  - &ref_5
                    type: string
                    example: 20240523.1
                    description: The version of the worker that executed the run
              idempotencyKey:
                allOf:
                  - &ref_6
                    type: string
                    description: >-
                      The idempotency key used to prevent creating duplicate
                      runs, if provided
                    example: idempotency_key_1234
              createdAt:
                allOf:
                  - &ref_7
                    type: string
                    format: date-time
              updatedAt:
                allOf:
                  - &ref_8
                    type: string
                    format: date-time
              isTest:
                allOf:
                  - &ref_9
                    type: boolean
                    description: Whether the run is a test run or not
                    example: false
              startedAt:
                allOf:
                  - &ref_10
                    type: string
                    format: date-time
                    description: The time the run started
              finishedAt:
                allOf:
                  - &ref_11
                    type: string
                    format: date-time
                    description: The time the run finished
              delayedUntil:
                allOf:
                  - &ref_12
                    type: string
                    format: date-time
                    description: >-
                      If the run was triggered with a delay, this will be the
                      time the run will be enqueued to execute
              ttl:
                allOf:
                  - &ref_13
                    $ref: '#/components/schemas/TTL'
              expiredAt:
                allOf:
                  - &ref_14
                    type: string
                    format: date-time
                    description: >-
                      If the run had a TTL and that time has passed, when the
                      run "expired".
              tags:
                allOf:
                  - &ref_15
                    type: array
                    description: >-
                      Tags can be attached to a run to make it easy to find runs
                      (in the dashboard or using SDK functions like `runs.list`)
                    example:
                      - user_5df987al13
                      - org_c6b7dycmxw
                    items:
                      type: string
                      description: >-
                        A tag must be between 1 and 64 characters, a run can
                        have up to 5 tags attached to it.
              metadata:
                allOf:
                  - &ref_16
                    type: object
                    description: >-
                      The metadata of the run. See [Metadata](/runs/metadata)
                      for more information.
                    example:
                      foo: bar
              costInCents:
                allOf:
                  - &ref_17
                    type: number
                    example: 0.00292
                    description: >-
                      The compute cost of the run (so far) in cents. This cost
                      does not apply to DEV runs.
              baseCostInCents:
                allOf:
                  - &ref_18
                    type: number
                    example: 0.0025
                    description: >-
                      The invocation cost of the run in cents. This cost does
                      not apply to DEV runs.
              durationMs:
                allOf:
                  - &ref_19
                    type: number
                    example: 491
                    description: >-
                      The duration of compute (so far) in milliseconds. This
                      does not include waits.
              depth:
                allOf:
                  - &ref_20
                    type: integer
                    example: 0
                    description: >-
                      The depth of the run in the task run hierarchy. The root
                      run has a depth of 0.
              batchId:
                allOf:
                  - &ref_21
                    type: string
                    description: The ID of the batch that this run belongs to
                    example: batch_1234
              triggerFunction:
                allOf:
                  - &ref_22
                    type: string
                    description: The name of the function that triggered the run
                    enum:
                      - trigger
                      - triggerAndWait
                      - batchTrigger
                      - batchTriggerAndWait
              payload:
                allOf:
                  - type: object
                    description: >-
                      The payload that was sent to the task. Will be omitted if
                      the request was made with a Public API key
                    example:
                      foo: bar
              payloadPresignedUrl:
                allOf:
                  - type: string
                    description: >-
                      The presigned URL to download the payload. Will only be
                      included if the payload is too large to be included in the
                      response. Expires in 5 minutes.
                    example: >-
                      https://r2.cloudflarestorage.com/packets/yubjwjsfkxnylobaqvqz/dev/run_p4omhh45hgxxnq1re6ovy/payload.json?X-Amz-Expires=300&X-Amz-Date=20240625T154526Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=10b064e58a0680db5b5e077be2be3b2a%2F20240625%2Fauto%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=88604cb993ffc151b4d73f2439da431d9928488e4b3dcfa4a7c8f1819
              output:
                allOf:
                  - type: object
                    description: >-
                      The output of the run. Will be omitted if the request was
                      made with a Public API key
                    example:
                      foo: bar
              outputPresignedUrl:
                allOf:
                  - type: string
                    description: >-
                      The presigned URL to download the output. Will only be
                      included if the output is too large to be included in the
                      response. Expires in 5 minutes.
                    example: >-
                      https://r2.cloudflarestorage.com/packets/yubjwjsfkxnylobaqvqz/dev/run_p4omhh45hgxxnq1re6ovy/payload.json?X-Amz-Expires=300&X-Amz-Date=20240625T154526Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=10b064e58a0680db5b5e077be2be3b2a%2F20240625%2Fauto%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=88604cb993ffc151b4d73f2439da431d9928488e4b3dcfa4a7c8f1819
              relatedRuns:
                allOf:
                  - type: object
                    properties:
                      root:
                        $ref: '#/components/schemas/CommonRunObject'
                        description: >-
                          The root run of the run hierarchy. Will be omitted if
                          the run is the root run
                      parent:
                        $ref: '#/components/schemas/CommonRunObject'
                        description: >-
                          The parent run of the run. Will be omitted if the run
                          is the root run
                      children:
                        description: >-
                          The immediate children of the run. Will be omitted if
                          the run has no children
                        type: array
                        items:
                          $ref: '#/components/schemas/CommonRunObject'
              schedule:
                allOf:
                  - type: object
                    description: >-
                      The schedule that triggered the run. Will be omitted if
                      the run was not triggered by a schedule
                    required:
                      - id
                      - generator
                    properties:
                      id:
                        type: string
                        description: The unique ID of the schedule, prefixed with `sched_`
                        example: sched_1234
                      externalId:
                        type: string
                        description: >-
                          The external ID of the schedule. Can be anything that
                          is useful to you (e.g., user ID, org ID, etc.)
                        example: user_1234
                      deduplicationKey:
                        type: string
                        description: >-
                          The deduplication key used to prevent creating
                          duplicate schedules
                        example: dedup_key_1234
                      generator:
                        type: object
                        properties:
                          type:
                            type: string
                            enum:
                              - CRON
                          expression:
                            type: string
                            description: The cron expression used to generate the schedule
                            example: 0 0 * * *
                          description:
                            type: string
                            description: The description of the generator in plain english
                            example: Every day at midnight
              attempts:
                allOf:
                  - type: array
                    items:
                      type: object
                      required:
                        - id
                        - status
                        - createdAt
                        - updatedAt
                      properties:
                        id:
                          type: string
                          description: >-
                            The unique ID of the attempt, prefixed with
                            `attempt_`
                          example: attempt_1234
                        status:
                          type: string
                          enum:
                            - PENDING
                            - EXECUTING
                            - PAUSED
                            - COMPLETED
                            - FAILED
                            - CANCELED
                        error:
                          $ref: '#/components/schemas/SerializedError'
                        createdAt:
                          type: string
                          format: date-time
                        updatedAt:
                          type: string
                          format: date-time
                        startedAt:
                          type: string
                          format: date-time
                        completedAt:
                          type: string
                          format: date-time
            refIdentifier: '#/components/schemas/CommonRunObject'
            requiredProperties:
              - id
              - status
              - taskIdentifier
              - createdAt
              - updatedAt
              - attempts
        examples:
          example:
            value:
              id: run_1234
              status: PENDING_VERSION
              taskIdentifier: my-task
              version: 20240523.1
              idempotencyKey: idempotency_key_1234
              createdAt: '2023-11-07T05:31:56Z'
              updatedAt: '2023-11-07T05:31:56Z'
              isTest: false
              startedAt: '2023-11-07T05:31:56Z'
              finishedAt: '2023-11-07T05:31:56Z'
              delayedUntil: '2023-11-07T05:31:56Z'
              ttl: 1h42m
              expiredAt: '2023-11-07T05:31:56Z'
              tags: &ref_0
                - user_5df987al13
                - org_c6b7dycmxw
              metadata: &ref_1
                foo: bar
              costInCents: 0.00292
              baseCostInCents: 0.0025
              durationMs: 491
              depth: 0
              batchId: batch_1234
              triggerFunction: trigger
              payload:
                foo: bar
              payloadPresignedUrl: >-
                https://r2.cloudflarestorage.com/packets/yubjwjsfkxnylobaqvqz/dev/run_p4omhh45hgxxnq1re6ovy/payload.json?X-Amz-Expires=300&X-Amz-Date=20240625T154526Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=10b064e58a0680db5b5e077be2be3b2a%2F20240625%2Fauto%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=88604cb993ffc151b4d73f2439da431d9928488e4b3dcfa4a7c8f1819
              output:
                foo: bar
              outputPresignedUrl: >-
                https://r2.cloudflarestorage.com/packets/yubjwjsfkxnylobaqvqz/dev/run_p4omhh45hgxxnq1re6ovy/payload.json?X-Amz-Expires=300&X-Amz-Date=20240625T154526Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=10b064e58a0680db5b5e077be2be3b2a%2F20240625%2Fauto%2Fs3%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=88604cb993ffc151b4d73f2439da431d9928488e4b3dcfa4a7c8f1819
              relatedRuns:
                root:
                  id: run_1234
                  status: PENDING_VERSION
                  taskIdentifier: my-task
                  version: 20240523.1
                  idempotencyKey: idempotency_key_1234
                  createdAt: '2023-11-07T05:31:56Z'
                  updatedAt: '2023-11-07T05:31:56Z'
                  isTest: false
                  startedAt: '2023-11-07T05:31:56Z'
                  finishedAt: '2023-11-07T05:31:56Z'
                  delayedUntil: '2023-11-07T05:31:56Z'
                  ttl: 1h42m
                  expiredAt: '2023-11-07T05:31:56Z'
                  tags: *ref_0
                  metadata: *ref_1
                  costInCents: 0.00292
                  baseCostInCents: 0.0025
                  durationMs: 491
                  depth: 0
                  batchId: batch_1234
                  triggerFunction: trigger
                parent:
                  id: run_1234
                  status: PENDING_VERSION
                  taskIdentifier: my-task
                  version: 20240523.1
                  idempotencyKey: idempotency_key_1234
                  createdAt: '2023-11-07T05:31:56Z'
                  updatedAt: '2023-11-07T05:31:56Z'
                  isTest: false
                  startedAt: '2023-11-07T05:31:56Z'
                  finishedAt: '2023-11-07T05:31:56Z'
                  delayedUntil: '2023-11-07T05:31:56Z'
                  ttl: 1h42m
                  expiredAt: '2023-11-07T05:31:56Z'
                  tags: *ref_0
                  metadata: *ref_1
                  costInCents: 0.00292
                  baseCostInCents: 0.0025
                  durationMs: 491
                  depth: 0
                  batchId: batch_1234
                  triggerFunction: trigger
                children:
                  - id: run_1234
                    status: PENDING_VERSION
                    taskIdentifier: my-task
                    version: 20240523.1
                    idempotencyKey: idempotency_key_1234
                    createdAt: '2023-11-07T05:31:56Z'
                    updatedAt: '2023-11-07T05:31:56Z'
                    isTest: false
                    startedAt: '2023-11-07T05:31:56Z'
                    finishedAt: '2023-11-07T05:31:56Z'
                    delayedUntil: '2023-11-07T05:31:56Z'
                    ttl: 1h42m
                    expiredAt: '2023-11-07T05:31:56Z'
                    tags: *ref_0
                    metadata: *ref_1
                    costInCents: 0.00292
                    baseCostInCents: 0.0025
                    durationMs: 491
                    depth: 0
                    batchId: batch_1234
                    triggerFunction: trigger
              schedule:
                id: sched_1234
                externalId: user_1234
                deduplicationKey: dedup_key_1234
                generator:
                  type: CRON
                  expression: 0 0 * * *
                  description: Every day at midnight
              attempts:
                - id: attempt_1234
                  status: PENDING
                  error:
                    message: Something went wrong
                    name: Error
                    stackTrace: 'Error: Something went wrong'
                  createdAt: '2023-11-07T05:31:56Z'
                  updatedAt: '2023-11-07T05:31:56Z'
                  startedAt: '2023-11-07T05:31:56Z'
                  completedAt: '2023-11-07T05:31:56Z'
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
    CommonRunObject:
      type: object
      required:
        - id
        - status
        - taskIdentifier
        - createdAt
        - updatedAt
      properties:
        id: *ref_2
        status: *ref_3
        taskIdentifier: *ref_4
        version: *ref_5
        idempotencyKey: *ref_6
        createdAt: *ref_7
        updatedAt: *ref_8
        isTest: *ref_9
        startedAt: *ref_10
        finishedAt: *ref_11
        delayedUntil: *ref_12
        ttl: *ref_13
        expiredAt: *ref_14
        tags: *ref_15
        metadata: *ref_16
        costInCents: *ref_17
        baseCostInCents: *ref_18
        durationMs: *ref_19
        depth: *ref_20
        batchId: *ref_21
        triggerFunction: *ref_22
    SerializedError:
      type: object
      required:
        - message
      properties:
        message:
          type: string
          example: Something went wrong
        name:
          type: string
          example: Error
        stackTrace:
          type: string
          example: 'Error: Something went wrong'

````