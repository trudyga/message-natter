FROM node:8.3.0

LABEL "name"="message-natter"
LABEL "author"="trudyga0822@gmail.com"

WORKDIR /usr/app

EXPOSE 80

CMD ["node", "./bin/www"]

COPY package.json .
RUN npm install

COPY . ./