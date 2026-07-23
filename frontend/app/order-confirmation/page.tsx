'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, MessageCircle, Package } from 'lucide-react';
import { CartItem } from '@/lib/cart-context';
const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000';

interface OrderData {
  orderId: string;
  total_pkr: number;
  customer: {
    name: string;
    whatsapp: string;
    address: string;
    city: string;
  };
  items: CartItem[];
  createdAt: string;
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-4xl text-ink mb-4">Order Not Found</h1>
        <p className="font-body text-ink-light mb-8">We couldn't find the order details. If you placed an order, please contact us.</p>
        <Link href="/shop" className="btn-primary">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 text-gold rounded-full mb-6">
          <CheckCircle size={32} strokeWidth={1.5} />
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-4">Order Confirmed</h1>
        <p className="font-body text-ink-light text-lg">
          Thank you for your order, {order.customer.name.split(' ')[0]}.
        </p>
      </div>

      <div className="bg-sand border border-sand-dark p-6 sm:p-10 mb-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-sand-dark">
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-ink-light mb-1">Order Number</p>
            <p className="font-display text-2xl text-ink">{order.orderId}</p>
          </div>
          <div className="sm:text-right">
            <p className="font-body text-xs tracking-widest uppercase text-ink-light mb-1">Total Amount</p>
            <p className="font-display text-2xl text-ink">₨{order.total_pkr.toLocaleString('en-PK')}</p>
            <p className="font-body text-xs text-accent mt-1">Cash on Delivery</p>
          </div>
        </div>

        <div className="py-8 border-b border-sand-dark">
          <h3 className="font-display text-xl text-ink mb-6">What happens next?</h3>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center flex-shrink-0 border border-sand-dark text-ink">
              <MessageCircle size={18} strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-body font-medium text-ink mb-1">WhatsApp Confirmation</p>
              <p className="font-body text-sm text-ink-light leading-relaxed">
                We will contact you shortly on <strong>{order.customer.whatsapp}</strong> to confirm your order details and delivery address.
              </p>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center flex-shrink-0 border border-sand-dark text-ink">
              <Package size={18} strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-body font-medium text-ink mb-1">Processing & Shipping</p>
              <p className="font-body text-sm text-ink-light leading-relaxed">
                Once confirmed, your order will be shipped from Oman. Delivery typically takes 3-5 business days.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <h3 className="font-display text-xl text-ink mb-6">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-4 bg-cream p-3 border border-sand-dark">
                <div className="relative w-16 aspect-[3/4] bg-sand flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 py-1">
                  <p className="font-display text-base text-ink line-clamp-1">{item.name}</p>
                  <p className="font-body text-xs text-ink-light mt-1">
                    {item.brand} | Size: {item.size} | Qty: {item.quantity}
                  </p>
                </div>
                <div className="py-1">
                  <p className="font-body text-sm font-medium text-ink">
                    ₨{(item.price_pkr * item.quantity).toLocaleString('en-PK')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
        <Link href={`/track?id=${order.orderId}`} className="btn-primary">
          Track Order
        </Link>
        <a 
          href={`https://wa.me/${WA}?text=Hi%2C%20I%20just%20placed%20order%20${order.orderId}.`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-outline bg-cream"
        >
          Message us on WhatsApp
        </a>
      </div>
    </div>
  );
}
