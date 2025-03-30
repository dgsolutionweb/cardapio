#!/bin/bash

# Script de deploy para produção da aplicação Cake Shop

echo "🚀 Iniciando deploy para produção..."

# 1. Verificar ambiente
if [ ! -f .env.production ]; then
  echo "❌ Arquivo .env.production não encontrado!"
  exit 1
fi

# 2. Copiar arquivo de ambiente de produção
cp .env.production .env
echo "✅ Arquivo de ambiente de produção copiado."

# 3. Instalar dependências
echo "📦 Instalando dependências..."
npm install --production
if [ $? -ne 0 ]; then
  echo "❌ Falha ao instalar dependências!"
  exit 1
fi
echo "✅ Dependências instaladas."

# 4. Construir a aplicação React
echo "🔨 Construindo aplicação React..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Falha ao construir a aplicação!"
  exit 1
fi
echo "✅ Aplicação construída com sucesso!"

# 5. Inicializar banco de dados de produção
echo "🔄 Configurando banco de dados de produção..."
cd db
chmod +x setup.sh
./setup.sh
if [ $? -ne 0 ]; then
  echo "❌ Falha ao configurar banco de dados!"
  exit 1
fi
cd ..
echo "✅ Banco de dados configurado."

# 6. Iniciar servidor em modo produção
echo "🚀 Iniciando servidor em modo produção..."
npm run prod

echo "✅ Deploy concluído! A aplicação está rodando em modo produção." 