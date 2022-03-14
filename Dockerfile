FROM nginx

WORKDIR /foundry-dashboard

RUN mkdir src
RUN mkdir public

COPY ./*.json ./
COPY ./src ./src
COPY ./public ./public

RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y node
RUN ["npm", "install"]
RUN ["npx", "tsc"]
RUN ["npm", "run", "build"]
