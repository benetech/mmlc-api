#!/usr/bin/env bash

# Make sure we're up to date.
sudo apt-get update -y
sudo apt-get upgrade -y

# Install required packages.
sudo apt-get install nodejs npm mongodb openjdk-7-jre-headless git -y
sudo ln -s /usr/bin/nodejs /usr/bin/node

# Get the source if running in production.
# The /Vagrant synced folder only exists in the dev environment.
if [ -d /vagrant ]
then
  cd /vagrant
else
  git clone https://github.com/benetech/mmlc-experiments ~mmlc/mathml-cloud
  cd ~mmlc/mathml-cloud
fi

# Install Node.JS packages.
sudo npm -g -y install sails sails-mongo azure-cli --save
sudo npm -y install
cd MathJax-node
 sudo npm -y install
cd ..
