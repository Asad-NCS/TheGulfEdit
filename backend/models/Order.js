const mongoose = require('mongoose');

// ── Embedded sub-schemas ────────────────────────────────────────────────────

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:      { type: String, required: true },
    brand:     { type: String, required: true },
    image:     { type: String, required: true },
    slug:      { type: String },
    size:      { type: String, required: true },
    color:     { type: String },
    colorHex:  { type: String },
    quantity:  { type: Number, required: true, min: 1 },
    price_pkr: { type: Number, required: true },
  },
  { _id: false }
);

const trackingSchema = new mongoose.Schema(
  {
    courier:           { type: String, enum: ['DHL', 'Aramex', 'TCS', 'OCS', 'Other', ''] },
    trackingNumber:    { type: String },
    trackingUrl:       { type: String },
    estimatedDelivery: { type: Date },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status:    { type: String, required: true },
    note:      { type: String },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ── Main Order schema ───────────────────────────────────────────────────────

const orderSchema = new mongoose.Schema(
  {
    // Human-readable ID: GE-YYYYMMDD-XXXX (generated pre-save)
    orderId: {
      type: String,
      unique: true,
      index: true,
    },
    sessionId: { type: String, index: true },

    items: [orderItemSchema],

    customer: {
      name:       { type: String, required: true },
      whatsapp:   { type: String, required: true },
      email:      { type: String },
      city:       { type: String, required: true },
      address:    { type: String, required: true },
      postalCode: { type: String },
      notes:      { type: String },
    },

    subtotal_pkr: { type: Number, required: true },
    shipping_pkr: { type: Number, required: true, default: 250 },
    total_pkr:    { type: Number, required: true },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },

    paymentMethod: { type: String, default: 'COD' },

    tracking: { type: trackingSchema, default: () => ({}) },

    statusHistory: [statusHistorySchema],
  },
  { timestamps: true }
);

// ── Pre-save: generate human-readable orderId ───────────────────────────────
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const today = new Date();
    const dateStr =
      today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0');

    // Count orders today to get a sequential suffix
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay   = new Date(today.setHours(23, 59, 59, 999));
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const seq = String(count + 1).padStart(4, '0');
    this.orderId = `GE-${dateStr}-${seq}`;
  }

  // Seed initial status history on first save
  if (this.isNew) {
    this.statusHistory.push({ status: 'pending', note: 'Order placed' });
  }

  next();
});

module.exports = mongoose.model('Order', orderSchema);
