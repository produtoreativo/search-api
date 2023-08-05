# Search-API

Search-API is a service designed to enhance the product search capability of a WooCommerce application. It leverages Debezium to capture changes from MySQL, enriches them through KSQLDB, and indexes into Elasticsearch.

## Prerequisites

- Docker
- Docker compose
- npm

## Project Setup

This project requires some initial configuration steps to run properly. Follow the instructions below:

1. Set Elasticsearch configuration:

  ```sh
  sudo sysctl -w vm.max_map_count=262144
  ```

>~~2. Add an entry to /etc/hosts for Docker:~~
>  ```sh
>  sudo echo "127.0.0.1   host.docker.internal" >> /etc/hosts
>  ```
> **Note:** This step is deprecated and is no longer required.

3. Navigate to the infra directory and start the services using Docker Compose:
  ```sh
  cd infra
  docker-compose up -d
  ```

4. In a separate terminal, navigate to the nest-search-api directory, install all the dependencies and run the initialization script:
  ```sh
  cd nest-search-api
  npm install
  ELASTICSEARCH_URL=http://localhost:9200 npm run init
  ```

## Accessing Services

After completing the setup, you can access the various services at the following URLs:

- Nestjs API -> http://localhost:3000
- Wordpress -> http://localhost:8000/wp-admin/
- Php MyAdmin -> http://localhost:8080
- Kafka control center -> http://localhost:9021
- Kibana -> http://localhost:5601

## Command Line Instructions

### Running ksql cli

```sh
  docker exec -it ksqldb-cli ksql http://ksqldb-server:8088
```

### Connecting to the DB

```sh
  docker exec -it mysql bash -c 'mysql -u root -p$MYSQL_ROOT_PASSWORD'
  # or
  docker exec -it mysql bash -c 'mysql -u $MYSQL_USER -p$MYSQL_PASSWORD wordpress'
```

### Activate logs in the Magento
bitnami/magento/bin/magento setup:config:set --enable-debug-logging=true
bitnami/magento/bin/magento dev:query-log:enable
bitnami/magento/bin/magento cache:flush

watch tail -n 15 bitnami/magento/var/log/debug.log
watch tail -n 15 bitnami/magento/var/debug/db.log