FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY static /usr/share/nginx/html/static
COPY styles /usr/share/nginx/html/styles
COPY scripts /usr/share/nginx/html/scripts

EXPOSE 80
