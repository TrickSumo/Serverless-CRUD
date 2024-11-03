const coffees = [];

const createCoffee = (coffee) => {
  coffees.push(coffee);
  return coffee;
};

const getCoffee = async (event) => {
  console.log("event", event);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Hello World",
      test: 123,
    }),
  };
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
