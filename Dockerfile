FROM nginx

COPY dist/angular-components/ /usr/share/nginx/html/

EXPOSE 80
