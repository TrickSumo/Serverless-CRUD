const { getDynamoDBTableItem, getAllDynamoDBTableItems } = require("./dynamo");

const coffees = [];

const createResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body,
  };
};

const createCoffee = (coffee) => {
  coffees.push(coffee);
  return coffee;
};

const getCoffee = async (event) => {
  const { pathParameters } = event;
  const coffeeId = pathParameters?.id;
  try {
    if (coffeeId) {
      const data = await getDynamoDBTableItem(coffeeId);
      return createResponse(200, JSON.stringify(data));
    } else {
      const data = await getAllDynamoDBTableItems();
      return createResponse(200, JSON.stringify(data));
    }
  } catch (error) {
    if (error.message === "404")
      return createResponse(404, JSON.stringify({ error: "Item Not Found!" }));
    return createResponse(
      500,
      JSON.stringify({
        error: "Internal Server Error!",
        message: error.message,
      })
    );
  }
};

const updateCoffee = (id, updatedCoffee) => {
  const index = coffees.findIndex((coffee) => coffee.id === id);
  if (index !== -1) {
    coffees[index] = { ...coffees[index], ...updatedCoffee };
    return coffees[index];
  }
  return null;
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
