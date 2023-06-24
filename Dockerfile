FROM golang:1.20.5-alpine3.18 as build
COPY /src/restic-restore /src
WORKDIR /src


FROM node:20-alpine3.18 as ui-build
COPY ./src/ui /app
WORKDIR /app
RUN npm install
RUN npm build

FROM alpine:3.18
WORKDIR /app
VOLUME /config
ENV HTTP_PORT=8080
ENV RESTORE_CONFIG_PATH=/config
ENV UI_PATH=/app/ui
EXPOSE 8080
COPY --from=ui-build /app/dist /app/ui
COPY --from=build /build/restic-restore /app
ENTRYPOINT [ "/app/restic-restore" ]