FROM node:16-slim AS base
WORKDIR /usr/src/app

FROM base AS build
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base AS production
COPY --from=build /usr/src/app/ ./

CMD ["npm","run","start:prod"]