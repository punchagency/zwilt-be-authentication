# Builder stage
FROM node:24 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx tsc --project tsconfig.prod.json

# Runtime stage
FROM node:24-alpine AS runtime

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist .

EXPOSE 8080

CMD ["node", "index.js"]
