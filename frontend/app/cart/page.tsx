'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function CartPage() {
  const router = useRouter();
  const { cart, itemCount, subtotal, loading, updateItem, removeItem } = useCart();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h1 className="font-display text-4xl text-ink mb-10">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-32 skeleton" />
            <div className="h-32 skeleton" />
          </div>
          <div className="h-64 skeleton" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-6">Your Cart is Empty</h1>
        <p className="font-body text-ink-light mb-10">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/shop" className="btn-primary px-10">
          Start Shopping
        </Link>
      </div>
    );
  }

  const shipping = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <h1 className="font-display text-4xl text-ink mb-10">Your Cart ({itemCount})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ── Cart Items ────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="border-t border-sand-dark">
            {cart.items.map((item) => (
              <div key={item._id} className="py-6 border-b border-sand-dark flex gap-6">
                <Link href={`/shop/${item.slug}`} className="relative w-24 sm:w-32 aspect-[3/4] bg-sand flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </Link>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between gap-4">
                    <div>
                      <span className="brand-badge mb-1.5 block w-fit">{item.brand}</span>
                      <Link href={`/shop/${item.slug}`} className="font-display text-lg text-ink hover:text-gold transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <div className="font-body text-xs text-ink-light mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        <span>Size: {item.size}</span>
                        {item.color && (
                          <span className="flex items-center gap-1.5">
                            Color: 
                            <span className="w-3 h-3 rounded-full border border-sand-dark inline-block" style={{ backgroundColor: item.colorHex || '#ccc' }} />
                            {item.color}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="font-body font-medium text-ink whitespace-nowrap">
                      ₨{item.price_pkr.toLocaleString('en-PK')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-sand-dark bg-cream h-10 w-28">
                      <button 
                        onClick={() => updateItem(item._id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="w-8 h-full flex items-center justify-center text-ink-light hover:text-ink disabled:opacity-30 transition-colors"
                      >
                        <Minus size={14} strokeWidth={1.5} />
                      </button>
                      <span className="flex-1 text-center font-body text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateItem(item._id, item.quantity + 1)}
                        className="w-8 h-full flex items-center justify-center text-ink-light hover:text-ink transition-colors"
                      >
                        <Plus size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item._id)}
                      className="font-body text-xs text-accent hover:text-ink transition-colors flex items-center gap-1.5 underline underline-offset-4"
                    >
                      <Trash2 size={14} strokeWidth={1.5} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Order Summary ─────────────────────────────────────────── */}
        <div>
          <div className="bg-sand p-6 md:p-8 sticky top-24">
            <h2 className="font-display text-2xl text-ink mb-6">Order Summary</h2>
            
            <div className="space-y-4 font-body text-sm mb-6 pb-6 border-b border-sand-dark">
              <div className="flex justify-between">
                <span className="text-ink-light">Subtotal</span>
                <span className="text-ink font-medium">₨{subtotal.toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-light">Shipping</span>
                <span className="text-ink font-medium">
                  {shipping === 0 ? 'Free' : `₨${shipping.toLocaleString('en-PK')}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between font-display text-xl text-ink mb-2">
              <span>Total</span>
              <span>₨{total.toLocaleString('en-PK')}</span>
            </div>
            
            <p className="font-body text-xs text-ink-light mb-8">
              Tax included. Cash on Delivery only.
            </p>

            <button 
              onClick={() => router.push('/checkout')}
              className="btn-primary w-full h-14 text-sm"
            >
              Proceed to Checkout <ArrowRight size={16} strokeWidth={1.5} />
            </button>
            
            <div className="mt-6 font-body text-xs text-ink-light/80 text-center leading-relaxed">
              <p>Delivery across Pakistan in 3-5 business days.</p>
              <p className="mt-1">Orders are confirmed via WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
