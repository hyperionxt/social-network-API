FROM node:18

WORKDIR /myapp
COPY package.json .
RUN npm install

COPY . .
CMD [ "npm","run","dev" ]