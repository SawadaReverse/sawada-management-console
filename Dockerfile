FROM node:18-alpine AS build-image

WORKDIR /app
COPY . /app/

RUN yarn && yarn build

FROM node:18-alpine AS run-image

WORKDIR /app
COPY --from=build-image /app/.next /app/.next
COPY --from=build-image /app/node_modules /app/node_modules
COPY --from=build-image /app/package.json /app/package.json

EXPOSE 8080
CMD [ "yarn", "start" ]
