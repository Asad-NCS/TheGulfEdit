import ProductCard, { type Product } from '@/components/ProductCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API}/api/products/featured`, {
      next: { revalidate: 300 }, // ISR: re-fetch every 5 minutes
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data.slice(0, 6) : [];
  } catch {
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
