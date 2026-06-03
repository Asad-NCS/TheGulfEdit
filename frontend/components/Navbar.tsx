'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Shop',       href: '/shop' },
  { label: 'About',      href: '/about' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'Track Order',href: '/track' },
  { label: 'Contact',    href: '/contact' },
];

export default function Navbar() {
  const pathname            = usePathname();
  const { itemCount }       = useCart();
  const [open, setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll to add backdrop
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const isHome = pathname === '/';

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled || !isHome
            ? 'bg-cream/95 backdrop-blur-md border-b border-sand-dark shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none group">
              <span className="font-display text-xl md:text-2xl font-semibold text-ink tracking-tight group-hover:text-gold transition-colors duration-200">
                The Gulf Edit
              </span>
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-ink-light/60">
                Oman · Pakistan
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-body text-sm tracking-wide transition-colors duration-200 relative group ${
                    pathname === link.href
                      ? 'text-gold'
                      : 'text-ink-light hover:text-ink'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-200 ${
                      pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Right: Cart + Hamburger */}
            <div className="flex items-center gap-3">
              {/* Cart icon */}
              <Link
                href="/cart"
                className="relative p-2 text-ink hover:text-gold transition-colors duration-200"
                aria-label={`Cart — ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
              >
                <ShoppingBag size={22} strokeWidth={1.5} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px]
                                 bg-gold text-cream text-[10px] font-medium font-body
                                 flex items-center justify-center rounded-full px-1 leading-none"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 text-ink hover:text-gold transition-colors"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close menu' : 'Open menu'}
              >
                {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-cream
                         border-l border-sand-dark flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-sand-dark">
                <span className="font-display text-lg text-ink">Menu</span>
                <button onClick={() => setOpen(false)} className="p-1 text-ink-light hover:text-ink">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex flex-col p-6 gap-6 flex-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-display text-2xl tracking-tight transition-colors ${
                      pathname === link.href ? 'text-gold' : 'text-ink hover:text-gold'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t border-sand-dark">
                <Link href="/cart" className="btn-primary w-full">
                  <ShoppingBag size={16} strokeWidth={1.5} />
                  View Cart
                  {itemCount > 0 && (
                    <span className="ml-1 bg-cream text-ink rounded-full w-5 h-5
                                     flex items-center justify-center text-[11px] font-medium">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
