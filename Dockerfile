FROM node:8-alpine

ENV CODE /usr/src/app
WORKDIR $CODE

RUN mkdir -p $CODE
COPY package.json $CODE
COPY yarn.lock $CODE
RUN yarn

ADD public $CODE/public
ADD server $CODE/server
ADD src $CODE/src

RUN yarn build-css
RUN yarn build

EXPOSE 8282
CMD ["node", "server"]
