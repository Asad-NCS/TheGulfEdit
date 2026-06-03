const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name:      { type: String, required: true },
    brand:     { type: String, required: true },
    image:     { type: String, required: true },
    slug:      { type: String, required: true },
    size:      { type: String, required: true },
    color:     { type: String },            // color name, optional
    colorHex:  { type: String },            // hex for display, optional
    quantity:  { type: Number, required: true, min: 1, default: 1 },
    price_pkr: { type: Number, required: true, min: 0 },
  },
  { _id: true }  // keep _id so we can reference itemId in PUT/DELETE routes
);

const cartSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    updatedAt: {
      type: Date,
      default: Date.now,
      // TTL index — MongoDB auto-deletes carts 7 days after last update
      expires: 60 * 60 * 24 * 7,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: 'updatedAt' },
  }
);

module.exports = mongoose.model('Cart', cartSchema);
