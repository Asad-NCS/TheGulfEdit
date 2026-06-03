'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/products?page=${page}&limit=20${search ? `&category=${search}` : ''}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API}/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Product deleted');
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  // Very simplified product form for this example
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="font-display text-3xl text-ink">Products</h1>
        <button 
          onClick={() => { setEditingId(null); setIsModalOpen(true); }}
          className="btn-primary py-2 px-4"
        >
          <Plus size={16} className="mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-cream border border-sand-dark mb-6">
        <div className="p-4 border-b border-sand-dark flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
            <input 
              type="text" 
              placeholder="Search by category..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10 py-2 w-full text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sand border-b border-sand-dark font-body text-xs tracking-wider uppercase text-ink-light">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category / Brand</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm divide-y divide-sand-dark">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-ink-light">No products found.</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-sand/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 bg-sand-dark flex-shrink-0">
                          {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" />}
                        </div>
                        <span className="font-medium text-ink line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-ink-light">{p.category} <br/><span className="text-xs">{p.brand}</span></td>
                    <td className="p-4 text-ink">₨{p.price_pkr.toLocaleString()}</td>
                    <td className="p-4 text-ink-light">
                      {p.sizes.reduce((sum: number, s: any) => sum + s.stock, 0)} total
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-ink-light hover:text-ink"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(p._id)} className="p-2 text-accent hover:text-red-700"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-sand-dark flex justify-between items-center">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline py-1 px-3 text-sm disabled:opacity-50">Prev</button>
          <span className="font-body text-sm text-ink-light">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-outline py-1 px-3 text-sm disabled:opacity-50">Next</button>
        </div>
      </div>

      {/* Product Form Modal Placeholder */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
          <div className="bg-cream p-6 w-full max-w-2xl border border-sand-dark shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-ink-light hover:text-ink">
              <X size={20} />
            </button>
            <h2 className="font-display text-2xl mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="font-body text-sm text-ink-light mb-6">Product form implementation goes here.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="btn-outline py-2 px-4">Cancel</button>
              <button className="btn-primary py-2 px-4">Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
