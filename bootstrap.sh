#!/usr/bin/env bash

# Make sure we're up to date.
apt-get update -y
apt-get upgrade -y

# Install required packages.
apt-get install nodejs npm mongodb openjdk-7-jre-headless git -y
ln -s /usr/bin/nodejs /usr/bin/node

# Get the source if running in production.
# The /Vagrant synced folder only exists in the dev environment.
if [ -d /vagrant ]
then
  cd /vagrant
else
  git clone https://github.com/benetech/mmlc-experiments ~mmlc/mathml-cloud
  chown -R ~mmlc/mathml-cloud mmlc
  cd ~mmlc/mathml-cloud
fi

# Install Node.JS packages, mathjax-node, and mathjax.
npm -g -y install sails sails-mongo azure-cli forever passport passport-http-bearer sails-generate-auth --save
npm -g -y install https://github.com/benetech/MathJax-node/tarball/master --save
npm -y install --no-bin-links

# Install mathjax dependency.
git clone -b develop https://github.com/dpvc/MathJax.git node_modules/MathJax-node/mathjax
