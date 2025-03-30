#!/bin/bash

# Script para gerar favicon e logos com as letras "DG"

# Verificar se o ImageMagick está instalado
if ! [ -x "$(command -v convert)" ]; then
  echo "❌ ImageMagick não está instalado. Instalando..."
  sudo apt-get update
  sudo apt-get install -y imagemagick
fi

echo "🎨 Gerando ícones para DG Cardápios..."

# Cores
BG_COLOR="#FF6B6B"  # Fundo rosa avermelhado
TEXT_COLOR="#FFFFFF"  # Texto branco

# Criar favicon.ico
convert -size 64x64 xc:$BG_COLOR -gravity center \
  -fill $TEXT_COLOR -pointsize 32 -annotate +0+0 "DG" \
  -define icon:auto-resize=16,32,48,64 \
  public/favicon.ico

# Criar logo192.png
convert -size 192x192 xc:$BG_COLOR -gravity center \
  -fill $TEXT_COLOR -pointsize 96 -annotate +0+0 "DG" \
  public/logo192.png

# Criar logo512.png
convert -size 512x512 xc:$BG_COLOR -gravity center \
  -fill $TEXT_COLOR -pointsize 256 -annotate +0+0 "DG" \
  public/logo512.png

echo "✅ Ícones gerados com sucesso!"
echo "🔍 Verifique os arquivos em:"
echo "   - public/favicon.ico"
echo "   - public/logo192.png"
echo "   - public/logo512.png" 