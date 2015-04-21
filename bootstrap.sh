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

#Install redis.
wget http://download.redis.io/releases/redis-2.8.17.tar.gz
tar xzf redis-2.8.17.tar.gz
cd redis-2.8.17
make install
sudo mkdir /etc/redis
sudo mkdir /var/redis
sudo cp utils/redis_init_script /etc/init.d/redis_6379
if [ -d /vagrant ]
then
  sudo cp /vagrant/6379.conf /etc/redis/6379.conf
else
  sudo cp ~mmlc/mathml-cloud/6379.conf /etc/redis/6379.conf
fi
sudo mkdir /var/redis/6379
sudo update-rc.d redis_6379 defaults
cd ..

#start redis
/etc/init.d/redis_6379 start

# Install Node.JS packages.
npm -g -y install sails@0.10.5 azure-cli forever
npm -y install --no-bin-links


