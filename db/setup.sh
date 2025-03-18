#!/bin/bash

# Carregar variáveis de ambiente
if [ -f ../.env ]; then
  source ../.env
else
  echo "Arquivo .env não encontrado!"
  exit 1
fi

# Parâmetros do banco de dados
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD:-}
DB_NAME=${DB_NAME:-cake_shop}

echo "Inicializando banco de dados $DB_NAME..."

# Executar o script SQL
if [ -z "$DB_PASSWORD" ]; then
  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER < init.sql
else
  mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD < init.sql
fi

# Verificar se a execução foi bem-sucedida
if [ $? -eq 0 ]; then
  echo "✅ Banco de dados inicializado com sucesso!"
else
  echo "❌ Erro ao inicializar o banco de dados."
  exit 1
fi

echo "Usuário admin criado com senha admin123"
echo "Categorias e produtos de exemplo criados!" 