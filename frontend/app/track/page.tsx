'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Package, Truck, CheckCircle, ExternalLink, Clock, X } from 'lucide-react';
import { CartItem } from '@/lib/cart-context';

interface OrderTracking {
  orderId: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  statusHistory: { status: string; note: string; updatedAt: string }[];
  tracking: {
    courier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
  };
  items: CartItem[];
  customer: {
    name: string;
    city: string;
  };
  subtotal_pkr: number;
  shipping_pkr: number;
  total_pkr: number;
  createdAt: string;
}

const STATUS_STEPS = [
  { id: 'pending', label: 'Order Placed', icon: Clock },
  { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Package },
];

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>}>
      <TrackOrderContent />
    </Suspense>
  );
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialId = searchParams.get('id') || '';

  const [orderId, setOrderId] = useState(initialId);
  const [order, setOrder] = useState<OrderTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || 'Order not found');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) fetchOrder(initialId);
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    router.push(`/track?id=${orderId.trim()}`);
  };

  const currentStatusIdx = order ? STATUS_STEPS.findIndex(s => s.id === order.status) : -1;
  const isCancelled = order?.status === 'cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl text-ink mb-4">Track Your Order</h1>
        <p className="font-body text-ink-light mb-8 max-w-md mx-auto">
          Enter your Order ID below to check the current status and tracking details of your shipment.
        </p>
        
        <form onSubmit={handleSearch} className="flex max-w-md mx-auto">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. GE-20240101-0001"
            className="input rounded-none border-r-0 flex-1"
          />
          <button type="submit" disabled={loading} className="btn-primary px-6 rounded-none whitespace-nowrap">
            {loading ? 'Searching...' : <><Search size={18} strokeWidth={1.5} /> Track</>}
          </button>
        </form>
        {error && <p className="text-accent font-body text-sm mt-4">{error}</p>}
      </div>

      {order && (
        <div className="animate-fade-up">
          <div className="bg-cream border border-sand-dark overflow-hidden mb-8">
            <div className="bg-sand px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-dark">
              <div>
                <p className="font-body text-xs text-ink-light tracking-widest uppercase mb-1">Order Details</p>
                <h2 className="font-display text-xl text-ink">{order.orderId}</h2>
              </div>
              <div className="sm:text-right">
                <p className="font-body text-sm text-ink font-medium">{order.customer.name}</p>
                <p className="font-body text-xs text-ink-light mt-0.5">{order.customer.city}, Pakistan</p>
              </div>
            </div>

            <div className="p-6 md:p-10">
              {isCancelled ? (
                <div className="text-center py-8 border border-accent/20 bg-accent/5">
                  <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                    <X size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl text-ink mb-2">Order Cancelled</h3>
                  <p className="font-body text-sm text-ink-light">This order has been cancelled. Please contact support if you need assistance.</p>
                </div>
              ) : (
                <>
                  {/* Status Timeline */}
                  <div className="relative mb-16">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-sand-dark -translate-y-1/2 z-0 hidden sm:block" />
                    <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-8 sm:gap-4">
                      {STATUS_STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        const isCompleted = idx <= currentStatusIdx;
                        const isCurrent = idx === currentStatusIdx;
                        
                        return (
                          <div key={step.id} className="flex sm:flex-col items-center gap-4 sm:gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                              isCompleted ? 'bg-gold text-cream shadow-md shadow-gold/20' : 'bg-cream border border-sand-dark text-sand-dark'
                            }`}>
                              <Icon size={18} strokeWidth={isCompleted ? 2 : 1.5} />
                            </div>
                            <div className="sm:text-center">
                              <p className={`font-body text-sm font-medium ${isCurrent ? 'text-ink' : isCompleted ? 'text-ink/80' : 'text-ink-light/50'}`}>
                                {step.label}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tracking Info Box */}
                  {order.tracking && order.tracking.trackingNumber && (
                    <div className="bg-sand/50 border border-sand-dark p-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <p className="font-body text-xs tracking-widest uppercase text-ink-light mb-1">Shipping Details</p>
                        <p className="font-body text-base text-ink mb-2">
                          <span className="font-medium">{order.tracking.courier}</span> — {order.tracking.trackingNumber}
                        </p>
                        {order.tracking.estimatedDelivery && (
                          <p className="font-body text-sm text-ink-light">
                            Estimated Delivery: {new Date(order.tracking.estimatedDelivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {order.tracking.trackingUrl && (
                        <a 
                          href={order.tracking.trackingUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-primary px-6"
                        >
                          Track on Courier Website <ExternalLink size={16} strokeWidth={1.5} />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Order Items */}
                  <h3 className="font-display text-xl text-ink mb-6">Items in this order</h3>
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-4 border border-sand-dark">
                        <div className="relative w-16 aspect-[3/4] bg-sand flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <p className="font-display text-base text-ink line-clamp-1">{item.name}</p>
                          <p className="font-body text-xs text-ink-light mt-1">
                            {item.brand} | Size: {item.size} | Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="py-1 text-right">
                          <p className="font-body text-sm font-medium text-ink">
                            ₨{(item.price_pkr * item.quantity).toLocaleString('en-PK')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-sand-dark flex justify-end">
                    <div className="w-full sm:w-64 space-y-3 font-body text-sm">
                      <div className="flex justify-between text-ink-light">
                        <span>Subtotal</span>
                        <span>₨{order.subtotal_pkr.toLocaleString('en-PK')}</span>
                      </div>
                      <div className="flex justify-between text-ink-light">
                        <span>Shipping</span>
                        <span>{order.shipping_pkr === 0 ? 'Free' : `₨${order.shipping_pkr.toLocaleString('en-PK')}`}</span>
                      </div>
                      <div className="flex justify-between font-medium text-ink text-base pt-3 border-t border-sand-dark">
                        <span>Total (COD)</span>
                        <span>₨{order.total_pkr.toLocaleString('en-PK')}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
