import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { GalleryItem } from '../types';
import { fetchGallery } from '../lib/admin-data';

const SEO_TITLE = 'Shakthi Thattuvadaset Corner | Best Thattu Vadai Set & Traditional Snacks Since 1996';
const SEO_DESCRIPTION =
  'Shakthi Thattuvadaset Corner is a popular traditional snack shop since 1996 serving fresh thattu vadai set, vadas, and South Indian evening snacks with authentic taste and quality ingredients.';

const story = `Shakthi Thattuvadaset Corner is one of the most loved traditional snack shops serving fresh and tasty South Indian snacks since 1996. Known for its authentic thattu vadai set, crispy vadas, and evening snack varieties, our shop has become a popular destination for snack lovers looking for quality and taste.

Located in Tamil Nadu, Shakthi Thattuvadaset Corner is famous for preparing hot and fresh snacks using high-quality ingredients, traditional recipes, and hygienic cooking methods. Our focus is to deliver authentic street-style snack flavors while maintaining modern food safety standards.

For more than two decades, we have built strong customer trust by providing consistent taste, affordable pricing, and quick service. Whether you are looking for evening snacks, takeaway snacks, or traditional South Indian street food, Shakthi Thattuvadaset Corner is a trusted choice for families, students, and working professionals.

We are committed to preserving traditional snack culture while providing a fast, clean, and satisfying food experience for every customer who visits us.`;

const promises = [
  { title: 'Fresh Daily', desc: 'Prepared fresh every morning, no leftover batches.' },
  { title: 'No Compromise', desc: 'Traditional recipes, no shortcuts on taste.' },
  { title: 'Hygiene First', desc: 'Clean kitchen, safe packaging, contactless delivery.' },
];

function isYouTubeOrVimeo(url: string): boolean {
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url || '');
}

function getYouTubeEmbedUrl(url: string): string | null {
  const u = (url || '').trim();
  if (!u) return null;
  // Extract video ID from: watch?v=ID, youtu.be/ID, embed/ID, v/ID, shorts/ID (handles m.youtube, www, youtube-nocookie)
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/i,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/i,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/i,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]+)/i,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/i,
  ];
  for (const re of patterns) {
    const m = u.match(re);
    if (m) return `https://www.youtube.com/embed/${m[1]}`;
  }
  return null;
}

function getEmbedUrl(url: string): string {
  const u = (url || '').trim();
  const yt = getYouTubeEmbedUrl(u);
  if (yt) return yt;
  const vimeoMatch = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return u;
}

export function About() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetchGallery().then(setGallery).catch(() => setGallery([]));
  }, []);

  useEffect(() => {
    document.title = SEO_TITLE;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', SEO_DESCRIPTION);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = SEO_DESCRIPTION;
      document.head.appendChild(meta);
    }
    return () => {
      document.title = 'Shakthi Thattuvadaset Corner | Order Food Online';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl px-4 py-8 md:py-16"
    >
      <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Our Story</h1>
      <p className="mb-12 whitespace-pre-line text-gray-600 leading-relaxed md:text-lg">
        {story}
      </p>

      <h2 className="mb-8 text-2xl font-bold text-gray-900">Our Promise</h2>
      <div className="mb-16 grid gap-6 md:grid-cols-3">
        {promises.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white p-6 shadow-lg"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFD54F] text-[#C62828]">
              <span className="text-xl">✓</span>
            </div>
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="mb-6 text-2xl font-bold text-gray-900">Gallery</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No gallery items yet. Check back later.</p>
        ) : (
          gallery.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              className="overflow-hidden rounded-2xl shadow-lg"
            >
              {item.type === 'image' ? (
                <div>
                  <img
                    src={item.url}
                    alt={item.caption || 'Gallery'}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  {item.caption && (
                    <p className="bg-gray-50 px-4 py-2 text-sm text-gray-600">{item.caption}</p>
                  )}
                </div>
              ) : (
                <div>
                  {!item.url?.trim() ? (
                    <div className="flex aspect-video w-full items-center justify-center rounded-t-2xl bg-gray-200 text-gray-500">
                      <span className="text-sm">No video URL</span>
                    </div>
                  ) : isYouTubeOrVimeo(item.url) ? (
                    <div className="relative aspect-video w-full min-h-[200px] bg-black">
                      <iframe
                        src={getEmbedUrl(item.url)}
                        title={item.caption || 'Video'}
                        width="100%"
                        height="100%"
                        className="absolute inset-0 h-full w-full rounded-t-2xl"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        frameBorder={0}
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                  ) : (
                    <video
                      src={item.url}
                      controls
                      preload="metadata"
                      playsInline
                      className="aspect-video w-full object-cover bg-gray-900"
                      poster=""
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {item.caption && (
                    <p className="bg-gray-50 px-4 py-2 text-sm text-gray-600">{item.caption}</p>
                  )}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
