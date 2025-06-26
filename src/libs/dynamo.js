const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

// Validate required environment variables
const requiredEnvVars = ['DYNAMODB_TABLE'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Create a DynamoDB client
const client = new DynamoDBClient({ 
  region: process.env.AWS_REGION || 'us-east-1'
});

// Create a DynamoDB Document Client
const dynamodb = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

const TABLE_NAME = process.env.DYNAMODB_TABLE;

// Helper function to generate a response object
const createResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(body),
});

// CRUD Operations
// createItem es el nombre preferido; alias putItem para compatibilidad
const createItem = async (item) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: item,
  });
  await dynamodb.send(command);
  return item;
};

const getItem = async (pk, sk) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: pk,
      SK: sk,
    },
  });
  const result = await dynamodb.send(command);
  return result.Item;
};

const queryItems = async (params) => {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    ...params,
  });
  const result = await dynamodb.send(command);
  return result.Items || [];
};

const updateItem = async (pk, sk, updateExpression, expressionAttributeValues, expressionAttributeNames = {}) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: pk,
      SK: sk,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
    ReturnValues: 'ALL_NEW',
  });
  const result = await dynamodb.send(command);
  return result.Attributes;
};

const deleteItem = async (pk, sk) => {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: pk,
      SK: sk,
    },
  });
  await dynamodb.send(command);
  return { success: true };
};

module.exports = {
  createResponse,
  // alias
  createItem,
  putItem: createItem,
  getItem,
  queryItems,
  updateItem,
  deleteItem,
};
