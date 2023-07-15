GET mysql-server.wordpress.wp_posts/_search?pretty=true&size=50
{
    "query" : {
        "bool": {
          "filter": [
            { "term": { "before.post_status": "publish" }},
            { "term": { "after.post_status": "publish" }},
            { "term": { "after.post_type": "product" }}
          ]
        }
    }
}

GET mysql-server.wordpress.wp_terms/_search?pretty=true&size=50

GET mysql-server.wordpress.wp_posts/_search?pretty=true&size=50
{
    "query" : {
        "bool": {
          "filter": [
            { "term": { "post_status": "publish" }},
            { "term": { "post_type": "product" }}
          ]
        }
    }
}

GET mysql-server.wordpress.wp_posts/_search?pretty=true&size=50



PUT mysql-server.wordpress.wp_terms/_settings
{ 
    "index": { 
        "default_pipeline": "mysql-server.wordpress.wp_terms_lookup" 
    } 
}

GET mysql-server.wordpress.wp_term_taxonomy/_search?pretty=true&size=50

GET mysql-server.wordpress.wp_posts/_settings
