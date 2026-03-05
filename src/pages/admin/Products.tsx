import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, Category } from '../../types';
import { supabase } from '../../lib/supabase';
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  STORAGE_BUCKET_PRODUCTS,
} from '../../lib/admin-data';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { ModalForm } from '../../components/admin/ModalForm';
import { EmptyState } from '../../components/admin/EmptyState';
import { SkeletonTableRows } from '../../components/admin/SkeletonCard';

const defaultForm = {
  name: '',
  description: '',
  price: 0,
  image: '',
  categoryId: '',
  stock: 0,
  isPopular: false,
  isTodaySpecial: false,
  is_featured: false,
};

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [formKey, setFormKey] = useState(0);
  
  // Filter states
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterMinPrice, setFilterMinPrice] = useState<string>('');
  const [filterMaxPrice, setFilterMaxPrice] = useState<string>('');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [filterPopular, setFilterPopular] = useState<boolean>(false);
  const [filterSpecial, setFilterSpecial] = useState<boolean>(false);
  const [filterFeatured, setFilterFeatured] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const load = () => {
    setLoading(true);
    Promise.all([fetchProducts(), fetchCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setFilteredProducts(p);
        setCategories(c);
      })
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  // Apply filters whenever products or filter criteria change
  useEffect(() => {
    let filtered = products;
    
    // Filter by search term (name)
    if (filterSearch.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(filterSearch.toLowerCase())
      );
    }
    
    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(product => product.categoryId === filterCategory);
    }
    
    // Filter by price range
    if (filterMinPrice) {
      filtered = filtered.filter(product => product.price >= Number(filterMinPrice));
    }
    if (filterMaxPrice) {
      filtered = filtered.filter(product => product.price <= Number(filterMaxPrice));
    }
    
    // Filter by flags
    if (filterPopular) {
      filtered = filtered.filter(product => product.isPopular);
    }
    if (filterSpecial) {
      filtered = filtered.filter(product => product.isTodaySpecial);
    }
    if (filterFeatured) {
      filtered = filtered.filter(product => product.is_featured);
    }
    
    setFilteredProducts(filtered);
  }, [products, filterCategory, filterMinPrice, filterMaxPrice, filterSearch, filterPopular, filterSpecial, filterFeatured]);

  const clearFilters = () => {
    setFilterCategory('');
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setFilterSearch('');
    setFilterPopular(false);
    setFilterSpecial(false);
    setFilterFeatured(false);
  };

  const hasActiveFilters = filterCategory || filterMinPrice || filterMaxPrice || filterSearch || filterPopular || filterSpecial || filterFeatured;

  const openCreate = () => {
    setEditing(null);
    setError(null);
    setCategoryOpen(false);
    setForm({ ...defaultForm, categoryId: categories[0]?.id ?? '' });
    setImageFile(null);
    imageInputRef.current && (imageInputRef.current.value = '');
    setFormKey((k) => k + 1);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setError(null);
    setCategoryOpen(false);
    setForm({
      name: p.name,
      description: p.description ?? '',
      price: p.price,
      image: p.image ?? '',
      categoryId: p.categoryId ?? '',
      stock: p.stock ?? 0,
      isPopular: p.isPopular ?? false,
      isTodaySpecial: p.isTodaySpecial ?? false,
      is_featured: p.is_featured ?? false,
    });
    setImageFile(null);
    imageInputRef.current && (imageInputRef.current.value = '');
    setFormKey((k) => k + 1);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const categoryId = (form.categoryId || '').trim();
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }
    
    // Check Supabase configuration first
    if (!supabase) {
      setError('Database not configured. Please check your Supabase configuration in .env file.');
      return;
    }
    
    setSaving(true);
    const REQUEST_TIMEOUT_MS = 60000;

    const run = async () => {
      console.log('Starting product upload process...');
      let imageUrl = (form.image || '').trim();
      
      if (imageFile) {
        console.log('Uploading image:', imageFile.name, 'Size:', imageFile.size);
        try {
          const startTime = Date.now();
          imageUrl = await uploadImage(
            STORAGE_BUCKET_PRODUCTS,
            `/${Date.now()}-${imageFile.name}`,
            imageFile
          );
          console.log('Image upload completed in:', Date.now() - startTime, 'ms');
        } catch (uploadErr) {
          console.error('Image upload error:', uploadErr);
          const msg = uploadErr instanceof Error ? uploadErr.message : String(uploadErr);
          throw new Error(`Image upload failed: ${msg}. Create without image or fix storage.`);
        }
      } else {
        console.log('No image file, using existing URL:', imageUrl);
      }
      
      console.log('Creating product payload...');
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        image: imageUrl || '',
        categoryId,
        stock: Number(form.stock) || 0,
        isPopular: form.isPopular,
        isTodaySpecial: form.isTodaySpecial,
        is_featured: form.is_featured,
      };
      
      console.log('Payload:', payload);
      return payload;
    };

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out. Check your connection and try again.')), REQUEST_TIMEOUT_MS)
    );

    try {
      console.log('Starting database operation...');
      const payload = await Promise.race([run(), timeout]);
      
      console.log('Database operation type:', editing ? 'UPDATE' : 'CREATE');
      
      if (editing) {
        console.log('Updating product with ID:', editing.id);
        await updateProduct(editing.id, payload);
        console.log('Product updated successfully');
      } else {
        console.log('Creating new product...');
        await createProduct(payload);
        console.log('Product created successfully');
      }
      
      // Create the updated/new product object
      const updatedProduct = {
        ...payload,
        id: editing?.id || `temp-${Date.now()}`,
        created_at: editing?.created_at || new Date().toISOString(),
      };
      
      console.log('Updating local state with product:', updatedProduct);
      
      // Update local state instead of reloading
      if (editing) {
        // Update existing product in state
        setProducts(prev => prev.map(p => p.id === editing.id ? updatedProduct : p));
      } else {
        // Add new product to state
        setProducts(prev => [updatedProduct, ...prev]);
      }
      
      // Reset form and close modal
      setForm({ ...defaultForm, categoryId: categories[0]?.id ?? '' });
      setImageFile(null);
      imageInputRef.current && (imageInputRef.current.value = '');
      setEditing(null);
      setError(null);
      setFormKey((k) => k + 1);
      setModalOpen(false);
      
      console.log('Product upload process completed successfully');
    } catch (err) {
      console.error('Product upload error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`Delete product "${p.name}"?`)) return;
    try {
      await deleteProduct(p.id);
      // Update local state instead of reloading
      setProducts(prev => prev.filter(product => product.id !== p.id));
    } catch (err) {
      setError(String(err));
    }
  };

  const columns: Column<Product>[] = [
    {
      key: 'image',
      header: 'Image',
      render: (r) => (
        <img
          src={r.image || ''}
          alt=""
          className="h-12 w-12 rounded-xl object-cover bg-gray-100"
        />
      ),
    },
    { key: 'name', header: 'Name', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'price', header: 'Price', render: (r) => <span className="text-primary font-semibold">₹{r.price}</span> },
    {
      key: 'category',
      header: 'Category',
      render: (r) => {
        const cat = categories.find((c) => c.id === r.categoryId);
        return <span className="text-gray-600">{cat?.name ?? '-'}</span>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => openEdit(r)}
            className="rounded-xl bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => handleDelete(r)}
            className="rounded-xl bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            Delete
          </motion.button>
        </div>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Products</h1>
          <p className="mt-1 text-gray-500">Manage products from database</p>
        </div>
        <div className="flex gap-3">
          {/* Filter Button */}
          <div ref={filterRef} className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setFilterOpen(!filterOpen)}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold shadow-lg transition-colors ${
                hasActiveFilters 
                  ? 'bg-primary text-white shadow-primary/25' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
              {hasActiveFilters && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {filteredProducts.length}
                </span>
              )}
            </motion.button>
            
            {/* Filter Dropdown */}
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-20 mt-2 w-80 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
                >
                  <div className="space-y-4">
                    {/* Search */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Search Products</label>
                      <input
                        type="text"
                        value={filterSearch}
                        onChange={(e) => setFilterSearch(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    
                    {/* Category Filter */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Price Range */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Price Range (₹)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={filterMinPrice}
                          onChange={(e) => setFilterMinPrice(e.target.value)}
                          placeholder="Min"
                          className="rounded-xl border border-gray-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={filterMaxPrice}
                          onChange={(e) => setFilterMaxPrice(e.target.value)}
                          placeholder="Max"
                          className="rounded-xl border border-gray-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    
                    {/* Flags */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Product Flags</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={filterPopular}
                            onChange={(e) => setFilterPopular(e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">Popular Only</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={filterSpecial}
                            onChange={(e) => setFilterSpecial(e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">Today Special Only</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={filterFeatured}
                            onChange={(e) => setFilterFeatured(e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-gray-700">Featured Only</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Clear All
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterOpen(false)}
                        className="flex-1 rounded-xl bg-primary px-4 py-2.5 font-semibold text-white shadow-lg"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-white shadow-lg shadow-primary/25"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </motion.button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <SkeletonTableRows rows={5} />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? "No products match your filters" : "No products yet"}
          description={hasActiveFilters ? "Try adjusting your filter criteria to see more products." : "Add products to show in your shop."}
          action={!hasActiveFilters ? { label: 'Add Product', onClick: openCreate } : { label: 'Clear Filters', onClick: clearFilters }}
        />
      ) : (
        <>
          {hasActiveFilters && (
            <div className="flex items-center justify-between rounded-2xl bg-blue-50 p-4">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-sm font-medium text-blue-900">
                  Showing {filteredProducts.length} of {products.length} products
                </span>
              </div>
              <button
                onClick={clearFilters}
                className="rounded-xl bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
              >
                Clear Filters
              </button>
            </div>
          )}
          <DataTable columns={columns} data={filteredProducts} keyExtractor={(r) => r.id} />
        </>
      )}

      <ModalForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Price (₹)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.price || ''}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) || 0 }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div ref={categoryRef}>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setCategoryOpen((o) => !o)}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-3 text-left text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                style={{ minHeight: '42px' }}
                aria-haspopup="listbox"
                aria-expanded={categoryOpen}
              >
                <span className={form.categoryId ? 'font-medium' : 'text-gray-500'}>
                  {form.categoryId ? categories.find((c) => c.id === form.categoryId)?.name ?? 'Select category' : 'Select category'}
                </span>
                <svg
                  className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${categoryOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {categoryOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    role="listbox"
                    className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
                  >
                    {categories.length === 0 ? (
                      <li className="px-4 py-3 text-sm text-gray-500">No categories. Add in Admin → Categories.</li>
                    ) : (
                      categories.map((c) => (
                        <li key={c.id} role="option" aria-selected={form.categoryId === c.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setForm((f) => ({ ...f, categoryId: c.id }));
                              setCategoryOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${
                              form.categoryId === c.id ? 'bg-primary/10 font-medium text-primary' : 'text-gray-900'
                            }`}
                          >
                            {c.name}
                          </button>
                        </li>
                      ))
                    )}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            {categories.length === 0 && (
              <p className="mt-1 text-xs text-amber-600">Add categories first in Admin → Categories.</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Image</label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
            />
            {form.image && !imageFile && (
              <img src={form.image} alt="Preview" className="mt-2 h-24 w-24 rounded-xl object-cover" />
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isPopular}
                onChange={(e) => setForm((f) => ({ ...f, isPopular: e.target.checked }))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">Popular</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isTodaySpecial}
                onChange={(e) => setForm((f) => ({ ...f, isTodaySpecial: e.target.checked }))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">Today Special</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-white shadow-lg disabled:opacity-60"
            >
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </motion.button>
          </div>
        </form>
      </ModalForm>
    </motion.div>
  );
}
