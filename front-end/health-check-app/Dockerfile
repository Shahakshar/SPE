# Stage 1 - Build the React app
FROM node:23-slim AS frontend-builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=frontend-builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Don't create env.js here - let ConfigMap handle it

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]