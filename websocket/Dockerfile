FROM node:23-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 7000

ENTRYPOINT ["npm", "start"]
