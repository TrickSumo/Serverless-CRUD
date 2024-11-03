const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

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
  console.log("response", response);
  if (response?.Item) return response.Item;
  else throw new Error("404");
};

const getAllDynamoDBTableItems = async () => {
  const params = {
    TableName: COFFEE_TABLE,
  };
  const command = new ScanCommand(params);
  const response = await docClient.send(command);
  console.log("response", response);
  return response.Items;
};

const postData = async (data) => {
  // Logic to post data
  return { message: "Data posted", data };
};

const putData = async (id, data) => {
  // Logic to update data
  return { message: "Data updated", id, data };
};

const deleteData = async (id) => {
  // Logic to delete data
  return { message: "Data deleted", id };
};

module.exports = {
  getDynamoDBTableItem,
  getAllDynamoDBTableItems,
  postData,
  putData,
  deleteData,
};
