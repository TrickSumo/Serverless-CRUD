const { getCoffee,
  createCoffee,
  updateCoffee,
  deleteCoffee } = require("./index");
const { getDynamoDBTableItem,
  getAllDynamoDBTableItems,
  postDynamoDBTableItem,
  putDynamoDBTableItem,
  deleteDynamoDBTableItem } = require("./dynamo");

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
  postDynamoDBTableItem: jest.fn(),
  putDynamoDBTableItem: jest.fn(),
  deleteDynamoDBTableItem: jest.fn(),
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

describe("createCoffee Function Test Cases", () => {

  it("Should return 201 if coffee is created successfully", async () => {
    const event = { body: JSON.stringify(mockData[0]) };
    postDynamoDBTableItem.mockResolvedValue({});
    const result = await createCoffee(event);
    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toEqual({
      message: "Item Created Successfully!",
      data: mockData[0],
    });
  });

  it("Should return error if coffeeId or any other parameter is missing", async () => {
    const event = { body: {} };
    postDynamoDBTableItem.mockResolvedValue({});
    const result = await createCoffee(event);
    expect(result.statusCode).toBe(500);
  });

  it("Should return error if coffeeId already exists", async () => {
    const event = { body: JSON.stringify(mockData[0]) };
    postDynamoDBTableItem.mockRejectedValue({ message: "The conditional request failed" });
    const result = await createCoffee(event);
    expect(result.statusCode).toBe(409);
    expect(JSON.parse(result.body)).toEqual({ "error": "Item already exists!" });
  });
});

describe("updateCoffee Function Test Cases", () => {
  it("Should return success if coffee is updated successfully", async () => {
    const event = { body: JSON.stringify(mockData[0]), pathParameters: { id: "coffee101" } };
    putDynamoDBTableItem.mockResolvedValue({});
    const result = await updateCoffee(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ message: "Item Updated Successfully!", data: {} });
  });

  it("Should return error if coffeeId is missing", async () => {
    const event = { body: JSON.stringify(mockData[0]), pathParameters: {} };
    putDynamoDBTableItem.mockResolvedValue({});
    const result = await updateCoffee(event);
    expect(result.statusCode).toBe(400);
  });

  it("Should return error if coffeeId is not found", async () => {
    const event = { body: JSON.stringify(mockData[0]), pathParameters: { id: "coffee101-random" } };
    putDynamoDBTableItem.mockRejectedValue({ message: "The conditional request failed" });
    const result = await updateCoffee(event);
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ "error": "Item does not exists!" });
  });
});

describe("deleteCoffee Function Test Cases", () => {

  it("Should return success if coffee is deleted successfully", async () => {
    const event = { pathParameters: { id: "coffee101" } };
    deleteDynamoDBTableItem.mockResolvedValue({});
    const result = await deleteCoffee(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ message: "Item Deleted Successfully!", data: {} });
  });

  it("Should return error if coffeeId is missing or not found ", async () => {
    const event = { pathParameters: {} };
    deleteDynamoDBTableItem.mockResolvedValue({});
    const result = await deleteCoffee(event);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ "error": "Missing coffeeId" });

    const event2 = { pathParameters: { id: "coffee101-random" } };
    deleteDynamoDBTableItem.mockRejectedValue({ message: "The conditional request failed" });
    const result2 = await deleteCoffee(event2);
    expect(result2.statusCode).toBe(404);
    expect(JSON.parse(result2.body)).toEqual({ "error": "Item does not exists!" });
  });
});