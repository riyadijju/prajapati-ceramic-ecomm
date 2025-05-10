const express = require("express");
const Products = require("./products.model");
const Reviews = require("../reviews/reviews.model");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();

// Helper function to validate variants
const validateVariants = (variants, basePrice) => {
  if (!Array.isArray(variants)) return null;

  return variants.map(variant => ({
    name: variant.name || 'Unnamed Variant',
    color: variant.color || '#000000',
    image: variant.image || '',
    price:  Number(variant.price) ,
    stock: Number(variant.stock),
  }));
};

// POST - Create product with variants
router.post("/create-product", async (req, res) => {
  try {
    const { variants, price, ...productData } = req.body;
    const validatedVariants = validateVariants(variants, price);

    console.log('productData')
    console.log(productData)
    console.log('price')
    console.log(price)
    console.log('variants')
    console.log(variants)

    const mainImage = req.body.mainImage || req.body.image;
    const newProduct = new Products({
      ...productData,
      price,
      image: mainImage, 
      variants: validatedVariants || []
    });

    const savedProduct = await newProduct.save();

    // Calculate initial rating
    const reviews = await Reviews.find({ productId: savedProduct._id });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      savedProduct.rating = totalRating / reviews.length;
      await savedProduct.save();
    }
    console.log(savedProduct)
    res.status(201).send(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({
      message: "Failed to create product",
      error: error.message
    });
  }
});

// GET - All products with variant filtering
router.get("/", async (req, res) => {
  try {
    const { category, color, minPrice, maxPrice, page = 1, limit = 10, variantColor } = req.query;
    let filter = {};

    if (category && category !== "all") filter.category = category;

    if (minPrice && maxPrice) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && !isNaN(max)) {
        filter.price = { $gte: min, $lte: max };
      }
    }

    if (variantColor && variantColor !== "all") {
      filter['variants.color'] = variantColor;
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

// GET - Single product with variants
router.get("/:id", async (req, res) => {
  try {
    
    const productId = req.params.id;
    const product = await Products.findById(productId)
      .populate("author", "email username");

      console.log(product)

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    const reviews = await Reviews.find({ productId })
      .populate("userId", "username email");

    res.status(200).send({ product, reviews });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send({ message: "Failed to fetch product" });
  }
});

// PATCH - Update product and variants
router.patch("/update-product/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const { variants, ...updateData } = req.body;

    let updateObject = { ...updateData };

    if (variants) {
      const currentProduct = await Products.findById(productId);
      let updatedVariants = currentProduct.variants;

      if (Array.isArray(variants)) {
        updatedVariants = updatedVariants.map(existingVariant => {
          const updatedVariant = variants.find(v =>
            v._id ? v._id.toString() === existingVariant._id.toString() :
              (v.name === existingVariant.name || v.color === existingVariant.color)
          );
          return updatedVariant || existingVariant;
        });

        variants.forEach(newVariant => {
          if (!newVariant._id && !updatedVariants.some(v =>
            v.name === newVariant.name && v.color === newVariant.color
          )) {
            updatedVariants.push({
              ...newVariant,
              price: newVariant.price || currentProduct.price,
              stock: newVariant.stock || 0
            });
          }
        });
      }

      updateObject.variants = updatedVariants;
    }

    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      updateObject,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({
      message: "Failed to update product",
      error: error.message
    });
  }
});

// DELETE - Product
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Products.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    await Reviews.deleteMany({ productId });
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ message: "Failed to delete product" });
  }
});

// GET - Related products
router.get("/related/:id", async (req, res) => {
  try {
    
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    const titleRegex = new RegExp(
      product.name.split(" ").filter(w => w.length > 1).join("|"),
      "i"
    );

    const relatedProducts = await Products.find({
      _id: { $ne: product._id },
      $or: [
        { name: { $regex: titleRegex } },
        { category: product.category }
      ]
    }).limit(4);

    res.status(200).send(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).send({ message: "Failed to fetch related products" });
  }
});

module.exports = router;
