const express = require("express");
const Products = require("./products.model");
const router = express.Router();

// post a product
router.post("/create-product", async (req, res) => {
    try {
      const newProduct = new Products({
        ...req.body,
      });
  
      const savedProduct = await newProduct.save();
      res.status(201).send(savedProduct);
      // calculate review
      const reviews = await Reviews.find({ productId: savedProduct._id });
      if (reviews.length > 0) {
        const totalRating = reviews.reduce(
          (acc, review) => acc + review.rating,
          0
        );
        const averageRating = totalRating / reviews.length;
        savedProduct.rating = averageRating;
        await savedProduct.save();
      }
      res.status(201).send(savedProduct);
    } catch (error) {
      console.error("Error creating new product", error);
      res.status(500).send({ message: "Failed to create new product" });
    }
  });

module.exports = router;