require("dotenv").config();
const datetime = require("node-datetime");
const passKey = process.env.MPESA_PASSKEY;
const shortCode = process.env.MPESA_SHORTCODE;
const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

const newPassword = () => {
  const dt = datetime.create();
  const formatted = dt.format("YmdHMS");

  const passString = shortCode + passKey + formatted;

  const base64EncodedPassword = Buffer.from(passString).toString("base64");

  return base64EncodedPassword;
};

exports.mpesaPassword = (req, res) => {
  res.send(newPassword());
};
