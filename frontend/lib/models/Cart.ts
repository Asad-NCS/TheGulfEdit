import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  brand: String,
  image: String,
  slug: String,
  size: { type: String, required: true },
  color: String,
  colorHex: String,
  quantity: { type: Number, required: true, min: 1 },
  price_pkr: { type: Number, required: true }
}, { _id: true }); // Ensure each item gets its own distinct _id in the array

const CartSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  items: [CartItemSchema],
  expiresAt: { type: Date, required: true, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
}, { timestamps: true });

// TTL index to automatically delete carts after 7 days
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
