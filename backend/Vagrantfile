# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  # Box Settings
  config.vm.box = "ubuntu/focal64"


  # Provider
  config.vm.provider "virtualbox" do |vb|
    # Display the VirtualBox GUI when booting the machine
    vb.gui = false
  
    # Customize the amount of memory on the VM:
    vb.memory = "2048"
    vb.cpus = 2
  end
  
  # config.vm.box_check_update = false

  # Network Settings

  config.vm.network "forwarded_port", guest: 22, host: 3400, id: 'ssh'
	# config.vm.network "forwarded_port", guest: 3306, host: 3306

  # using a specific IP.
  config.vm.network "private_network", ip: "192.168.33.10"

  # SSH config
  config.ssh.forward_agent = true

  # Folder Settings
  #  config.vm.synced_folder "www/", "/var/www/html"
  config.vm.synced_folder "./", "/var/www/content-cleaner"

  # Provision settings
  # # config.vm.provision "shell", inline: <<-SHELL
  #   apt-get update && apt-get upgrade
  #   apt-get install -y apache2
  # # SHELL
  config.vm.provision "shell", path: "bootstrap.sh"
end
