const axios = require("axios");
async function send_order(order, nPetition) {
  const url = "http://192.168.20.27:5000/read";
  const body = { order: order, nPetition: nPetition };

  try {
    const response = await axios.post(url, body);
    return {
      answer: response.data.answer,
      nPetit: response.data.nPetition,
    };
  } catch (error) {
    return {
      answer: "Error: Unable to process request.",
      nPetit: nPetition,
    };
  }
}

module.exports = { send_order };
