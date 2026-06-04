'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Package, Mail, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    products: 0,
    contacts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch aggregated stats from the backend.
    // For now, we'll just fetch raw counts.
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes, contactsRes] = await Promise.all([
          fetch(`/api/orders?limit=1000`),
          fetch(`/api/products?limit=1`),
          fetch(`/api/contact`) // Requires admin but we assume server.js allows it or we skip it for now
        ]);

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
        const contactsData = await contactsRes.json();

        let totalRev = 0;
        if (ordersData.success) {
          totalRev = ordersData.data.reduce((sum: number, o: any) => sum + (o.status !== 'cancelled' ? o.total_pkr : 0), 0);
        }

        setStats({
          orders: ordersData.success ? ordersData.pagination.total : 0,
          revenue: totalRev,
          products: productsData.success ? productsData.pagination.total : 0,
          contacts: contactsData.success ? contactsData.data.length : 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const STAT_CARDS = [
    { label: 'Total Revenue', value: `₨${stats.revenue.toLocaleString('en-PK')}`, icon: TrendingUp, color: 'text-green-600', link: '/admin/orders' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-blue-600', link: '/admin/orders' },
    { label: 'Products', value: stats.products, icon: Package, color: 'text-gold', link: '/admin/products' },
    { label: 'Unread Messages', value: stats.contacts, icon: Mail, color: 'text-accent', link: '/admin/contacts' },
  ];

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {STAT_CARDS.map((stat, i) => (
          <Link key={i} href={stat.link} className="bg-cream border border-sand-dark p-6 hover:border-gold transition-colors block">
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-sm text-ink-light tracking-widest uppercase">{stat.label}</span>
              <stat.icon size={20} className={stat.color} strokeWidth={1.5} />
            </div>
            <p className="font-display text-3xl text-ink">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-cream border border-sand-dark p-8">
        <h2 className="font-display text-xl text-ink mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/products?new=true" className="btn-primary">Add New Product</Link>
          <Link href="/admin/orders" className="btn-outline bg-transparent">View Recent Orders</Link>
        </div>
      </div>
    </div>
  );
}
