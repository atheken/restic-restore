FROM mcr.microsoft.com/devcontainers/base:alpine-3.18
RUN sudo apk add -u go restic
ENV GOPATH="$HOME/go"
ENV PATH="$GOPATH/bin:$PATH"
RUN go install -v golang.org/x/tools/gopls@latest
RUN go install github.com/mitranim/gow@latest
WORKDIR /src
CMD gow run .