FROM node:latest as build-stage

COPY . /usr/share/app/

WORKDIR /usr/share/app/

RUN npm i && npm run build-docs

FROM nginx:latest

COPY --from=build-stage /usr/share/app/dist/docs/ /usr/share/nginx/html/

EXPOSE 80
