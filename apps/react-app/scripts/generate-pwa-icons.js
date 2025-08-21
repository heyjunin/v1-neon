#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

// Função para criar um ícone SVG simples
function createSVGIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="#ffffff" text-anchor="middle" dy="0.35em">V1</text>
</svg>`
}

// Função para criar um ícone PNG simples (simulado com SVG)
function createPNGIcon(size) {
  return createSVGIcon(size)
}

// Criar diretório public se não existir
const publicDir = path.join(process.cwd(), 'public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// Gerar ícones
const icons = [
  { name: 'favicon.ico', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'masked-icon.svg', size: 512 },
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
]

console.log('🎨 Gerando ícones PWA...')

icons.forEach(icon => {
  const iconPath = path.join(publicDir, icon.name)
  const iconContent = icon.name.endsWith('.svg') 
    ? createSVGIcon(icon.size)
    : createPNGIcon(icon.size)
  
  fs.writeFileSync(iconPath, iconContent)
  console.log(`✅ Gerado: ${icon.name}`)
})

console.log('🎉 Ícones PWA gerados com sucesso!')
