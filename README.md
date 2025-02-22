# Kafka Docker Setup

This repository contains a Docker Compose configuration to run an Apache Kafka cluster with multiple controllers and brokers.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed

## Setup

### Running Kafka Cluster

To start the Kafka cluster, navigate to the `docker` folder and run:

```sh
./scripts/run-kafka.sh
```

This will start:
- 3 Kafka controllers (`controller-1`, `controller-2`, `controller-3`)
- 3 Kafka brokers (`broker-1`, `broker-2`, `broker-3`)
- A dedicated network (`kafka-network`)

### Stopping Kafka Cluster

To stop and remove all running containers, run:

```sh
./scripts/stop-kafka.sh
```

### Viewing Logs

To view logs of the Kafka cluster, run:

```sh
./scripts/kafka-logs.sh
```

This will output logs from all running Kafka services.

## Kafka Configuration

The `docker/docker-kafka-compose.yaml` file defines the following:

- **Controllers** (Nodes 1, 2, and 3) handle metadata management.
- **Brokers** (Nodes 4, 5, and 6) handle message processing.
- **Kafka Network** (`kafka-network`) ensures communication between containers.

## Ports Mapping

| Broker    | Internal Port | External Port |
|-----------|--------------|--------------|
| broker-1  | 9092         | 29092        |
| broker-2  | 9092         | 39092        |
| broker-3  | 9092         | 49092        |

## Environment Variables

- `KAFKA_NODE_ID`: Unique identifier for each Kafka node.
- `KAFKA_PROCESS_ROLES`: Defines whether a node is a `controller` or `broker`.
- `KAFKA_LISTENERS`: Defines listener endpoints.
- `KAFKA_ADVERTISED_LISTENERS`: Defines how brokers advertise their services.
- `KAFKA_CONTROLLER_QUORUM_VOTERS`: Defines the list of controller nodes.
- `KAFKA_TOPICS`: Default topics to create on startup.

## Post setup

### Creating Topic with Consumer Group

- List clusters 
  ```sh
  docker ps -a 
  ```

- Run container interactive terminal
  ```sh
  docker exec -it broker-1 bash 
  ```

- creating topic and consumer group 
  ```sh
  ./opt/kafka/bin/kafka-consumer-group.sh --bootstrap-server broker-1:19092 --topic nest-kafka-topic --group nest-kafka-group
  ```

## Notes

- Brokers are accessible externally via `localhost:29092`, `localhost:39092`, and `localhost:49092`.
- The `scripts` folder contains helper scripts for managing the Kafka cluster.
- Ensure scripts have execute permissions by running:
  ```sh
  chmod +x scripts/*.sh
  ```

## License

This project is licensed under the MIT License.

