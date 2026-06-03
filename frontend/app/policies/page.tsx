import type { Metadata } from 'next';
import { ShieldCheck, RefreshCw, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Store Policies',
  description: 'Shipping, returns, and authenticity policies for The Gulf Edit.',
};

export default function PoliciesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center mb-16">
        <span className="section-label block mb-4">The Gulf Edit</span>
        <h1 className="font-display text-4xl md:text-5xl text-ink">Store Policies</h1>
      </div>

      <div className="space-y-12">
        
        {/* ── Return Policy ────────────────────────────────────────────── */}
        <section className="bg-sand p-8 md:p-12 border border-sand-dark">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-sand-dark">
            <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-ink flex-shrink-0">
              <RefreshCw size={24} strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-2xl text-ink">Returns & Exchanges</h2>
          </div>
          
          <div className="prose prose-sm font-body text-ink-light leading-relaxed">
            <p>
              As a Cash on Delivery business importing items directly from Oman, <strong>we do not offer cash refunds</strong>. However, we gladly offer exchanges under the following conditions:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Exchange requests must be made within <strong>3 days</strong> of receiving your order.</li>
              <li>Items must be unused, unwashed, and in their original condition.</li>
              <li>Original brand tags (Splash, Max, R&B) must remain attached.</li>
            </ul>
            <p className="mt-4">
              <strong>How to exchange:</strong> Contact us on WhatsApp with your Order ID and the reason for exchange. If approved, you will need to ship the item back to our facility in Pakistan. Once received and inspected, we will issue store credit or arrange the replacement size.
            </p>
            <p className="mt-4 text-xs text-accent">
              <em>Note: Return shipping costs are the responsibility of the customer unless the wrong item was delivered.</em>
            </p>
          </div>
        </section>

        {/* ── Shipping Policy ──────────────────────────────────────────── */}
        <section className="bg-sand p-8 md:p-12 border border-sand-dark">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-sand-dark">
            <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-ink flex-shrink-0">
              <Truck size={24} strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-2xl text-ink">Shipping & Delivery</h2>
          </div>
          
          <div className="prose prose-sm font-body text-ink-light leading-relaxed">
            <p>
              We deliver to all major cities and towns across Pakistan using premium courier services.
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li><strong>Delivery Time:</strong> Standard delivery takes 3-5 business days from the time your order is confirmed via WhatsApp.</li>
              <li><strong>Shipping Cost:</strong> A flat rate of ₨250 applies to all orders under ₨5,000.</li>
              <li><strong>Free Shipping:</strong> Orders above ₨5,000 automatically qualify for free shipping.</li>
            </ul>
            <p className="mt-4">
              Once your order is dispatched, you will receive a tracking number via WhatsApp which you can use on our Track Order page.
            </p>
          </div>
        </section>

        {/* ── Authenticity ─────────────────────────────────────────────── */}
        <section className="bg-sand p-8 md:p-12 border border-sand-dark">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-sand-dark">
            <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-ink flex-shrink-0">
              <ShieldCheck size={24} strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-2xl text-ink">Authenticity Guarantee</h2>
          </div>
          
          <div className="prose prose-sm font-body text-ink-light leading-relaxed">
            <p>
              We guarantee that every single item sold on The Gulf Edit is 100% authentic. 
            </p>
            <p className="mt-4">
              We do not source from local wholesalers, leftover factories, or third-party liquidators. Our family team in Oman personally purchases these items at retail from official Landmark Group stores (Splash, Max, and R&B).
            </p>
            <p className="mt-4">
              All items are shipped with their original retail tags attached.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
