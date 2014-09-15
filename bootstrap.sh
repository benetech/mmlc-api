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

# Install Node.JS packages, mathjax-node, and mathjax.
sudo npm -g -y install sails sails-mongo azure-cli forever --save
sudo npm -g -y install https://github.com/benetech/MathJax-node/tarball/master --save
sudo npm -y install

# Install mathjax dependency.
cd node_modules/MathJax-node
sudo git clone https://github.com/dpvc/MathJax.git mathjax
cd mathjax
sudo git checkout develop
cd ..

# Start the app.
cd ~mmlc/mathml-cloud
sudo forever -w start app.js
