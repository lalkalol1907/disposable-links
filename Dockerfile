FROM node:20-alpine as build

COPY package.json .
RUN yarn install
COPY . .
RUN yarn build

FROM node:20-alpine
COPY --from=build /dist /dist
COPY --from=build package.json package.json
RUN yarn install --prod

ENV REDIS_PORT 6379
ENV REDIS_HOST localhost
ENV APP_PORT 3000
ENV NODE_ENV production

CMD [ "node", "dist/main.js" ]