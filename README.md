```sh
sudo sysctl -w vm.max_map_count=262144 # for elastic
sudo echo "127.0.0.1   host.docker.internal" >> /etc/hosts # for docker
docker-compose up
# sudo chown 1000:1000 infra/es01 # for elastic
```


- Nestjs API -> http://localhost:3000
- Wordpress -> http://localhost:8000
- Php MyAdmin -> http://localhost:8080
- Kafka control center -> http://localhost:9021
- Kibana -> http://localhost:5601