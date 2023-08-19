'use strict';
exports.config = {
  app_name: 'search-api',
  license_key: 'CHANGE-LICENSE-KEY',
  distributed_tracing: {
    enabled: true,
  },
  logging: {
    level: 'trace',
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*',
    ],
  },
};
