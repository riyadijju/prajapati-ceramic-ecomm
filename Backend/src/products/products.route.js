const express = require("express");
const Products = require("./products.model");
const Reviews = require("../reviews/reviews.model");
// const verifyToken = require("../middleware/verifyToken");
// const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();

// post a product
router.post("/create-product", async (req, res) => {
    try {
      const newProduct = new Products({
        ...req.body,
      });
  
      const savedProduct = await newProduct.save();
      
      // Calculate review (moved before sending response)
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
      
      // Only send ONE response at the end
      res.status(201).send(savedProduct);
    } catch (error) {
      console.error("Error creating new product", error);
      res.status(500).send({ message: "Failed to create new product" });
    }
});

// get all products
router.get("/", async (req, res) => {
    try {
      const {
        category,
        color,
        minPrice,
        maxPrice,
        page = 1,
        limit = 10,
      } = req.query;
  
      let filter = {};
  
      if (category && category !== "all") {
        filter.category = category;
      }
  
      if (color && color !== "all") {
        filter.color = color;
      }
  
      if (minPrice && maxPrice) {
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);
        if (!isNaN(min) && !isNaN(max)) {
          filter.price = { $gte: min, $lte: max };
        }
      }
  
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const totalProducts = await Products.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / parseInt(limit));
  
      const products = await Products.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("author", "email")
        .sort({ createdAt: -1 });
  
      res.status(200).send({ products, totalPages, totalProducts });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send({ message: "Failed to fetch products" });
    }
});



module.exports = router;