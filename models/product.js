const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    richDescription: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    images: [{ type: String }],
    brand: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
      min: 1,
      max: 250,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true } }
);

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

exports.Product = mongoose.model("Product", productSchema);
