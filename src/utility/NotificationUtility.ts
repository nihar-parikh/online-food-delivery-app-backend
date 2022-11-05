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
  const accountSid = `${process.env.TWILIO_ACCOUNT_SID}`;
  const authToken = `${process.env.TWILIO_AUTH_TOKEN}`;
  const client = require("twilio")(accountSid, authToken);

  const message = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: "+14246229638",
    to: `+91${toPhoneNumber}`,
  });

  return message;
};
