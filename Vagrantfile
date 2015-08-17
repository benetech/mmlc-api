# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.require_version ">= 1.6.0"
ENV['VAGRANT_DEFAULT_PROVIDER'] = 'docker'

Vagrant.configure('2') do |config|

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # Default Node port
#  config.vm.network "forwarded_port", guest: 1337, host: 1337
#  config.vm.network "forwarded_port", guest: 3000, host: 3000
  # Open up ports to support debugging
#  config.vm.network "forwarded_port", guest: 5858, host: 5858
#  config.vm.network "forwarded_port", guest: 8080, host: 8080
  
  config.vm.define "mmlc-redis" do |container|
    # Disable synced folders for the Docker container
    container.vm.synced_folder ".", "/vagrant", disabled: true
  
    container.vm.provider "docker" do |docker|
      # TODO: Why can't it find the tag redis:2.8.21?
      docker.image = "redis"
      docker.ports = ['6379:6379']
      docker.name = 'mmlc-redis'
    end
  end
  
  config.vm.define "mmlc-mongo" do |container|
    # Disable synced folders for the Docker container
    container.vm.synced_folder ".", "/vagrant", disabled: true
  
    container.vm.provider "docker" do |docker|
      docker.image = "mongo:2.6.11"
      docker.ports = ['27017:27017']
      docker.name = 'mmlc-mongo'
    end
  end
  
  config.vm.define "mmlc-api" do |container|
    container.vm.synced_folder ".", "/vagrant"
  
    # The mmlc-api container
    container.vm.provider "docker" do |docker|
      # Specify the Docker image to use
      docker.build_dir = "."
    
      # Specify port mappings
      docker.ports = ['1337:1337']
    
      # Specify a friendly name for the Docker container
      docker.name = 'mmlc-api'
      docker.link('mmlc-redis:mmlc-redis')
      docker.link('mmlc-mongo:mmlc-mongo')
      docker.host_vm_build_dir_options = { :type => "rsync", :rsync__exclude => "node_modules/" }
    end
  end

end
