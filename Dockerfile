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

# add built project to nginx to be served
COPY --from=build /app/dist/ArabicNewsPodcast-FE/browser /etc/nginx/html/

EXPOSE 80
