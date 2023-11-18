FROM node:18-bullseye

RUN apt-get update && apt-get install vim -y --force-yes

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app/

COPY index.ts /usr/src/app/index.ts
COPY package.json /usr/src/app
COPY johnsmith.jpg /usr/src/app
COPY billbrasky.jpg /usr/src/app

RUN npm install

CMD ["npm", "start"]
