#!/bin/bash

aws s3 sync s3://riivr-app-terraform-state/dev .

unzip env-file.zip

cp .env.production .env
rm .env.production

sed -i -e "s|\(^REDIS_HOST=\).*|REDIS_HOST=redis://$ELASTICACHE_ENDPOINT_REDIS:6379|g" .env

rm -rf env-file.zip
cp .env .env.production
zip env-file.zip .env.production

aws --region us-east-1 s3 cp env-file.zip s3://riivr-app-terraform-state/dev/
rm -rf .env*
rm -rf env-file.zip
