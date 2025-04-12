const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  name: String,
  color: String,
  image: String,
  price: Number,
  stock: Number
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    image: { type: String, required: true }, // main image
    rating: { type: Number, default: 0 },
    variants: [VariantSchema],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const Products = mongoose.model("Product", ProductSchema);

module.exports = Products;
