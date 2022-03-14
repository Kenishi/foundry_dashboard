FROM nginx

WORKDIR /foundry-dashboard

RUN mkdir src
RUN mkdir public

COPY ./*.json ./
COPY ./src ./src
COPY ./public ./public

RUN apt-get install -y npm
RUN ["npm", "install"]
RUN ["npx", "tsc"]

RUN mkdir -p /usr/share/nginx/html
RUN cp ./build /usr/share/nginx/html