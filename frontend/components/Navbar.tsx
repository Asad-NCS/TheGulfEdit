'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { motion, AnimatePresence } from 'framer-motion';

const SHOP_CATEGORIES = [
  { label: 'Women', slug: 'women' },
  { label: 'Men',   slug: 'men' },
  { label: 'Kids',  slug: 'kids' },
];

export default function Navbar() {
  const pathname        = usePathname();
  const { itemCount }   = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setSearchOpen(false); }, [pathname]);

  const isHome = pathname === '/';
  const transparent = isHome && !scrolled && !open;

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        transparent ? 'bg-transparent' : 'bg-cream/97 backdrop-blur-md border-b border-sand-dark'
      }`}>

        {/* Top bar */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px] md:h-[70px]">

            {/* Left: Category links (desktop) */}
            <nav className="hidden md:flex items-center gap-7">
              {SHOP_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/shop?category=${cat.slug}`}
                  className={`font-body text-sm font-medium tracking-wide transition-colors duration-200 relative group pb-0.5 ${
                    pathname.includes('/shop') && new URLSearchParams(
                      typeof window !== 'undefined' ? window.location.search : ''
                    ).get('category') === cat.slug
                      ? 'text-ink border-b border-ink'
                      : transparent
                        ? 'text-cream/80 hover:text-cream'
                        : 'text-ink-light hover:text-ink'
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
              <Link
                href="/shop"
                className={`font-body text-sm font-medium tracking-wide transition-colors duration-200 ${
                  transparent ? 'text-cream/80 hover:text-cream' : 'text-ink-light hover:text-ink'
                }`}
              >
                All
              </Link>
            </nav>

            {/* Center: Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none group"
            >
              <span className={`font-display text-xl md:text-2xl font-semibold tracking-tight transition-colors duration-300 ${
                transparent ? 'text-cream' : 'text-ink'
              }`}>
                The Gulf Edit
              </span>
              <span className={`font-body text-[9px] tracking-[0.22em] uppercase transition-colors duration-300 ${
                transparent ? 'text-cream/50' : 'text-ink-light/50'
              }`}>
                Oman · Pakistan
              </span>
            </Link>

            {/* Right: Search + Cart + Hamburger */}
            <div className="flex items-center gap-1 md:gap-2 ml-auto">
              {/* Search icon */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search"
                className={`p-2 transition-colors duration-200 ${
                  transparent ? 'text-cream/80 hover:text-cream' : 'text-ink-light hover:text-ink'
                }`}
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className={`relative p-2 transition-colors duration-200 ${
                  transparent ? 'text-cream/80 hover:text-cream' : 'text-ink-light hover:text-ink'
                }`}
                aria-label={`Cart — ${itemCount} items`}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] bg-gold text-cream text-[9px] font-medium font-body flex items-center justify-center rounded-full px-1 leading-none"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Mobile hamburger */}
              <button
                className={`md:hidden p-2 transition-colors ${
                  transparent ? 'text-cream/80 hover:text-cream' : 'text-ink-light hover:text-ink'
                }`}
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close menu' : 'Open menu'}
              >
                {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
            </div>

          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              key="search"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-sand-dark bg-cream"
            >
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                  className="flex items-center gap-3 border border-sand-dark px-4 py-2.5 bg-sand/50"
                >
                  <Search size={16} strokeWidth={1.5} className="text-ink-light flex-shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for dresses, shirts, trousers…"
                    className="flex-1 bg-transparent font-body text-sm text-ink placeholder:text-ink-light/50 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-ink-light hover:text-ink"
                  >
                    <X size={16} strokeWidth={1.5} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[280px] bg-cream flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-6 h-[60px] border-b border-sand-dark">
                <span className="font-display text-lg text-ink">Menu</span>
                <button onClick={() => setOpen(false)} className="p-1 text-ink-light hover:text-ink">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex flex-col p-6 gap-1 flex-1">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ink-light/50 mb-4">Shop</p>
                {SHOP_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/shop?category=${cat.slug}`}
                    className="font-display text-2xl text-ink hover:text-gold transition-colors py-1"
                  >
                    {cat.label}
                  </Link>
                ))}
                <Link href="/shop" className="font-display text-2xl text-ink hover:text-gold transition-colors py-1">
                  All Products
                </Link>

                <div className="border-t border-sand-dark mt-6 pt-6 flex flex-col gap-3">
                  {[
                    { label: 'About', href: '/about' },
                    { label: 'Track Order', href: '/track' },
                    { label: 'Contact', href: '/contact' },
                    { label: 'Size Guide', href: '/size-guide' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="font-body text-sm text-ink-light hover:text-ink transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="p-5 border-t border-sand-dark">
                <Link href="/cart" className="btn-primary w-full">
                  <ShoppingBag size={16} strokeWidth={1.5} />
                  View Cart {itemCount > 0 && `(${itemCount})`}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
