const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");

router.get(`/`, async (req, res, next) => {
  const categoryList = await Category.find();
  res.send(categoryList);
});

module.exports = router;
