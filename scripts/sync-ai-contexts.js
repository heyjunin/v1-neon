const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

const scriptsToRun = [
  "scripts/setup-gemini-context.js",
  "scripts/setup-windsurf-context.js",
];

async function runScript(scriptPath) {
  console.log(`\n--- Executing: ${scriptPath} ---\n`);
  try {
    const { stdout, stderr } = await execPromise(`node ${scriptPath}`);
    console.log(stdout);
    if (stderr) {
      console.error("Stderr:", stderr);
    }
    console.log(`--- Finished: ${scriptPath} ---`);
  } catch (error) {
    console.error(`### Error executing ${scriptPath}: ###`, error);
    throw error; // Stop the entire process if one script fails
  }
}

async function syncAllAiContexts() {
  console.log("############################################");
  console.log("# Starting AI Contexts Synchronization #");
  console.log("############################################");

  try {
    for (const script of scriptsToRun) {
      await runScript(script);
    }
    console.log("\n#############################################");
    console.log("# AI Contexts Synchronization Complete! #");
    console.log("#############################################");
  } catch (error) {
    console.error("\n##########################################");
    console.error("# AI Contexts Synchronization Failed! #");
    console.error("##########################################");
    process.exit(1);
  }
}

syncAllAiContexts();
