FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências primeiro para aproveitar o cache
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar o resto dos arquivos
COPY . .

# Construir a aplicação React
RUN npm run build

# Criar diretório de logs
RUN mkdir -p logs

# Porta onde a aplicação vai rodar
EXPOSE 8080

# Comando para iniciar a aplicação em produção
CMD ["node", "server.js"] 