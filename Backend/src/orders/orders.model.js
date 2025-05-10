// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema(
//   {
//     orderId: { type: String, required: true }, // Stripe Payment Intent ID
//     products: [
//       {
//         _id: { type: String, required: true }, // product id
//         name: { type: String, required: true },
//         image: { type: String, required: true },
//         price: { type: Number, required: true },
//         quantity: { type: Number, required: true },
//         variant: {
//           _id: { type: String },
//           name: { type: String },
//           color: { type: String },
//           price: { type: Number },
//           image: { type: String },
//           stock: { type: Number },
//         },
//       },
//     ],
//     amount: { type: Number, required: true },
//     email: { type: String, required: true },
//     status: {
//       type: String,
//       enum: ["pending", "processing", "shipped", "completed"],
//       default: "pending",
//     },
//   },
//   { timestamps: true }
// );

// const Order = mongoose.model("Order", OrderSchema);
// module.exports = Order;
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderId: String,
    products: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
          ],
    amount: Number,
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "completed",],
      default: "pending",
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
