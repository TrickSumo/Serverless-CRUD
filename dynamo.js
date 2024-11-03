const getData = async () => {
  return [1, 2, 3];
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

module.exports = { getData, postData, putData, deleteData };

module.exports = { getData };
