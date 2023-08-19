

## Executando o agente do NewRelic
docker run \
  -d \
  --name newrelic-infra \
  --network=host \
  --cap-add=SYS_PTRACE \
  --privileged \
  --pid=host \
  -v "/:/host:ro" \
  -v "/var/run/docker.sock:/var/run/docker.sock" \
  -v "newrelic-infra:/etc/newrelic-infra" \
  -e NRIA_LICENSE_KEY=XXXXXXXXXX \
  newrelic/infrastructure:latest
