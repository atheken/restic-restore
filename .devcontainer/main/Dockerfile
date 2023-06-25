FROM alpine:3.18
RUN apk add -u go git curl nodejs openssh
RUN go install -v golang.org/x/tools/gopls@latest
WORKDIR /data
CMD sleep infinity