# Estrutura para realizar o ETL entre o SQL Server e o Elasticsearch

## SQL Server

Se precisar executar apenas o SQL Server   

```sh
docker run --cap-add SYS_PTRACE -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=@Fuh1478" \
   -p 1433:1433 --name sql1 --hostname sql1 \
   -d \
  mcr.microsoft.com/azure-sql-edge
```

Usuario padrão: sa  

## Rodar o compose
  ```sh
  cd sqlserver
  docker-compose up -d
  ```

Se precisar de apenas um serviço

  ```sh
    docker-compose up -d mssql
  ```