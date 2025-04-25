// const mongoose = require("mongoose");

// const VariantSchema = new mongoose.Schema({
//   name: String,
//   color: String,
//   image: String,
//   price: Number,
//   stock: Number
// });

// const ProductSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     category: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     image: { type: String, required: true }, // main image
//     rating: { type: Number, default: 0 },
//     variants: [VariantSchema],
//     author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
//   },
//   { timestamps: true }
// );

// const Products = mongoose.model("Product", ProductSchema);

// module.exports = Products;

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
    price: { 
      type: Number, 
      required: true, 
      default: 0, // Fallback price if no variants exist
    },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    variants: [VariantSchema],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

// Add a method to calculate the lowest price from variants
ProductSchema.methods.calculatePrice = function () {
  if (this.variants.length > 0) {
    return Math.min(...this.variants.map(variant => variant.price));
  }
  return this.price; // Fallback price
};

// Indexing for performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ author: 1 });

const Products = mongoose.model("Product", ProductSchema);

module.exports = Products;
