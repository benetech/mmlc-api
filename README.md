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

The app should be running at http://localhost:1337.

Hosting
--------

An instance of the application is hosted by Benetech in Microsoft Azure:
* Interactive form: http://mathmlcloud.org
* API use: http://mathmlcloud.portal.azure-api.net

If you wish to run the application in your own environment, the Vagrantfile in the project has a provider definition that allows you to provision an instance in Microsoft Azure, but you are free to host it wherever you like. Documentation on provisioning in other virtual machine environments, like Docker, Hyper-V or AWS, is available on the Vagrant site.

License
---------

See the [LICENSE.txt](LICENSE.txt) file for use information.
