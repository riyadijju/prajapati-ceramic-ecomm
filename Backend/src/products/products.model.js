// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     category: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     oldPrice: { type: Number },
//     image: { type: String, required: true },
//     color: { type: String },
//     rating: { type: Number, default: 0 },
//     author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
//   },
//   { timestamps: true }
// );

// const Products = mongoose.model("Product", ProductSchema);

// module.exports = Products;



// ----TRY_________
// const mongoose = require("mongoose");

// const VariantSchema = new mongoose.Schema({
//   name: String,
//   color: String,
//   image: String,
// });

// const ProductSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     category: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     oldPrice: { type: Number },
//     image: { type: String, required: true }, // default or main image
//     rating: { type: Number, default: 0 },
//     variants: [VariantSchema], // 👈 added this
//     artist: { type: String }, // 👈 instead of color, use this to highlight artisan
//     author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
//   },
//   { timestamps: true }
// );

// const Products = mongoose.model("Product", ProductSchema);

// module.exports = Products;
  


// _____TRY 2__________
const mongoose = require("mongoose");

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true }, // Hex code or color name
  image: { type: String, required: true },
  price: { type: Number }, // Optional variant-specific pricing
  stock: { type: Number, default: 0 }
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // Base price
    oldPrice: { type: Number },
    mainImage: { type: String, required: true }, // Main display image
    variants: [VariantSchema], // Array of color variants
    rating: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const Products = mongoose.model("Product", ProductSchema);

module.exports = Products;