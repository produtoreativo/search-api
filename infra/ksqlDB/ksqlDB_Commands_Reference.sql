-- Creates stream from existing Kafka topic.
-- This stream reflects the data in the Kafka topic.
DROP STREAM IF EXISTS POSTMETA_STREAM;
CREATE STREAM POSTMETA_STREAM
WITH (kafka_topic='mysql-server.wordpress.wp_postmeta', value_format='AVRO');


-- Creates table from existing Kafka topic. 
-- This table represents the current state of the data in the Kafka topic, 
-- where each row is identified by a unique primary key.
-- The primary key declared in the CREATE TABLE command should be unique and 
-- different from any existing column names in the Kafka message to avoid 
-- "Duplicate column names" error, as ksqlDB does not allow two columns in the 
-- same table to have the same name.
DROP TABLE IF EXISTS POSTMETA_TABLE;
CREATE TABLE POSTMETA_TABLE
(KEY VARCHAR PRIMARY KEY)
WITH (KAFKA_TOPIC='mysql-server.wordpress.wp_postmeta', VALUE_FORMAT='AVRO');


-- Creates a table from the existing stream.
-- This table will hold the latest value of each field, based on the primary key determined by the GROUP BY clause.
-- It applies the aggregate function LATEST_BY_OFFSET to get the latest value for each field.
-- The result is a materialized view of the latest state for each primary key in the stream.
DROP TABLE IF EXISTS POSTMETA_TABLE;
CREATE TABLE POSTMETA_TABLE AS
SELECT 
    META_ID
  , LATEST_BY_OFFSET(POST_ID) AS POST_ID
  , LATEST_BY_OFFSET(META_KEY) AS META_KEY
  , LATEST_BY_OFFSET(META_VALUE) AS META_VALUE
FROM POSTMETA_STREAM
GROUP BY META_ID;


-- Creates a new table where each row is grouped by POST_ID.
-- Each row contains a list of structs, with each struct representing a row from the POSTMETA_TABLE where the POST_ID matches.
-- Each struct contains the META_ID, META_KEY, and META_VALUE from the corresponding row in the POSTMETA_TABLE.
-- The COLLECT_LIST function is used to gather all related rows into a list.
-- The result is a table where each row represents a post, and the metadata from all rows in the POSTMETA_TABLE related to that post are collected together.
DROP TABLE IF EXISTS POSTMETA_TABLE_GROUPBY_POSTID;
CREATE TABLE POSTMETA_TABLE_GROUPBY_POSTID
AS SELECT 
  PM.POST_ID,
  COLLECT_LIST(
    STRUCT(
        META_ID := PM.META_ID
      , META_KEY := PM.META_KEY
      , META_VALUE := PM.META_VALUE
    )
  ) AS METADATA
FROM POSTMETA_TABLE PM
GROUP BY PM.POST_ID
EMIT CHANGES;


-- An alternative approach for grouping and structuring data from the POSTMETA_STREAM.
-- Instead of using STRUCT, it manually formats each row into a JSON-like string. This provides greater flexibility in data structuring and formatting.
-- The result is a new table where each row represents a post and its metadata is compiled into a list of structured strings.
--
-- DROP TABLE IF EXISTS POSTMETA_TABLE_GROUPBY_POSTID;
-- CREATE TABLE POSTMETA_TABLE_GROUPBY_POSTID
-- AS SELECT 
--   PM.POST_ID,
--   COLLECT_LIST(
--     '{ "META_ID" : "' + CAST(PM.META_ID AS STRING) 
--     + '", "META_KEY" : "' + PM.META_KEY 
--     + '", "META_VALUE" : "' + PM.META_VALUE + '"}'
--   ) AS POSTMETA_LIST
-- FROM POSTMETA_STREAM PM
-- GROUP BY PM.POST_ID
-- EMIT CHANGES;