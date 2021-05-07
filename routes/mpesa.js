const express = require("express");
const router = express.Router();

const {mpesaPassword} = require("../controllers/mpesaController")

router.get("/", mpesaPassword)
module.exports = router;