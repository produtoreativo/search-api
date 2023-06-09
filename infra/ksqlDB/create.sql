-- criar um Stream capturando tudo que chega em posts
CREATE STREAM stream_posts 
(
    ID BIGINT
    , post_title VARCHAR(STRING)
    , post_content VARCHAR(STRING)
)
WITH (
    KAFKA_TOPIC = 'mysql-server.wordpress.wp_posts',
    VALUE_FORMAT = 'JSON'
);

SELECT * FROM stream_posts EMIT CHANGES;

-- Garante que o topico será criado
CREATE STREAM POSTS_TOPIC
 WITH (PARTITIONS=1) AS SELECT * FROM stream_posts PARTITION BY ID;


CREATE TABLE posts_aggregated 
(
    ID BIGINT
    , post_title VARCHAR(STRING)
    , post_content VARCHAR(STRING)
)
WITH (
    KAFKA_TOPIC='tb_posts2',
    VALUE_FORMAT='JSON',
    KEY='ID', 
    PARTITIONS=1, 
    REPLICAS=1
)
AS 
SELECT ID,post_title, post_content FROM POSTS_TOPIC EMIT CHANGES;

SELECT * FROM posts_aggregated;