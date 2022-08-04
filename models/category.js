const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: { type: String },
    color: {
      type: String,
    },
  },
  { toJSON: { virtuals: true } }
);

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

exports.Category = mongoose.model("Category", categorySchema);
