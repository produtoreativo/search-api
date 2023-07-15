// cleanup enrich policies and pipelines

PUT mysql-server.wordpress.wp_terms/_settings 
{
    "index": {
        "default_pipeline": ""
    }
}
DELETE /_ingest/pipeline/mysql-server.wordpress.wp_terms_lookup

PUT mysql-server.wordpress.wp_term_relationships/_settings 
{
    "index": {
        "default_pipeline": ""
    }
}
DELETE /_ingest/pipeline/mysql-server.wordpress.wp_term_relationships_lookup

PUT mysql-server.wordpress.wp_posts/_settings 
{
    "index": {
        "default_pipeline": ""
    }
}
DELETE /_ingest/pipeline/mysql-server.wordpress.wp_posts_lookup

DELETE /_enrich/policy/mysql-server.wordpress.wp_term_taxonomy_policy

DELETE /_enrich/policy/mysql-server.wordpress.wp_termmeta_policy

DELETE /_enrich/policy/mysql-server.wordpress.wp_terms_policy

DELETE /_enrich/policy/mysql-server.wordpress.wp_postmeta_policy

DELETE /_enrich/policy/mysql-server.wordpress.wp_term_relationships_policy
