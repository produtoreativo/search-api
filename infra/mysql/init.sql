-- Creating a user with necessary permissions for Debezium MySQL connector
CREATE USER 'debezium'@'%' IDENTIFIED WITH mysql_native_password BY 'dbz';
GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'debezium';
FLUSH PRIVILEGES;

-- Reset binlog_row_value_options to be empty
SET @@global.binlog_row_value_options="";