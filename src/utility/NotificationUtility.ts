export const generateOTP = () => {
  const otp = Math.floor(Math.random() * 1000000);
  let otp_expiry = new Date();
  otp_expiry.setTime(new Date().getTime() + 2 * 60 * 1000);

  return { otp, otp_expiry };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  // Download the helper library from https://www.twilio.com/docs/node/install
  // Find your Account SID and Auth Token at twilio.com/console
  // and set the environment variables. See http://twil.io/secure
  const accountSid = "AC6f7bed68446c1bc017006f7b441c2aff";
  const authToken = "833783c45d8175eecaebe051ef286e20";
  const client = require("twilio")(accountSid, authToken);

  const message = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: "+14246229638",
    to: `+91${toPhoneNumber}`,
  });

  return message;
};
