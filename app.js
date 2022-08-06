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
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/errorHandler");

const api = process.env.API_URL;

// enabling cors middleware
app.use(cors());
app.options("*", cors);

// middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

// to access matching Routes middleware
app.use(`${api}/products`, productRoutes);
app.use(`${api}/category`, categoryRoutes);
app.use(`${api}/orders`, orderRoutes);
app.use(`${api}/users`, userRoutes);

// connecting Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 3000;
// listening to server
app.listen(PORT, () => {
  console.log("server is running at http://localhost:3000");
});
