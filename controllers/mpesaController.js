require("dotenv").config();
const axios = require("axios");
const datetime = require("node-datetime");
const passKey = process.env.MPESA_PASSKEY;
const shortCode = process.env.MPESA_SHORTCODE;
const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

const dt = datetime.create();
const formatted = dt.format("YmdHMS");
const newPassword = () => {
  const passString = shortCode + passKey + formatted;

  const base64EncodedPassword = Buffer.from(passString).toString("base64");

  return base64EncodedPassword;
};

exports.token = (req, res, next) => {
  const URL =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  const auth =
    "Basic " +
    Buffer.from(consumerKey + ":" + consumerSecret).toString("base64");

  const headers = {
    Authorization: auth,
  };

  axios
    .get(URL, {
      headers,
    })
    .then((res) => {
      let data = res.data;
      let access_token = data.access_token;
      req.access_token = access_token;
      next();
    })
    .catch((err) => console.log(err));
};

exports.mpesaPassword = (req, res) => {
  res.send(newPassword());
};

exports.stkPush = (req, res) => {
  const access_token = req.access_token;
  const headers = {
    Authorization: "Bearer " + access_token,
  };

  const stkURL =
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  let data = {
    BusinessShortCode: shortCode,
    Password: newPassword(),
    Timestamp: formatted,
    TransactionType: "CustomerPayBillOnline",
    Amount: "45",
    PartyA: "0713732594",
    PartyB: shortCode,
    PhoneNumber: "0713732594",
    CallBackURL: "https://ip_address:port/callback/url",
    AccountReference: "Organizaation Name",
    TransactionDesc: "Lipa Na MPESA",
  };
  axios
    .post(stkURL, data, { headers })
    .then((response) => res.send(response.data))
    .catch((err) => console.log(err));
  res.send(access_token);
};
