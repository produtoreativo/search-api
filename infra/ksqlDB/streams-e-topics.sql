DROP STREAM IF EXISTS posts_enriched;\

DROP STREAM IF EXISTS posts; CREATE STREAM posts ( ID int, post_title varchar, post_author varchar, post_date varchar, post_date_gmt varchar, post_content varchar, post_type varchar, post_excerpt varchar, post_status varchar, comment_status varchar, ping_status varchar, post_password varchar, post_name varchar, to_ping varchar, pinged varchar, post_modified varchar, post_modified_gmt varchar, post_content_filtered varchar, post_parent int, guid varchar, menu_order int, post_mime_type varchar, comment_count int ) WITH \
(kafka_topic='mysql-server.wordpress.wp_posts', value_format='JSON'); \


CREATE STREAM POSTS_TOPIC \
 WITH (PARTITIONS=1) AS SELECT * FROM posts PARTITION BY ID;

DROP STREAM IF EXISTS posts_meta; CREATE STREAM posts_meta (meta_id int,post_id int, meta_key varchar,  meta_value varchar) WITH \
(kafka_topic='mysql-server.wordpress.wp_postmeta', value_format='JSON'); \

CREATE STREAM POSTS_META_TOPIC \
 WITH (PARTITIONS=1) AS SELECT * FROM posts_meta PARTITION BY meta_id;


DROP STREAM IF EXISTS term_relationships; CREATE STREAM term_relationships (object_id int,term_taxonomy_id int, term_order int) WITH \
(kafka_topic='mysql-server.wordpress.wp_term_relationships', value_format='JSON'); \

CREATE STREAM TERM_RELATIONSHIPS_TOPIC \
 WITH (PARTITIONS=1) AS SELECT * FROM term_relationships PARTITION BY object_id;


DROP STREAM IF EXISTS term_taxonomy; CREATE STREAM term_taxonomy (term_taxonomy_id int,term_id int, taxonomy varchar, description varchar, parent int, count int) WITH \
(kafka_topic='mysql-server.wordpress.wp_term_taxonomy', value_format='JSON'); \

CREATE STREAM TERM_TAXONOMY_TOPIC \
 WITH (PARTITIONS=1) AS SELECT * FROM term_taxonomy PARTITION BY term_taxonomy_id;


DROP STREAM IF EXISTS terms; CREATE STREAM terms (term_id int, name varchar, slug varchar, term_group int) WITH \
(kafka_topic='mysql-server.wordpress.wp_terms', value_format='JSON'); \

CREATE STREAM TERMS_TOPIC \
 WITH (PARTITIONS=1) AS SELECT * FROM terms PARTITION BY term_id;

DROP STREAM IF EXISTS termmeta; CREATE STREAM termmeta (meta_id int,term_id int, meta_key varchar, meta_value varchar) WITH \
(kafka_topic='mysql-server.wordpress.wp_termmeta', value_format='JSON'); \

CREATE STREAM TERM_META_TOPIC \
 WITH (PARTITIONS=1) AS SELECT * FROM termmeta PARTITION BY meta_id;


DROP STREAM IF EXISTS posts_enriched; CREATE STREAM posts_enriched AS \
SELECT \
p.id, p.post_title, p.post_author, p.post_date, p.post_date_gmt, p.post_content, p.post_type, p.post_excerpt, \
p.post_status, p.comment_status, p.ping_status, p.post_password, p.post_name, p.to_ping, p.pinged, p.post_modified, \
p.post_modified_gmt, p.post_content_filtered, p.post_parent, p.guid, p.menu_order, p.post_mime_type, p.comment_count, \
pm.meta_id, pm.meta_key, pm.meta_value, \
tr.term_taxonomy_id, tr.term_order, \
tt.term_id, tt.taxonomy, tt.description, tt.parent, tt.count, \
t.name, t.slug, t.term_group, \
tm.term_id, tm.meta_key, tm.meta_value \
FROM POSTS_TOPIC p \
LEFT OUTER JOIN POSTS_META_TOPIC pm WITHIN 7 days ON p.id = pm.post_id \
LEFT OUTER JOIN TERM_RELATIONSHIPS_TOPIC tr WITHIN 7 days ON p.id = tr.object_id \
LEFT OUTER JOIN TERM_TAXONOMY_TOPIC tt WITHIN 7 days ON tr.term_taxonomy_id = tt.term_taxonomy_id \
LEFT OUTER JOIN TERMS_TOPIC t WITHIN 7 days ON t.term_id = tt.term_id \
LEFT OUTER JOIN TERM_META_TOPIC tm WITHIN 7 days ON tm.term_id = t.term_id \
WHERE p.post_status = 'publish' AND p.post_type = 'product' \
EMIT CHANGES;






-- SELECT p.ID,
-- p.post_title 'nome',
-- p.post_content 'descrição',
-- GROUP_CONCAT(cat.name SEPARATOR ' | ') 'Category',
-- MAX(CASE WHEN meta.meta_key = '_sku' THEN meta.meta_value END) 'SKU',
-- MAX(CASE WHEN meta.meta_key = '_price' THEN meta.meta_value END) 'Price',
-- MAX(CASE WHEN meta.meta_key = '_weight' THEN meta.meta_value END) 'Weight',
-- MAX(CASE WHEN meta.meta_key = '_stock' THEN meta.meta_value END) 'Stock'
-- FROM wp_posts AS p
-- JOIN wp_postmeta AS meta ON p.ID = meta.post_ID
-- LEFT JOIN
-- (
-- SELECT pp.id,
-- GROUP_CONCAT(t.name SEPARATOR ' > ') AS name
-- FROM wp_posts AS pp
-- JOIN wp_term_relationships tr ON pp.id = tr.object_id
-- JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
-- JOIN wp_terms t ON tt.term_id = t.term_id
-- || tt.parent = t.term_id
-- WHERE tt.taxonomy = 'product_cat'
-- GROUP BY pp.id, tt.term_id
-- ) cat ON p.id = cat.id
-- WHERE (p.post_type = 'product' OR p.post_type = 'product_variation')
-- AND meta.meta_key IN ('_sku', '_price', '_weight', '_stock')
-- AND meta.meta_value is not null
-- GROUP BY p.ID