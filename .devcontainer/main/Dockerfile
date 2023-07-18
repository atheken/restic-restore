FROM alpine:3.18
RUN apk add -u git curl nodejs openssh npm restic bash fuse fuse3 rclone vim
SHELL ["/bin/bash", "-c" ]
RUN npm install -g tsx typescript vite
ENV SHELL=/bin/bash
ENV RESTIC_CACHE_DIR=/restic-cache
ENV RESTORE_SAVE_KEY_FILE=''
ENV RESTORE_SAVE_KEY='the-storage-key-is-here-with-sufficient-length-for-aes256'
VOLUME /restic-cache
VOLUME /configs
VOLUME /data
WORKDIR /data
CMD sleep infinity