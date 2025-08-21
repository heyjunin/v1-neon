# List Schedules

> List all schedules. You can also paginate the results.

## OpenAPI

````yaml v3-openapi GET /api/v1/schedules
paths:
  path: /api/v1/schedules
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
            - type: integer
              required: false
              description: Page number of the schedule listing
        perPage:
          schema:
            - type: integer
              required: false
              description: Number of schedules per page
      header: {}
      cookie: {}
    body: {}
    codeSamples:
      - lang: typescript
        source: |-
          import { schedules } from "@trigger.dev/sdk/v3";

          const allSchedules = await schedules.list();
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
                      $ref: '#/components/schemas/ScheduleObject'
              pagination:
                allOf:
                  - type: object
                    properties:
                      currentPage:
                        type: integer
                      totalPages:
                        type: integer
                      count:
                        type: integer
            refIdentifier: '#/components/schemas/ListSchedulesResult'
        examples:
          example:
            value:
              data:
                - id: sched_1234
                  task: my-scheduled-task
                  type: IMPERATIVE
                  active: true
                  deduplicationKey: dedup_key_1234
                  externalId: user_1234
                  generator:
                    type: CRON
                    expression: 0 0 * * *
                    description: Every day at midnight
                  timezone: America/New_York
                  nextRun: '2024-04-01T00:00:00Z'
                  environments:
                    - id: <string>
                      type: <string>
                      userName: <string>
              pagination:
                currentPage: 123
                totalPages: 123
                count: 123
        description: Successful request
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
    ScheduleObject:
      type: object
      properties:
        id:
          type: string
          example: sched_1234
          description: The unique ID of the schedule, prefixed with 'sched_'
        task:
          type: string
          example: my-scheduled-task
          description: The id of the scheduled task that will be triggered by this schedule
        type:
          type: string
          example: IMPERATIVE
          description: >-
            The type of schedule, `DECLARATIVE` or `IMPERATIVE`. Declarative
            schedules are declared in your code by setting the `cron` property
            on a `schedules.task`. Imperative schedules are created in the
            dashboard or by using the imperative SDK functions like
            `schedules.create()`.
        active:
          type: boolean
          example: true
          description: Whether the schedule is active or not
        deduplicationKey:
          type: string
          example: dedup_key_1234
          description: The deduplication key used to prevent creating duplicate schedules
        externalId:
          type: string
          example: user_1234
          description: >-
            The external ID of the schedule. Can be anything that is useful to
            you (e.g., user ID, org ID, etc.)
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
        timezone:
          type: string
          example: America/New_York
          description: >-
            Defaults to UTC. In IANA format, if set then it will trigger at the
            CRON frequency in that timezone and respect daylight savings time.
        nextRun:
          type: string
          format: date-time
          description: The next time the schedule will run
          example: '2024-04-01T00:00:00Z'
        environments:
          type: array
          items:
            $ref: '#/components/schemas/ScheduleEnvironment'
    ScheduleEnvironment:
      type: object
      properties:
        id:
          type: string
        type:
          type: string
        userName:
          type: string

````