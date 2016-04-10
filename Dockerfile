FROM node:4 

MAINTAINER John Brugge <johnbrugge@benetech.org>

EXPOSE 1337

ENV APP_DIR /usr/src/mmlc-api
ENV BUILD_PACKAGES curl unzip
ENV RUNTIME_PACKAGES openjdk-7-jre-headless python

RUN mkdir $APP_DIR

WORKDIR $APP_DIR 

COPY . $APP_DIR

RUN apt-get update && \
    apt-get install -y $BUILD_PACKAGES $RUNTIME_PACKAGES && \ 
    npm -y install && \
    curl -O http://www.apache.org/dist/xmlgraphics/batik/binaries/batik-1.7.zip && \
    unzip batik-1.7.zip && \
    cp -r batik-1.7/* node_modules/mathjax-node/batik/ && \
    rm -rf batik* && \
    chmod -R ugo+rw $APP_DIR && \
    apt-get purge --yes --auto-remove $BUILD_PACKAGES && \
    apt-get clean

CMD ["node", "app.js"]
