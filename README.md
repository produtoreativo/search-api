## Project Setup

This project requires some initial configuration steps to run properly. Follow the instructions below:

1. Set Elasticsearch configuration:

  ```sh
  sudo sysctl -w vm.max_map_count=262144
  ```

2. Add an entry to /etc/hosts for Docker:
  ```sh
  sudo echo "127.0.0.1   host.docker.internal" >> /etc/hosts
  ```

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
- Wordpress -> http://localhost:8000
- Php MyAdmin -> http://localhost:8080
- Kafka control center -> http://localhost:9021
- Kibana -> http://localhost:5601
