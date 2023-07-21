FROM alpine:3.18 as build
RUN apk add -u nodejs npm restic bash rclone
RUN npm install -g tsx typescript vite
SHELL ["/bin/bash", "-c" ]
COPY ./src /data
WORKDIR /data
RUN npm install
RUN vite build

FROM alpine:3.18
RUN apk add -u nodejs npm rclone restic bash openssh fuse fuse3
COPY --from=build /data/build /app
WORKDIR /app
COPY ./src/package.json ./
COPY ./src/package-lock.json ./
# it's not clear to me why these are necessary, the default nodejs handling should
# gracefully stop the process.
RUN echo '; process.on("SIGINT", () => { process.exit(0) });' >> ./index.js
RUN echo '; process.on("SIGTERM", () => { process.exit(0) });' >> ./index.js
RUN npm i --omit dev
ENV NODE_ENV=production
ENV RESTIC_CACHE_DIR=/cache
ENV RESTIC_MOUNT_DIR=/tmp/restic-mount
ENV RESTIC_MOUNT_REAP_INTERVAL=600
ENV VERSION=${GITHUB_SHA:-'unknown'}
ENV PORT=8888
VOLUME /cache
VOLUME /configs
ENTRYPOINT ["/usr/bin/node", "/app"]