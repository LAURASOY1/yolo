#!/bin/bash

echo "Fixing Python apt_pkg module issue..."

# Install python3-apt package which contains apt_pkg
sudo apt-get update || true
sudo apt-get install -y python3-apt || true

# Create symlink for apt_pkg if needed
if [ ! -e /usr/lib/python3/dist-packages/apt_pkg.cpython-38-x86_64-linux-gnu.so ] && [ -e /usr/lib/python3/dist-packages/apt_pkg.cpython-36m-x86_64-linux-gnu.so ]; then
    sudo ln -s /usr/lib/python3/dist-packages/apt_pkg.cpython-36m-x86_64-linux-gnu.so /usr/lib/python3/dist-packages/apt_pkg.cpython-38-x86_64-linux-gnu.so
fi

echo "Python apt_pkg fix applied"
