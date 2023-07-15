// wp_terms

PUT mysql-server.wordpress.wp_terms/_settings
{
    "index": {
        "default_pipeline": "mysql-server.wordpress.wp_terms_lookup"
    }
}

PUT /_enrich/policy/mysql-server.wordpress.wp_term_taxonomy_policy
{
    "match": {
        "indices": "mysql-server.wordpress.wp_term_taxonomy",
        "match_field": "term_taxonomy_id", //term_id ?
        "enrich_fields": [
            "taxonomy",
            "description",
            "parent",
            "count"
        ]
    }
}

// wp_termmeta inicia vazio no DB do Wordpress.
// necessário criar o indice e o mapping antes de criar a policy.

PUT /mysql-server.wordpress.wp_termmeta
{
    "settings": {
        "number_of_shards": 1
    },
    "mappings": {
        "properties": {
            "term_id": {
                "type": "long"
            },
            "meta_id": {
                "type": "long"
            },
            "meta_key": {
                "type": "text"
            },
            "meta_value": {
                "type": "text"
            }
        }
    }
}


PUT /_enrich/policy/mysql-server.wordpress.wp_termmeta_policy
{
    "match": {
        "indices": "mysql-server.wordpress.wp_termmeta",
        "match_field": "term_id",
        "enrich_fields": [
            "meta_id",
            "meta_key",
            "meta_value"
        ]
    }
}

POST /_enrich/policy/mysql-server.wordpress.wp_term_taxonomy_policy/_execute

POST /_enrich/policy/mysql-server.wordpress.wp_termmeta_policy/_execute

PUT /_ingest/pipeline/mysql-server.wordpress.wp_terms_lookup
{
    "description": "Criando wp_terms com os campos termmeta e taxonomy",
    "processors": [
        {
            "enrich": {
                "policy_name": "mysql-server.wordpress.wp_term_taxonomy_policy",
                "field": "term_id",
                "target_field": "taxonomy"
            }
        },
        {
            "enrich": {
                "policy_name": "mysql-server.wordpress.wp_termmeta_policy",
                "field": "term_id",
                "target_field": "termmetas",
                "max_matches": 128
            }
        }
    ]
}


// wp_term_relationships

PUT mysql-server.wordpress.wp_term_relationships/_settings
{
    "index": {
        "default_pipeline": "mysql-server.wordpress.wp_term_relationships_lookup"
    }
}

PUT /_enrich/policy/mysql-server.wordpress.wp_terms_policy
{
    "match": {
        "indices": "mysql-server.wordpress.wp_terms",
        "match_field": "term_id",
        "enrich_fields": [
            "name",
            "slug",
            "term_group",
            "taxonomy",
            "termmetas"
        ]
    }
}


POST /_enrich/policy/mysql-server.wordpress.wp_terms_policy/_execute

PUT /_ingest/pipeline/mysql-server.wordpress.wp_term_relationships_lookup
{
    "description": "Criando wp_term_relationships com os campos term e taxonomy",
    "processors": [
        {
            "enrich": {
                "policy_name": "mysql-server.wordpress.wp_terms_policy",
                "field": "term_taxonomy_id",
                "target_field": "term"
            }
        },
        {
            "rename": {
                "field": "object_id",
                "target_field": "post_id"
            }
        }
    ]
}


// wp_posts

PUT mysql-server.wordpress.wp_posts/_settings
{ 
    "index": { 
        "default_pipeline": "mysql-server.wordpress.wp_posts_lookup" 
    } 
}

PUT /_enrich/policy/mysql-server.wordpress.wp_postmeta_policy
{
    "match": {
        "indices": "mysql-server.wordpress.wp_postmeta",
        "match_field": "post_id",
        "enrich_fields": [
            "meta_id",
            "meta_key",
            "meta_value"
        ]
    }
}

PUT /_enrich/policy/mysql-server.wordpress.wp_term_relationships_policy
{
    "match": {
        "indices": "mysql-server.wordpress.wp_term_relationships",
        "match_field": "post_id", // object_id
        "enrich_fields": [
            "term_order",
            "term"
        ]
    }
}

POST /_enrich/policy/mysql-server.wordpress.wp_postmeta_policy/_execute

POST /_enrich/policy/mysql-server.wordpress.wp_term_relationships_policy/_execute

PUT /_ingest/pipeline/mysql-server.wordpress.wp_posts_lookup 
{
    "description": "Criando products",
    "processors": [
        {
            "enrich": {
                "policy_name": "mysql-server.wordpress.wp_postmeta_policy",
                "field": "ID",
                "target_field": "metadatas",
                "max_matches": 128
            }
        },
        {
            "enrich": {
                "policy_name": "mysql-server.wordpress.wp_term_relationships_policy",
                "field": "ID",
                "target_field": "categories",
                "max_matches": 128
            }
        }
    ],
    "on_failure": [
        {
            "set": {
                "description": "Record error information",
                "field": "error_information",
                "value": "Processor {{ _ingest.on_failure_processor_type }} with tag {{ _ingest.on_failure_processor_tag }} in pipeline {{ _ingest.on_failure_pipeline }} failed with message {{ _ingest.on_failure_message }}"
            }
        }
    ]
}
