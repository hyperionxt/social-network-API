FROM node:18

WORKDIR /myapi
COPY package.json .
RUN npm install

COPY . .
CMD [ "npm","run","dev" ]