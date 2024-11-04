const { getCoffee } = require("./index");
const { getDynamoDBTableItem, getAllDynamoDBTableItems } = require("./dynamo");

const mockData = [
  { id: "coffee101", Name: "Filter Coffee", Price: "$30", Available: "true" },
  { id: "coffee102", Name: "Cold Coffee", Price: "$15", Available: "true" },
  { id: "coffee103", Name: "Special Coffee", Price: "$45", Available: "true" },
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
      (coffee) => coffee.id === event.pathParameters.id
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
