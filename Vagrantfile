# -*- mode: ruby -*- # vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "geerlingguy/ubuntu2004"
  
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
    vb.cpus = 2
    vb.name = "ecommerce-app-vm"
  end
  
  # Forward necessary ports with different host ports to avoid collisions
  config.vm.network "forwarded_port", guest: 3000, host: 3030  # Frontend
  config.vm.network "forwarded_port", guest: 5000, host: 5050  # Backend API
  config.vm.network "forwarded_port", guest: 27018, host: 27019 # MongoDB
  
  # Apply Python apt fix before any other provisioning
  config.vm.provision "shell", path: "fix_python_apt.sh", privileged: true, run: "once"
  
  # Provisioning script
  config.vm.provision "shell", inline: <<-SHELL
    handle_error() {
      local exit_code=$1
      local error_msg=$2
      local success_msg=$3
      
      if [ $exit_code -ne 0 ]; then
        echo "ERROR: $error_msg (exit code: $exit_code)"
        echo "Please check logs above for more details."
        exit $exit_code
      else
        echo "SUCCESS: $success_msg"
      fi
    }
    
    echo "===== Starting VM provisioning ====="
    
    # Fix Python APT issue again in case it persists
    if ! python3 -c "import apt_pkg" 2>/dev/null; then
      echo "Fixing apt_pkg module again..."
      apt-get update -y || true
      apt-get install -y python3-apt || true
      
      if [ ! -e /usr/lib/python3/dist-packages/apt_pkg.cpython-38-x86_64-linux-gnu.so ] && [ -e /usr/lib/python3/dist-packages/apt_pkg.cpython-36m-x86_64-linux-gnu.so ]; then
        ln -sf /usr/lib/python3/dist-packages/apt_pkg.cpython-36m-x86_64-linux-gnu.so /usr/lib/python3/dist-packages/apt_pkg.cpython-38-x86_64-linux-gnu.so
      fi
    fi
    
    echo "Updating package index..."
    sudo apt-get update -y || true
    
    echo "Installing Python 3, pip, and venv..."
    sudo apt-get install -y python3 python3-pip python3-venv software-properties-common
    handle_error $? "Failed to install Python 3 packages" "Python 3, pip, and venv installed"
    
    echo "Checking Python version:"
    python3 --version
    handle_error $? "Python 3 not found or broken" "Python 3 is working"
    
    echo "Checking pip version:"
    pip3 --version
    handle_error $? "pip3 not found or broken" "pip3 is working"
    
    echo "Installing Ansible via apt..."
    sudo apt-get install -y ansible
    handle_error $? "Failed to install Ansible" "Ansible installed successfully"
    
    echo "Checking Ansible version:"
    ansible --version
    handle_error $? "Ansible not working properly" "Ansible is working"
    
    echo "Setting DNS to Google DNS to avoid network issues..."
    echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf >/dev/null
    
    echo "Checking for Ansible inventory and playbook files..."
    if [ -f /vagrant/inventory.yml ] && [ -f /vagrant/playbook.yml ]; then
      echo "Running Ansible playbook..."
      cd /vagrant
      ansible-playbook -i inventory.yml playbook.yml
      handle_error $? "Failed to run Ansible playbook" "Ansible playbook completed successfully"
    else
      echo "WARNING: inventory.yml or playbook.yml not found in /vagrant directory. Skipping Ansible run."
      echo "Please place these files in the directory shared with the VM."
    fi
      
    echo "===== VM provisioning completed ====="
  SHELL
end
