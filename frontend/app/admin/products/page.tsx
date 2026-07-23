'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Search, X, Save, Upload, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductSize { size: string; stock: number; }
interface ProductColor { name: string; hex: string; }

interface ProductData {
  _id?: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  price_pkr: number | string;
  compare_price_pkr: number | string;
  images: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
  material: string;
  care_instructions: string;
  tags: string;
  featured: boolean;
  active: boolean;
}

const EMPTY_PRODUCT: ProductData = {
  name: '', slug: '', brand: 'Splash', category: 'women', subcategory: '',
  description: '', price_pkr: '', compare_price_pkr: '',
  images: [''],
  sizes: [{ size: 'S', stock: 0 }, { size: 'M', stock: 0 }, { size: 'L', stock: 0 }],
  colors: [{ name: 'Black', hex: '#000000' }],
  material: '', care_instructions: '', tags: '',
  featured: false, active: true,
};

const BRANDS = ['Splash', 'Max', 'R&B'];
const CATEGORIES = ['women', 'men', 'kids'];
const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2Y', '4Y', '6Y', '8Y', '10Y', '12Y', '26', '28', '30', '32', '34', '36', '38'];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminProducts() {
  const [products, setProducts]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm]           = useState<ProductData>(EMPTY_PRODUCT);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState<number | null>(null); // index of image being uploaded
  const [activeTab, setActiveTab] = useState<'basic'|'inventory'|'media'>('basic');
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const res  = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openNew = () => {
    setForm(EMPTY_PRODUCT);
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const openEdit = (p: any) => {
    setForm({
      ...EMPTY_PRODUCT,
      ...p,
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
      price_pkr: p.price_pkr ?? '',
      compare_price_pkr: p.compare_price_pkr ?? '',
      images: p.images?.length ? p.images : [''],
      sizes: p.sizes?.length ? p.sizes : EMPTY_PRODUCT.sizes,
      colors: p.colors?.length ? p.colors : EMPTY_PRODUCT.colors,
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res  = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { toast.success('Product deleted'); fetchProducts(); }
      else toast.error(data.message);
    } catch { toast.error('Delete failed'); }
  };

  // ── Form helpers ──
  const setField = (key: keyof ProductData, val: any) =>
    setForm((f) => ({ ...f, [key]: val }));

  const autoSlug = (name: string) => {
    const s = slugify(name + '-' + form.brand);
    setForm((f) => ({ ...f, name, slug: s }));
  };

  // Sizes
  const toggleSize = (size: string) => {
    setForm((f) => {
      const exists = f.sizes.find((s) => s.size === size);
      if (exists) return { ...f, sizes: f.sizes.filter((s) => s.size !== size) };
      return { ...f, sizes: [...f.sizes, { size, stock: 10 }] };
    });
  };
  const setStock = (size: string, stock: number) =>
    setForm((f) => ({ ...f, sizes: f.sizes.map((s) => s.size === size ? { ...s, stock } : s) }));

  // Colors
  const addColor = () => setForm((f) => ({ ...f, colors: [...f.colors, { name: '', hex: '#C4953A' }] }));
  const removeColor = (i: number) => setForm((f) => ({ ...f, colors: f.colors.filter((_, ci) => ci !== i) }));
  const setColor = (i: number, field: 'name' | 'hex', val: string) =>
    setForm((f) => ({ ...f, colors: f.colors.map((c, ci) => ci === i ? { ...c, [field]: val } : c) }));

  // Images
  const setImage = (i: number, val: string) =>
    setForm((f) => ({ ...f, images: f.images.map((img, ii) => ii === i ? val : img) }));
  const addImage  = () => setForm((f) => ({ ...f, images: [...f.images, ''] }));
  const removeImg = (i: number) => setForm((f) => ({ ...f, images: f.images.filter((_, ii) => ii !== i) }));

  // Upload image file to Cloudinary via API
  const handleImageUpload = async (i: number, file: File) => {
    setUploading(i);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setImage(i, data.url);
        toast.success('Image uploaded!');
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch {
      toast.error('Upload failed. Check your Cloudinary settings.');
    } finally {
      setUploading(null);
    }
  };

  // Save
  const handleSave = async () => {
    if (!form.name || !form.price_pkr || !form.brand || !form.category) {
      toast.error('Name, price, brand and category are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name + '-' + form.brand),
        price_pkr: Number(form.price_pkr),
        compare_price_pkr: form.compare_price_pkr ? Number(form.compare_price_pkr) : undefined,
        images: form.images.filter(Boolean),
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };

      const url    = form._id ? `/api/admin/products/${form._id}` : '/api/admin/products';
      const method = form._id ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(form._id ? 'Product updated!' : 'Product created!');
        setIsModalOpen(false);
        fetchProducts();
      } else {
        toast.error(data.message || 'Save failed');
      }
    } catch { toast.error('Something went wrong'); }
    finally { setSaving(false); }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="font-display text-3xl text-ink">Products</h1>
        <button onClick={openNew} className="btn-primary py-2 px-5 text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-cream border border-sand-dark">
        <div className="p-4 border-b border-sand-dark flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
            <input
              type="text"
              placeholder="Filter by category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 py-2 text-sm"
            />
          </div>
          <span className="font-body text-xs text-ink-light">{products.length} products</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sand border-b border-sand-dark font-body text-[11px] tracking-wider uppercase text-ink-light">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Brand / Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Featured</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm divide-y divide-sand-dark">
              {loading ? (
                <tr><td colSpan={6} className="p-10 text-center text-ink-light">Loading…</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="p-10 text-center text-ink-light">No products found.</td></tr>
              ) : products.map((p) => (
                <tr key={p._id} className="hover:bg-sand/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 bg-sand-dark flex-shrink-0 overflow-hidden">
                        {p.images?.[0]
                          ? <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                          : <div className="w-full h-full flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-light/30">
                                <rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                              </svg>
                            </div>
                        }
                      </div>
                      <span className="font-medium text-ink line-clamp-2 max-w-[160px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-ink-light">
                    {p.brand}<br/>
                    <span className="text-xs capitalize">{p.category}</span>
                  </td>
                  <td className="p-4">
                    <div className="text-ink font-medium">₨{p.price_pkr?.toLocaleString()}</div>
                    {p.compare_price_pkr && (
                      <div className="text-[11px] text-ink-light/50 line-through">₨{p.compare_price_pkr?.toLocaleString()}</div>
                    )}
                  </td>
                  <td className="p-4 text-ink-light">
                    {p.sizes?.reduce((sum: number, s: any) => sum + s.stock, 0) ?? 0} units
                  </td>
                  <td className="p-4">
                    {p.featured ? (
                      <Star size={14} className="text-gold fill-gold" />
                    ) : (
                      <span className="text-ink-light/30">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 text-ink-light hover:text-gold transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 text-ink-light hover:text-accent transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-sand-dark flex justify-between items-center">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline py-1 px-3 text-sm disabled:opacity-40">← Prev</button>
            <span className="font-body text-sm text-ink-light">Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-outline py-1 px-3 text-sm disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>

      {/* ── PRODUCT FORM MODAL ──────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-ink/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-cream w-full max-w-3xl border border-sand-dark shadow-2xl my-8">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-sand-dark">
              <h2 className="font-display text-2xl text-ink">
                {form._id ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-ink-light hover:text-ink p-1">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-sand-dark">
              {(['basic', 'inventory', 'media'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-body text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-gold text-gold font-medium'
                      : 'text-ink-light hover:text-ink'
                  }`}
                >
                  {tab === 'basic' ? 'Basic Info' : tab === 'inventory' ? 'Sizes & Colors' : 'Images & Tags'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6 space-y-5">

              {/* ── BASIC TAB ── */}
              {activeTab === 'basic' && (
                <>
                  {/* Name */}
                  <div>
                    <label className="label-admin">Product Name *</label>
                    <input
                      className="input"
                      placeholder="e.g. Floral Midi Dress"
                      value={form.name}
                      onChange={(e) => autoSlug(e.target.value)}
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="label-admin">Slug (URL)</label>
                    <input
                      className="input font-mono text-sm"
                      value={form.slug}
                      onChange={(e) => setField('slug', slugify(e.target.value))}
                    />
                    <p className="font-body text-[11px] text-ink-light/60 mt-1">Auto-generated from name. Edit if needed.</p>
                  </div>

                  {/* Brand + Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-admin">Brand *</label>
                      <select className="select" value={form.brand} onChange={(e) => setField('brand', e.target.value)}>
                        {BRANDS.map((b) => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label-admin">Category *</label>
                      <select className="select" value={form.category} onChange={(e) => setField('category', e.target.value)}>
                        {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Subcategory */}
                  <div>
                    <label className="label-admin">Subcategory</label>
                    <input
                      className="input"
                      placeholder="e.g. Dresses, Trousers, T-Shirts"
                      value={form.subcategory}
                      onChange={(e) => setField('subcategory', e.target.value)}
                    />
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-admin">Price (₨) *</label>
                      <input
                        type="number"
                        className="input"
                        placeholder="e.g. 5500"
                        value={form.price_pkr}
                        onChange={(e) => setField('price_pkr', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label-admin">Compare at Price (₨) — for Sale badge</label>
                      <input
                        type="number"
                        className="input"
                        placeholder="e.g. 7000 (original)"
                        value={form.compare_price_pkr}
                        onChange={(e) => setField('compare_price_pkr', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="label-admin">Description</label>
                    <textarea
                      className="input min-h-[90px] resize-y"
                      placeholder="Describe the product, fabric, fit, occasion…"
                      value={form.description}
                      onChange={(e) => setField('description', e.target.value)}
                    />
                  </div>

                  {/* Material + Care */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-admin">Material</label>
                      <input className="input" placeholder="e.g. 100% Cotton" value={form.material} onChange={(e) => setField('material', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-admin">Care Instructions</label>
                      <input className="input" placeholder="e.g. Machine wash cold" value={form.care_instructions} onChange={(e) => setField('care_instructions', e.target.value)} />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setField('featured', e.target.checked)}
                        className="w-4 h-4 accent-gold"
                      />
                      <span className="font-body text-sm text-ink">Featured on homepage</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.active !== false}
                        onChange={(e) => setField('active', e.target.checked)}
                        className="w-4 h-4 accent-gold"
                      />
                      <span className="font-body text-sm text-ink">Active (visible in shop)</span>
                    </label>
                  </div>
                </>
              )}

              {/* ── INVENTORY TAB ── */}
              {activeTab === 'inventory' && (
                <>
                  {/* Sizes */}
                  <div>
                    <label className="label-admin mb-3">Sizes & Stock</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {PRESET_SIZES.map((size) => {
                        const active = form.sizes.find((s) => s.size === size);
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`font-body text-xs px-3 py-1.5 border transition-all ${
                              active
                                ? 'bg-ink text-cream border-ink'
                                : 'border-sand-dark text-ink-light hover:border-ink hover:text-ink'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>

                    {form.sizes.length > 0 && (
                      <div className="border border-sand-dark divide-y divide-sand-dark">
                        {form.sizes.map((s) => (
                          <div key={s.size} className="flex items-center gap-4 p-3">
                            <span className="font-body text-sm font-medium text-ink w-10">{s.size}</span>
                            <div className="flex items-center gap-2 flex-1">
                              <label className="font-body text-xs text-ink-light">Stock:</label>
                              <input
                                type="number"
                                min={0}
                                value={s.stock}
                                onChange={(e) => setStock(s.size, Number(e.target.value))}
                                className="input py-1 px-2 text-sm w-24"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleSize(s.size)}
                              className="text-ink-light/40 hover:text-accent p-1"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Colors */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="label-admin">Colors</label>
                      <button type="button" onClick={addColor} className="btn-ghost text-xs gap-1">
                        <Plus size={12} /> Add Color
                      </button>
                    </div>
                    <div className="space-y-2">
                      {form.colors.map((c, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 border border-sand-dark">
                          <input
                            type="color"
                            value={c.hex}
                            onChange={(e) => setColor(i, 'hex', e.target.value)}
                            className="w-9 h-9 rounded-none border border-sand-dark cursor-pointer"
                          />
                          <input
                            type="text"
                            value={c.name}
                            onChange={(e) => setColor(i, 'name', e.target.value)}
                            placeholder="Color name (e.g. Black)"
                            className="input py-1.5 text-sm flex-1"
                          />
                          <span className="font-mono text-xs text-ink-light">{c.hex}</span>
                          <button type="button" onClick={() => removeColor(i)} className="text-ink-light/40 hover:text-accent p-1">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── MEDIA TAB ── */}
              {activeTab === 'media' && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="label-admin">Product Images</label>
                      <button type="button" onClick={addImage} className="btn-ghost text-xs gap-1">
                        <Plus size={12} /> Add Image Slot
                      </button>
                    </div>

                    <div className="bg-sand/50 border border-sand-dark p-4 mb-4 rounded">
                      <p className="font-body text-xs text-ink-light leading-relaxed">
                        <strong>Upload images directly</strong> using the button below — they&apos;ll be saved to Cloudinary automatically. Or paste a direct image URL.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {form.images.map((img, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          {/* Hidden file input */}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={(el) => { fileInputRefs.current[i] = el; }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(i, file);
                              e.target.value = '';
                            }}
                          />
                          <div className="relative w-16 h-20 bg-sand-dark flex-shrink-0 border border-sand-dark overflow-hidden">
                            {img ? (
                              <Image src={img} alt="preview" fill className="object-cover" onError={() => {}} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                {uploading === i ? (
                                  <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Upload size={16} className="text-ink-light/30" />
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex gap-2 mb-1">
                              <input
                                type="url"
                                value={img}
                                onChange={(e) => setImage(i, e.target.value)}
                                placeholder="Paste URL or upload a file →"
                                className="input text-sm py-2 flex-1"
                              />
                              <button
                                type="button"
                                disabled={uploading !== null}
                                onClick={() => fileInputRefs.current[i]?.click()}
                                className="btn-outline py-2 px-3 text-xs whitespace-nowrap disabled:opacity-50"
                                title="Upload image file"
                              >
                                {uploading === i ? 'Uploading…' : <><Upload size={13} /> Upload</>}
                              </button>
                            </div>
                            <p className="font-body text-[10px] text-ink-light/50">
                              {i === 0 ? 'Main image (shown first)' : 'Additional image'}
                            </p>
                          </div>
                          {form.images.length > 1 && (
                            <button type="button" onClick={() => removeImg(i)} className="text-ink-light/40 hover:text-accent p-2 mt-1">
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="label-admin">Tags</label>
                    <input
                      className="input"
                      placeholder="new, sale, trending, summer (comma-separated)"
                      value={form.tags}
                      onChange={(e) => setField('tags', e.target.value)}
                    />
                    <p className="font-body text-[11px] text-ink-light/60 mt-1">Use &apos;new&apos; to show the NEW badge on the product card.</p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-sand-dark bg-sand/30">
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost text-sm">
                Cancel
              </button>
              <div className="flex gap-3">
                {activeTab !== 'basic' && (
                  <button
                    onClick={() => setActiveTab(activeTab === 'media' ? 'inventory' : 'basic')}
                    className="btn-outline py-2 px-4 text-sm"
                  >
                    ← Back
                  </button>
                )}
                {activeTab !== 'media' ? (
                  <button
                    onClick={() => setActiveTab(activeTab === 'basic' ? 'inventory' : 'media')}
                    className="btn-primary py-2 px-5 text-sm"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary py-2 px-6 text-sm disabled:opacity-60"
                  >
                    <Save size={14} />
                    {saving ? 'Saving…' : form._id ? 'Update Product' : 'Create Product'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
