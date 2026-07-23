import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { ArrowRight, ShieldCheck, Package, Truck, MessageCircle } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/ProductSkeleton';
import FeaturedProducts from './FeaturedProducts';

export const metadata: Metadata = {
  title: 'The Gulf Edit — Gulf Fashion, Delivered to Pakistan',
  description: 'Authentic Splash, Max, and R&B fashion from Oman, delivered across Pakistan. Shop tops, dresses, trousers and more. Cash on Delivery.',
};

const MARQUEE_TEXT = [
  'Authentic Gulf Brands',
  'Direct from Oman',
  'Cash on Delivery',
  'New Arrivals Weekly',
  'Splash · Max · R&B',
  'Free Shipping Above ₨5,000',
];


const WHY_US = [
  {
    icon: ShieldCheck,
    title: 'Guaranteed Authentic',
    desc: 'Sourced directly from Landmark Group stores in Oman. No replicas.',
  },
  {
    icon: Package,
    title: 'Gulf Pricing',
    desc: 'Close to Oman retail prices — no inflated local markups.',
  },
  {
    icon: Truck,
    title: '3–5 Day Delivery',
    desc: 'International courier with full tracking to your door.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Support',
    desc: 'Message us any time for help with sizing or orders.',
  },
];

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000';

export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      {/* -mt pulls the section up behind the sticky navbar so images fill from top */}
      <section className="relative bg-sand overflow-hidden -mt-[60px] md:-mt-[70px]">
        {/* Full-bleed split layout like Splash */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

          {/* LEFT — Women */}
          <Link
            href="/shop?category=women"
            className="relative overflow-hidden group block min-h-[55vw] lg:min-h-0"
          >
            <Image
              src="/images/cat-women.jpg"
              alt="Shop Women — The Gulf Edit"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Bottom gradient for label readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/5 to-transparent" />
            {/* Top gradient for navbar readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-transparent" />
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-cream/60 mb-2">Splash · Max · R&B</p>
                  <h2 className="font-display text-4xl md:text-5xl font-light text-cream leading-tight">Women</h2>
                </div>
                <span className="bg-cream text-ink font-body text-xs font-semibold tracking-widest uppercase px-5 py-3 group-hover:bg-gold group-hover:text-cream transition-all duration-300">
                  SHOP WOMEN
                </span>
              </div>
            </div>
          </Link>

          {/* RIGHT — Men */}
          <Link
            href="/shop?category=men"
            className="relative overflow-hidden group block min-h-[55vw] lg:min-h-0"
          >
            <Image
              src="/images/cat-men.jpg"
              alt="Shop Men — The Gulf Edit"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/5 to-transparent" />
            {/* Top gradient for navbar readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-cream/60 mb-2">Splash · Max · R&B</p>
                  <h2 className="font-display text-4xl md:text-5xl font-light text-cream leading-tight">Men</h2>
                </div>
                <span className="bg-cream text-ink font-body text-xs font-semibold tracking-widest uppercase px-5 py-3 group-hover:bg-gold group-hover:text-cream transition-all duration-300">
                  SHOP MEN
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Brand name overlay — sits below the navbar (offset by nav height) */}
        <div className="absolute top-[70px] md:top-[80px] left-0 right-0 flex justify-center pointer-events-none z-10">
          <div className="text-center">
            <h1 className="font-display text-3xl md:text-4xl font-light text-cream drop-shadow-lg tracking-wide">
              The Gulf Edit
            </h1>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/70 mt-1 drop-shadow">
              Gulf Fashion · Delivered to Pakistan
            </p>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────────────── */}
      <div className="bg-ink overflow-hidden py-3.5 border-y border-ink">
        <div className="marquee-track">
          {[...MARQUEE_TEXT, ...MARQUEE_TEXT].map((text, i) => (
            <span key={i} className="inline-flex items-center gap-5 px-6 font-body text-[11px] tracking-[0.22em] uppercase text-cream/70 font-medium whitespace-nowrap">
              {text}
              <span className="w-0.5 h-0.5 rounded-full bg-gold inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* ── KIDS BANNER ─────────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/shop?category=kids"
          className="relative aspect-[16/5] overflow-hidden block group"
        >
          <Image
            src="/images/cat-kids.jpg"
            alt="Shop Kids — The Gulf Edit"
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent" />
          <div className="absolute inset-0 flex items-center px-10 md:px-16">
            <div>
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-gold mb-2">New Arrivals</p>
              <h2 className="font-display text-3xl md:text-5xl font-light text-cream mb-5 leading-tight">
                Kids Collection
              </h2>
              <span className="bg-gold text-ink font-body text-xs font-semibold tracking-widest uppercase px-6 py-3 group-hover:bg-cream transition-colors duration-300">
                SHOP KIDS
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* ── NEW ARRIVALS ────────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label block mb-2">Just In</p>
            <h2 className="font-display text-3xl md:text-4xl text-ink">New Arrivals</h2>
          </div>
          <Link href="/shop" className="hidden sm:flex items-center gap-1.5 font-body text-sm text-ink-light hover:text-gold transition-colors border-b border-transparent hover:border-gold pb-px">
            View all <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>

        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <FeaturedProducts />
        </Suspense>

        <div className="text-center mt-10 sm:hidden">
          <Link href="/shop" className="btn-outline">View All Products</Link>
        </div>
      </section>

      {/* ── BRAND STRIP ─────────────────────────────────────────────────────── */}
      <section className="border-t border-b border-sand-dark py-14 bg-sand">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label text-center block mb-8">Brands We Carry</p>
          <div className="grid grid-cols-3 gap-0 max-w-xl mx-auto">
            {['Splash', 'Max', 'R&B'].map((brand) => (
              <Link
                key={brand}
                href={`/shop?brand=${brand}`}
                className="flex items-center justify-center py-6 px-4 border-r last:border-r-0 border-sand-dark hover:bg-sand-dark/50 transition-colors group"
              >
                <span className="font-display text-2xl md:text-3xl font-light text-ink-light group-hover:text-gold transition-colors duration-200">
                  {brand}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ─────────────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-sand-dark">
          {WHY_US.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`p-8 flex flex-col items-start gap-4 ${
                i < 3 ? 'border-b md:border-b-0 md:border-r lg:border-r border-sand-dark' : ''
              }`}
            >
              <div className="w-10 h-10 border border-gold/30 flex items-center justify-center">
                <Icon size={18} className="text-gold" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display text-lg text-ink mb-1.5">{title}</h3>
                <p className="font-body text-sm text-ink-light leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="bg-ink py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-label text-gold block mb-4">Cash on Delivery · Nationwide</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream font-light mb-5 leading-tight">
            Something in mind?
          </h2>
          <p className="font-body text-cream/50 text-base mb-10 max-w-md mx-auto leading-relaxed">
            Message us on WhatsApp for custom requests, size queries, or anything else. We&apos;re a family business and we actually respond.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={`https://wa.me/${WA}?text=Hi%2C%20I%27d%20like%20to%20order%20from%20The%20Gulf%20Edit.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm px-8 py-4"
            >
              <MessageCircle size={16} strokeWidth={1.5} />
              Chat on WhatsApp
            </a>
            <Link href="/shop" className="btn-outline border-cream/20 text-cream hover:bg-cream hover:text-ink text-sm px-8 py-4">
              Browse Shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
