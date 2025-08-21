#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

// Tamanhos de ícones necessários para PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Criar arquivos de ícone placeholder
// Em produção, você deve substituir estes por ícones reais gerados a partir do logo.png
function createIconPlaceholder(size) {
  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#ffffff" font-family="Arial, sans-serif" font-size="${size * 0.3}">V1</text>
</svg>`;

  return svg;
}

// Criar ícones
for (const size of iconSizes) {
  const iconPath = path.join(
    __dirname,
    "..",
    "public",
    "icons",
    `icon-${size}x${size}.png`,
  );
  const svgPath = path.join(
    __dirname,
    "..",
    "public",
    "icons",
    `icon-${size}x${size}.svg`,
  );

  // Criar SVG placeholder
  const svg = createIconPlaceholder(size);
  fs.writeFileSync(svgPath, svg);

  console.log(`✅ Created icon-${size}x${size}.svg`);
}

// Criar apple touch icon
const appleTouchIcon = createIconPlaceholder(180);
fs.writeFileSync(
  path.join(__dirname, "..", "public", "icons", "apple-touch-icon.svg"),
  appleTouchIcon,
);
console.log("✅ Created apple-touch-icon.svg");

// Criar screenshots placeholder
const desktopScreenshot = `
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="720" fill="#000000"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#ffffff" font-family="Arial, sans-serif" font-size="48">V1 Desktop Screenshot</text>
</svg>`;

const mobileScreenshot = `
<svg width="390" height="844" viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg">
  <rect width="390" height="844" fill="#000000"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#ffffff" font-family="Arial, sans-serif" font-size="24">V1 Mobile Screenshot</text>
</svg>`;

fs.writeFileSync(
  path.join(__dirname, "..", "public", "screenshots", "desktop.svg"),
  desktopScreenshot,
);
fs.writeFileSync(
  path.join(__dirname, "..", "public", "screenshots", "mobile.svg"),
  mobileScreenshot,
);

console.log("✅ Created screenshot placeholders");

console.log(
  "\n📝 Note: These are placeholder SVGs. For production, convert them to PNG using:",
);
console.log("   - Online tools like convertio.co or cloudconvert.com");
console.log("   - Or use ImageMagick: convert icon.svg icon.png");
console.log("   - Or use Sharp.js in a build script");
