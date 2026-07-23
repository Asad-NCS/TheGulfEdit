'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import ProductCard, { type Product } from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ProductSkeleton';

const CATEGORIES = ['women', 'men', 'kids'];
const BRANDS     = ['Splash', 'Max', 'R&B'];
const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '26', '28', '30', '32', '34', '36', '38', '2Y', '4Y', '6Y', '8Y', '10Y', '12Y'];
const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'price_asc',      label: 'Price: Low → High' },
  { value: 'price_desc',     label: 'Price: High → Low' },
];

interface FilterSection {
  key: string;
  label: string;
  options: string[];
}

const FILTER_SECTIONS: FilterSection[] = [
  { key: 'category', label: 'Category', options: CATEGORIES },
  { key: 'brand',    label: 'Brand',    options: BRANDS },
  { key: 'size',     label: 'Size',     options: SIZES },
];

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>}>
      <ShopPageContent />
    </Suspense>
  );
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  // Active filters
  const [category,    setCategory]    = useState(searchParams.get('category') || '');
  const [brand,       setBrand]       = useState(searchParams.get('brand')    || '');
  const [size,        setSize]        = useState(searchParams.get('size')     || '');
  const [sort,        setSort]        = useState(searchParams.get('sort')     || 'createdAt_desc');
  const [minPrice,    setMinPrice]    = useState(searchParams.get('minPrice') || '');
  const [maxPrice,    setMaxPrice]    = useState(searchParams.get('maxPrice') || '');
  const [search,      setSearch]      = useState(searchParams.get('search')   || '');
  const [page,        setPage]        = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data state
  const [products,   setProducts]    = useState<Product[]>([]);
  const [total,      setTotal]       = useState(0);
  const [totalPages, setTotalPages]  = useState(1);
  const [loading,    setLoading]     = useState(true);

  // Collapsed sections
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (brand)    params.set('brand', brand);
      if (size)     params.set('size', size);
      if (sort)     params.set('sort', sort);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (search)   params.set('search', search);
      params.set('page',  String(page));
      params.set('limit', '12');

      const res  = await fetch(`/api/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, brand, size, sort, minPrice, maxPrice, search, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [category, brand, size, sort, minPrice, maxPrice, search]);

  const clearAll = () => {
    setCategory(''); setBrand(''); setSize('');
    setMinPrice(''); setMaxPrice(''); setSort('createdAt_desc'); setSearch('');
    router.replace('/shop');
  };

  const hasFilters = !!(category || brand || size || minPrice || maxPrice || search);

  const toggleSection = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Filter Sidebar (shared markup) ────────────────────────────────────────
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs font-body text-accent hover:text-ink transition-colors"
        >
          <X size={12} strokeWidth={2} /> Clear all filters
        </button>
      )}

      {/* Filter sections */}
      {FILTER_SECTIONS.map(({ key, label, options }) => (
        <div key={key} className="border-b border-sand-dark pb-5">
          <button
            onClick={() => toggleSection(key)}
            className="flex items-center justify-between w-full mb-3 font-body text-xs tracking-[0.15em] uppercase text-ink-light hover:text-ink transition-colors"
          >
            {label}
            {collapsed[key] ? <ChevronDown size={14} strokeWidth={1.5} /> : <ChevronUp size={14} strokeWidth={1.5} />}
          </button>
          {!collapsed[key] && (
            <div className="flex flex-wrap gap-2">
              {options.map((opt) => {
                const state = key === 'category' ? category : key === 'brand' ? brand : size;
                const setter = key === 'category' ? setCategory : key === 'brand' ? setBrand : setSize;
                const active = state === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setter(active ? '' : opt)}
                    className={`text-xs font-body px-2.5 py-1.5 border transition-all duration-150 ${
                      active
                        ? 'bg-ink text-cream border-ink'
                        : 'border-sand-dark text-ink-light hover:border-ink hover:text-ink'
                    }`}
                  >
                    {opt === 'women' ? 'Women' : opt === 'men' ? 'Men' : opt === 'kids' ? 'Kids' : opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Price range */}
      <div>
        <p className="font-body text-xs tracking-[0.15em] uppercase text-ink-light mb-3">Price (₨)</p>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input text-xs py-2 px-3 w-full"
          />
          <span className="text-ink-light text-xs">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input text-xs py-2 px-3 w-full"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="mb-10">
        <span className="section-label block mb-2">{search ? 'Search Results' : 'Explore'}</span>
        <h1 className="section-heading">
          {search
            ? `"${search}"`
            : category
            ? category.charAt(0).toUpperCase() + category.slice(1)
            : 'All Products'}
        </h1>
        {total > 0 && !loading && (
          <p className="font-body text-sm text-ink-light mt-1">{total} item{total !== 1 ? 's' : ''}</p>
        )}
      </div>

      <div className="flex gap-10">
        {/* ── Sidebar (desktop) ──────────────────────────────────────────── */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="font-body text-xs tracking-[0.2em] uppercase text-ink mb-6 pb-3 border-b border-sand-dark">
              Filter
            </h2>
            <FilterContent />
          </div>
        </aside>

        {/* ── Main Content ───────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-sand-dark">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden btn-ghost flex items-center gap-2 text-sm"
            >
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              Filter
              {hasFilters && (
                <span className="bg-gold text-ink text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  {[category, brand, size, minPrice, maxPrice].filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Active filters (desktop pill display) */}
            <div className="hidden lg:flex flex-wrap gap-2">
              {[
                category && { label: category, clear: () => setCategory('') },
                brand    && { label: brand,    clear: () => setBrand('') },
                size     && { label: size,     clear: () => setSize('') },
                search   && { label: `"${search}"`, clear: () => setSearch('') },
              ].filter(Boolean).map((f: unknown) => {
                const filter = f as { label: string; clear: () => void };
                return (
                  <button
                    key={filter.label}
                    onClick={filter.clear}
                    className="flex items-center gap-1.5 text-xs font-body px-3 py-1.5
                               bg-sand-dark text-ink hover:bg-ink hover:text-cream transition-colors"
                  >
                    {filter.label} <X size={11} strokeWidth={2} />
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <div className="ml-auto flex items-center gap-3">
              <label className="font-body text-xs text-ink-light hidden sm:block">Sort:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="select text-xs py-2 w-44 pr-8"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Product grid */}
          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-ink-light mb-3">No products found</p>
              <p className="font-body text-sm text-ink-light/60 mb-6">Try adjusting your filters.</p>
              <button onClick={clearAll} className="btn-outline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost text-sm disabled:opacity-30"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 text-sm font-body border transition-colors ${
                    p === page
                      ? 'bg-ink text-cream border-ink'
                      : 'border-sand-dark text-ink-light hover:border-ink hover:text-ink'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-ghost text-sm disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Filter Drawer ──────────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-cream overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-sand-dark">
              <span className="font-display text-lg">Filters</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-6">
              <FilterContent />
            </div>
            <div className="sticky bottom-0 p-6 border-t border-sand-dark bg-cream">
              <button onClick={() => setSidebarOpen(false)} className="btn-primary w-full">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
