import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  category: { type: String, required: true, enum: ['women', 'men', 'kids'] },
  subcategory: { type: String, default: '' },
  description: { type: String, required: true },
  price_pkr: { type: Number, required: true },
  compare_price_pkr: { type: Number },
  original_price_omr: { type: Number },
  images: [{ type: String }],
  sizes: [{
    size: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 }
  }],
  colors: [{
    name: { type: String, required: true },
    hex: { type: String, required: true }
  }],
  material: { type: String },
  care_instructions: { type: String },
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
}, { timestamps: true });

ProductSchema.index({ category: 1, active: 1 });
ProductSchema.index({ featured: 1, active: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
