import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Category } from '../../types';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
  STORAGE_BUCKET_CATEGORIES,
} from '../../lib/admin-data';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { ModalForm } from '../../components/admin/ModalForm';
import { EmptyState } from '../../components/admin/EmptyState';
import { SkeletonTableRows } from '../../components/admin/SkeletonCard';

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchCategories()
      .then(setCategories)
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', slug: '', image: '' });
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, image: c.image });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let imageUrl = form.image;
      if (imageFile) {
        imageUrl = await uploadImage(STORAGE_BUCKET_CATEGORIES, `/${Date.now()}-${imageFile.name}`, imageFile);
      }
      if (editing) {
        await updateCategory(editing.id, { ...form, image: imageUrl });
      } else {
        await createCategory({ ...form, slug: form.slug || slugify(form.name), image: imageUrl });
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Category) => {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    try {
      await deleteCategory(c.id);
      load();
    } catch (err) {
      setError(String(err));
    }
  };

  const columns: Column<Category>[] = [
    {
      key: 'image',
      header: 'Image',
      render: (r) => (
        <img src={r.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
      ),
    },
    { key: 'name', header: 'Name', render: (r) => <span className="font-medium">{r.name}</span> },
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
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Categories</h1>
          <p className="mt-1 text-gray-500">Manage product categories</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#E53935] px-5 py-3 font-semibold text-white shadow-lg shadow-[#E53935]/25"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </motion.button>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <SkeletonTableRows rows={5} />
      ) : categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Add categories to organize your products."
          action={{ label: 'Add Category', onClick: openCreate }}
        />
      ) : (
        <DataTable columns={columns} data={categories} keyExtractor={(r) => r.id} />
      )}

      <ModalForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value, slug: f.slug || slugify(e.target.value) }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
              placeholder="auto-generated from name"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
            />
            {form.image && !imageFile && (
              <img src={form.image} alt="Preview" className="mt-2 h-24 w-24 rounded-xl object-cover" />
            )}
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
              className="rounded-xl bg-[#E53935] px-5 py-2.5 font-semibold text-white shadow-lg disabled:opacity-60"
            >
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </motion.button>
          </div>
        </form>
      </ModalForm>
    </motion.div>
  );
}
