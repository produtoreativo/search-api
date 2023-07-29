/* eslint-disable prettier/prettier */
export default function queryMagento(my_search_term: string) {

    return (
        {
            "query": {
                "bool": {
                    "should": [                  
                        {
                            "match": {
                                "short_description": {
                                    "query": my_search_term,
                                    "operator": "OR",
                                    "prefix_length": 0,
                                    "max_expansions": 50,
                                    "fuzzy_transpositions": true,
                                    "lenient": false,
                                    "zero_terms_query": "NONE",
                                    "auto_generate_synonyms_phrase_query": true,
                                    "boost": 2.0
                                }
                            }
                        },
                    ]
                }
            },

        }
    )
}