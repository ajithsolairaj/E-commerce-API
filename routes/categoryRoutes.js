const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");

router.get(`/`, async (req, res, next) => {
  const categoryList = await Category.find();
  res.send(categoryList);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(500).json({ message: "the category with the id wan not found" });
  }
  res.status(200).send(category);
});

router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  category = await category.save();
  if (!category) {
    return res.status(404).send("the category cannot be found");
  }
  res.send(category);
});

router.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true }
  );
  if (!category) return res.status(400).send("the category cannot be created");
  res.send(category);
});

router.delete("/:id", (req, res) => {
  console.log(req.params.id);
  Category.findByIdAndRemove(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(500).json({
          success: false,
          message: "error deleting category:category not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "category deleted",
      });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
