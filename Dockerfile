FROM node:11

MAINTAINER John Brugge <johnbrugge@benetech.org>

EXPOSE 1337

ENV NODE_ENV production

ENV APP_DIR /usr/src/mmlc-api
ENV BUILD_PACKAGES curl unzip
ENV RUNTIME_PACKAGES openjdk-8-jre-headless python netcat-openbsd

RUN mkdir $APP_DIR

WORKDIR $APP_DIR

COPY . $APP_DIR

RUN apt-get update && \
    apt-get install -y $BUILD_PACKAGES $RUNTIME_PACKAGES && \
    npm -y install && \
    curl -O http://www.apache.org/dist/xmlgraphics/batik/binaries/batik-bin-1.10.zip && \
    unzip batik-bin-1.10.zip && \
    mv batik-1.10 node_modules/mathjax-node/batik/ && \
    rm -rf batik* && \
    chmod -R ugo+rw $APP_DIR && \
    apt-get purge --yes --auto-remove $BUILD_PACKAGES && \
    apt-get clean && \
    chmod +x wait_for.sh

CMD ./wait_for.sh mongo 27017 && node app.js
