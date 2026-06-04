'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useCart } from '@/lib/cart-context';
import { Lock, Truck } from 'lucide-react';
const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Quetta', 'Other'];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, sessionId, refreshCart } = useCart();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    city: '',
    address: '',
    postalCode: '',
    notes: ''
  });

  // Redirect if empty
  useEffect(() => {
    if (cart && cart.items.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  if (!cart || cart.items.length === 0) return null;

  const shipping = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          customer: formData
        })
      });

      const data = await res.json();
      
      if (data.success) {
        await refreshCart(); // Cart should be cleared by backend now
        router.push(`/order-confirmation?id=${data.data.orderId}`);
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <h1 className="font-display text-4xl text-ink mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* ── Checkout Form ────────────────────────────────────────── */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="font-display text-xl text-ink mb-6 border-b border-sand-dark pb-3">Contact Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-body text-xs text-ink-light mb-1.5 ml-1">Full Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input" placeholder="e.g. Asad Ahmed" />
                </div>
                <div>
                  <label className="block font-body text-xs text-ink-light mb-1.5 ml-1">WhatsApp Number *</label>
                  <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleChange} className="input" placeholder="e.g. 03001234567" />
                  <p className="text-[11px] text-ink-light/60 mt-1.5 ml-1">We will send order confirmation and tracking to this number.</p>
                </div>
                <div>
                  <label className="block font-body text-xs text-ink-light mb-1.5 ml-1">Email (Optional)</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" placeholder="e.g. asad@example.com" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl text-ink mb-6 border-b border-sand-dark pb-3">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-body text-xs text-ink-light mb-1.5 ml-1">City *</label>
                  <select name="city" required value={formData.city} onChange={handleChange} className="select">
                    <option value="" disabled>Select a city</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-body text-xs text-ink-light mb-1.5 ml-1">Full Address *</label>
                  <textarea name="address" required value={formData.address} onChange={handleChange} className="input min-h-[100px] resize-y" placeholder="House/Flat No, Street, Area" />
                </div>
                <div>
                  <label className="block font-body text-xs text-ink-light mb-1.5 ml-1">Postal Code (Optional)</label>
                  <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="input" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl text-ink mb-6 border-b border-sand-dark pb-3">Additional Info</h2>
              <div>
                <label className="block font-body text-xs text-ink-light mb-1.5 ml-1">Order Notes (Optional)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className="input" placeholder="Any special delivery instructions?" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full h-14 mt-4 text-base">
              {loading ? 'Processing...' : 'Place Order'}
            </button>
            <p className="flex items-center justify-center gap-1.5 text-xs font-body text-ink-light mt-4">
              <Lock size={12} strokeWidth={1.5} /> Secure checkout
            </p>
          </form>
        </div>

        {/* ── Order Summary Sidebar ─────────────────────────────────── */}
        <div className="lg:order-last order-first mb-8 lg:mb-0">
          <div className="bg-sand p-6 md:p-8 sticky top-24">
            <h2 className="font-display text-2xl text-ink mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto scrollbar-thin pr-2">
              {cart.items.map(item => (
                <div key={item._id} className="flex gap-4">
                  <div className="relative w-16 aspect-[3/4] bg-sand-dark flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-2 -right-2 bg-ink text-cream w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-body">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm text-ink line-clamp-1">{item.name}</p>
                    <p className="font-body text-xs text-ink-light mt-0.5">{item.brand} — {item.size}</p>
                  </div>
                  <div className="font-body text-sm font-medium text-ink">
                    ₨{(item.price_pkr * item.quantity).toLocaleString('en-PK')}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-sand-dark pt-6 space-y-4 font-body text-sm mb-6 pb-6 border-b">
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

            <div className="flex justify-between font-display text-xl text-ink mb-8">
              <span>Total</span>
              <span>₨{total.toLocaleString('en-PK')}</span>
            </div>

            <div className="bg-cream border border-sand-dark p-4 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 text-gold">
                <Truck size={20} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-body text-sm font-medium text-ink mb-1">Cash on Delivery</h4>
                <p className="font-body text-xs text-ink-light leading-relaxed">
                  Pay with cash when your order arrives at your door. Please have the exact amount ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
