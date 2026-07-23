'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, MessageCircle, Truck, Package, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-800 border-blue-200',
  shipped:   'bg-purple-50 text-purple-800 border-purple-200',
  delivered: 'bg-green-50 text-green-800 border-green-200',
  cancelled: 'bg-red-50 text-red-800 border-red-200',
};

export default function AdminOrders() {
  const [orders, setOrders]       = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState<any | null>(null); // order open in modal
  const [saving, setSaving]       = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    courier: '', trackingNumber: '', trackingUrl: '', estimatedDelivery: ''
  });
  const [statusNote, setStatusNote] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/orders?limit=100');
      const data = await res.json();
      if (data.success) setOrders(data.data);
      else toast.error('Failed to load orders');
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const openDetail = (order: any) => {
    setSelected(order);
    setTrackingForm({
      courier:           order.tracking?.courier || '',
      trackingNumber:    order.tracking?.trackingNumber || '',
      trackingUrl:       order.tracking?.trackingUrl || '',
      estimatedDelivery: order.tracking?.estimatedDelivery
        ? new Date(order.tracking.estimatedDelivery).toISOString().slice(0, 10)
        : '',
    });
    setStatusNote('');
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: statusNote }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Status → ${status}`);
        if (selected?._id === id) setSelected(data.data);
        fetchOrders();
      } else toast.error(data.message || 'Failed');
    } catch { toast.error('Network error'); }
  };

  const saveTracking = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${selected._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking: trackingForm }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Tracking info saved!');
        setSelected(data.data);
        fetchOrders();
      } else toast.error(data.message || 'Failed');
    } catch { toast.error('Network error'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-ink">Orders</h1>
        <span className="font-body text-sm text-ink-light">{orders.length} total</span>
      </div>

      <div className="bg-cream border border-sand-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sand border-b border-sand-dark font-body text-[11px] tracking-wider uppercase text-ink-light">
                <th className="p-4 font-medium">Order / Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">City</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm divide-y divide-sand-dark">
              {loading ? (
                <tr><td colSpan={7} className="p-10 text-center text-ink-light">Loading…</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="p-10 text-center text-ink-light">No orders yet.</td></tr>
              ) : orders.map((o) => (
                <>
                  <tr key={o._id} className="hover:bg-sand/30 transition-colors">
                    <td className="p-4">
                      <div className="font-mono text-xs font-bold text-ink">{o.orderId}</div>
                      <div className="text-[11px] text-ink-light mt-1">
                        {new Date(o.createdAt).toLocaleDateString('en-PK', { day:'2-digit', month:'short', year:'numeric' })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-ink">{o.customer?.name}</div>
                      {o.customer?.whatsapp && (
                        <a
                          href={`https://wa.me/${o.customer.whatsapp.replace(/\D/g,'')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1 mt-1"
                        >
                          <MessageCircle size={11} />
                          {o.customer.whatsapp}
                        </a>
                      )}
                    </td>
                    <td className="p-4 text-ink-light capitalize">{o.customer?.city}</td>
                    <td className="p-4 font-medium text-ink">₨{o.total_pkr?.toLocaleString()}</td>
                    <td className="p-4 text-ink-light">{o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        className={`text-xs px-2 py-1 border outline-none font-medium cursor-pointer ${STATUS_STYLES[o.status] || STATUS_STYLES.pending}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openDetail(o)}
                        className="text-xs px-3 py-1.5 border border-ink/20 text-ink hover:border-gold hover:text-gold transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ORDER DETAIL MODAL ──────────────────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 bg-ink/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-cream w-full max-w-2xl border border-sand-dark shadow-2xl my-8">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-sand-dark">
              <div>
                <h2 className="font-display text-2xl text-ink">{selected.orderId}</h2>
                <p className="font-body text-xs text-ink-light mt-1">
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-ink-light hover:text-ink p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* Customer Info */}
              <div className="bg-sand/50 border border-sand-dark p-4">
                <h3 className="font-body text-xs tracking-widest uppercase text-ink-light mb-3">Customer</h3>
                <div className="grid grid-cols-2 gap-2 font-body text-sm">
                  <div><span className="text-ink-light">Name:</span> <span className="text-ink font-medium">{selected.customer?.name}</span></div>
                  <div>
                    <span className="text-ink-light">WhatsApp:</span>{' '}
                    <a
                      href={`https://wa.me/${selected.customer?.whatsapp?.replace(/\D/g,'')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-green-600 font-medium hover:underline"
                    >
                      {selected.customer?.whatsapp}
                    </a>
                  </div>
                  <div><span className="text-ink-light">City:</span> <span className="text-ink capitalize">{selected.customer?.city}</span></div>
                  <div><span className="text-ink-light">Address:</span> <span className="text-ink">{selected.customer?.address}</span></div>
                  {selected.customer?.email && (
                    <div><span className="text-ink-light">Email:</span> <span className="text-ink">{selected.customer?.email}</span></div>
                  )}
                  {selected.customer?.notes && (
                    <div className="col-span-2"><span className="text-ink-light">Notes:</span> <span className="text-ink italic">{selected.customer.notes}</span></div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-body text-xs tracking-widest uppercase text-ink-light mb-3">Items Ordered</h3>
                <div className="border border-sand-dark divide-y divide-sand-dark">
                  {selected.items?.map((item: any, i: number) => (
                    <div key={i} className="p-3 flex items-center gap-3">
                      <Package size={14} className="text-ink-light flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-ink text-sm">{item.name}</div>
                        <div className="text-xs text-ink-light">
                          Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-ink">
                        ₨{(item.price_pkr * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-sand/30 flex justify-between text-sm">
                    <span className="text-ink-light">Subtotal</span>
                    <span className="font-medium text-ink">₨{selected.subtotal_pkr?.toLocaleString()}</span>
                  </div>
                  <div className="p-3 flex justify-between text-sm">
                    <span className="text-ink-light">Shipping</span>
                    <span className="text-ink">{selected.shipping_pkr === 0 ? 'Free' : `₨${selected.shipping_pkr}`}</span>
                  </div>
                  <div className="p-3 bg-ink flex justify-between text-sm">
                    <span className="text-cream font-medium">Total</span>
                    <span className="text-gold font-bold">₨{selected.total_pkr?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Update Status + Note */}
              <div className="bg-sand/50 border border-sand-dark p-4">
                <h3 className="font-body text-xs tracking-widest uppercase text-ink-light mb-3">Update Status</h3>
                <div className="flex gap-3 items-start flex-wrap">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected._id, s)}
                      className={`text-xs px-3 py-1.5 border font-medium capitalize transition-colors ${
                        selected.status === s
                          ? 'bg-ink text-cream border-ink'
                          : 'border-sand-dark text-ink-light hover:border-ink hover:text-ink'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add a note (e.g. Called customer, package dispatched)"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="input mt-3 text-sm py-2"
                />
              </div>

              {/* Tracking */}
              <div className="border border-sand-dark p-4">
                <h3 className="font-body text-xs tracking-widest uppercase text-ink-light mb-3 flex items-center gap-2">
                  <Truck size={14} />
                  Tracking Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-admin">Courier</label>
                    <select
                      className="select"
                      value={trackingForm.courier}
                      onChange={(e) => setTrackingForm(f => ({ ...f, courier: e.target.value }))}
                    >
                      <option value="">-- Select Courier --</option>
                      <option>TCS</option>
                      <option>OCS</option>
                      <option>DHL</option>
                      <option>Aramex</option>
                      <option>Leopards</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-admin">Tracking Number</label>
                    <input
                      type="text"
                      className="input text-sm py-2"
                      placeholder="e.g. TCS-123456789"
                      value={trackingForm.trackingNumber}
                      onChange={(e) => setTrackingForm(f => ({ ...f, trackingNumber: e.target.value }))}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="label-admin">Tracking URL (optional)</label>
                    <input
                      type="url"
                      className="input text-sm py-2"
                      placeholder="https://..."
                      value={trackingForm.trackingUrl}
                      onChange={(e) => setTrackingForm(f => ({ ...f, trackingUrl: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label-admin">Est. Delivery Date</label>
                    <input
                      type="date"
                      className="input text-sm py-2"
                      value={trackingForm.estimatedDelivery}
                      onChange={(e) => setTrackingForm(f => ({ ...f, estimatedDelivery: e.target.value }))}
                    />
                  </div>
                </div>
                <button
                  onClick={saveTracking}
                  disabled={saving}
                  className="btn-primary py-2 px-5 text-sm mt-4 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save Tracking Info'}
                </button>
              </div>

              {/* Status History */}
              {selected.statusHistory?.length > 0 && (
                <div>
                  <h3 className="font-body text-xs tracking-widest uppercase text-ink-light mb-3 flex items-center gap-2">
                    <Clock size={14} />
                    Status History
                  </h3>
                  <div className="space-y-2">
                    {[...selected.statusHistory].reverse().map((h: any, i: number) => (
                      <div key={i} className="flex gap-3 items-start text-sm">
                        <div className={`text-xs px-2 py-0.5 border font-medium capitalize flex-shrink-0 ${STATUS_STYLES[h.status] || STATUS_STYLES.pending}`}>
                          {h.status}
                        </div>
                        <div className="flex-1">
                          {h.note && <div className="text-ink">{h.note}</div>}
                          <div className="text-xs text-ink-light">{new Date(h.updatedAt || h.timestamp || selected.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            <div className="px-6 py-4 border-t border-sand-dark flex justify-end">
              <button onClick={() => setSelected(null)} className="btn-outline py-2 px-5 text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
