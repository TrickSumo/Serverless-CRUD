const {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand
} = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const COFFEE_TABLE = process.env.COFFEE_TABLE;

const getDynamoDBTableItem = async (coffeeId) => {
  const params = {
    TableName: COFFEE_TABLE,
    Key: {
      coffeeId,
    },
  };
  const command = new GetCommand(params);
  const response = await docClient.send(command);
  if (response?.Item) return response.Item;
  else throw new Error("404");
};

const getAllDynamoDBTableItems = async () => {
  const params = {
    TableName: COFFEE_TABLE,
  };
  const command = new ScanCommand(params);
  const response = await docClient.send(command);
  return response.Items;
};

const postDynamoDBTableItem = async (data) => {
  if (!data || !data.coffeeId || !data.name || !data.price || !data.available) {
    throw new Error(
      "Missing required attributes for the item: coffeeId, name, price, or available."
    );
  }

  const params = {
    TableName: COFFEE_TABLE,
    Item: marshall({
      coffeeId: data?.coffeeId,
      name: data?.name,
      price: data?.price,
      available: data?.available,
    }),
    ConditionExpression: "attribute_not_exists(coffeeId)",
  };

  const command = new PutItemCommand(params);
  const response = await docClient.send(command);
  return response;
};

const putDynamoDBTableItem = async (coffeeId, data) => {
  const { name, price, available } = data || {};

  let updateExpression = `SET ${name ? "#name = :name, " : ""}${price ? "price = :price, " : ""}${available ? "available = :available, " : ""}`.slice(0, -2);

  const params = {
    TableName: COFFEE_TABLE,
    Key: marshall({ coffeeId }),
    UpdateExpression: updateExpression,
    ...(name && {
      ExpressionAttributeNames: {
        "#name": "name", // name is a reserved keyword in DynamoDB
      },
    }),

    ExpressionAttributeValues: marshall({
      ...(name && { ":name": data?.name }),
      ...(price && { ":price": data?.price }),
      ...(available && { ":available": data?.available }),
    }),
    ReturnValues: "ALL_NEW",
    ConditionExpression: "attribute_exists(coffeeId)",
  };

  const command = new UpdateItemCommand(params);
  const response = await docClient.send(command);
  return unmarshall(response.Attributes);
};

const deleteDynamoDBTableItem = async (coffeeId) => {
  const params = {
    TableName: COFFEE_TABLE,
    Key: marshall({ coffeeId }),
    ReturnValues: "ALL_OLD",
    ConditionExpression: "attribute_exists(coffeeId)",
  };
  const command = new DeleteItemCommand(params);
  const response = await docClient.send(command);
  return unmarshall(response.Attributes);
};

module.exports = {
  getDynamoDBTableItem,
  getAllDynamoDBTableItems,
  postDynamoDBTableItem,
  putDynamoDBTableItem,
  deleteDynamoDBTableItem,
};
