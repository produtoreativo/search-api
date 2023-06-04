PUT /_enrich/policy/mysql-server.wordpress.wp_postmeta_policy 
{ 
    "match":{ 
        "indices": "mysql-server.wordpress.wp_postmeta", 
        "match_field": "post_id", 
        "enrich_fields": ["meta_id", "meta_key", "meta_value"]  
    } 
} 

POST /_enrich/policy/mysql-server.wordpress.wp_postmeta_policy/_execute 

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


PUT mysql-server.wordpress.wp_posts/_settings 
{ 
    "index": { 
        "default_pipeline": "mysql-server.wordpress.wp_posts_lookup" 
    } 
}
