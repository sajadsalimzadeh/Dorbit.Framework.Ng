FROM nginx

COPY dist/docs/ /usr/share/nginx/html/

EXPOSE 80
