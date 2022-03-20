#### Builder
FROM node:current-alpine AS builder

WORKDIR /foundry-dashboard

RUN mkdir src
RUN mkdir public

COPY ./*.json ./
RUN ["npm", "install"]

COPY ./src ./src
COPY ./public ./public

RUN ["npx", "tsc"]
RUN ["npm", "run", "build"]

#### Runner
FROM nginx

COPY --from=builder /foundry-dashboard /foundry-dashboard