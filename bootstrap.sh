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

# Install Node.JS packages.
npm -g -y install sails azure-cli forever
npm -y install --no-bin-links
# Testing with Jasmine and Frisby
npm -g -y install jasmine jasmine-node frisby

# Install mathjax dependency.
git clone -b develop https://github.com/dpvc/MathJax.git node_modules/MathJax-node/mathjax
