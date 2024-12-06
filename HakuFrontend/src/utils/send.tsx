import axios from 'axios'

export async function send_order(order: string,nPetition: number): Promise<{ answer: string; nPetit: number }> {
    console.log("Sending...");
    const url = "http://192.168.80.19:5000/read";
    const body = { order: order,nPetition: nPetition };
    try {
       const answer = await axios.post(url, body);
       return {
      answer: answer.data.answer,
      nPetit: answer.data.nPetition,
    };
    } catch (error) {
      return {
        answer: "Error: Unable to process request.",
        nPetit: nPetition,
      };;
    }
  }


