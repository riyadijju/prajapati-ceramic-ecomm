const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true }, // Stripe Payment Intent ID
    products: [
      {
        _id: { type: String, required: true }, // product id
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        variant: {
          _id: { type: String },
          name: { type: String },
          color: { type: String },
          price: { type: Number },
          image: { type: String },
          stock: { type: Number },
        },
      },
    ],
    amount: { type: Number, required: true },
    email: { type: String, required: true },
    billingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },  // Added phone here
    },
    
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
