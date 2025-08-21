

const fs = require('fs/promises');
const path = require('path');

const sourceDir = path.join(process.cwd(), '.cursor', 'rules');
const destDir = path.join(process.cwd(), '.windsurf', 'rules');
const rootWindsurfRulesFile = path.join(process.cwd(), '.windsurfrules');

async function setupWindsurfContext() {
  try {
    console.log('Setting up Windsurf context...');

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

    // 3. Generate the root .windsurfrules index file
    const intro = `# Windsurf Assistant Guide for V1 Project\n\nThis file serves as the main entry point for the Windsurf assistant\'s context. The detailed project rules and conventions are organized in the files listed below, located in the \`./.windsurf/rules/\` directory.\n\nPlease reference these files for specific guidelines.\n`;

    const fileLinks = ruleFiles
      .map(file => `- [${file}](./.windsurf/rules/${file})`)
      .join('\n');

    const windsurfRulesContent = `${intro}\n## Project Rules Index\n\n${fileLinks}\n`;

    await fs.writeFile(rootWindsurfRulesFile, windsurfRulesContent);
    console.log(`Successfully generated index file: ${rootWindsurfRulesFile}`);

    console.log('\nWindsurf context setup complete!');

  } catch (error) {
    console.error('Error setting up Windsurf context:', error);
    process.exit(1);
  }
}

setupWindsurfContext();

