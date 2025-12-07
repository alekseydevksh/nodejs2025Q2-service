FROM node:24-alpine

WORKDIR /app

COPY package*.json tsconfig*.json ./

RUN npm ci

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start:dev"]