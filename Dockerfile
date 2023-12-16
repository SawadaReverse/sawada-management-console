FROM node:20-bookworm AS build-image

WORKDIR /app
COPY . /app/

RUN yarn && yarn build

FROM node:20-bookworm AS run-image

WORKDIR /app
COPY --from=build-image /app/.next /app/.next
COPY --from=build-image /app/node_modules /app/node_modules
COPY --from=build-image /app/package.json /app/package.json
COPY --from=build-image /app/.env* /app/

EXPOSE 3000
CMD [ "yarn", "start" ]
