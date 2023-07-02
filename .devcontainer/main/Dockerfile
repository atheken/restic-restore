FROM alpine:3.18
RUN apk add -u git curl nodejs openssh npm restic bash
SHELL ["/bin/bash", "-c" ]
RUN npm install -g tsx typescript
ENV SHELL=/bin/bash
WORKDIR /data
CMD sleep infinity