#!/bin/bash

aws s3 sync s3://riivr-app-env-files/dev .

unzip env-file.zip

cp .env.development .env
rm .env.development

sed -i -e "s|\(^REDIS_HOST=\).*|REDIS_HOST=redis://$ELASTICACHE_ENDPOINT_REDIS:6379|g" .env

rm -rf env-file.zip
cp .env .env.development
zip env-file.zip .env.development

aws --region us-east-1 s3 cp env-file.zip s3://riivr-app-env-files/dev/
rm -rf .env*
rm -rf env-file.zip
