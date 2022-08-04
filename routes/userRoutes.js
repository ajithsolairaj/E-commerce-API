const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get(`/`, async (req, res, next) => {
  const userList = await User.find().select("-passwordHash");
  if (!userList)
    return res.status(500).json({ success: false, message: "no user found" });
  else return res.send(userList);
});

router.get(`/:id`, async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user)
    return res
      .status(500)
      .json({ success: false, message: "user with id not found" });
  else return res.send(user);
});

//for admin
router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 12),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();
  if (!user) {
    return res.status(404).send("the user cannot be registered");
  }
  res.send(user);
});

//for user signup or register
router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 12),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();
  if (!user) {
    return res.status(404).send("the user cannot be registered");
  }
  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!user)
    return res
      .status(400)
      .send("The user with email not found do signup with email");
  else {
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        secret,
        { expiresIn: "1d" }
      );
      return res.status(200).send({ user: user.email, token: token });
    } else return res.status(400).send("password is wrong");
  }
});

router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the user is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments((count) => count);

  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
});

module.exports = router;
