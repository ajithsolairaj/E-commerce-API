const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    name: String,
    image: String,
    countInStock: {
      type: String,
      required: true,
    },
  },
  { toJSON: { virtuals: true } }
);

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

exports.Order = mongoose.model("Order", orderSchema);
