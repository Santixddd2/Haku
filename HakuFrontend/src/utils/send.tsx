import axios from 'axios'

export async function send_order(order: string): Promise<string> {
    console.log("Sending...");
    const url = "http://192.168.80.19:5000/read";
    const body = { order: order };
  
    try {
       const answer = await axios.post(url, body);
       return answer.data.answer; 
    } catch (error) {
      return "Error: Unable to process request.";
    }
  }


