export const generateOTP = () => {
  const otp = Math.floor(Math.random() * 100000);
  let otp_expiry = new Date();
  otp_expiry.setTime(new Date().getTime() + 2 * 60 * 1000);

  return { otp, otp_expiry };
};
