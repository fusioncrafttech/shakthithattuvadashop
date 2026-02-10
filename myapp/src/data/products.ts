import type { Product } from '../types';

const baseUrl = 'https://images.unsplash.com';

export const products: Product[] = [
  { id: '1', name: 'Classic Thattuvada', description: 'Crispy medu vada style with our secret spice blend', price: 45, image: `https://media-assets.swiggy.com/swiggy/image/upload/f_auto,q_auto,fl_lossy/cgxaivem0cp8n56m1u1r`, categoryId: '1', isPopular: true, isTodaySpecial: true },
  { id: '2', name: 'Onion Bajji', description: 'Sliced onion fritters, golden and crunchy', price: 40, image: `${baseUrl}/photo-1639024471283-03518883512d?w=400&h=300&fit=crop`, categoryId: '2', isPopular: true },
  { id: '3', name: 'Potato Bonda', description: 'Spiced potato filling in crisp coating', price: 35, image: `${baseUrl}/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop`, categoryId: '3', isPopular: true, isTodaySpecial: true },
  { id: '4', name: 'Medu Vada', description: 'Traditional South Indian lentil donuts', price: 50, image: `${baseUrl}/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop`, categoryId: '4', isPopular: true },
  { id: '5', name: 'Veg Samosa', description: 'Triangular pastry with spiced potato filling', price: 30, image: `${baseUrl}/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop`, categoryId: '5', isTodaySpecial: true },
  { id: '6', name: 'Chilli Bajji', description: 'Green chilli fritters with tangy dip', price: 45, image: `${baseUrl}/photo-1639024471283-03518883512d?w=400&h=300&fit=crop`, categoryId: '2' },
  { id: '7', name: 'Banana Bajji', description: 'Ripe banana in besan batter', price: 40, image: `${baseUrl}/photo-1639024471283-03518883512d?w=400&h=300&fit=crop`, categoryId: '2' },
  { id: '8', name: 'Ginger Chai', description: 'Fresh ginger masala chai', price: 20, image: `${baseUrl}/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop`, categoryId: '6' },
  { id: '9', name: 'Filter Coffee', description: 'South Indian filter kaapi', price: 25, image: `${baseUrl}/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop`, categoryId: '6', isPopular: true },
  { id: '10', name: 'Mixed Pakora', description: 'Assorted vegetable fritters', price: 55, image: `${baseUrl}/photo-1604329760661-e71dc83f2a26?w=400&h=300&fit=crop`, categoryId: '1', isTodaySpecial: true },
];
