# Instruções de Deployment - DG Cardápios (Cake Shop)

Este guia contém as instruções para fazer o deploy completo da aplicação DG Cardápios em uma VPS.

## Requisitos

- Ubuntu Server 20.04 LTS ou superior
- Node.js 18+ e npm
- Git
- Nginx
- MySQL
- Certbot (para SSL)

## 1. Preparação da VPS

Atualize o sistema e instale as dependências básicas:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git curl nginx mysql-server
```

### Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # Verifique se está na versão 20.x
npm -v   # Verifique se o npm está instalado
```

### Instalar Certbot para SSL

```bash
sudo apt install -y certbot python3-certbot-nginx
```

## 2. Configuração do MySQL

```bash
sudo mysql_secure_installation
```

Crie um banco de dados e um usuário para a aplicação:

```bash
sudo mysql -u root -p
```

No prompt do MySQL:

```sql
CREATE DATABASE cake_shop_prod;
CREATE USER 'db_user_production'@'localhost' IDENTIFIED BY 'StrongProduction!Password';
GRANT ALL PRIVILEGES ON cake_shop_prod.* TO 'db_user_production'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 3. Clonar o Repositório

Crie uma pasta para projetos web e clone o repositório:

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone https://seu-repositorio/cake-shop.git
cd cake-shop
```

## 4. Configuração da Aplicação

### Configurar Variáveis de Ambiente

```bash
cp .env.example .env.production
```

Edite o arquivo `.env.production` com suas configurações:

```
# Configurações do Servidor
PORT=8080

# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=db_user_production
DB_PASSWORD=StrongProduction!Password
DB_NAME=cake_shop_prod

# Configurações do React
REACT_APP_PORT=80
REACT_APP_API_URL=/api
```

Em seguida, copie para o arquivo .env:

```bash
cp .env.production .env
```

### Instalar Dependências e Construir a Aplicação

```bash
npm install --production
npm run build
```

## 5. Configuração do Banco de Dados

Inicialize o banco de dados com os scripts de esquema e dados iniciais:

```bash
cd db
chmod +x setup.sh
./setup.sh
cd ..
```

## 6. Configuração do PM2

Instale o PM2 globalmente:

```bash
sudo npm install -g pm2
```

Inicie a aplicação com PM2:

```bash
pm2 start ecosystem.config.js --env production
```

Configure o PM2 para iniciar automaticamente após reinicialização:

```bash
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
pm2 save
```

## 7. Configuração do Nginx

### Configurar o Servidor Web

Copie o arquivo de configuração do Nginx:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/cake-shop
sudo ln -sf /etc/nginx/sites-available/cake-shop /etc/nginx/sites-enabled/cake-shop
sudo nginx -t  # Teste a configuração
sudo systemctl restart nginx
```

### Configurar Permissões

```bash
sudo chown -R www-data:www-data /var/www/cake-shop/build
```

## 8. Configuração SSL com Let's Encrypt

Atualize o arquivo Nginx antes de executar o Certbot (substitua o domínio):

```bash
sudo sed -i 's/server_name .*;/server_name seu-dominio.com www.seu-dominio.com;/g' /etc/nginx/sites-available/cake-shop
```

Obtenha um certificado SSL:

```bash
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

## 9. Verificação Final

Verifique se todos os serviços estão rodando:

```bash
systemctl status nginx  # Nginx deve estar ativo
pm2 status  # A aplicação deve estar online
```

Acesse seu site através do navegador: `https://seu-dominio.com`

## Scripts em Ordem Correta

Para fazer o deploy completo, execute os scripts nesta ordem:

1. `./db/setup.sh` - Configura o banco de dados
2. `./generate_icons.sh` - Gera os ícones personalizados
3. `npm run build` - Constrói a aplicação
4. `npm run pm2:start` ou `pm2 start ecosystem.config.js` - Inicia a aplicação com PM2
5. `./setup-nginx.sh` - Configura o Nginx
6. `./setup-ssl.sh` - Configura o SSL

## Manutenção

### Atualizar a Aplicação

Quando precisar atualizar a aplicação:

```bash
cd /var/www/cake-shop
git pull
npm install --production
npm run build
sudo chown -R www-data:www-data build
pm2 restart cake-shop
```

### Renovação do Certificado SSL

O Certbot configura automaticamente a renovação do certificado. Você pode testar com:

```bash
sudo certbot renew --dry-run
```

### Backup do Banco de Dados

Faça backups regulares do banco de dados:

```bash
mysqldump -u db_user_production -p cake_shop_prod > backup_$(date +%Y%m%d).sql
``` 