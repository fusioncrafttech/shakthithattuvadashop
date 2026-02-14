import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GalleryItem } from '../../types';
import {
  fetchGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  uploadImage,
  STORAGE_BUCKET_GALLERY,
} from '../../lib/admin-data';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { ModalForm } from '../../components/admin/ModalForm';
import { EmptyState } from '../../components/admin/EmptyState';
import { SkeletonTableRows } from '../../components/admin/SkeletonCard';

const defaultForm = {
  type: 'image' as GalleryItem['type'],
  url: '',
  caption: '',
  sort_order: 0,
};

export function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchGallery()
      .then(setItems)
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setImageFile(null);
    setVideoFile(null);
    setModalOpen(true);
  };

  const openEdit = (g: GalleryItem) => {
    setEditing(g);
    setForm({
      type: g.type,
      url: g.url ?? '',
      caption: g.caption ?? '',
      sort_order: g.sort_order ?? 0,
    });
    setImageFile(null);
    setVideoFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let url = form.url;
      if (form.type === 'image' && imageFile) {
        url = await uploadImage(
          STORAGE_BUCKET_GALLERY,
          `/${Date.now()}-${imageFile.name}`,
          imageFile
        );
      }
      if (form.type === 'video' && videoFile) {
        url = await uploadImage(
          STORAGE_BUCKET_GALLERY,
          `/${Date.now()}-${videoFile.name}`,
          videoFile
        );
      }
      const payload = {
        type: form.type,
        url,
        caption: form.caption,
        sort_order: Number(form.sort_order) || 0,
      };
      if (editing) {
        await updateGalleryItem(editing.id, payload);
      } else {
        await createGalleryItem(payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (g: GalleryItem) => {
    if (!confirm('Remove this item from the gallery?')) return;
    try {
      await deleteGalleryItem(g.id);
      load();
    } catch (err) {
      setError(String(err));
    }
  };

  const columns: Column<GalleryItem>[] = [
    {
      key: 'preview',
      header: 'Preview',
      render: (r) =>
        r.type === 'image' ? (
          <img
            src={r.url || ''}
            alt=""
            className="h-14 w-20 rounded-xl object-cover bg-gray-100"
          />
        ) : (
          <div className="flex h-14 w-20 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        ),
    },
    { key: 'type', header: 'Type', render: (r) => <span className="capitalize font-medium">{r.type}</span> },
    {
      key: 'caption',
      header: 'Caption',
      render: (r) => <span className="text-gray-600">{r.caption || '—'}</span>,
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
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Gallery</h1>
          <p className="mt-1 text-gray-500">Photos and videos shown on the About page</p>
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
          Add Photo / Video
        </motion.button>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <SkeletonTableRows rows={5} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No gallery items yet"
          description="Add photos or videos to display on the About page."
          action={{ label: 'Add Photo / Video', onClick: openCreate }}
        />
      ) : (
        <DataTable columns={columns} data={items} keyExtractor={(r) => r.id} />
      )}

      <ModalForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Gallery Item' : 'Add Photo or Video'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as GalleryItem['type'] }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          {form.type === 'image' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Image (upload or URL)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="mb-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
              />
              <input
                type="url"
                placeholder="Or paste image URL"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {form.url && !imageFile && form.type === 'image' && (
                <img src={form.url} alt="Preview" className="mt-2 h-24 rounded-xl object-cover" />
              )}
            </div>
          )}

          {form.type === 'video' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Video (upload or URL)</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                className="mb-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
              />
              <input
                type="url"
                placeholder="Or paste YouTube, Vimeo, or direct video URL"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required={form.type === 'video' && !videoFile}
              />
              {form.url && !videoFile && (
                <p className="mt-1 text-xs text-gray-500">Preview: {form.url}</p>
              )}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Caption (optional)</label>
            <input
              type="text"
              value={form.caption}
              onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Sort order</label>
            <input
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
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
              disabled={saving || (form.type === 'image' && !form.url && !imageFile) || (form.type === 'video' && !form.url && !videoFile)}
              className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-white shadow-lg disabled:opacity-60"
            >
              {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
            </motion.button>
          </div>
        </form>
      </ModalForm>
    </motion.div>
  );
}
