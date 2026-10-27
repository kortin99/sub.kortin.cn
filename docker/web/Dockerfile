FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

ENV SUBCONVERTER_UPSTREAM=subconverter:25500 \
    MYURLS_UPSTREAM=myurls:8080

COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/web/apply-config.sh /docker-entrypoint.d/40-apply-config.sh
COPY --from=build /app/dist /usr/share/nginx/html

RUN chmod +x /docker-entrypoint.d/40-apply-config.sh

EXPOSE 80
