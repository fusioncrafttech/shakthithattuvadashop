import { useEffect } from 'react';
import { motion } from 'framer-motion';

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

const images = [
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1604329760661-e71dc83f2a26?w=400&h=300&fit=crop',
];

export function About() {
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i }}
            className="overflow-hidden rounded-2xl shadow-lg"
          >
            <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
