export const generateToken = (length: number) => {
  let otp = "";

  for (let i = 0; i < length; i++) {
    const digit = Math.floor(Math.random() * 10);
    console.log(digit);
    otp += digit;
  }
  return otp;
};
