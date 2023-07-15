FROM alpine:3.18
<<<<<<< Updated upstream
RUN apk add -u git curl nodejs openssh npm restic bash rclone
=======
RUN apk add -u git curl nodejs openssh npm restic bash fuse
>>>>>>> Stashed changes
SHELL ["/bin/bash", "-c" ]
RUN npm install -g tsx typescript vite
ENV SHELL=/bin/bash
ENV RESTIC_CACHE_DIR=/restic-cache
VOLUME /restic-cache
VOLUME /configs
VOLUME /data
WORKDIR /data
CMD sleep infinity