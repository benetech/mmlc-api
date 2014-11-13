# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure('2') do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "ubuntu/trusty64"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port", guest: 1337, host: 1337
  
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
    # Read settings from YAML file. Local dev does not need an Azure account, so skip if no file is there.
    require 'yaml'
    if File.exists?('secrets.yaml')
      secrets = YAML.load_file 'secrets.yaml'
      azure.subscription_id = secrets['subscription_id']
      azure.mgmt_certificate = secrets['mgmt_certificate']
      azure.vm_user = secrets['username'] # defaults to 'vagrant' if not provided
      azure.vm_password = secrets['password'] # Min 8 characters. should contain a lowercase letter, an uppercase letter, a number and a special character.
      override.ssh.username = secrets['username']
      override.ssh.password = secrets['password']
      override.ssh.private_key_path = secrets['ssh_private_key_file']
      azure.ssh_private_key_file = secrets['ssh_private_key_file']
      azure.ssh_certificate_file = secrets['ssh_certificate_file']
    end
    override.vm.box = 'azure' # Run command: vagrant box add azure https://github.com/msopentech/vagrant-azure/raw/master/dummy.box.
    azure.mgmt_endpoint = 'https://management.core.windows.net'
    azure.cloud_service_name = 'mathml-cloud'
    azure.storage_acct_name = 'mmlcstorage'
    azure.vm_image = 'b39f27a8b8c64d52b05eac6a62ebad85__Ubuntu-14_04-LTS-amd64-server-20140416.1-en-us-30GB'
    azure.vm_size = 'ExtraSmall'
    azure.vm_name = 'mathml-cloud' # MUST BE LOWERCASE, max 15 characters, can contain letters/numbers/hyphens (must start with a letter, cannot end with a hyphen).
    azure.vm_location = 'West US'
    azure.ssh_port = 22
    azure.tcp_endpoints = '1337:80'

    # We don't want the synced folder in Azure.
    override.vm.synced_folder ".", "/vagrant", disabled: true
  end

  # Run bootstrap script to perform additional setup.
  config.vm.provision :shell, path: "bootstrap.sh"

end
