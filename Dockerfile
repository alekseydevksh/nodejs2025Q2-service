FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig*.json nest-cli.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:24-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/tsconfig*.json ./

EXPOSE 4000

CMD ["npm", "run", "start:prod"]