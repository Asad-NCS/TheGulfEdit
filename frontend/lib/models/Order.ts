import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  brand: String,
  image: String,
  slug: String,
  size: { type: String, required: true },
  color: String,
  colorHex: String,
  quantity: { type: Number, required: true },
  price_pkr: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, // GE-YYYYMMDD-XXXX
  sessionId: { type: String, required: true },
  customer: {
    name: { type: String, required: true },
    whatsapp: { type: String, required: true },
    email: { type: String },
    city: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String },
    notes: { type: String }
  },
  items: [OrderItemSchema],
  subtotal_pkr: { type: Number, required: true },
  shipping_pkr: { type: Number, required: true },
  total_pkr: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: { type: String, required: true },
    note: String,
    updatedAt: { type: Date, default: Date.now }
  }],
  tracking: {
    courier: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date
  }
}, { timestamps: true });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(OrderSchema as any).pre('save', async function (this: any, next: (err?: Error) => void) {
  if (!this.orderId) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0,10).replace(/-/g, '');
    const start = new Date(date); start.setHours(0, 0, 0, 0);
    const end = new Date(date); end.setHours(23, 59, 59, 999);
    const count = await mongoose.model('Order').countDocuments({
      createdAt: { $gte: start, $lt: end }
    });
    this.orderId = `GE-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }
  
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      updatedAt: new Date()
    });
  }
  
  next();
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
