#!/bin/bash

# Check if a program is installed.
function program_is_installed {
  local return_=1

  type $1 >/dev/null 2>&1 || { local return_=0; }
  echo "$return_"
}

sudo yum update -y

# Install Node.js if not installed.
if [ $(program_is_installed node) == 0 ]; then
  curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
  sudo yum install -y nodejs
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

if [ $(program_is_installed pm2) == 0 ]; then
  npm install -g pm2
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
