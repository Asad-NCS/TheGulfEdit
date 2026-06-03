const express = require('express');
const router  = express.Router();
const Cart    = require('../models/Cart');
const Product = require('../models/Product');

// Helper — find or create cart by sessionId
async function getOrCreateCart(sessionId) {
  let cart = await Cart.findOne({ sessionId });
  if (!cart) {
    cart = new Cart({ sessionId, items: [] });
    await cart.save();
  }
  return cart;
}

// GET /api/cart/:sessionId
router.get('/:sessionId', async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.params.sessionId);
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/cart/:sessionId
// Body: { productId, size, color, colorHex, quantity }
// If an item with the same productId+size+color already exists → increment qty
router.post('/:sessionId', async (req, res) => {
  try {
    const { productId, size, color, colorHex, quantity = 1 } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ success: false, message: 'productId and size are required' });
    }

    // Fetch product to validate and snapshot data
    const product = await Product.findById(productId);
    if (!product || !product.active) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Validate size exists and has stock
    const sizeObj = product.sizes.find((s) => s.size === size);
    if (!sizeObj) {
      return res.status(400).json({ success: false, message: `Size ${size} not available` });
    }
    if (sizeObj.stock < 1) {
      return res.status(400).json({ success: false, message: `Size ${size} is out of stock` });
    }

    const cart = await getOrCreateCart(req.params.sessionId);

    // Check if identical item already in cart
    const existing = cart.items.find(
      (i) =>
        i.productId.toString() === productId &&
        i.size === size &&
        (i.color || '') === (color || '')
    );

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        productId,
        name:      product.name,
        brand:     product.brand,
        image:     product.images[0],
        slug:      product.slug,
        size,
        color:    color    || '',
        colorHex: colorHex || '',
        quantity: Number(quantity),
        price_pkr: product.price_pkr,
      });
    }

    cart.updatedAt = new Date();
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/cart/:sessionId/:itemId
// Body: { quantity }
router.put('/:sessionId/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || Number(quantity) < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    item.quantity  = Number(quantity);
    cart.updatedAt = new Date();
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/cart/:sessionId/:itemId
router.delete('/:sessionId/:itemId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    item.deleteOne();
    cart.updatedAt = new Date();
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
