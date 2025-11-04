# 1️⃣ Build Stage
FROM node:22.21.1-alpine3.21 AS builder

WORKDIR /app


COPY package*.json ./
COPY next.config.js ./
COPY tsconfig.json ./


RUN npm install


COPY . .


RUN mkdir -p .next

EXPOSE 3000


CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]
