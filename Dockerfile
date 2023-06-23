FROM node:18

WORKDIR /usr/src/app

RUN npm install pm2 -g

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run tsc

EXPOSE 3000

CMD [ "npm", "run", "serve" ]