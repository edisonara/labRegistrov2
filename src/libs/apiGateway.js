const { createResponse } = require('./dynamo');

const parseEvent = (event) => {
  // Parse the event body if it exists
  let body;
  try {
    body = event.body ? JSON.parse(event.body) : null;
  } catch (e) {
    body = event.body || null;
  }

  // Parse query string parameters
  const queryStringParameters = event.queryStringParameters || {};

  // Parse path parameters
  const pathParameters = event.pathParameters || {};

  // Parse headers
  const headers = event.headers || {};

  // Parse HTTP method
  const httpMethod = event.httpMethod;

  return {
    body,
    queryStringParameters,
    pathParameters,
    headers,
    httpMethod,
    rawEvent: event
  };
};

const createApiGatewayHandler = (controllerMethod) => {
  return async (event, context) => {
    try {
      // Parse the event
      const parsedEvent = parseEvent(event);
      
      // Call the controller method with the parsed event
      const result = await controllerMethod(parsedEvent);
      
      // Return the response in the format expected by API Gateway
      return {
        statusCode: result.statusCode,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: typeof result.body === 'string' ? result.body : JSON.stringify(result.body),
      };
    } catch (error) {
      console.error('Error in API Gateway handler:', error);
      
      // Handle different types of errors
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';
      
      return {
        statusCode,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          error: message,
          ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack,
            details: error.details
          })
        }),
      };
    }
  };
};

module.exports = {
  createApiGatewayHandler,
  parseEvent,
};
