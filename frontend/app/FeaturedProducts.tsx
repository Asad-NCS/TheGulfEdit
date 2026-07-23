import ProductCard, { type Product } from '@/components/ProductCard';
import connectDB from '@/lib/db';
import ProductModel from '@/lib/models/Product';
import { unstable_noStore as noStore } from 'next/cache';

async function getFeaturedProducts(): Promise<Product[]> {
  noStore(); // always fetch fresh — no ISR cache
  try {
    await connectDB();
    // Try featured first
    let products = await ProductModel.find({
      featured: true,
      active: true,
      'sizes.stock': { $gt: 0 },
    }).sort({ createdAt: -1 }).limit(6).lean();

    // Fallback: show newest active products if nothing is featured yet
    if (products.length === 0) {
      products = await ProductModel.find({
        active: true,
        'sizes.stock': { $gt: 0 },
      }).sort({ createdAt: -1 }).limit(6).lean();
    }

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-ink-light font-body text-sm">
        No products available yet. Check back soon!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, i) => (
        <ProductCard key={product._id} product={product} index={i} />
      ))}
    </div>
  );
}
