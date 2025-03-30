#!/bin/bash

# Script para configurar o Nginx para a aplicação Cake Shop

echo "🔧 Configurando Nginx para o Cake Shop..."

# Verificar se o Nginx está instalado
if ! [ -x "$(command -v nginx)" ]; then
  echo "❌ Nginx não está instalado. Por favor, instale com:"
  echo "   sudo apt update && sudo apt install -y nginx"
  exit 1
fi

# Caminho absoluto para a pasta build
BUILD_PATH="$(pwd)/build"

# Verificar se a pasta build existe
if [ ! -d "$BUILD_PATH" ]; then
  echo "❌ Pasta build não encontrada em $BUILD_PATH"
  echo "   Execute 'npm run build' primeiro."
  exit 1
fi

# Ajustar permissões da pasta build
echo "🔒 Ajustando permissões da pasta build..."
sudo chown -R www-data:www-data "$BUILD_PATH"

# Caminho para o arquivo de configuração do Nginx
NGINX_CONF_PATH="/etc/nginx/sites-available/cake-shop"
NGINX_ENABLED_PATH="/etc/nginx/sites-enabled/cake-shop"

# Substituir o caminho da pasta build no arquivo nginx.conf
echo "📝 Ajustando caminho da pasta build no arquivo nginx.conf..."
sed "s|/projetos/react/cake-shop/build|$BUILD_PATH|g" nginx.conf > nginx.conf.temp

# Copiar arquivo de configuração
echo "📋 Copiando arquivo de configuração para o Nginx..."
sudo cp nginx.conf.temp "$NGINX_CONF_PATH"
rm nginx.conf.temp

# Criar link simbólico se não existir
if [ ! -f "$NGINX_ENABLED_PATH" ]; then
  echo "🔗 Criando link simbólico..."
  sudo ln -s "$NGINX_CONF_PATH" "$NGINX_ENABLED_PATH"
fi

# Testar configuração do Nginx
echo "🔍 Testando configuração do Nginx..."
sudo nginx -t

if [ $? -eq 0 ]; then
  # Reiniciar Nginx
  echo "🔄 Reiniciando Nginx..."
  sudo systemctl restart nginx
  echo "✅ Nginx configurado com sucesso!"
  echo "🌐 Acesse a aplicação em: http://localhost (ou http://seu_dominio.com)"
else
  echo "❌ Configuração do Nginx inválida. Corrija os erros e tente novamente."
  exit 1
fi 