FROM node:8.3.0

LABEL "name"="users-service"
LABEL "author"="trudyga0822@gmail.com"

WORKDIR /usr/app

EXPOSE 80

ENV PORT=80
ENV DEBUG="users-service:*"

CMD ["node", "server.js"]

COPY package.json .
RUN npm install

COPY . /src