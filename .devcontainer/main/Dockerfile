FROM alpine:3.18
RUN apk add -u git curl nodejs openssh npm restic bash fuse rclone
SHELL ["/bin/bash", "-c" ]
RUN npm install -g tsx typescript vite
ENV SHELL=/bin/bash
ENV RESTIC_CACHE_DIR=/restic-cache
VOLUME /restic-cache
VOLUME /configs
VOLUME /data
WORKDIR /data
RUN adduser -D app
USER app
CMD sleep infinity