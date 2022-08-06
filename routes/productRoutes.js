const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const { Product } = require("../models/product");
const mongoose = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalif image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const extension = FILE_TYPE_MAP[file.mimetype];
    const fileName = file.originalname.split(" ").join("-"); //.replace(' ','-')
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

var uploadOptions = multer({ storage: storage });

router.get(`/`, async (req, res, next) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const productList = await Product.find(filter).populate("category");
  if (!productList) return res.status(500).json({ success: false });
  res.send(productList);
});

router.get(`/:id`, async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) return res.status(500).json({ success: false });
  res.send(product);
});

router.post(`/`, uploadOptions.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("category not found");
  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  let product = new Product({
    name: req.body.name,
    image: `${basePath}${fileName}`, // "http://localhost:300/public/uploads/image-223...jpeg or png"
    countInStock: req.body.countInStock,
    description: req.body.description,
    richDescription: req.body.richDescription,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  product = await product.save();
  if (!product)
    return res.status(500).json({
      message: "product cannot be created",
      success: false,
    });
  return res.status(201).json(product);
});

router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid Product Id");
  }

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(400).send("Invalid Product!");

  const file = req.file;
  let imagepath;

  if (file) {
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    imagepath = `${basePath}${fileName}`;
  } else {
    imagepath = product.image;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagepath,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!updatedProduct)
    return res.status(500).send("the product cannot be updated!");

  res.send(updatedProduct);
});

router.delete("/:id", (req, res) => {
  console.log(req.params.id);
  Product.findByIdAndRemove(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(500).json({
          success: false,
          message: "error deleting product:product not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "product deleted",
      });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res, next) => {
  const productCount = await Product.countDocuments();
  if (!productCount) return res.status(500).json({ success: false });
  res.send({ count: productCount });
});

router.get(`/get/featured/:count`, async (req, res, next) => {
  const count = req.params.count ? req.params.count : 0;
  if (count > 0) {
    const products = await Product.find({ isFeatured: true }).limit(+count);
    if (!products) return res.status(500).json({ success: false });
    res.send({ products });
  } else {
    const products = await Product.find({ isFeatured: true });
    if (!products) return res.status(500).json({ success: false });
    res.send({ products });
  }
});

router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("Invalid Product Id");
    }

    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!product) return res.status(500).send("the gallery cannot be updated!");

    res.send(product);
  }
);

module.exports = router;
