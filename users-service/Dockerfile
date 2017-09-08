FROM node:8.3.0

LABEL "name"="users-service"
LABEL "author"="trudyga0822@gmail.com"

WORKDIR /src

EXPOSE 80

ENV PORT=80
ENV DEBUG="users-service:*"

ENTRYPOINT ["node", "server.js"]

COPY package.json /src
RUN npm install

COPY . /src