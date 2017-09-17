#!/usr/bin/env bash

IMAGE_NAME=trudyga/message-natter-users-service
CONTAINER_NAME=users-service

docker stop ${CONTAINER_NAME}
docker rm ${CONTAINER_NAME}

docker run -i -p 3001:80 --name ${CONTAINER_NAME} ${IMAGE_NAME}