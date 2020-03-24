FROM node:12
WORKDIR /usr/src/

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm test

CMD node server.js
