FROM node:20-alpine AS build
LABEL maintainer="kortin99 <hi@kortin.com>"
LABEL org.opencontainers.image.source="https://github.com/kortin99/sub.kortin.cn"

ENV SUBCONVERTER_VERSION=v0.9.2
WORKDIR /
RUN apk add --no-cache bash git curl zip
RUN if [ "$(uname -m)" = "x86_64" ]; then export PLATFORM=linux64 ; else if [ "$(uname -m)" = "aarch64" ]; then export PLATFORM=aarch64 ; fi fi \
  && wget https://github.com/MetaCubeX/subconverter/releases/download/${SUBCONVERTER_VERSION}/subconverter_${PLATFORM}.tar.gz \
  && tar xzf subconverter_${PLATFORM}.tar.gz

WORKDIR /app
COPY . /app
RUN cd /app && npm install && npm run build

FROM nginx:1.16-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /subconverter /base
COPY --from=build /app/start.sh /app/start.sh
EXPOSE 80
CMD [ "sh", "-c", "/app/start.sh" ]