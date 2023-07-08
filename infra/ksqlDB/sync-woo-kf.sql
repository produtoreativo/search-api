CREATE OR REPLACE STREAM WP_POSTS_S WITH (VALUE_FORMAT='AVRO', KAFKA_TOPIC ='mysql-server.wordpress.wp_posts');
CREATE OR REPLACE STREAM WP_POSTMETA_S WITH (VALUE_FORMAT='AVRO', KAFKA_TOPIC ='mysql-server.wordpress.wp_postmeta');
CREATE OR REPLACE STREAM WP_TERM_RELATIONSHIPS_S WITH (VALUE_FORMAT='AVRO', KAFKA_TOPIC ='mysql-server.wordpress.wp_term_relationships');
CREATE OR REPLACE STREAM WP_TERM_TAXONOMY_S WITH (VALUE_FORMAT='AVRO', KAFKA_TOPIC ='mysql-server.wordpress.wp_term_taxonomy');
CREATE OR REPLACE STREAM WP_TERMS_S WITH (VALUE_FORMAT='AVRO', KAFKA_TOPIC ='mysql-server.wordpress.wp_terms');
CREATE OR REPLACE STREAM WP_TERMMETA_S WITH (VALUE_FORMAT='AVRO', KAFKA_TOPIC ='mysql-server.wordpress.wp_termmeta');


create or replace table woo_categories as
   SELECT pp.id as product_id,
      COLLECT_SET(t.name) as categories
    FROM WP_POSTS_S AS pp
      JOIN WP_TERM_RELATIONSHIPS_S tr WITHIN 30 DAYS ON pp.id = tr.object_id
      JOIN WP_TERM_TAXONOMY_S tt WITHIN 30 DAYS ON tr.term_taxonomy_id = tt.term_taxonomy_id
      JOIN WP_TERMS_S t WITHIN 30 DAYS ON tt.term_id = t.term_id
    WHERE tt.taxonomy = 'product_cat'
    group by pp.id
    EMIT CHANGES;


create or replace stream woo_products as
  SELECT  p.ID,
          p.post_title as "name",
          p.post_content as "description",
          cat.categories as "category",
          (
            CASE
              WHEN meta.meta_key = '_sku' THEN meta.meta_value
            END
          ) as "SKU",
          (
            CASE
              WHEN meta.meta_key = '_price' THEN meta.meta_value
            END
          ) as "Price",
          (
            CASE
              WHEN meta.meta_key = '_weight' THEN meta.meta_value
            END
          ) as "Weight",
          (
            CASE
              WHEN meta.meta_key = '_stock' THEN meta.meta_value
            END
          ) as "Stock"
  FROM WP_POSTS_S AS p
    JOIN WP_POSTMETA_S AS meta WITHIN 30 DAYS ON p.ID = meta.post_ID
    LEFT JOIN  WOO_CATEGORIES as cat on p.ID = cat.product_id
  WHERE (
      ( p.post_type = 'product'
      OR p.post_type = 'product_variation' ) AND p.post_status = 'publish'
    )
  AND meta.meta_key IN ('_sku', '_price', '_weight', '_stock')
  AND meta.meta_value is not null
  EMIT CHANGES;



