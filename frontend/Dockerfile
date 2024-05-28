# Usa a imagem oficial do Node.js como base
FROM node:14

# Cria e define o diretório de trabalho
WORKDIR /usr/src/app

# Copia o package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código-fonte da aplicação
COPY . .

# Compila a aplicação para produção
RUN npm run build

# Usa uma imagem de servidor web para servir os arquivos estáticos
FROM nginx:alpine

# Copia os arquivos compilados para o diretório padrão do nginx
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Expõe a porta que o nginx irá rodar
EXPOSE 80

# Define o comando para rodar o nginx
CMD ["nginx", "-g", "daemon off;"]
