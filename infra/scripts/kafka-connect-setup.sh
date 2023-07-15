#!/bin/bash

echo "Installing Connector"
confluent-hub install --no-prompt debezium/debezium-connector-mysql:2.2.1
confluent-hub install --no-prompt confluentinc/kafka-connect-elasticsearch:latest
#
echo "Launching Kafka Connect worker"
/etc/confluent/docker/run &
#
echo "Waiting for Kafka Connect to start..."
until curl -s -o /dev/null -w %{http_code} http://localhost:8083/connectors; do
  sleep 5
done
#
echo "Creating connector..."
curl -X POST -H "Content-Type: application/json" --data @/etc/kafka-connect/mysql-connector.json http://localhost:8083/connectors
curl -X POST -H "Content-Type: application/json" --data @/etc/kafka-connect/es-sink-connector.json http://localhost:8083/connectors
#
sleep infinity
