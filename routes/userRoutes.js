const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

router.get(`/`, async (req, res, next) => {
  const userList = await User.find();
  res.send(userList);
});

module.exports = router;
