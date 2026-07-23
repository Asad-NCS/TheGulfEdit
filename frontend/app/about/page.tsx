import type { Metadata } from 'next';
import { ShieldCheck, Truck, Package, ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'The story behind The Gulf Edit — bringing authentic Gulf fashion to Pakistan.',
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Authenticity First',
    desc: 'Every piece is sourced directly from Landmark Group stores in Oman. No replicas, no factory seconds, no compromises.',
  },
  {
    icon: Package,
    title: 'Fair Pricing',
    desc: 'We believe premium fashion shouldn\'t come with premium markups. You pay close to the original Oman retail price.',
  },
  {
    icon: Truck,
    title: 'Fast & Reliable',
    desc: 'Our dedicated family team packs and ships your orders quickly, ensuring safe delivery to your doorstep anywhere in Pakistan.',
  },
];

const FAQS = [
  {
    q: 'How long does delivery take?',
    a: 'Orders typically arrive within 3-5 business days via our premium international courier partners.'
  },
  {
    q: 'Are these items authentic?',
    a: '100% authentic. We personally purchase these items from official Splash, Max, and R&B stores in Oman and ship them to Pakistan.'
  },
  {
    q: 'Do you offer Cash on Delivery?',
    a: 'Yes! We exclusively offer Cash on Delivery across Pakistan so you can shop with complete peace of mind.'
  },
  {
    q: 'What is your return policy?',
    a: 'We offer an exchange within 3 days of delivery if there is a sizing issue, provided the item is unused with original tags attached. We do not offer cash refunds.'
  },
  {
    q: 'Where do you ship?',
    a: 'We deliver to all major cities and most towns across Pakistan.'
  },
  {
    q: 'How do I know my size?',
    a: 'Please refer to our detailed Size Guide. The measurements provided are based on standard Gulf sizing which is typically true to size.'
  }
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      
      {/* ── Brand Story ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24 items-center">
        {/* Story image — replace this with a real photo when available */}
        <div className="relative aspect-[4/5] bg-sand border border-sand-dark overflow-hidden flex flex-col items-center justify-center gap-6">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C4953A 0, #C4953A 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
          {/* Center content */}
          <div className="relative text-center px-8">
            <div className="w-20 h-20 border border-gold/30 flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-gold/50">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <p className="font-display text-2xl text-ink-light/40 tracking-wide mb-3">The Gulf Edit</p>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-ink-light/25">Add your photo here</p>
          </div>
          <p className="relative font-body text-[9px] tracking-[0.2em] uppercase text-ink-light/20 absolute bottom-6">
            Upload via Admin → About Image
          </p>
        </div>
        <div>
          <span className="section-label block mb-4">Our Story</span>
          <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mb-6">
            A family bridge between <br />
            <em className="text-gold not-italic">Oman and Pakistan.</em>
          </h1>
          <div className="prose prose-sm font-body text-ink-light leading-relaxed">
            <p>
              The Gulf Edit started with a simple realization: the fashion we loved in the Gulf — the quality of Splash, the everyday utility of Max, the trends of R&B — was either unavailable in Pakistan or sold with massive, unjustified markups.
            </p>
            <p>
              We decided to bridge that gap. We are a family-run business split between Oman and Pakistan. Our family in Oman personally visits Landmark Group stores, curates the best seasonal pieces, and ships them directly to our distribution hub in Pakistan.
            </p>
            <p>
              By keeping our operations lean and working directly, we bypass traditional import channels and middlemen. This allows us to offer you authentic Gulf fashion at prices that make sense.
            </p>
          </div>
        </div>
      </div>

      {/* ── Values ───────────────────────────────────────────────────── */}
      <div className="bg-sand p-8 md:p-16 mb-24 text-center">
        <span className="section-label block mb-4">What We Stand For</span>
        <h2 className="font-display text-3xl md:text-4xl text-ink mb-12">Our Core Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {VALUES.map((v) => (
            <div key={v.title} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cream border border-sand-dark rounded-full mb-6 text-gold group-hover:bg-gold group-hover:text-cream transition-colors duration-300">
                <v.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl text-ink mb-3">{v.title}</h3>
              <p className="font-body text-sm text-ink-light leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label block mb-4">Questions?</span>
          <h2 className="font-display text-3xl md:text-4xl text-ink">Frequently Asked</h2>
        </div>
        
        <div className="border-t border-sand-dark">
          {FAQS.map((faq, i) => (
            <details key={i} className="group border-b border-sand-dark">
              <summary className="flex items-center justify-between py-5 cursor-pointer list-none font-body text-base text-ink hover:text-gold transition-colors">
                {faq.q}
                <span className="transition-transform group-open:rotate-180 text-ink-light group-hover:text-gold">
                  <ChevronDown size={18} strokeWidth={1.5} />
                </span>
              </summary>
              <div className="pb-6 font-body text-sm text-ink-light leading-relaxed pr-8">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>

    </div>
  );
}
