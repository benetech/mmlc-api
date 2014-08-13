# -*- mode: ruby -*-
# vi: set ft=ruby :

# Read settings from YAML file.
require 'yaml'
secrets = YAML.load_file 'secrets.yaml'

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "hashicorp/precise64"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port", guest: 1337, host: 1337
  config.vm.network "forwarded_port", guest: 16000, host: 16000
  
  # Share the home directory for access to host source code
  # and use NFS for 10-100x speedup:
  # NOTE: you must have a network configured above, such as config.vm.network
  config.vm.synced_folder ".", "/vagrant"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # If true, then any SSH connections made will enable agent forwarding.
  # Default value: false
  # config.ssh.forward_agent = true

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Don't boot with headless mode
  #   vb.gui = true
  #
  #   # Use VBoxManage to customize the VM. For example to change memory:
  #   vb.customize ["modifyvm", :id, "--memory", "1024"]
  # end
  #
  # View the documentation for the provider you're using for more
  # information on available options.

  # Add Azure provider.
  # You must have run the following commands before you can actually provision to azure.
  # vagrant plugin install vagrant-azure
  # vagrant box add azure https://github.com/msopentech/vagrant-azure/raw/master/dummy.box
  config.vm.provider :azure do |azure, override|
    override.vm.box = 'azure' # Run command: vagrant box add azure https://github.com/msopentech/vagrant-azure/raw/master/dummy.box.
    azure.subscription_id       = secrets['subscription_id']
    azure.mgmt_certificate      = secrets['mgmt_certificate']
    azure.mgmt_endpoint         = 'https://management.core.windows.net'
    azure.vm_image              = 'b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-12_04_4-LTS-amd64-server-20140428-en-us-30GB'
    azure.vm_size               = 'Extra Small'
    azure.vm_name               = 'mathml-cloud' # MUST BE LOWERCASE, max 15 characters, can contain letters/numbers/hyphens (must start with a letter, cannot end with a hyphen).
    azure.vm_location           = 'West US'
    azure.vm_user               = secrets['username'] # defaults to 'vagrant' if not provided
    azure.vm_password           = secrets['password'] # Min 8 characters. should contain a lowercase letter, an uppercase letter, a number and a special character.
    override.ssh.username = secrets['username']
    override.ssh.password = secrets['password']
    azure.ssh_private_key_file  = secrets['ssh_private_key_file']
    azure.ssh_certificate_file  = secrets['ssh_certificate_file']
    azure.ssh_port = 22
  end

  # Enable provisioning with CFEngine. CFEngine Community packages are
  # automatically installed. For example, configure the host as a
  # policy server and optionally a policy file to run:
  #
  # config.vm.provision "cfengine" do |cf|
  #   cf.am_policy_hub = true
  #   # cf.run_file = "motd.cf"
  # end
  #
  # You can also configure and bootstrap a client to an existing
  # policy server:
  #
  # config.vm.provision "cfengine" do |cf|
  #   cf.policy_server_address = "10.0.2.15"
  # end

  # Enable provisioning with Puppet stand alone.  Puppet manifests
  # are contained in a directory path relative to this Vagrantfile.
  # You will need to create the manifests directory and a manifest in
  # the file default.pp in the manifests_path directory.
  #
  # config.vm.provision "puppet" do |puppet|
  #   puppet.manifests_path = "manifests"
  #   puppet.manifest_file  = "site.pp"
  # end

  # Enable provisioning with chef solo, specifying a cookbooks path, roles
  # path, and data_bags path (all relative to this Vagrantfile), and adding
  # some recipes and/or roles.
  #
  config.vm.provision :chef_solo do |chef|
    chef.add_recipe "apt"
    chef.add_recipe "nodejs"
    chef.add_recipe "mongodb-debs"
	  chef.json =	{
		  "nodejs" => {
		  "version" => "0.10.25"
	  }
	}
  end

  # Enable provisioning with chef server, specifying the chef server URL,
  # and the path to the validation key (relative to this Vagrantfile).
  #
  # The Opscode Platform uses HTTPS. Substitute your organization for
  # ORGNAME in the URL and validation key.
  #
  # If you have your own Chef Server, use the appropriate URL, which may be
  # HTTP instead of HTTPS depending on your configuration. Also change the
  # validation key to validation.pem.
  #
  # config.vm.provision "chef_client" do |chef|
  #   chef.chef_server_url = "https://api.opscode.com/organizations/ORGNAME"
  #   chef.validation_key_path = "ORGNAME-validator.pem"
  # end
  #
  # If you're using the Opscode platform, your validator client is
  # ORGNAME-validator, replacing ORGNAME with your organization name.
  #
  # If you have your own Chef Server, the default validation client name is
  # chef-validator, unless you changed the configuration.
  #
  #   chef.validation_client_name = "ORGNAME-validator"

  # Get sails and azure for node.
  config.vm.provision "shell", inline: "sudo npm -g -y install sails --save"
  config.vm.provision "shell", inline: "sudo npm -g -y install sails-mongo --save"
  config.vm.provision "shell", inline: "sudo npm -g -y install azure-cli --save"

  # Install Node.JS packages.
  config.vm.provision "shell", inline: "(cd /vagrant; npm -y install)"

  # Install java for batik.
  config.vm.provision :shell, inline: 'wget --no-check-certificate https://github.com/aglover/ubuntu-equip/raw/master/equip_java7_64.sh && bash equip_java7_64.sh'

end
