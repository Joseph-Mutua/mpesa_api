const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { readdirSync } = require("fs");
const app = express();
dotenv.config();

const mpesaRoutes = require("./routes/mpesa")

//Middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

//Routes
// app.get("/api", (req, res) => {
//     res.send("You jave landed on MPESA API PAGE")
// })

app.use("/api",mpesaRoutes)

// readdirSync("./routes").map((route) => {
//   app.use("/", require("./routes/" + route));
// });

//Connect Database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => {
    console.log(`DB connection error: ${err.message}`);
  });


//PORT
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
