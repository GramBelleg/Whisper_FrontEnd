#!/bin/bash

export DOCKER_PASS=$(sed -n '1p' /tmp/.auth)
export GITHUB_CRED_USR=$(sed -n '2p' /tmp/.auth)
export GITHUB_CRED_PSW=$(sed -n '3p' /tmp/.auth)

cd /home/azureuser/Whisper_FrontEnd

git pull https://$GITHUB_CRED_PSW@github.com/$GITHUB_CRED_USR/Whisper_FrontEnd.git production

docker login -u grambell003 -p $DOCKER_PASS

docker-compose down

docker-compose pull front

docker-compose up -d front

echo "lastest deployment of frontend at time $(date)" > log.txt