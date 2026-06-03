import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { ArrowRight, ShieldCheck, Package, Truck, MessageCircle, CheckCircle } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/ProductSkeleton';
import FeaturedProducts from './FeaturedProducts';

export const metadata: Metadata = {
  title: 'The Gulf Edit — Gulf Fashion, Delivered to You',
  description: 'Authentic Splash, Max, and R&B fashion from Oman, delivered across Pakistan. Shop tops, dresses, trousers and more. Cash on Delivery.',
};

// ── Data ──────────────────────────────────────────────────────────────────────
const MARQUEE_TEXT = [
  'Authentic Gulf Brands',
  'Direct from Oman',
  'Cash on Delivery',
  'New Arrivals Weekly',
  'Splash · Max · R&B',
  'Free Shipping Above ₨5,000',
];

const CATEGORIES = [
  { label: 'Women',  slug: 'women', img: 'https://picsum.photos/seed/cat-women/600/800' },
  { label: 'Men',    slug: 'men',   img: 'https://picsum.photos/seed/cat-men/600/800' },
  { label: 'Kids',   slug: 'kids',  img: 'https://picsum.photos/seed/cat-kids/600/800' },
];

const WHY_US = [
  {
    icon: ShieldCheck,
    title: 'Guaranteed Authentic',
    desc: 'Every piece sourced directly from Landmark Group stores in Oman. No replicas, no middlemen.',
  },
  {
    icon: Package,
    title: 'Gulf Pricing',
    desc: 'Pay close to what it costs in Oman — no inflated local markups.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'International courier to your door in 3–5 business days with tracking.',
  },
  {
    icon: MessageCircle,
    title: 'Easy Ordering',
    desc: 'Browse online, pay cash on delivery. WhatsApp us anytime for help.',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Browse',     desc: 'Explore our curated selection of Gulf fashion across all categories.' },
  { step: '02', title: 'Order',      desc: 'Add to cart, fill your details. No account needed. Cash on delivery.' },
  { step: '03', title: 'We Ship',    desc: 'Our family in Oman packs and ships your order via international courier.' },
  { step: '04', title: 'Receive',    desc: 'Delivery in 3–5 business days. Pay cash when it arrives at your door.' },
];

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000';

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center bg-ink overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'url(https://picsum.photos/seed/hero-bg/1400/900)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />

        {/* Right editorial image */}
        <div className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block overflow-hidden">
          <Image
            src="https://picsum.photos/seed/hero-model/800/1000"
            alt="Gulf fashion editorial"
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-xl">
            {/* Label */}
            <span className="section-label mb-6 block">Splash · Max · R&amp;B</span>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light text-cream leading-[1.05] mb-6">
              Gulf fashion,<br />
              <em className="not-italic text-gold">delivered to you.</em>
            </h1>

            <p className="font-body text-cream/70 text-base sm:text-lg leading-relaxed mb-10 max-w-md">
              Authentic Splash, Max, and R&amp;B pieces — sourced directly from Oman, delivered across Pakistan. Pay cash on delivery.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary text-sm px-8 py-4">
                Shop Now <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
              <a
                href={`https://wa.me/${WA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-cream/30 text-cream hover:bg-cream hover:text-ink text-sm px-8 py-4"
              >
                <MessageCircle size={16} strokeWidth={1.5} />
                WhatsApp Us
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-cream/10">
              {['Free Returns', 'COD Available', 'Real Oman Stock'].map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-gold" strokeWidth={1.5} />
                  <span className="font-body text-xs text-cream/60 tracking-wide">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE TICKER ─────────────────────────────────────────────────── */}
      <div className="bg-gold overflow-hidden py-3 border-y border-gold">
        <div className="marquee-track">
          {[...MARQUEE_TEXT, ...MARQUEE_TEXT].map((text, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6 font-body text-xs tracking-[0.2em] uppercase text-ink font-medium whitespace-nowrap">
              {text}
              <span className="w-1 h-1 rounded-full bg-ink/40" />
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <span className="section-label block mb-3">Browse by</span>
          <h2 className="section-heading">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-sand block"
            >
              <Image
                src={cat.img}
                alt={`${cat.label} fashion`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                <h3 className="font-display text-3xl font-light text-cream">{cat.label}</h3>
                <span className="flex items-center gap-1.5 font-body text-xs text-cream/70 tracking-wide
                                 border border-cream/30 px-3 py-1.5
                                 group-hover:bg-gold group-hover:border-gold group-hover:text-ink
                                 transition-all duration-300">
                  Shop <ArrowRight size={12} strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── NEW ARRIVALS ────────────────────────────────────────────────────── */}
      <section className="bg-sand py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="section-label block mb-3">Just In</span>
              <h2 className="section-heading">New Arrivals</h2>
            </div>
            <Link href="/shop" className="btn-ghost hidden sm:flex items-center gap-2 text-sm">
              View all <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>

          <Suspense fallback={<ProductGridSkeleton count={6} />}>
            <FeaturedProducts />
          </Suspense>

          <div className="text-center mt-12 sm:hidden">
            <Link href="/shop" className="btn-outline">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ── WHY US ─────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <span className="section-label block mb-3">Our Promise</span>
          <h2 className="section-heading">Why The Gulf Edit?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {WHY_US.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center group">
              <div className="inline-flex items-center justify-center w-14 h-14
                              border border-gold/30 mb-5
                              group-hover:bg-gold group-hover:border-gold
                              transition-colors duration-300">
                <Icon size={22} className="text-gold group-hover:text-ink transition-colors duration-300" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg text-ink mb-2">{title}</h3>
              <p className="font-body text-sm text-ink-light leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="bg-ink py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="section-label text-gold block mb-3">Simple Process</span>
            <h2 className="section-heading text-cream">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative p-8 border border-cream/10 group hover:border-gold/40 transition-colors duration-300">
                {/* Connector */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-px w-px h-8 bg-cream/10" />
                )}
                <span className="font-display text-6xl font-light text-cream/10 mb-4 block group-hover:text-gold/20 transition-colors duration-300">
                  {step.step}
                </span>
                <h3 className="font-display text-xl text-cream mb-2">{step.title}</h3>
                <p className="font-body text-sm text-cream/50 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM STRIP ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-10">
          <span className="section-label block mb-3">Follow Along</span>
          <h2 className="section-heading">@thegulfedit</h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <a
              key={i}
              href={`https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'thegulfedit'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-sand block"
            >
              <Image
                src={`https://picsum.photos/seed/insta-${i + 1}/400/400`}
                alt={`Instagram post ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-all duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-cream text-xs font-body tracking-widest uppercase">
                  View
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────────── */}
      <section className="relative bg-ink overflow-hidden py-24">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(https://picsum.photos/seed/cta-bg/1400/600)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-gold/20" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-label text-gold block mb-4">Ready to Order?</span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-cream font-light mb-6">
            Have a question? <br />
            <em className="not-italic text-gold">We're on WhatsApp.</em>
          </h2>
          <p className="font-body text-cream/60 text-base mb-10 max-w-lg mx-auto">
            Message us for sizing help, specific item requests, or anything else. Our family-run team responds promptly.
          </p>
          <a
            href={`https://wa.me/${WA}?text=Hi%2C%20I%27d%20like%20to%20order%20from%20The%20Gulf%20Edit.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base px-10 py-4"
          >
            <MessageCircle size={18} strokeWidth={1.5} />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
