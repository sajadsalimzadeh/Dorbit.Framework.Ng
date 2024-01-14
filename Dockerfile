FROM node:latest as build-stage

COPY . /usr/share/app/

WORKDIR /usr/share/app/

RUN npm i && npm run build-docs

FROM nginx:latest

WORKDIR /usr/share/app/

COPY --from=build-stage ./dist/docs/ /usr/share/nginx/html/

EXPOSE 80
