FROM alpine:3.18 as build
RUN apk add -u nodejs npm restic bash rclone
RUN npm install -g tsx typescript vite
SHELL ["/bin/bash", "-c" ]
COPY ./src /data
WORKDIR /data
RUN npm install
RUN vite build

FROM alpine:3.18
RUN apk add -u nodejs npm rclone restic bash
ENV SHELL=/bin/bash
COPY --from=build /data/ui/build /app
WORKDIR /app
COPY ./src/package.json ./
COPY ./src/package-lock.json ./
RUN npm i --omit dev
ENV NODE_ENV=production
ENV RESTIC_CACHE_DIR=/restic-cache
VOLUME /restic-cache
VOLUME /configs
ENTRYPOINT "/usr/bin/node ."