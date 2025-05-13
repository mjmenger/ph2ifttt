FROM node:24.0.1-slim

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .

EXPOSE 8081
CMD ["node", "server.js"]
ENTRYPOINT [ "node","server.js" ]