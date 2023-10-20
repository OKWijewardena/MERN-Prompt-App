const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();

//Assign into localhost ports
const PORT = process.env.PORT || 8000;

//Json Methods
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

//Database Connection
const URL = process.env.MONGO_URL;

//routes
app.use("/users", require("./routes/user.route"));
app.use("/prompt", require("./routes/prompt.route"));
app.use("/promptgene", require("./routes/promptgeneration"));
app.use("/payment", require("./routes/payment.route"));


//MongoDB configurations

mongoose.connect(URL, {
    // useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
//   useFindAndModify: false,
  });

//Mongoose Connection
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB Connection Successful!");
});

//Run on port
app.listen(PORT, () => {
    console.log(`Server is up and running on port number : ${PORT}`);
  });