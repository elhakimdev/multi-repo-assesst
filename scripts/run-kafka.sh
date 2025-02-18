#!/bin/bash

COMPOSE_FILE="./docker/docker-kafka-compose.yaml"
LOG_SCRIPT="./scripts/kafka-logs.sh"

# Check if the docker-compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
  echo "$COMPOSE_FILE file not found!"
  exit 1
fi

# Check if the log script exists
if [ ! -f "$LOG_SCRIPT" ]; then
  echo "$LOG_SCRIPT file not found!"
  exit 1
fi

# Export environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Run Docker Compose
echo "Starting Kafka cluster..."
docker-compose -f "$COMPOSE_FILE" up -d

# Check if Docker Compose started successfully
if [ $? -eq 0 ]; then
  echo "Kafka cluster started successfully!"
  echo "Starting Kafka logs..."
  bash "$LOG_SCRIPT"
else
  echo "Failed to start Kafka cluster!"
  exit 1
fi
