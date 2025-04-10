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
    price: typeof variant.price === 'number' ? variant.price : basePrice,
    stock: typeof variant.stock === 'number' ? variant.stock : 0
  }));
};

// POST - Create product with variants
router.post("/create-product", async (req, res) => {
  try {
    const { variants, price, ...productData } = req.body;
    
    const validatedVariants = validateVariants(variants, price);
    
    const newProduct = new Products({
      ...productData,
      price,
      mainImage: req.body.mainImage || req.body.image,
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
    const { 
      category, 
      color, 
      minPrice, 
      maxPrice, 
      page = 1, 
      limit = 10,
      variantColor 
    } = req.query;

    let filter = {};

    if (category && category !== "all") filter.category = category;
    
    if (minPrice && maxPrice) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && !isNaN(max)) {
        filter.price = { $gte: min, $lte: max };
      }
    }

    // Filter by variant color
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
        // Update existing variants
        updatedVariants = updatedVariants.map(existingVariant => {
          const updatedVariant = variants.find(v => 
            v._id ? v._id.toString() === existingVariant._id.toString() :
            (v.name === existingVariant.name || v.color === existingVariant.color)
          );
          return updatedVariant || existingVariant;
        });
        
        // Add new variants
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




















// const express = require("express");
// const Products = require("./products.model");
// const Reviews = require("../reviews/reviews.model");
// const verifyToken = require("../middleware/verifyToken");
// const verifyAdmin = require("../middleware/verifyAdmin");
// const router = express.Router();

// // post a product
// router.post("/create-product", async (req, res) => {
//     try {
//       const newProduct = new Products({
//         ...req.body,
//       });
  
//       const savedProduct = await newProduct.save();
      
//       // Calculate review (moved before sending response)
//       const reviews = await Reviews.find({ productId: savedProduct._id });
//       if (reviews.length > 0) {
//         const totalRating = reviews.reduce(
//           (acc, review) => acc + review.rating,
//           0
//         );
//         const averageRating = totalRating / reviews.length;
//         savedProduct.rating = averageRating;
//         await savedProduct.save();
//       }
      
//       // Only send ONE response at the end
//       res.status(201).send(savedProduct);
//     } catch (error) {
//       console.error("Error creating new product", error);
//       res.status(500).send({ message: "Failed to create new product" });
//     }
// });

// // get all products
// router.get("/", async (req, res) => {
//     try {
//       const {
//         category,
//         color,
//         minPrice,
//         maxPrice,
//         page = 1,
//         limit = 10,
//       } = req.query;
  
//       let filter = {};
  
//       if (category && category !== "all") {
//         filter.category = category;
//       }
  
//       if (color && color !== "all") {
//         filter.color = color;
//       }
  
//       if (minPrice && maxPrice) {
//         const min = parseFloat(minPrice);
//         const max = parseFloat(maxPrice);
//         if (!isNaN(min) && !isNaN(max)) {
//           filter.price = { $gte: min, $lte: max };
//         }
//       }
  
//       const skip = (parseInt(page) - 1) * parseInt(limit);
//       const totalProducts = await Products.countDocuments(filter);
//       const totalPages = Math.ceil(totalProducts / parseInt(limit));
  
//       const products = await Products.find(filter)
//         .skip(skip)
//         .limit(parseInt(limit))
//         .populate("author", "email")
//         .sort({ createdAt: -1 });
  
//       res.status(200).send({ products, totalPages, totalProducts });
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       res.status(500).send({ message: "Failed to fetch products" });
//     }
// });

// //   get single Product
// router.get("/:id", async (req, res) => {
//     try {
//       const productId = req.params.id;
//       const product = await Products.findById(productId).populate(
//         "author",
//         "email username"
//       );
//       if (!product) {
//         return res.status(404).send({ message: "Product not found" });
//       }
//       const reviews = await Reviews.find({ productId }).populate(
//         "userId",
//         "username email"
//       );
//       res.status(200).send({ product, reviews });
//     } catch (error) {
//       console.error("Error fetching the product", error);
//       res.status(500).send({ message: "Failed to fetch the product" });
//     }
// });

// // update a product
// router.patch("/update-product/:id",verifyToken, verifyAdmin, async (req, res) => {
//     try {
//       const productId = req.params.id;
//       const updatedProduct = await Products.findByIdAndUpdate(
//         productId,
//         { ...req.body },
//         { new: true }
//       );
  
//       if (!updatedProduct) {
//         return res.status(404).send({ message: "Product not found" });
//       }
  
//       res.status(200).send({
//         message: "Product updated successfully",
//         product: updatedProduct,
//       });
//     } catch (error) {
//       console.error("Error updating the product", error);
//       res.status(500).send({ message: "Failed to update the product" });
//     }
//   });

// // delete a product

// router.delete("/:id", async (req, res) => {
//     try {
//       const productId = req.params.id;
//       const deletedProduct = await Products.findByIdAndDelete(productId);
  
//       if (!deletedProduct) {
//         return res.status(404).send({ message: "Product not found" });
//       }
  
//       // delete reviews related to the product
//       await Reviews.deleteMany({ productId: productId });
  
//       res.status(200).send({
//         message: "Product deleted successfully",
//       });
//     } catch (error) {
//       console.error("Error deleting the product", error);
//       res.status(500).send({ message: "Failed to delete the product" });
//     }
// });

// // get related products
// router.get("/related/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
  
//       if (!id) {
//         return res.status(400).send({ message: "Product ID is required" });
//       }
//       const product = await Products.findById(id);
//       if (!product) {
//         return res.status(404).send({ message: "Product not found" });
//       }
  
//       const titleRegex = new RegExp(
//         product.name
//           .split(" ")
//           .filter((word) => word.length > 1)
//           .join("|"),
//         "i"
//       );
  
//       const relatedProducts = await Products.find({
//         _id: { $ne: id }, // Exclude the current product
//         $or: [
//           { name: { $regex: titleRegex } }, // Match similar names
//           { category: product.category }, // Match the same category
//         ],
//       });
  
//       res.status(200).send(relatedProducts);
  
//     } catch (error) {
//       console.error("Error fetching the related products", error);
//       res.status(500).send({ message: "Failed to fetch related products" });
//     }
//   });


// module.exports = router;