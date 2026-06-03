const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },   // e.g. "XS", "S", "M", "30", "32"
  stock: { type: Number, required: true, default: 0 },
}, { _id: false });

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },   // e.g. "Ivory", "Navy"
  hex:  { type: String, required: true },   // e.g. "#F5F0E8"
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    brand: {
      type: String,
      required: true,
      enum: ['Splash', 'Max', 'R&B'],
    },
    category: {
      type: String,
      required: true,
      enum: ['women', 'men', 'kids'],
    },
    subcategory: {
      type: String,
      required: true,
      enum: ['tops', 'bottoms', 'dresses', 'outerwear', 'accessories', 'footwear', 'sets'],
    },
    description: { type: String, required: true },
    price_pkr: { type: Number, required: true, min: 0 },
    original_price_omr: { type: Number, min: 0 },   // informational — not displayed
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: 'At least one image is required',
      },
    },
    sizes: [sizeSchema],
    colors: [colorSchema],
    material: { type: String },
    care_instructions: { type: String },
    tags: [{ type: String, lowercase: true }],
    featured: { type: Boolean, default: false },
    active:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
// Compound indexes for common filter queries
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ featured: 1, active: 1 });

module.exports = mongoose.model('Product', productSchema);
