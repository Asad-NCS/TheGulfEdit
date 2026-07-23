'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '@/lib/cart-context';
import { motion } from 'framer-motion';

export interface Product {
  _id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  description?: string;
  price_pkr: number;
  original_price_omr?: number;
  compare_price_pkr?: number;
  images: string[];
  sizes: { size: string; stock: number }[];
  colors: { name: string; hex: string }[];
  material?: string;
  care_instructions?: string;
  tags?: string[];
  featured: boolean;
  active?: boolean;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [hoveredImg, setHoveredImg] = useState(false);

  const firstSize = product.sizes.find((s) => s.stock > 0)?.size;
  const firstColor = product.colors[0];
  const isOnSale = product.compare_price_pkr && product.compare_price_pkr > product.price_pkr;
  const discountPct = isOnSale
    ? Math.round(((product.compare_price_pkr! - product.price_pkr) / product.compare_price_pkr!) * 100)
    : 0;
  const isNew = product.isNew || product.tags?.includes('new');

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstSize) { toast.error('Out of stock'); return; }
    setAdding(true);
    try {
      await addItem({
        productId: product._id,
        size:     firstSize,
        color:    firstColor?.name    || '',
        colorHex: firstColor?.hex     || '',
        quantity: 1,
      });
      toast.success(`Added to bag — ${product.name}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not add item');
    } finally {
      setAdding(false);
    }
  };

  // Primary image — fallback to clean branded placeholder
  const imgSrc = !imgError && product.images?.[0]
    ? product.images[0]
    : null;

  // Secondary image for hover (if exists)
  const img2 = product.images?.[1] || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
      className="group"
    >
      <Link href={`/shop/${product.slug}`} className="block">

        {/* Image container */}
        <div
          className="relative aspect-[3/4] overflow-hidden bg-sand"
          onMouseEnter={() => setHoveredImg(true)}
          onMouseLeave={() => setHoveredImg(false)}
        >
          {imgSrc ? (
            <>
              <Image
                src={imgSrc}
                alt={product.name}
                fill
                className={`object-cover transition-all duration-500 ${
                  img2 && hoveredImg ? 'opacity-0' : 'opacity-100'
                }`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onError={() => setImgError(true)}
              />
              {img2 && (
                <Image
                  src={img2}
                  alt={`${product.name} alternate view`}
                  fill
                  className={`object-cover transition-all duration-500 ${
                    hoveredImg ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
            </>
          ) : (
            /* Elegant branded placeholder when no real image */
            <div className="absolute inset-0 bg-sand-dark flex flex-col items-center justify-center">
              <div className="w-16 h-16 border border-gold/30 flex items-center justify-center mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink-light/30">
                  <rect x="3" y="3" width="18" height="18" rx="1"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <span className="font-body text-[9px] tracking-[0.2em] uppercase text-ink-light/30">
                {product.brand}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && (
              <span className="bg-ink text-cream font-body text-[9px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1">
                NEW
              </span>
            )}
            {isOnSale && discountPct > 0 && (
              <span className="bg-accent text-cream font-body text-[9px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1">
                {discountPct}% OFF
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWishlisted((v) => !v);
              toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', { icon: wishlisted ? '🗑' : '❤️' });
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-cream/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-cream"
            aria-label="Add to wishlist"
          >
            <Heart
              size={14}
              strokeWidth={1.5}
              className={wishlisted ? 'fill-accent text-accent' : 'text-ink'}
            />
          </button>

          {/* Quick add — appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleQuickAdd}
              disabled={adding || !firstSize}
              className="w-full bg-ink text-cream font-body text-[11px] font-medium tracking-[0.15em] uppercase py-3 flex items-center justify-center gap-2 hover:bg-gold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={13} strokeWidth={1.5} />
              {adding ? 'Adding…' : firstSize ? 'Quick Add' : 'Out of Stock'}
            </button>
          </div>

          {/* Out of stock overlay */}
          {!firstSize && (
            <div className="absolute inset-0 bg-cream/40 flex items-center justify-center">
              <span className="bg-cream font-body text-xs tracking-widest uppercase text-ink-light px-4 py-2 border border-sand-dark">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pt-3 pb-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="font-body text-[9px] tracking-[0.18em] uppercase text-ink-light/60 block mb-0.5">
                {product.brand}
              </span>
              <h3 className="font-body text-sm text-ink leading-snug line-clamp-2 font-medium">
                {product.name}
              </h3>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-body text-sm font-semibold text-ink">
                ₨{product.price_pkr.toLocaleString('en-PK')}
              </p>
              {isOnSale && (
                <p className="font-body text-[11px] text-ink-light/50 line-through">
                  ₨{product.compare_price_pkr!.toLocaleString('en-PK')}
                </p>
              )}
            </div>
          </div>

          {/* Color swatches */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {product.colors.slice(0, 6).map((c) => (
                <div
                  key={c.name}
                  title={c.name}
                  className="w-3.5 h-3.5 rounded-full border border-sand-dark flex-shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.colors.length > 6 && (
                <span className="font-body text-[10px] text-ink-light/50">+{product.colors.length - 6}</span>
              )}
            </div>
          )}

          {/* Size pills */}
          {product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.sizes.slice(0, 5).map((s) => (
                <span
                  key={s.size}
                  className={`font-body text-[10px] px-1.5 py-0.5 border ${
                    s.stock > 0
                      ? 'border-sand-dark text-ink-light'
                      : 'border-sand-dark/50 text-ink-light/25 line-through'
                  }`}
                >
                  {s.size}
                </span>
              ))}
              {product.sizes.length > 5 && (
                <span className="font-body text-[10px] text-ink-light/40 self-center">
                  +{product.sizes.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
