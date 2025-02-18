#!/bin/bash

LOG_DIR="./logs"
PID_FILE="$LOG_DIR/kafka-logs.pid"

if [ -f "$PID_FILE" ]; then
  echo "Stopping Kafka logging..."
  while read -r pid; do
    kill "$pid" 2>/dev/null
  done < "$PID_FILE"
  rm -f "$PID_FILE"
  echo "Kafka logging stopped."
else
  echo "No Kafka logging process found."
fi


# Check if the .env file exists
if [ ! -f ./docker/docker-kafka-compose.yaml ]; then
  echo "./docker/docker-kafka-compose.yaml file not found!"
  exit 1
fi

# Export environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Run Docker Compose with the specified environment file
echo "Stopping Containerized Kafka with Docker Compose with the .env file..."
docker-compose -f ./docker/docker-kafka-compose.yaml down -v

# Check if Docker Compose started successfully
if [ $? -eq 0 ]; then
  echo "Docker Compose started successfully!"
else
  echo "Failed to start Docker Compose!"
  exit 1
fi