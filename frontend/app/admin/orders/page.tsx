'use client';

import { useState, useEffect } from 'react';
import { Eye, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/orders?limit=50`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${API}/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success('Status updated');
        fetchOrders();
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Orders</h1>

      <div className="bg-cream border border-sand-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sand border-b border-sand-dark font-body text-xs tracking-wider uppercase text-ink-light">
                <th className="p-4 font-medium">Order ID / Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm divide-y divide-sand-dark">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-ink-light">No orders found.</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="hover:bg-sand/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-ink">{o.orderId}</div>
                      <div className="text-xs text-ink-light mt-1">{new Date(o.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-ink">{o.customer.name}</div>
                      <div className="text-xs text-ink-light">{o.customer.whatsapp}</div>
                    </td>
                    <td className="p-4 font-medium text-ink">₨{o.total_pkr.toLocaleString()}</td>
                    <td className="p-4">
                      <select 
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        className={`text-xs px-2 py-1 border outline-none font-medium ${
                          o.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                          o.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                          o.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-ink-light hover:text-ink"><Eye size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
