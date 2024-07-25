export const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    NOT_MODIFIED: 304,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
  };
  
  // You can also export individual constants if needed
  export const { OK, CREATED, ACCEPTED, NO_CONTENT, MOVED_PERMANENTLY, FOUND, NOT_MODIFIED, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, METHOD_NOT_ALLOWED, CONFLICT, INTERNAL_SERVER_ERROR, NOT_IMPLEMENTED, BAD_GATEWAY, SERVICE_UNAVAILABLE, GATEWAY_TIMEOUT } = HTTP_STATUS_CODES;
  