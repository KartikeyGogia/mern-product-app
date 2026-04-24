const express = require('express');
const router = express.Router();
const Product = require('../models/Product');



router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "Failed to create product" });
    }
});

router.get("/", async (req, res) => {
  try {
    console.log("Fetching products...");

    const products = await Product.find();

    console.log("Products:", products);

    res.json(products);
  } catch (err) {
    console.log("ERROR:", err); 
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete product" });
    }
});
    
module.exports = router;