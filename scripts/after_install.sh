#!/bin/bash

cd /home/ec2-user/riivr-backend
sudo rm -rf env-file.zip
sudo rm -rf .env
sudo rm -rf .env.development
aws s3 sync s3://riivr-app-env-files/dev .
unzip env-file.zip
sudo cp .env.development .env
sudo pm2 delete all
sudo npm install
