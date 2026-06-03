const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const Cart    = require('../models/Cart');

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: /track/:orderId MUST be defined before /:orderId
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/orders/track/:orderId   — PUBLIC, no auth
// Used by /track page
router.get('/track/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).select(
      'orderId status statusHistory tracking items customer.name customer.city subtotal_pkr shipping_pkr total_pkr createdAt'
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found. Please check your Order ID.' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders   — create a new order
router.post('/', async (req, res) => {
  try {
    const {
      sessionId,
      customer,    // { name, whatsapp, email, city, address, postalCode, notes }
      items,       // array — or we fetch from cart if sessionId provided
    } = req.body;

    // Validate required customer fields
    if (!customer?.name || !customer?.whatsapp || !customer?.city || !customer?.address) {
      return res.status(400).json({
        success: false,
        message: 'Required customer fields: name, whatsapp, city, address',
      });
    }

    let orderItems = items;

    // If no items in body, pull from cart
    if ((!orderItems || orderItems.length === 0) && sessionId) {
      const cart = await Cart.findOne({ sessionId });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }
      orderItems = cart.items.map((i) => ({
        productId: i.productId,
        name:      i.name,
        brand:     i.brand,
        image:     i.image,
        slug:      i.slug,
        size:      i.size,
        color:     i.color,
        colorHex:  i.colorHex,
        quantity:  i.quantity,
        price_pkr: i.price_pkr,
      }));
    }

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    // Calculate totals
    const subtotal = orderItems.reduce((sum, i) => sum + i.price_pkr * i.quantity, 0);
    const shipping = subtotal >= 5000 ? 0 : 250;
    const total    = subtotal + shipping;

    const order = new Order({
      sessionId,
      items:       orderItems,
      customer,
      subtotal_pkr: subtotal,
      shipping_pkr: shipping,
      total_pkr:    total,
      paymentMethod: 'COD',
    });

    await order.save();

    // Clear the cart after successful order
    if (sessionId) {
      await Cart.findOneAndUpdate({ sessionId }, { $set: { items: [] } });
    }

    res.status(201).json({ success: true, data: { orderId: order.orderId, _id: order._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:orderId   — fetch order for confirmation page
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).select('-__v');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
