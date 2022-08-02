const express = require("express");
const { default: mongoose } = require("mongoose");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

require("dotenv/config");

// importing Routes
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

const api = process.env.API_URL;

// enabling cors middleware
app.use(cors());
app.options("*", cors);

// middleware
app.use(express.json());
app.use(morgan("tiny"));

// to access matching Routes middleware
app.use(`${api}/products`, productRoutes);
app.use(`${api}/category`, categoryRoutes);
app.use(`${api}/order`, orderRoutes);
app.use(`${api}/user`, userRoutes);

// connecting Database
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

// listening to server
app.listen(3000, () => {
  console.log("server is running at http://localhost:3000");
});