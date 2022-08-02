const express = require("express");
const router = express.Router();
const { Order } = require("../models/order");

router.get(`/`, async (req, res, next) => {
  const orderList = await Order.find();
  res.send(orderList);
});

module.exports = router;
