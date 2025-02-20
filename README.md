# Fullstack Assessment Tripatra

This repository contains three projects:
1. A Next.js project with Kafka integration.
2. A React project.
3. A Nest.js Kafka project (Nx-based).

## Prerequisites

Make sure you have the following installed on your machine:
- Node.js (>= 14.x)
- npm (>= 6.x) or yarn (>= 1.x)
- Docker (for Kafka setup)

## Setting Up Kafka
You can create a Kafka topic inside your running Kafka broker container using the following command:

### **1. List Running Containers**  
First, find the Kafka broker container name:  
```sh
docker ps
```
Look for the container name of one of your brokers (e.g., `broker-1`).

### **2. Execute Into the Kafka Broker Container**  
Run the following command to get inside the broker container (replace `broker-1` if needed):  
```sh
docker exec -it broker-1 bash
```

### **3. Create a Kafka Topic**  
Inside the container, use the Kafka CLI to create a topic:  
```sh
kafka-topics.sh --create \
  --topic my-topic \
  --bootstrap-server broker-1:9092 \
  --partitions 3 \
  --replication-factor 2
```

### **4. Verify the Topic Was Created**  
Check the available topics with:  
```sh
kafka-topics.sh --list --bootstrap-server broker-1:9092
```

Let me know if you run into any issues! 🚀
## Running the Next.js Kafka Project

1. Install dependencies:
    ```sh
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

2. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running the React Project

1. Install dependencies:
    ```sh
    npm install
    # or
    yarn install
    ```

2. Start the development server:
    ```sh
    npm start
    # or
    yarn start
    ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running the Nest.js Kafka Project (Nx-based)
1. Install dependencies:
    ```sh
    npm install
    # or
    yarn install
    ```

2. Start the development server for nest js (Kafka Integrated Seamlesly during nest js setup & initialized):
    ```sh
    npx nx serve nest-kafka
    ```

3. The server will be running at [http://localhost:3333](http://localhost:3333).

## Additional Notes

- Ensure Kafka is running before starting the Next.js or Nest.js projects.
- For any issues, please refer to the respective project's documentation or raise an issue in this repository.
