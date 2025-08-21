#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

// Função para criar um ícone SVG simples
function createSVGIcon(size, text = 'V1') {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="#ffffff" text-anchor="middle" dy="0.35em">${text}</text>
</svg>`
}

// Função para criar um ícone PNG simples (usando SVG como base)
function createPNGIcon(size, text = 'V1') {
  const svg = createSVGIcon(size, text)
  // Em um ambiente real, você usaria uma biblioteca como sharp para converter SVG para PNG
  // Por simplicidade, vamos apenas criar um arquivo SVG com extensão .png
  return svg
}

// Configuração dos ícones
const icons = [
  { name: 'pwa-192x192.png', size: 192, content: createPNGIcon(192) },
  { name: 'pwa-512x512.png', size: 512, content: createPNGIcon(512) },
  { name: 'apple-touch-icon.png', size: 180, content: createPNGIcon(180) },
  { name: 'favicon.ico', size: 32, content: createSVGIcon(32) },
]

// Diretório público
const publicDir = path.join(process.cwd(), 'public')

console.log('🎨 Gerando ícones PWA...')

for (const icon of icons) {
  const iconPath = path.join(publicDir, icon.name)
  
  try {
    fs.writeFileSync(iconPath, icon.content)
    console.log(`✅ Gerado: ${icon.name}`)
  } catch (error) {
    console.error(`❌ Erro ao gerar ${icon.name}:`, error.message)
  }
}

console.log('🎉 Ícones PWA gerados com sucesso!')
