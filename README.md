MathMLCloud
=========

MathMLCloud is a sails app (see http://sailsjs.org) that converts ascii math to MathML and calls Mathoid to convert to SVG and 
alt text.

Dependencies:

  - Vagrant and VirtualBox. See http://docs.vagrantup.com/v2/getting-started/index.html for installation instructions.
  - Mathoid. See https://github.com/benetech/mediawiki-services-mathoid for installation instructions.

Installation
--------------

```
git clone https://github.com/benetech/mmlc-experiments.git yourProjectName
cd yourProjectName
git clone https://github.com/benetech/mediawiki-services-mathoid.git mathoid
vagrant up
```

Install Sails and dependencies
------------------------------

After you've installed your VM, you'll have to install Sails.js and its dependencies.

```
vagrant ssh 
cd /vagrant
npm install
sudo apt-get install libfreetype6 libfontconfig
```

Start App
----------
```
cd mathoid
phantomjs main.js >/dev/null &
cd ..
sails lift >/dev/null &
```


Then the app should be running at http://localhost:1337.
