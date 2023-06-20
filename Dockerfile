FROM node:18-alpine AS build-image

WORKDIR /app
COPY . /app/

RUN yarn && yarn build

FROM node:18-alpine AS run-image

ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

ENV GOOGLE_CLIENT_ID ${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET ${GOOGLE_CLIENT_SECRET}
ENV NEXTAUTH_SECRET ${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL ${NEXTAUTH_URL}

WORKDIR /app
COPY --from=build-image /app/.next /app/.next
COPY --from=build-image /app/node_modules /app/node_modules
COPY --from=build-image /app/package.json /app/package.json

EXPOSE 8080
CMD [ "yarn", "start" ]
