FROM alpine:3.18 as build
RUN apk add -u git curl nodejs openssh npm restic bash rclone
RUN npm install -g tsx typescript vite
SHELL ["/bin/bash", "-c" ]
COPY ./src /data
WORKDIR /data
RUN npm install
WORKDIR /data/api
RUN tsc
WORKDIR /data/ui
RUN vite build
# Now, copy the ui dist into the api dist and 
# ensure it's served statically from the express process under /app
RUN cp /data/api/dist /dist
WORKDIR /dist
RUN cp /data/ui/build ./app/

FROM alpine:3.18
RUN apk add -u nodejs npm rclone restic bash
ENV SHELL=/bin/bash
ENV RESTIC_CACHE_DIR=/restic-cache
VOLUME /restic-cache
VOLUME /configs
COPY --FROM=build /dist /app
WORKDIR /app
COPY ./src/package.json ./
COPY ./src/package-lock.json ./
ENTRYPOINT "node index.js"