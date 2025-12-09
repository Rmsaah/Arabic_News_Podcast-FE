# STAGE 1: build
FROM node:22.12.0-alpine AS build
WORKDIR /app
# 1. Copy dependencies files only (Lowest layer: Caches well)
COPY package*.json ./

# 2. Install dependencies (Next layer: Caches if package*.json doesn't change)
RUN npm install

# 3. Copy application files (Highest layer: Changes frequently)
# add files needed to build project?
COPY angular.json tsconfig.json tsconfig.app.json ./
COPY src ./src
COPY public ./public
RUN npm run build

# STAGE 2: production
FROM nginx:1.28-alpine
# add the custom NGINX configuration file
COPY ./nginx2.conf /etc/nginx/nginx.conf

# install envsubst for runtime env injection
RUN apk add --no-cache gettext

# copy entrypoint script to generate env.js from env.template.js at container start
COPY docker-entrypoint.d /docker-entrypoint.d
RUN chmod +x /docker-entrypoint.d/*.sh

# add built project to nginx to be served
COPY --from=build /app/dist/ArabicNewsPodcast-FE/browser /usr/share/nginx/html

EXPOSE 4354
