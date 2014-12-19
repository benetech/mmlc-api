MathMLCloud
=========

MathMLCloud is a sails app (see http://sailsjs.org) that converts ascii math to MathML, text descriptions, SVGs and PNGs.

Dependencies:

  - Vagrant and VirtualBox. See http://docs.vagrantup.com/v2/getting-started/index.html for installation instructions.

Installation
--------------

```
git clone https://github.com/benetech/mmlc-experiments.git yourProjectName
cd yourProjectName
vagrant up
```

Start App
----------

```
vagrant ssh
cd /vagrant
sails lift
```

Then the app should be running at http://localhost:1337.

License
---------

See the [LICENSE.txt](blob/master/LICENSE.txt) file for use information.
