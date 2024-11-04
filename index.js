const {
  getDynamoDBTableItem,
  getAllDynamoDBTableItems,
  postDynamoDBTableItem,
  putDynamoDBTableItem,
  deleteDynamoDBTableItem,
} = require("./dynamo");

const coffees = [];

const createResponse = (statusCode, body) => {
  const responseBody = JSON.stringify(body);
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: responseBody,
  };
};

const getCoffee = async (event) => {
  const { pathParameters } = event;
  const coffeeId = pathParameters?.id;
  try {
    if (coffeeId) {
      const data = await getDynamoDBTableItem(coffeeId);
      return createResponse(200, data);
    } else {
      const data = await getAllDynamoDBTableItems();
      return createResponse(200, data);
    }
  } catch (error) {
    if (error.message === "404")
      return createResponse(404, { error: "Item Not Found!" });
    return createResponse(500, {
      error: "Internal Server Error!",
      message: error.message,
    });
  }
};

const createCoffee = async (event) => {
  const { body } = event;
  try {
    const data = await postDynamoDBTableItem(JSON.parse(body));
    return createResponse(201, { message: "Data posted" });
  } catch (error) {
    console.log("error", error);
    if (error.message === "The conditional request failed")
      return createResponse(409, { error: "Item already exists!" });
    else
      return createResponse(500, {
        error: "Internal Server Error!",
        message: error.message,
      });
  }
};

// Name, price and avaialbility of coffee can be edited. If coffeeId is not found in record, function will throw an error.
const updateCoffee = async (event) => {
  const { body, pathParameters } = event;
  const coffeeId = pathParameters?.id;
  if (!coffeeId) return createResponse(400, { error: "Missing coffeeId" });

  try {
    const data = await putDynamoDBTableItem(coffeeId, JSON.parse(body));
    return createResponse(200, data);
  } catch (error) {
    if (error.message === "The conditional request failed")
      return createResponse(409, { error: "Item does not exists!" });
    return createResponse(500, {
      error: "Internal Server Error!",
      message: error.message,
    });
  }
};

const deleteCoffee = (id) => {
  const index = coffees.findIndex((coffee) => coffee.id === id);
  if (index !== -1) {
    return coffees.splice(index, 1)[0];
  }
  return null;
};

module.exports = {
  getCoffee,
  createCoffee,
  updateCoffee,
  deleteCoffee,
};
