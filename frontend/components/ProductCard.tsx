'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
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
  images: string[];
  sizes: { size: string; stock: number }[];
  colors: { name: string; hex: string }[];
  material?: string;
  care_instructions?: string;
  tags?: string[];
  featured: boolean;
  active?: boolean;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Pick first in-stock size for quick add
  const firstSize = product.sizes.find((s) => s.stock > 0)?.size;
  const firstColor = product.colors[0];

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!firstSize) {
      toast.error('Out of stock');
      return;
    }
    setAdding(true);
    try {
      await addItem({
        productId: product._id,
        size:      firstSize,
        color:     firstColor?.name    || '',
        colorHex:  firstColor?.hex     || '',
        quantity:  1,
      });
      toast.success(`Added to cart — ${product.name}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not add item');
    } finally {
      setAdding(false);
    }
  };

  const imgSrc = !imgError && product.images?.[0]
    ? product.images[0]
    : `https://picsum.photos/seed/${product.slug}/600/800`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
    >
      <Link href={`/shop/${product.slug}`} className="product-card group block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-sand">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />

          {/* Overlay actions */}
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-all duration-300" />
          <div className="absolute bottom-3 left-3 right-3 flex gap-2
                          translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                          transition-all duration-300">
            <button
              onClick={handleQuickAdd}
              disabled={adding || !firstSize}
              className="flex-1 flex items-center justify-center gap-2
                         bg-cream text-ink text-xs font-medium font-body tracking-wide py-2.5
                         hover:bg-gold hover:text-cream transition-colors duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              {adding ? 'Adding…' : firstSize ? 'Quick Add' : 'Out of Stock'}
            </button>
            <Link
              href={`/shop/${product.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center w-10 bg-cream text-ink
                         hover:bg-ink hover:text-cream transition-colors duration-200"
            >
              <Eye size={14} strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 border-t border-sand-dark">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="brand-badge mb-1.5 block">{product.brand}</span>
              <h3 className="font-display text-base text-ink leading-snug line-clamp-2">
                {product.name}
              </h3>
            </div>
            <p className="font-body font-medium text-sm text-ink whitespace-nowrap mt-1">
              ₨{product.price_pkr.toLocaleString('en-PK')}
            </p>
          </div>

          {/* Size dots */}
          {product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {product.sizes.slice(0, 5).map((s) => (
                <span
                  key={s.size}
                  className={`text-[10px] font-body px-1.5 py-0.5 border ${
                    s.stock > 0
                      ? 'border-sand-dark text-ink-light'
                      : 'border-sand-dark text-ink-light/30 line-through'
                  }`}
                >
                  {s.size}
                </span>
              ))}
              {product.sizes.length > 5 && (
                <span className="text-[10px] text-ink-light/50 self-center">+{product.sizes.length - 5}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
