const { getCoffee } = require("./index");
const { getDynamoDBTableItem, getAllDynamoDBTableItems } = require("./dynamo");

const mockData = [
  {
    coffeeId: "coffee101",
    name: "Filter Coffee",
    price: "$30",
    available: "true",
  },
  {
    coffeeId: "coffee102",
    name: "Cold Coffee",
    price: "$15",
    available: "true",
  },
  {
    coffeeId: "coffee103",
    name: "Special Coffee",
    price: "$45",
    available: "true",
  },
];

jest.mock("./dynamo", () => ({
  getDynamoDBTableItem: jest.fn(),
  getAllDynamoDBTableItems: jest.fn(),
}));

describe("getCoffee Function Test Cases", () => {
  it("Should return list of all coffees when coffee API is called without coffeeID", async () => {
    getAllDynamoDBTableItems.mockResolvedValue(mockData);
    const event = { pathParameters: {} };
    const result = await getCoffee(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockData);
  });

  it("Should return empty list if DB is empty and coffeeID is not passed", async () => {
    const event = { pathParameters: {} };
    getAllDynamoDBTableItems.mockResolvedValue([]);
    const result = await getCoffee(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual([]);
  });

  it("Should return coffee details when coffee API is called with coffeeID", async () => {
    const coffeeId = "coffee101";
    const event = { pathParameters: { id: coffeeId } };
    const mockCoffeeData = mockData.find(
      (coffee) => coffee.id === event.pathParameters.coffeeId
    );
    getDynamoDBTableItem.mockResolvedValue(mockCoffeeData);
    const result = await getCoffee(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockCoffeeData);
  });

  it("Should return 404 if coffeeId is not present in DB records", async () => {
    const coffeeId = "coffee101-random";
    const event = { pathParameters: { id: coffeeId } };
    getDynamoDBTableItem.mockRejectedValue(new Error("404"));
    const result = await getCoffee(event);
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ error: "Item Not Found!" });
  });
});
