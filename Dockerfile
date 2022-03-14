FROM nginx

RUN ["npm", "install"]
RUN ["npx", "tsc"]

COPY ./build /usr/share/nginx/html