const express = require("express");
// const Order = require("./orders.model");
// const verifyToken = require("../middleware/verifyToken");
// const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();


// create checkout session
router.post("/create-checkout-session", async (req, res) => {
    const { products } = req.body;
  
    try {
      const lineItems = products.map((product) => ({
        price_data: {
          currency: "npr",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.quantity,
      }));
//   -------------------------
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "",
      });
  
      res.json({ id: session.id });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

module.exports = router;