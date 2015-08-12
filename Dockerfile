FROM ubuntu:14.04

MAINTAINER John Brugge <johnbrugge@benetech.org>

EXPOSE 1337

RUN mkdir /usr/local/mmlc-api

WORKDIR /usr/local/mmlc-api

# Make sure we're up to date.
RUN apt-get update -y && apt-get upgrade -y

# Install required packages.
RUN apt-get install -y \
	nodejs \
	npm \
	openjdk-7-jre-headless

COPY api api
COPY config config 
COPY tasks tasks 
COPY 6379.conf 6379.conf
COPY app.js app.js
COPY kue.js kue.js 
COPY package.json package.json

# Install Node.js packages.
RUN npm -g -y install sails@0.10.5 && \
	npm -y install --no-bin-links

RUN groupadd -g 11500 -r mmlc-api && \
    useradd -g mmlc-api -u 11500 -m -s /bin/bash mmlc-api 

USER mmlc-api

CMD ["sails", "lift"]
