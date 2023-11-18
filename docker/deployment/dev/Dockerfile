FROM node:18-bullseye

ADD package.json /usr/src/app/
ADD yarn.lock /usr/src/app/

RUN apt-get update && apt-get install redis-server subversion vim git -y

RUN mkdir -p /usr/src/app
RUN chown -R node: /usr/src/app

WORKDIR /usr/src/app/

RUN yarn install

ADD . /usr/src/app/

ENV AUTH_LOCAL=true
ENV APP_ENDPOINT=dev

RUN NODE_ENV=production yarn build

CMD ["yarn", "start"]