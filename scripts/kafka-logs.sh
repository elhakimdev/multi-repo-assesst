#!/bin/bash

# Log directory
LOG_DIR="./logs"
mkdir -p "$LOG_DIR"

# Log files
BROKER_LOG="$LOG_DIR/broker.log"
CONTROLLER_LOG="$LOG_DIR/controller.log"
ERROR_LOG="$LOG_DIR/error.log"
PID_FILE="$LOG_DIR/kafka-logs.pid"

# Clean up old logs
> "$BROKER_LOG"
> "$CONTROLLER_LOG"
> "$ERROR_LOG"

echo "Starting Kafka logging in the background..."

# Function to tail logs in the background
tail_logs() {
  local container_name=$1
  local log_file=$2

  echo "Tailing logs for $container_name..."
  docker logs -f "$container_name" 2>&1 | tee -a "$log_file" &
  echo $! >> "$PID_FILE"  # Store the process ID
}

# Create a PID file to track background processes
> "$PID_FILE"

# Monitor controller logs
tail_logs controller-1 "$CONTROLLER_LOG"
tail_logs controller-2 "$CONTROLLER_LOG"
tail_logs controller-3 "$CONTROLLER_LOG"

# Monitor broker logs
tail_logs broker-1 "$BROKER_LOG"
tail_logs broker-2 "$BROKER_LOG"
tail_logs broker-3 "$BROKER_LOG"

# Monitor for errors
echo "Monitoring errors..."
tail -F "$BROKER_LOG" "$CONTROLLER_LOG" | grep -i "error\|warn\|failed" | tee -a "$ERROR_LOG" &
echo $! >> "$PID_FILE"

echo "Logs are being saved in the ./logs directory."
echo "Kafka logging is running in the background. To stop it, use: ./stop-kafka-logs.sh"
