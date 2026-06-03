import Link from 'next/link';
import { MessageCircle, Instagram } from 'lucide-react';

const WA  = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER  || '923000000000';
const IG  = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'thegulfedit';

const FOOTER_LINKS = [
  { label: 'Shop',        href: '/shop' },
  { label: 'About',       href: '/about' },
  { label: 'Size Guide',  href: '/size-guide' },
  { label: 'Track Order', href: '/track' },
  { label: 'Contact',     href: '/contact' },
  { label: 'Policies',    href: '/policies' },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/80 font-body">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div>
            <h2 className="font-display text-2xl font-semibold text-cream mb-2">
              The Gulf Edit
            </h2>
            <p className="text-xs tracking-[0.2em] uppercase text-gold mb-4">
              Sourced from Oman · Delivered across Pakistan
            </p>
            <p className="text-sm leading-relaxed text-cream/60 max-w-xs">
              Authentic fashion from Landmark Group's Gulf stores — Splash, Max, and R&B — brought directly to your door.
            </p>
          </div>

          {/* Nav Links */}
          <div>
            <h3 className="font-body text-xs tracking-[0.2em] uppercase text-gold mb-5">
              Navigate
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/60 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-body text-xs tracking-[0.2em] uppercase text-gold mb-5">
              Get in Touch
            </h3>
            <div className="space-y-4">
              <a
                href={`https://wa.me/${WA}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-cream/60 hover:text-gold transition-colors"
              >
                <MessageCircle size={16} strokeWidth={1.5} />
                WhatsApp us
              </a>
              <a
                href={`https://instagram.com/${IG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-cream/60 hover:text-gold transition-colors"
              >
                <Instagram size={16} strokeWidth={1.5} />
                @{IG}
              </a>
            </div>

            {/* COD Badge */}
            <div className="mt-8 inline-flex items-center gap-2 border border-gold/30 px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-xs font-medium tracking-widest uppercase text-gold">
                Cash on Delivery Only
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5
                        flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream/30">
            © {new Date().getFullYear()} The Gulf Edit. All rights reserved.
          </p>
          <p className="text-xs text-cream/30">
            Authentic Gulf Brands · Direct from Oman
          </p>
        </div>
      </div>
    </footer>
  );
}
