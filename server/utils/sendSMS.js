import axios from "axios";

export async function sendSMS(mobile , otp ) {
  try {
      const head = {
          headers: {
              'authkey': "375450AGkb7pX8r1624f29efP1",
              'content-type': 'application/json',
          }
      };
      const body = {
          flow_id: "66306b2fd6fc05226e15f792",
          sender: "0xDAY",
          short_url: "0",
          mobiles: mobile,
          otp: otp,
      }
      const { data } = await axios.post("https://api.msg91.com/api/v5/flow/", body, head);
      console.log("getting data from sendSMS function ", data);
  } catch (error) {
      console.log("Error from sendSMS", error);
  }
}

