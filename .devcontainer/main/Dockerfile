FROM alpine:3.18
RUN apk add -u git curl nodejs openssh npm restic bash fuse fuse3 rclone vim uuidgen
SHELL ["/bin/bash", "-c" ]
RUN npm install -g tsx typescript vite
ENV SHELL=/bin/bash
ENV VERSION=${VERSION:-'dev'}
ENV RESTIC_CACHE_DIR=/cache
ENV RESTIC_MOUNT_REAP_INTERVAL=120
VOLUME /cache
VOLUME /configs
VOLUME /data
WORKDIR /data
CMD sleep infinity