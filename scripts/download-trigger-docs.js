const fs = require("fs/promises");
const path = require("path");

const urls = [
  "https://trigger.dev/docs/apikeys.md",
  "https://trigger.dev/docs/bulk-actions.md",
  "https://trigger.dev/docs/changelog.md",
  "https://trigger.dev/docs/cli-deploy-commands.md",
  "https://trigger.dev/docs/cli-dev.md",
  "https://trigger.dev/docs/cli-dev-commands.md",
  "https://trigger.dev/docs/cli-init-commands.md",
  "https://trigger.dev/docs/cli-introduction.md",
  "https://trigger.dev/docs/cli-list-profiles-commands.md",
  "https://trigger.dev/docs/cli-login-commands.md",
  "https://trigger.dev/docs/cli-logout-commands.md",
  "https://trigger.dev/docs/cli-preview-archive.md",
  "https://trigger.dev/docs/cli-promote-commands.md",
  "https://trigger.dev/docs/cli-switch.md",
  "https://trigger.dev/docs/cli-update-commands.md",
  "https://trigger.dev/docs/cli-whoami-commands.md",
  "https://trigger.dev/docs/community.md",
  "https://trigger.dev/docs/config/config-file.md",
  "https://trigger.dev/docs/config/extensions/additionalFiles.md",
  "https://trigger.dev/docs/config/extensions/additionalPackages.md",
  "https://trigger.dev/docs/config/extensions/aptGet.md",
  "https://trigger.dev/docs/config/extensions/audioWaveform.md",
  "https://trigger.dev/docs/config/extensions/custom.md",
  "https://trigger.dev/docs/config/extensions/emitDecoratorMetadata.md",
  "https://trigger.dev/docs/config/extensions/esbuildPlugin.md",
  "https://trigger.dev/docs/config/extensions/ffmpeg.md",
  "https://trigger.dev/docs/config/extensions/lightpanda.md",
  "https://trigger.dev/docs/config/extensions/overview.md",
  "https://trigger.dev/docs/config/extensions/playwright.md",
  "https://trigger.dev/docs/config/extensions/prismaExtension.md",
  "https://trigger.dev/docs/config/extensions/puppeteer.md",
  "https://trigger.dev/docs/config/extensions/pythonExtension.md",
  "https://trigger.dev/docs/config/extensions/syncEnvVars.md",
  "https://trigger.dev/docs/context.md",
  "https://trigger.dev/docs/deploy-environment-variables.md",
  "https://trigger.dev/docs/deployment/atomic-deployment.md",
  "https://trigger.dev/docs/deployment/overview.md",
  "https://trigger.dev/docs/deployment/preview-branches.md",
  "https://trigger.dev/docs/errors-retrying.md",
  "https://trigger.dev/docs/github-actions.md",
  "https://trigger.dev/docs/github-repo.md",
  "https://trigger.dev/docs/guides/ai-agents/generate-translate-copy.md",
  "https://trigger.dev/docs/guides/ai-agents/overview.md",
  "https://trigger.dev/docs/guides/ai-agents/respond-and-check-content.md",
  "https://trigger.dev/docs/guides/ai-agents/route-question.md",
  "https://trigger.dev/docs/guides/ai-agents/translate-and-refine.md",
  "https://trigger.dev/docs/guides/ai-agents/verify-news-article.md",
  "https://trigger.dev/docs/guides/community/dotenvx.md",
  "https://trigger.dev/docs/guides/community/fatima.md",
  "https://trigger.dev/docs/guides/community/rate-limiter.md",
  "https://trigger.dev/docs/guides/community/sveltekit.md",
  "https://trigger.dev/docs/guides/cursor-rules.md",
  "https://trigger.dev/docs/guides/example-projects/batch-llm-evaluator.md",
  "https://trigger.dev/docs/guides/example-projects/claude-thinking-chatbot.md",
  "https://trigger.dev/docs/guides/example-projects/human-in-the-loop-workflow.md",
  "https://trigger.dev/docs/guides/example-projects/mastra-agents-with-memory.md",
  "https://trigger.dev/docs/guides/example-projects/meme-generator-human-in-the-loop.md",
  "https://trigger.dev/docs/guides/example-projects/openai-agent-sdk-guardrails.md",
  "https://trigger.dev/docs/guides/example-projects/openai-agents-sdk-typescript-playground.md",
  "https://trigger.dev/docs/guides/example-projects/realtime-csv-importer.md",
  "https://trigger.dev/docs/guides/example-projects/realtime-fal-ai.md",
  "https://trigger.dev/docs/guides/example-projects/turborepo-monorepo-prisma.md",
  "https://trigger.dev/docs/guides/example-projects/vercel-ai-sdk-deep-research.md",
  "https://trigger.dev/docs/guides/example-projects/vercel-ai-sdk-image-generator.md",
  "https://trigger.dev/docs/guides/examples/dall-e3-generate-image.md",
  "https://trigger.dev/docs/guides/examples/deepgram-transcribe-audio.md",
  "https://trigger.dev/docs/guides/examples/fal-ai-image-to-cartoon.md",
  "https://trigger.dev/docs/guides/examples/fal-ai-realtime.md",
  "https://trigger.dev/docs/guides/examples/ffmpeg-video-processing.md",
  "https://trigger.dev/docs/guides/examples/firecrawl-url-crawl.md",
  "https://trigger.dev/docs/guides/examples/libreoffice-pdf-conversion.md",
  "https://trigger.dev/docs/guides/examples/lightpanda.md",
  "https://trigger.dev/docs/guides/examples/open-ai-with-retrying.md",
  "https://trigger.dev/docs/guides/examples/pdf-to-image.md",
  "https://trigger.dev/docs/guides/examples/puppeteer.md",
  "https://trigger.dev/docs/guides/examples/react-email.md",
  "https://trigger.dev/docs/guides/examples/react-pdf.md",
  "https://trigger.dev/docs/guides/examples/resend-email-sequence.md",
  "https://trigger.dev/docs/guides/examples/satori.md",
  "https://trigger.dev/docs/guides/examples/scrape-hacker-news.md",
  "https://trigger.dev/docs/guides/examples/sentry-error-tracking.md",
  "https://trigger.dev/docs/guides/examples/sharp-image-processing.md",
  "https://trigger.dev/docs/guides/examples/stripe-webhook.md",
  "https://trigger.dev/docs/guides/examples/supabase-database-operations.md",
  "https://trigger.dev/docs/guides/examples/supabase-storage-upload.md",
  "https://trigger.dev/docs/guides/examples/vercel-ai-sdk.md",
  "https://trigger.dev/docs/guides/examples/vercel-sync-env-vars.md",
  "https://trigger.dev/docs/guides/frameworks/bun.md",
  "https://trigger.dev/docs/guides/frameworks/drizzle.md",
  "https://trigger.dev/docs/guides/frameworks/nextjs.md",
  "https://trigger.dev/docs/guides/frameworks/nextjs-webhooks.md",
  "https://trigger.dev/docs/guides/frameworks/nodejs.md",
  "https://trigger.dev/docs/guides/frameworks/prisma.md",
  "https://trigger.dev/docs/guides/frameworks/remix.md",
  "https://trigger.dev/docs/guides/frameworks/remix-webhooks.md",
  "https://trigger.dev/docs/guides/frameworks/sequin.md",
  "https://trigger.dev/docs/guides/frameworks/supabase-authentication.md",
  "https://trigger.dev/docs/guides/frameworks/supabase-edge-functions-basic.md",
  "https://trigger.dev/docs/guides/frameworks/supabase-edge-functions-database-webhooks.md",
  "https://trigger.dev/docs/guides/frameworks/supabase-guides-overview.md",
  "https://trigger.dev/docs/guides/frameworks/webhooks-guides-overview.md",
  "https://trigger.dev/docs/guides/introduction.md",
  "https://trigger.dev/docs/guides/python/python-crawl4ai.md",
  "https://trigger.dev/docs/guides/python/python-doc-to-markdown.md",
  "https://trigger.dev/docs/guides/python/python-image-processing.md",
  "https://trigger.dev/docs/guides/python/python-pdf-form-extractor.md",
  "https://trigger.dev/docs/help-email.md",
  "https://trigger.dev/docs/help-slack.md",
  "https://trigger.dev/docs/hidden-tasks.md",
  "https://trigger.dev/docs/how-it-works.md",
  "https://trigger.dev/docs/how-to-reduce-your-spend.md",
  "https://trigger.dev/docs/idempotency.md",
  "https://trigger.dev/docs/introduction.md",
  "https://trigger.dev/docs/limits.md",
  "https://trigger.dev/docs/logging.md",
  "https://trigger.dev/docs/machines.md",
  "https://trigger.dev/docs/management/advanced-usage.md",
  "https://trigger.dev/docs/management/authentication.md",
  "https://trigger.dev/docs/management/auto-pagination.md",
  "https://trigger.dev/docs/management/envvars/create.md",
  "https://trigger.dev/docs/management/envvars/delete.md",
  "https://trigger.dev/docs/management/envvars/import.md",
  "https://trigger.dev/docs/management/envvars/list.md",
  "https://trigger.dev/docs/management/envvars/retrieve.md",
  "https://trigger.dev/docs/management/envvars/update.md",
  "https://trigger.dev/docs/management/errors-and-retries.md",
  "https://trigger.dev/docs/management/overview.md",
  "https://trigger.dev/docs/management/runs/cancel.md",
  "https://trigger.dev/docs/management/runs/list.md",
  "https://trigger.dev/docs/management/runs/replay.md",
  "https://trigger.dev/docs/management/runs/reschedule.md",
  "https://trigger.dev/docs/management/runs/retrieve.md",
  "https://trigger.dev/docs/management/runs/update-metadata.md",
  "https://trigger.dev/docs/management/schedules/activate.md",
  "https://trigger.dev/docs/management/schedules/create.md",
  "https://trigger.dev/docs/management/schedules/deactivate.md",
  "https://trigger.dev/docs/management/schedules/delete.md",
  "https://trigger.dev/docs/management/schedules/list.md",
  "https://trigger.dev/docs/management/schedules/retrieve.md",
  "https://trigger.dev/docs/management/schedules/timezones.md",
  "https://trigger.dev/docs/management/schedules/update.md",
  "https://trigger.dev/docs/management/tasks/batch-trigger.md",
  "https://trigger.dev/docs/management/tasks/trigger.md",
  "https://trigger.dev/docs/manual-setup.md",
  "https://trigger.dev/docs/migrating-from-v3.md",
  "https://trigger.dev/docs/migration-mergent.md",
  "https://trigger.dev/docs/open-source-contributing.md",
  "https://trigger.dev/docs/open-source-self-hosting.md",
  "https://trigger.dev/docs/queue-concurrency.md",
  "https://trigger.dev/docs/quick-start.md",
  "https://trigger.dev/docs/realtime/auth.md",
  "https://trigger.dev/docs/realtime/backend/overview.md",
  "https://trigger.dev/docs/realtime/backend/streams.md",
  "https://trigger.dev/docs/realtime/backend/subscribe.md",
  "https://trigger.dev/docs/realtime/how-it-works.md",
  "https://trigger.dev/docs/realtime/overview.md",
  "https://trigger.dev/docs/realtime/react-hooks/overview.md",
  "https://trigger.dev/docs/realtime/react-hooks/streams.md",
  "https://trigger.dev/docs/realtime/react-hooks/subscribe.md",
  "https://trigger.dev/docs/realtime/react-hooks/swr.md",
  "https://trigger.dev/docs/realtime/react-hooks/triggering.md",
  "https://trigger.dev/docs/realtime/react-hooks/use-wait-token.md",
  "https://trigger.dev/docs/realtime/run-object.md",
  "https://trigger.dev/docs/replaying.md",
  "https://trigger.dev/docs/request-feature.md",
  "https://trigger.dev/docs/roadmap.md",
  "https://trigger.dev/docs/run-tests.md",
  "https://trigger.dev/docs/run-usage.md",
  "https://trigger.dev/docs/runs.md",
  "https://trigger.dev/docs/runs/max-duration.md",
  "https://trigger.dev/docs/runs/metadata.md",
  "https://trigger.dev/docs/runs/priority.md",
  "https://trigger.dev/docs/self-hosting/docker.md",
  "https://trigger.dev/docs/self-hosting/env/supervisor.md",
  "https://trigger.dev/docs/self-hosting/env/webapp.md",
  "https://trigger.dev/docs/self-hosting/kubernetes.md",
  "https://trigger.dev/docs/self-hosting/overview.md",
  "https://trigger.dev/docs/tags.md",
  "https://trigger.dev/docs/tasks/overview.md",
  "https://trigger.dev/docs/tasks/scheduled.md",
  "https://trigger.dev/docs/tasks/schemaTask.md",
  "https://trigger.dev/docs/triggering.md",
  "https://trigger.dev/docs/troubleshooting.md",
  "https://trigger.dev/docs/troubleshooting-alerts.md",
  "https://trigger.dev/docs/troubleshooting-debugging-in-vscode.md",
  "https://trigger.dev/docs/troubleshooting-github-issues.md",
  "https://trigger.dev/docs/troubleshooting-uptime-status.md",
  "https://trigger.dev/docs/upgrading-packages.md",
  "https://trigger.dev/docs/vercel-integration.md",
  "https://trigger.dev/docs/versioning.md",
  "https://trigger.dev/docs/video-walkthrough.md",
  "https://trigger.dev/docs/wait.md",
  "https://trigger.dev/docs/wait-for.md",
  "https://trigger.dev/docs/wait-for-token.md",
  "https://trigger.dev/docs/wait-until.md",
  "https://trigger.dev/docs/writing-tasks-introduction.md",
];

const baseOutputDir = path.join(process.cwd(), ".ai", "docs", "trigger-dev");

async function downloadDocs() {
  try {
    console.log(`Starting download of ${urls.length} documents...`);

    for (const url of urls) {
      try {
        const parsedUrl = new URL(url);
        // Get path part after /docs/ and ensure it's not empty
        const relativePath = parsedUrl.pathname.startsWith("/docs/")
          ? parsedUrl.pathname.substring(5)
          : parsedUrl.pathname.substring(1);

        if (!relativePath) {
          console.warn(`Could not determine relative path for URL: ${url}`);
          continue;
        }

        const finalPath = path.join(baseOutputDir, relativePath);
        const dirForFile = path.dirname(finalPath);

        // Create the subdirectory structure
        await fs.mkdir(dirForFile, { recursive: true });

        const response = await fetch(url);
        if (!response.ok) {
          console.error(
            ` -> Failed to download ${url}. Status: ${response.status}`,
          );
          continue;
        }

        const content = await response.text();
        await fs.writeFile(finalPath, content);
        console.log(` -> Successfully saved to ${finalPath}`);
      } catch (error) {
        console.error(` -> Error processing ${url}:`, error.message);
      }
    }

    console.log(`\nDownload complete. All files saved in ${baseOutputDir}`);
  } catch (error) {
    console.error("A critical error occurred:", error);
    process.exit(1);
  }
}

downloadDocs();
