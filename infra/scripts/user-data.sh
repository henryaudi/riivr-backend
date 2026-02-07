#!/bin/bash
set -euo pipefail

# Check if a program is installed.
function program_is_installed {
  local return_=1

  type $1 >/dev/null 2>&1 || { local return_=0; }
  echo "$return_"
}

# Wait for any other yum process to finish (cloud-init can run in parallel).
while sudo fuser /var/run/yum.pid >/dev/null 2>&1; do
  sleep 3
done

sudo yum update -y

# Install Node.js if not installed (AL2 is glibc 2.26; NodeSource LTS now requires >= 2.28).
if [ $(program_is_installed node) == 0 ]; then
  if ! sudo amazon-linux-extras install -y nodejs; then
    if curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -; then
      sudo yum install -y nodejs || true
    fi
  fi
fi

# Ensure npm is present.
if [ $(program_is_installed npm) == 0 ]; then
  sudo yum install -y npm || true
fi

if [ $(program_is_installed pm2) == 0 ]; then
  npm install -g pm2
fi

# Install Git if not installed.
if [ $(program_is_installed git) == 0 ]; then
  sudo yum install git -y
fi

if [ $(program_is_installed docker) == 0 ]; then
  sudo amazon-linux-extras install docker -y
  sudo systemctl start docker
  sudo docker run --name riivr-redis -p 6379:6379 --restart always --detach redis
fi

cd /home/ec2-user

git clone -b dev https://github.com/henryaudi/riivr-backend.git

cd riivr-backend
npm install
aws s3 sync s3://riivr-app-env-files/dev .
unzip env-file.zip
cp .env.development .env
npm run build
npm run start
