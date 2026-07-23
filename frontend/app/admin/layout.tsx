'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LayoutDashboard, Package, ShoppingCart, Mail, LogOut, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/contacts', label: 'Messages', icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // If we're on the login page, don't show the dashboard shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    Cookies.remove('gulf_admin_auth');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-sand flex flex-col md:flex-row font-body">
      {/* Mobile Header */}
      <div className="md:hidden bg-ink text-cream p-4 flex items-center justify-between sticky top-0 z-50">
        <span className="font-display text-xl">Admin Panel</span>
        <button onClick={() => setOpen(!open)} className="text-cream">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-ink text-cream transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 flex flex-col
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 pb-2 mb-6 border-b border-cream/10 hidden md:block">
          <h2 className="font-display text-2xl text-gold mb-1">The Gulf Edit</h2>
          <p className="text-xs tracking-widest uppercase text-cream/50">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6 md:mt-0">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-none transition-colors ${
                  active ? 'bg-gold text-ink font-medium' : 'text-cream/70 hover:bg-cream/5 hover:text-cream'
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2 : 1.5} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-cream/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-accent hover:bg-cream/5 transition-colors"
          >
            <LogOut size={18} strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div className="fixed inset-0 bg-ink/50 z-30 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden min-h-screen">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
