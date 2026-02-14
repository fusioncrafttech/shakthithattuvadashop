import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  fetchBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadImage,
  STORAGE_BUCKET_BANNERS,
} from '../../lib/admin-data';
import type { OfferBanner } from '../../types';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { ModalForm } from '../../components/admin/ModalForm';
import { EmptyState } from '../../components/admin/EmptyState';
import { SkeletonTableRows } from '../../components/admin/SkeletonCard';

const defaultForm = {
  title: '',
  subtitle: '',
  image: '',
  cta: '',
  redirect_url: '' as string | null,
  start_date: '' as string | null,
  end_date: '' as string | null,
  is_active: true,
};

export function AdminBanners() {
  const [banners, setBanners] = useState<OfferBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<OfferBanner | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchBanners()
      .then(setBanners)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    const today = new Date().toISOString().slice(0, 10);
    const end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    setForm({
      ...defaultForm,
      start_date: today,
      end_date: end,
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (b: OfferBanner) => {
    setEditing(b);
    setForm({
      title: b.title,
      subtitle: b.subtitle ?? '',
      image: b.image,
      cta: b.cta ?? '',
      redirect_url: b.redirect_url ?? '',
      start_date: b.start_date ?? '',
      end_date: b.end_date ?? '',
      is_active: b.is_active ?? true,
    });
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
        imageUrl = await uploadImage(
          STORAGE_BUCKET_BANNERS,
          `/${Date.now()}-${imageFile.name}`,
          imageFile
        );
      }
      const payload = {
        ...form,
        image: imageUrl,
        redirect_url: form.redirect_url || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      };
      if (editing) {
        await updateBanner(editing.id, payload);
      } else {
        await createBanner(payload as Omit<OfferBanner, 'id' | 'created_at'>);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (b: OfferBanner) => {
    if (!confirm(`Delete banner "${b.title}"?`)) return;
    try {
      await deleteBanner(b.id);
      load();
    } catch (err) {
      setError(String(err));
    }
  };

  const columns: Column<OfferBanner>[] = [
    {
      key: 'image',
      header: 'Thumbnail',
      render: (r) => (
        <div className="h-14 w-24 overflow-hidden rounded-xl border border-gray-200">
          <img src={r.image} alt="" className="h-full w-full object-cover" />
        </div>
      ),
    },
    { key: 'title', header: 'Title', render: (r) => <span className="font-medium">{r.title}</span> },
    { key: 'subtitle', header: 'Subtitle', render: (r) => <span className="text-gray-500">{r.subtitle}</span> },
    {
      key: 'dates',
      header: 'Active Period',
      render: (r) =>
        r.start_date && r.end_date
          ? `${new Date(r.start_date).toLocaleDateString()} – ${new Date(r.end_date).toLocaleDateString()}`
          : '—',
    },
    {
      key: 'is_active',
      header: 'Active',
      render: (r) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            r.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {r.is_active !== false ? 'Yes' : 'No'}
        </span>
      ),
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
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Offer Banners</h1>
          <p className="mt-1 text-gray-500">
            Banners shown on home. Only active banners with current date between start & end are displayed.
          </p>
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
          Add Banner
        </motion.button>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <SkeletonTableRows rows={4} />
      ) : banners.length === 0 ? (
        <EmptyState
          title="No banners yet"
          description="Add offer banners to show on the home page."
          action={{ label: 'Add Banner', onClick: openCreate }}
        />
      ) : (
        <DataTable columns={columns} data={banners} keyExtractor={(r) => r.id} />
      )}

      <ModalForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Banner' : 'Add Banner'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Banner Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Subtitle</label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Redirect URL</label>
            <input
              type="text"
              value={form.redirect_url ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, redirect_url: e.target.value || null }))}
              placeholder="/shop or https://..."
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={form.start_date ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value || null }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={form.end_date ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value || null }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">CTA Button Text</label>
            <input
              type="text"
              value={form.cta}
              onChange={(e) => setForm((f) => ({ ...f, cta: e.target.value }))}
              placeholder="Order Now"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#E53935] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Banner Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
            />
            {form.image && !imageFile && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={form.image}
                  alt="Preview"
                  className="h-20 w-32 rounded-xl border border-gray-200 object-cover"
                />
                <span className="text-xs text-gray-500">Thumbnail preview</span>
              </div>
            )}
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-[#E53935] focus:ring-[#E53935]"
            />
            <span className="text-sm font-medium">Active (show on site when within date range)</span>
          </label>
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
