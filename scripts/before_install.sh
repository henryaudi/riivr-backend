#!/bin/bash

DIT="/home/ec2-user/riivr-backend"
if [ -d "$DIT" ]; then
  cd /home/ec2-user
  sudo rm -rf riivr-backend
else
  echo "Directory does not exist"
fi
