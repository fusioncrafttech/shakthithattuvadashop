import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, Category } from '../../types';
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const load = () => {
    setLoading(true);
    Promise.all([fetchProducts(), fetchCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

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
    setSaving(true);
    const REQUEST_TIMEOUT_MS = 25000;

    const run = async () => {
      let imageUrl = (form.image || '').trim();
      if (imageFile) {
        try {
          imageUrl = await uploadImage(
            STORAGE_BUCKET_PRODUCTS,
            `/${Date.now()}-${imageFile.name}`,
            imageFile
          );
        } catch (uploadErr) {
          const msg = uploadErr instanceof Error ? uploadErr.message : String(uploadErr);
          throw new Error(`Image upload failed: ${msg}. Create without image or fix storage.`);
        }
      }
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
      if (editing) {
        await updateProduct(editing.id, payload);
      } else {
        await createProduct(payload);
      }
    };

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out. Check your connection and try again.')), REQUEST_TIMEOUT_MS)
    );

    try {
      await Promise.race([run(), timeout]);
      setForm({ ...defaultForm, categoryId: categories[0]?.id ?? '' });
      setImageFile(null);
      imageInputRef.current && (imageInputRef.current.value = '');
      setEditing(null);
      setError(null);
      setFormKey((k) => k + 1);
      setModalOpen(false);
      load();
    } catch (err) {
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
      load();
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

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <SkeletonTableRows rows={5} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Add products to show in your shop."
          action={{ label: 'Add Product', onClick: openCreate }}
        />
      ) : (
        <DataTable columns={columns} data={products} keyExtractor={(r) => r.id} />
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
