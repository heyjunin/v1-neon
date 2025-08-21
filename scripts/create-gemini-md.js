const fs = require("fs/promises");
const path = require("path");

const rulesDir = path.join(process.cwd(), ".cursor", "rules");
const outputFile = path.join(process.cwd(), "GEMINI.md");
const mainReadmePath = path.join(rulesDir, "README.md");

async function generateGeminiDoc() {
  try {
    console.log("Starting documentation generation...");

    const files = await fs.readdir(rulesDir);
    const mdcFiles = files.filter(
      (file) => file.endsWith(".mdc") || file.endsWith(".md"),
    );

    // Start with the content of the main README.md from the rules folder
    let combinedContent = "";
    try {
      const mainReadmeContent = await fs.readFile(mainReadmePath, "utf8");
      // Let's use a custom, more direct title for the final file
      combinedContent = `# Gemini Assistant Guide for V1 Project\n\nThis document provides essential guidelines for the AI assistant to ensure code generation and modifications align with the project's standards.\n\n`;
      // And append the rest of the readme content, skipping the original title
      combinedContent += mainReadmeContent.substring(
        mainReadmeContent.indexOf("\n") + 1,
      );
    } catch (e) {
      console.log(
        "Could not find a README.md in .cursor/rules, starting with a generic title.",
      );
      combinedContent = `# Gemini Assistant Guide for V1 Project\n\nThis document provides essential guidelines for the AI assistant to ensure code generation and modifications align with the project's standards.\n\n`;
    }

    for (const file of mdcFiles) {
      // Skip the main README, as we've already processed it.
      if (file === "README.md" || file === "IMPLEMENTATION_SUMMARY.md") {
        continue;
      }

      const filePath = path.join(rulesDir, file);
      const content = await fs.readFile(filePath, "utf8");

      // Remove Cursor-specific metadata like --- globs: ... ---
      const cleanedContent = content.split("---")[0].trim();

      const title = path
        .basename(file, path.extname(file))
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      combinedContent += `\n---\n## ${title}\n\n${cleanedContent}\n`;
    }

    await fs.writeFile(outputFile, combinedContent);
    console.log(`Successfully generated ${outputFile}`);
  } catch (error) {
    console.error("Error generating documentation:", error);
    process.exit(1);
  }
}

generateGeminiDoc();
