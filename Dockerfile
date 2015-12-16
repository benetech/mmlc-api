FROM ubuntu:14.04

MAINTAINER John Brugge <johnbrugge@benetech.org>

EXPOSE 1337

RUN mkdir /usr/local/mmlc-api

WORKDIR /usr/local/mmlc-api

# Make sure we're up to date.
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update -y && apt-get upgrade -y && \
	apt-get install -y curl && \
	apt-get install -y build-essential

RUN curl -sL https://deb.nodesource.com/setup_0.10 | sudo -E bash -

# Install required packages.
RUN apt-get install -y \
	nodejs \
	openjdk-7-jre-headless \
	python

COPY api api
COPY config config 
COPY tasks tasks 
COPY 6379.conf 6379.conf
COPY app.js app.js
COPY kue.js kue.js 
COPY package.json package.json

# Install Node.js packages.
RUN npm -g -y install npm@latest-2
RUN npm -g -y install sails@0.11.0 && \
	npm -y install --no-bin-links
RUN npm install webkit-devtools-agent

RUN groupadd -g 11500 -r mmlc-api && \
    useradd -g mmlc-api -u 11500 -m -s /bin/bash mmlc-api 
RUN chmod -R ugo+rw /usr/local/mmlc-api

USER mmlc-api

CMD ["node", "app.js"]
