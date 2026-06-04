import ProductCard, { type Product } from '@/components/ProductCard';
import connectDB from '@/lib/db';
import ProductModel from '@/lib/models/Product';

export const revalidate = 300; // ISR: re-validate every 5 minutes

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    await connectDB();
    const products = await ProductModel.find({ 
      featured: true,
      'sizes.stock': { $gt: 0 } 
    })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

    // Mongoose documents need to be serialized properly to pass to Client Components
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
