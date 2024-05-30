# Usa a imagem oficial do Node.js como base
FROM node:20

# Cria e define o diretório de trabalho
WORKDIR /usr/src/app

# Copia o package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código-fonte da aplicação
COPY . .

# Expõe a porta que a aplicação irá rodar
EXPOSE 3000

# Define o comando para rodar a aplicação
CMD ["node", "server.js"]
