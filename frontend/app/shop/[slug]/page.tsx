'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ShoppingBag, ChevronDown, ChevronUp, Ruler } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '@/lib/cart-context';
import type { Product } from '@/components/ProductCard';
import ProductCard from '@/components/ProductCard';
import SizeChartModal from '@/components/SizeChartModal';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Selections
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImgIdx, setMainImgIdx] = useState(0);

  // UI state
  const [adding, setAdding] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [accDetails, setAccDetails] = useState(true);
  const [accShipping, setAccShipping] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
          if (data.data.colors && data.data.colors.length > 0) {
            setSelectedColor(data.data.colors[0]);
          }
          
          // Fetch related
          const relRes = await fetch(`/api/products?category=${data.data.category}&limit=4`);
          const relData = await relRes.json();
          if (relData.success) {
            setRelated(relData.data.filter((p: Product) => p._id !== data.data._id).slice(0, 4));
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-[3/4] skeleton" />
          <div className="space-y-6 pt-8">
            <div className="skeleton h-6 w-32" />
            <div className="skeleton h-10 w-3/4" />
            <div className="skeleton h-8 w-1/4" />
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="font-display text-4xl text-ink mb-4">Product Not Found</h1>
        <p className="font-body text-ink-light mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => router.push('/shop')} className="btn-primary">
          Return to Shop
        </button>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    setAdding(true);
    try {
      await addItem({
        productId: product._id,
        size: selectedSize,
        color: selectedColor?.name || '',
        colorHex: selectedColor?.hex || '',
        quantity,
      });
      toast.success('Added to cart');
      router.push('/cart');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not add item');
    } finally {
      setAdding(false);
    }
  };

  const images = product.images?.filter(Boolean).length > 0 
    ? product.images.filter(Boolean)
    : [];   // no fallback — placeholder div shown below

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-24">
        
        {/* ── Image Gallery ──────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-sand border border-sand-dark overflow-hidden">
            {images.length > 0 ? (
              <Image
                src={images[mainImgIdx]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              /* Branded placeholder when no image uploaded */
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-sand-dark">
                <div className="w-20 h-20 border border-gold/30 flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink-light/30">
                    <rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ink-light/30">{product.brand}</p>
                <p className="font-body text-[9px] tracking-[0.15em] uppercase text-ink-light/20 mt-1">Photo coming soon</p>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImgIdx(i)}
                  className={`relative w-20 aspect-[3/4] flex-shrink-0 border transition-all ${
                    i === mainImgIdx ? 'border-ink opacity-100' : 'border-sand-dark opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${i+1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ───────────────────────────────────────────────── */}
        <div>
          <span className="brand-badge mb-4">{product.brand}</span>
          <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mb-4 text-balance">
            {product.name}
          </h1>
          <p className="font-body text-xl font-medium text-ink mb-6">
            ₨{product.price_pkr.toLocaleString('en-PK')}
          </p>
          
          <div className="w-full h-px bg-sand-dark mb-8" />

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <span className="font-body text-sm font-medium text-ink block mb-3">
                Color: <span className="text-ink-light font-normal">{selectedColor?.name}</span>
              </span>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${
                      selectedColor?.name === c.name ? 'border-ink scale-110' : 'border-transparent shadow-sm'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-sm font-medium text-ink">Size</span>
              <button 
                onClick={() => setChartOpen(true)}
                className="flex items-center gap-1.5 text-xs font-body text-ink-light hover:text-ink transition-colors underline underline-offset-4"
              >
                <Ruler size={14} strokeWidth={1.5} /> Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((s) => {
                const isSelected = selectedSize === s.size;
                const outOfStock = s.stock < 1;
                return (
                  <button
                    key={s.size}
                    disabled={outOfStock}
                    onClick={() => setSelectedSize(s.size)}
                    className={`min-w-[3rem] px-3 py-2 text-sm font-body border transition-all ${
                      isSelected
                        ? 'bg-ink text-cream border-ink'
                        : outOfStock
                        ? 'bg-cream text-ink-light/30 border-sand-dark cursor-not-allowed line-through'
                        : 'bg-cream text-ink border-sand-dark hover:border-ink'
                    }`}
                  >
                    {s.size}
                  </button>
                )
              })}
            </div>
            {selectedSize && product.sizes.find(s => s.size === selectedSize)?.stock && product.sizes.find(s => s.size === selectedSize)!.stock <= 3 && (
              <p className="text-accent text-xs mt-2 font-body">Only {product.sizes.find(s => s.size === selectedSize)?.stock} left in stock!</p>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex items-center border border-sand-dark bg-cream h-14 w-full sm:w-32">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center text-ink-light hover:text-ink transition-colors"
              >
                <Minus size={16} strokeWidth={1.5} />
              </button>
              <span className="flex-1 text-center font-body text-sm font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-full flex items-center justify-center text-ink-light hover:text-ink transition-colors"
              >
                <Plus size={16} strokeWidth={1.5} />
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="flex-1 btn-primary h-14 text-base tracking-widest disabled:opacity-70 disabled:cursor-wait"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>

          {/* Description */}
          <div className="prose prose-sm font-body text-ink-light leading-relaxed mb-8">
            <p>{product.description}</p>
          </div>

          {/* Accordions */}
          <div className="border-t border-sand-dark">
            <div className="border-b border-sand-dark">
              <button
                onClick={() => setAccDetails(!accDetails)}
                className="flex items-center justify-between w-full py-4 font-body text-sm tracking-widest uppercase text-ink hover:text-gold transition-colors"
              >
                Product Details
                {accDetails ? <ChevronUp size={16} strokeWidth={1.5} /> : <ChevronDown size={16} strokeWidth={1.5} />}
              </button>
              {accDetails && (
                <div className="pb-5 font-body text-sm text-ink-light space-y-3">
                  {product.material && (
                    <p><strong className="font-medium text-ink">Material:</strong> {product.material}</p>
                  )}
                  {product.care_instructions && (
                    <p><strong className="font-medium text-ink">Care:</strong> {product.care_instructions}</p>
                  )}
                  <p><strong className="font-medium text-ink">Origin:</strong> Sourced directly from Oman</p>
                </div>
              )}
            </div>
            <div className="border-b border-sand-dark">
              <button
                onClick={() => setAccShipping(!accShipping)}
                className="flex items-center justify-between w-full py-4 font-body text-sm tracking-widest uppercase text-ink hover:text-gold transition-colors"
              >
                Shipping & Returns
                {accShipping ? <ChevronUp size={16} strokeWidth={1.5} /> : <ChevronDown size={16} strokeWidth={1.5} />}
              </button>
              {accShipping && (
                <div className="pb-5 font-body text-sm text-ink-light space-y-3 leading-relaxed">
                  <p>• Delivery across Pakistan in 3-5 business days via premium courier.</p>
                  <p>• Cash on Delivery available for all orders.</p>
                  <p>• Free shipping on orders above ₨5,000.</p>
                  <p>• Exchange within 3 days of delivery (item must be unused with tags).</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Related Products ───────────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="border-t border-sand-dark pt-16 mt-16">
          <div className="text-center mb-10">
            <h2 className="section-heading text-3xl">You May Also Like</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      <SizeChartModal 
        isOpen={chartOpen} 
        onClose={() => setChartOpen(false)} 
        category={product.category} 
      />
    </div>
  );
}
