#!/bin/bash

# Script para configurar certificado SSL com Let's Encrypt para www.strongzonefit.com

DOMAIN="www.strongzonefit.com"
EMAIL="admin@strongzonefit.com"  # Altere para seu e-mail real

echo "🔒 Configurando certificado SSL para $DOMAIN"

# Verificar se o Nginx está instalado
if ! [ -x "$(command -v nginx)" ]; then
  echo "❌ Nginx não está instalado. Por favor, instale com:"
  echo "   sudo apt update && sudo apt install -y nginx"
  exit 1
fi

# Verificar se o certbot está instalado
if ! [ -x "$(command -v certbot)" ]; then
  echo "📦 Instalando certbot..."
  sudo apt update
  sudo apt install -y certbot python3-certbot-nginx
fi

# Atualizar a configuração do Nginx para o domínio
echo "📝 Atualizando configuração do Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/cake-shop
sudo ln -sf /etc/nginx/sites-available/cake-shop /etc/nginx/sites-enabled/cake-shop

# Verificar se a configuração do Nginx está correta
sudo nginx -t

if [ $? -ne 0 ]; then
  echo "❌ Configuração do Nginx inválida!"
  exit 1
fi

# Reiniciar o Nginx
sudo systemctl restart nginx

# Confirmar que o DNS está corretamente configurado
echo "⚠️ IMPORTANTE: Certifique-se de que o domínio $DOMAIN está apontando para este servidor antes de continuar."
echo "   Você pode verificar isso com: dig +short $DOMAIN"
echo ""
read -p "O domínio está corretamente configurado? (s/n): " dns_ok

if [ "$dns_ok" != "s" ]; then
  echo "❌ Por favor, configure o DNS corretamente e tente novamente."
  exit 1
fi

# Obter o certificado SSL
echo "🔑 Obtendo certificado SSL com Let's Encrypt..."
sudo certbot --nginx -d $DOMAIN -d strongzonefit.com --non-interactive --agree-tos --email $EMAIL

if [ $? -ne 0 ]; then
  echo "❌ Falha ao obter o certificado SSL!"
  exit 1
fi

# Aplicar a configuração SSL
echo "📝 Aplicando configuração HTTPS..."
sudo cp nginx-ssl.conf /etc/nginx/sites-available/cake-shop
sudo systemctl restart nginx

# Configurar renovação automática do certificado
echo "🔄 Configurando renovação automática do certificado..."
sudo systemctl status certbot.timer

echo "✅ Configuração SSL concluída!"
echo "🌐 Seu site está disponível em: https://$DOMAIN"

# Testar a renovação do certificado (simulação)
echo "🔄 Testando processo de renovação do certificado..."
sudo certbot renew --dry-run

if [ $? -eq 0 ]; then
  echo "✅ Renovação automática configurada corretamente!"
else
  echo "⚠️ Atenção: Pode haver problemas com a renovação automática. Verifique a configuração."
fi 