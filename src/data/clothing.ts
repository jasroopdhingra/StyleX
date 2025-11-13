export type ClothingItem = {
  id: number;
  name: string;
  description: string;
  image: string;
  tags: string[];
  price: string;
};

export const clothingDatabase: ClothingItem[] = [
  {
    id: 1,
    name: 'Coastal Linen Set',
    description: 'Lightweight linen button-up paired with relaxed trousers for breezy days.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop',
    tags: ['coastal', 'grandma', 'linen', 'set', 'breezy'],
    price: '$168'
  },
  {
    id: 2,
    name: 'Minimalist Denim',
    description: 'Clean-cut denim jacket layered over a ribbed neutral tee for effortless style.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&auto=format&fit=crop',
    tags: ['minimalist', 'denim', 'casual', 'neutral'],
    price: '$142'
  },
  {
    id: 3,
    name: 'Boho Prairie Dress',
    description: 'Floral midi dress with a fitted waist and soft sleeves inspired by boho escapes.',
    image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500&auto=format&fit=crop',
    tags: ['boho', 'dress', 'floral', 'vacation'],
    price: '$210'
  },
  {
    id: 4,
    name: 'City Streetwear',
    description: 'Oversized bomber, monochrome tee, and structured cargos for modern streetwear.',
    image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=500&auto=format&fit=crop',
    tags: ['urban', 'street', 'cargos', 'bomber'],
    price: '$185'
  },
  {
    id: 5,
    name: 'Soft Knit Essentials',
    description: 'Muted knit sweater and wool skirt combo that nails office casual elegance.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop',
    tags: ['office', 'casual', 'knit', 'sweater'],
    price: '$156'
  },
  {
    id: 6,
    name: 'Retro Night Out',
    description: 'Satin slip dress with cropped moto jacket inspired by 90s nightlife.',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format&fit=crop',
    tags: ['retro', 'night', 'moto', 'satin'],
    price: '$220'
  },
  {
    id: 7,
    name: 'Desert Wanderer',
    description: 'Utility vest layered over soft earth-tone basics made for adventurous spirits.',
    image: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=500&auto=format&fit=crop',
    tags: ['utility', 'earthy', 'adventure', 'vest'],
    price: '$198'
  },
  {
    id: 8,
    name: 'Monochrome Power Suit',
    description: 'Structured blazer and wide-leg trousers with sculptural accessories for bold offices.',
    image: 'https://images.unsplash.com/photo-1521572167114-7775471bda25?w=500&auto=format&fit=crop',
    tags: ['suit', 'work', 'tailored', 'minimal'],
    price: '$245'
  }
];
