

const fs = require('fs/promises');
const path = require('path');

const sourceDir = path.join(process.cwd(), '.ai', 'rules');
const destDir = path.join(process.cwd(), '.gemini', 'rules');
const rootGeminiMd = path.join(process.cwd(), 'GEMINI.md');

async function setupGeminiContext() {
  try {
    console.log('Setting up Gemini context...');

    // 1. Ensure destination directory is clean
    await fs.rm(destDir, { recursive: true, force: true });
    await fs.mkdir(destDir, { recursive: true });
    console.log(`Cleaned and created directory: ${destDir}`);

    // 2. Copy all rule files
    const files = await fs.readdir(sourceDir);
    const ruleFiles = files.filter(file => file.endsWith('.md') || file.endsWith('.mdc'));

    for (const file of ruleFiles) {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);
      await fs.copyFile(sourcePath, destPath);
    }
    console.log(`Copied ${ruleFiles.length} rule files to ${destDir}`);

    // 3. Generate the root GEMINI.md index file
    const intro = `# Gemini Assistant Guide for V1 Project\n\nThis file serves as the main entry point for the AI assistant's context. The detailed project rules and conventions are organized in the files listed below, located in the \`.gemini/rules/\` directory.\n\nPlease reference these files for specific guidelines.\n`;

    const fileLinks = ruleFiles
      .map(file => `- [${file}](./.gemini/rules/${file})`)
      .join('\n');

    const geminiMdContent = `${intro}\n## Project Rules Index\n\n${fileLinks}\n`;

    await fs.writeFile(rootGeminiMd, geminiMdContent);
    console.log(`Successfully generated index file: ${rootGeminiMd}`);

    console.log('\nGemini context setup complete!');

  } catch (error) {
    console.error('Error setting up Gemini context:', error);
    process.exit(1);
  }
}

setupGeminiContext();

