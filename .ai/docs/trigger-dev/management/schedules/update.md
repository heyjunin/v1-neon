# Update Schedule

> Update a schedule by its ID. This will only work on `IMPERATIVE` schedules that were created in the dashboard or using the imperative SDK functions like `schedules.create()`.

## OpenAPI

````yaml v3-openapi PUT /api/v1/schedules/{schedule_id}
paths:
  path: /api/v1/schedules/{schedule_id}
  method: put
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
        schedule_id:
          schema:
            - type: string
              required: true
              description: The ID of the schedule.
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              task:
                allOf:
                  - type: string
              cron:
                allOf:
                  - type: string
              externalId:
                allOf:
                  - type: string
              timezone:
                allOf:
                  - type: string
                    example: America/New_York
                    description: >-
                      Defaults to "UTC". In IANA format ("America/New_York"). If
                      set then it will trigger at the CRON frequency in that
                      timezone and respect daylight savings time.
            required: true
            refIdentifier: '#/components/schemas/UpdateScheduleOptions'
            requiredProperties:
              - task
              - cron
        examples:
          example:
            value:
              task: <string>
              cron: <string>
              externalId: <string>
              timezone: America/New_York
    codeSamples:
      - lang: typescript
        source: |-
          import { schedules } from "@trigger.dev/sdk/v3";

          const updatedSchedule = await schedules.update(scheduleId, {
            task: 'my-updated-task',
            cron: '0 0 * * *'
          });
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              id:
                allOf:
                  - type: string
                    example: sched_1234
                    description: The unique ID of the schedule, prefixed with 'sched_'
              task:
                allOf:
                  - type: string
                    example: my-scheduled-task
                    description: >-
                      The id of the scheduled task that will be triggered by
                      this schedule
              type:
                allOf:
                  - type: string
                    example: IMPERATIVE
                    description: >-
                      The type of schedule, `DECLARATIVE` or `IMPERATIVE`.
                      Declarative schedules are declared in your code by setting
                      the `cron` property on a `schedules.task`. Imperative
                      schedules are created in the dashboard or by using the
                      imperative SDK functions like `schedules.create()`.
              active:
                allOf:
                  - type: boolean
                    example: true
                    description: Whether the schedule is active or not
              deduplicationKey:
                allOf:
                  - type: string
                    example: dedup_key_1234
                    description: >-
                      The deduplication key used to prevent creating duplicate
                      schedules
              externalId:
                allOf:
                  - type: string
                    example: user_1234
                    description: >-
                      The external ID of the schedule. Can be anything that is
                      useful to you (e.g., user ID, org ID, etc.)
              generator:
                allOf:
                  - type: object
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
                allOf:
                  - type: string
                    example: America/New_York
                    description: >-
                      Defaults to UTC. In IANA format, if set then it will
                      trigger at the CRON frequency in that timezone and respect
                      daylight savings time.
              nextRun:
                allOf:
                  - type: string
                    format: date-time
                    description: The next time the schedule will run
                    example: '2024-04-01T00:00:00Z'
              environments:
                allOf:
                  - type: array
                    items:
                      $ref: '#/components/schemas/ScheduleEnvironment'
            refIdentifier: '#/components/schemas/ScheduleObject'
        examples:
          example:
            value:
              id: sched_1234
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
        description: Schedule updated successfully
    '400':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Invalid request parameters
        examples: {}
        description: Invalid request parameters
    '401':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Unauthorized
        examples: {}
        description: Unauthorized
    '404':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Resource not found
        examples: {}
        description: Resource not found
    '422':
      _mintlify/placeholder:
        schemaArray:
          - type: any
            description: Unprocessable Entity
        examples: {}
        description: Unprocessable Entity
  deprecated: false
  type: path
components:
  schemas:
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