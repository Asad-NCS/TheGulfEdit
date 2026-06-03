/**
 * seed.js — Populates MongoDB with 12 sample products
 * Run: node seed.js
 *
 * Products:
 *   4 Women: 2 Splash, 1 Max, 1 R&B
 *   4 Men:   2 Max, 1 Splash, 1 R&B
 *   4 Kids:  4 Max
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const Product = require('./models/Product');

// picsum.photos gives stable image URLs by seed ID
const img = (id, w = 600, h = 800) =>
  `https://picsum.photos/seed/${id}/${w}/${h}`;

const products = [
  // ══════════════════════════════════════════════════════════
  // WOMEN — Splash (2)
  // ══════════════════════════════════════════════════════════
  {
    slug: 'splash-womens-floral-midi-dress',
    name: 'Floral Midi Dress',
    brand: 'Splash',
    category: 'women',
    subcategory: 'dresses',
    description:
      'Elegant floral midi dress in a lightweight woven fabric. Features a V-neckline, flared skirt, and concealed zip at the back. A versatile piece that transitions from day to evening effortlessly.',
    price_pkr: 4500,
    original_price_omr: 16,
    images: [
      img('splash-w-dress-1'),
      img('splash-w-dress-2'),
      img('splash-w-dress-3'),
      img('splash-w-dress-4'),
    ],
    sizes: [
      { size: 'XS', stock: 5 },
      { size: 'S',  stock: 8 },
      { size: 'M',  stock: 6 },
      { size: 'L',  stock: 4 },
      { size: 'XL', stock: 2 },
    ],
    colors: [
      { name: 'Rose Floral', hex: '#D4707A' },
      { name: 'Navy Floral', hex: '#2C3E6B' },
    ],
    material: '100% Viscose',
    care_instructions: 'Machine wash cold, gentle cycle. Do not tumble dry.',
    tags: ['dress', 'floral', 'midi', 'women', 'splash'],
    featured: true,
    active: true,
  },
  {
    slug: 'splash-womens-linen-wide-leg-trousers',
    name: 'Linen Wide-Leg Trousers',
    brand: 'Splash',
    category: 'women',
    subcategory: 'bottoms',
    description:
      'Relaxed wide-leg trousers crafted from breathable linen. High-rise fit with an elasticated waistband and two side pockets. Perfect for warm weather styling.',
    price_pkr: 3200,
    original_price_omr: 11,
    images: [
      img('splash-w-trouser-1'),
      img('splash-w-trouser-2'),
      img('splash-w-trouser-3'),
    ],
    sizes: [
      { size: '28', stock: 6 },
      { size: '30', stock: 8 },
      { size: '32', stock: 7 },
      { size: '34', stock: 4 },
    ],
    colors: [
      { name: 'Sand',  hex: '#C8B89A' },
      { name: 'White', hex: '#F5F0E8' },
    ],
    material: '55% Linen, 45% Cotton',
    care_instructions: 'Hand wash or machine wash on delicate cycle. Iron while damp.',
    tags: ['trousers', 'linen', 'wide-leg', 'women', 'splash'],
    featured: false,
    active: true,
  },

  // ══════════════════════════════════════════════════════════
  // WOMEN — Max (1)
  // ══════════════════════════════════════════════════════════
  {
    slug: 'max-womens-knit-cardigan',
    name: 'Ribbed Knit Cardigan',
    brand: 'Max',
    category: 'women',
    subcategory: 'tops',
    description:
      'Cosy ribbed-knit cardigan with a relaxed open-front silhouette. Long sleeves, side pockets, and a soft drape make this an everyday layering essential.',
    price_pkr: 3800,
    original_price_omr: 13,
    images: [
      img('max-w-cardigan-1'),
      img('max-w-cardigan-2'),
      img('max-w-cardigan-3'),
    ],
    sizes: [
      { size: 'S',   stock: 7 },
      { size: 'M',   stock: 9 },
      { size: 'L',   stock: 5 },
      { size: 'XL',  stock: 3 },
      { size: 'XXL', stock: 2 },
    ],
    colors: [
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Cream', hex: '#F2ECD8' },
      { name: 'Charcoal', hex: '#3D3D3D' },
    ],
    material: '70% Acrylic, 30% Wool',
    care_instructions: 'Hand wash in cool water. Lay flat to dry.',
    tags: ['cardigan', 'knit', 'women', 'max', 'winter'],
    featured: true,
    active: true,
  },

  // ══════════════════════════════════════════════════════════
  // WOMEN — R&B (1)
  // ══════════════════════════════════════════════════════════
  {
    slug: 'rnb-womens-satin-slip-skirt',
    name: 'Satin Slip Skirt',
    brand: 'R&B',
    category: 'women',
    subcategory: 'bottoms',
    description:
      'Luxurious satin-finish slip skirt with a midi length and subtle bias cut. Elasticated waistband ensures a comfortable fit. Pairs seamlessly with a tucked-in blouse or oversized knit.',
    price_pkr: 2800,
    original_price_omr: 9.5,
    images: [
      img('rnb-w-skirt-1'),
      img('rnb-w-skirt-2'),
      img('rnb-w-skirt-3'),
    ],
    sizes: [
      { size: 'XS', stock: 4 },
      { size: 'S',  stock: 7 },
      { size: 'M',  stock: 6 },
      { size: 'L',  stock: 3 },
    ],
    colors: [
      { name: 'Gold',  hex: '#C4953A' },
      { name: 'Blush', hex: '#E8BFBA' },
      { name: 'Black', hex: '#1A1610' },
    ],
    material: '100% Polyester Satin',
    care_instructions: 'Dry clean recommended. Iron on low heat.',
    tags: ['skirt', 'satin', 'women', 'rnb', 'evening'],
    featured: true,
    active: true,
  },

  // ══════════════════════════════════════════════════════════
  // MEN — Max (2)
  // ══════════════════════════════════════════════════════════
  {
    slug: 'max-mens-slim-chino-trousers',
    name: 'Slim-Fit Chino Trousers',
    brand: 'Max',
    category: 'men',
    subcategory: 'bottoms',
    description:
      'Clean-cut slim-fit chinos in a durable cotton-stretch blend. Four-pocket construction with a zip fly. Versatile enough for smart-casual or office wear.',
    price_pkr: 3500,
    original_price_omr: 12,
    images: [
      img('max-m-chino-1'),
      img('max-m-chino-2'),
      img('max-m-chino-3'),
    ],
    sizes: [
      { size: '28', stock: 5 },
      { size: '30', stock: 9 },
      { size: '32', stock: 8 },
      { size: '34', stock: 6 },
      { size: '36', stock: 3 },
    ],
    colors: [
      { name: 'Khaki',   hex: '#B5A482' },
      { name: 'Navy',    hex: '#1B2A4A' },
      { name: 'Charcoal', hex: '#3D3D3D' },
    ],
    material: '97% Cotton, 3% Elastane',
    care_instructions: 'Machine wash at 30°C. Do not bleach.',
    tags: ['chino', 'trousers', 'men', 'max', 'office'],
    featured: true,
    active: true,
  },
  {
    slug: 'max-mens-polo-shirt',
    name: 'Classic Piqué Polo Shirt',
    brand: 'Max',
    category: 'men',
    subcategory: 'tops',
    description:
      'Timeless piqué polo shirt with a regular fit. Ribbed collar and cuffs, two-button placket. A wardrobe staple that works equally well tucked or untucked.',
    price_pkr: 2200,
    original_price_omr: 7.5,
    images: [
      img('max-m-polo-1'),
      img('max-m-polo-2'),
      img('max-m-polo-3'),
    ],
    sizes: [
      { size: 'S',   stock: 10 },
      { size: 'M',   stock: 12 },
      { size: 'L',   stock: 9 },
      { size: 'XL',  stock: 6 },
      { size: 'XXL', stock: 3 },
    ],
    colors: [
      { name: 'White',    hex: '#F5F0E8' },
      { name: 'Navy',     hex: '#1B2A4A' },
      { name: 'Burgundy', hex: '#7D1E2A' },
    ],
    material: '100% Cotton Piqué',
    care_instructions: 'Machine wash warm. Tumble dry low.',
    tags: ['polo', 'shirt', 'men', 'max', 'casual'],
    featured: false,
    active: true,
  },

  // ══════════════════════════════════════════════════════════
  // MEN — Splash (1)
  // ══════════════════════════════════════════════════════════
  {
    slug: 'splash-mens-linen-shirt',
    name: 'Relaxed Linen Shirt',
    brand: 'Splash',
    category: 'men',
    subcategory: 'tops',
    description:
      'Breezy linen shirt with a relaxed fit and a camp collar. Long sleeves with button cuffs, chest patch pocket. Ideal for warm weather — styled open over a tee or buttoned up.',
    price_pkr: 2900,
    original_price_omr: 10,
    images: [
      img('splash-m-shirt-1'),
      img('splash-m-shirt-2'),
      img('splash-m-shirt-3'),
    ],
    sizes: [
      { size: 'S',   stock: 6 },
      { size: 'M',   stock: 8 },
      { size: 'L',   stock: 7 },
      { size: 'XL',  stock: 4 },
      { size: 'XXL', stock: 2 },
    ],
    colors: [
      { name: 'Stone',    hex: '#C8B89A' },
      { name: 'Sky Blue', hex: '#7EB3CC' },
    ],
    material: '100% Linen',
    care_instructions: 'Machine wash cold. Iron while damp for best results.',
    tags: ['shirt', 'linen', 'men', 'splash', 'summer'],
    featured: true,
    active: true,
  },

  // ══════════════════════════════════════════════════════════
  // MEN — R&B (1)
  // ══════════════════════════════════════════════════════════
  {
    slug: 'rnb-mens-jogger-pants',
    name: 'Tapered Jogger Pants',
    brand: 'R&B',
    category: 'men',
    subcategory: 'bottoms',
    description:
      'Modern tapered joggers with an elasticated waistband and adjustable drawstring. Ribbed cuffs, two side pockets, and one rear zip pocket. Smart enough for casual outings, comfortable enough for lounging.',
    price_pkr: 2600,
    original_price_omr: 9,
    images: [
      img('rnb-m-jogger-1'),
      img('rnb-m-jogger-2'),
      img('rnb-m-jogger-3'),
    ],
    sizes: [
      { size: 'S',   stock: 5 },
      { size: 'M',   stock: 8 },
      { size: 'L',   stock: 7 },
      { size: 'XL',  stock: 4 },
    ],
    colors: [
      { name: 'Black',  hex: '#1A1610' },
      { name: 'Olive',  hex: '#5B6240' },
      { name: 'Grey',   hex: '#9B9B9B' },
    ],
    material: '60% Cotton, 40% Polyester',
    care_instructions: 'Machine wash at 30°C. Do not iron print areas.',
    tags: ['jogger', 'pants', 'men', 'rnb', 'casual'],
    featured: false,
    active: true,
  },

  // ══════════════════════════════════════════════════════════
  // KIDS — Max (4)
  // ══════════════════════════════════════════════════════════
  {
    slug: 'max-kids-printed-tshirt-set',
    name: 'Printed T-Shirt & Shorts Set',
    brand: 'Max',
    category: 'kids',
    subcategory: 'sets',
    description:
      'Fun matching set for little ones — a graphic printed tee paired with elasticated shorts. Soft cotton jersey keeps kids comfortable all day long.',
    price_pkr: 1800,
    original_price_omr: 6,
    images: [
      img('max-k-tshirt-set-1'),
      img('max-k-tshirt-set-2'),
      img('max-k-tshirt-set-3'),
    ],
    sizes: [
      { size: '2Y',  stock: 6 },
      { size: '4Y',  stock: 8 },
      { size: '6Y',  stock: 7 },
      { size: '8Y',  stock: 5 },
    ],
    colors: [
      { name: 'Blue Print',  hex: '#4A90C4' },
      { name: 'Green Print', hex: '#5B8A5B' },
    ],
    material: '100% Cotton Jersey',
    care_instructions: 'Machine wash warm. Tumble dry low.',
    tags: ['kids', 'set', 'tshirt', 'shorts', 'max'],
    featured: true,
    active: true,
  },
  {
    slug: 'max-kids-denim-jacket',
    name: 'Classic Denim Jacket',
    brand: 'Max',
    category: 'kids',
    subcategory: 'outerwear',
    description:
      'Mini-me denim jacket with a button front, chest pockets, and side pockets. Slightly relaxed fit for comfortable layering over everyday outfits.',
    price_pkr: 2800,
    original_price_omr: 9.5,
    images: [
      img('max-k-denim-1'),
      img('max-k-denim-2'),
      img('max-k-denim-3'),
    ],
    sizes: [
      { size: '4Y',  stock: 5 },
      { size: '6Y',  stock: 6 },
      { size: '8Y',  stock: 4 },
      { size: '10Y', stock: 3 },
    ],
    colors: [
      { name: 'Mid Wash', hex: '#5A7EA8' },
    ],
    material: '100% Cotton Denim',
    care_instructions: 'Machine wash cold, inside out. Do not bleach.',
    tags: ['kids', 'denim', 'jacket', 'max', 'outerwear'],
    featured: false,
    active: true,
  },
  {
    slug: 'max-girls-frill-dress',
    name: 'Frill Hem Party Dress',
    brand: 'Max',
    category: 'kids',
    subcategory: 'dresses',
    description:
      'Sweet party dress for girls with a frill hem, puff sleeves, and a back zip. Lightweight woven fabric in a pretty floral print makes this a go-to for celebrations.',
    price_pkr: 2200,
    original_price_omr: 7.5,
    images: [
      img('max-k-frill-dress-1'),
      img('max-k-frill-dress-2'),
      img('max-k-frill-dress-3'),
    ],
    sizes: [
      { size: '2Y',  stock: 4 },
      { size: '4Y',  stock: 6 },
      { size: '6Y',  stock: 5 },
      { size: '8Y',  stock: 3 },
    ],
    colors: [
      { name: 'Pink Floral', hex: '#E8A4B8' },
    ],
    material: '100% Polyester',
    care_instructions: 'Machine wash cold, gentle cycle. Do not iron directly on print.',
    tags: ['kids', 'girls', 'dress', 'party', 'max'],
    featured: true,
    active: true,
  },
  {
    slug: 'max-boys-cargo-pants',
    name: 'Cargo Jogger Pants',
    brand: 'Max',
    category: 'kids',
    subcategory: 'bottoms',
    description:
      'Rugged cargo joggers for active boys. Features multiple pockets, elasticated waistband, and tapered leg. Durable twill fabric stands up to playtime.',
    price_pkr: 1500,
    original_price_omr: 5,
    images: [
      img('max-k-cargo-1'),
      img('max-k-cargo-2'),
      img('max-k-cargo-3'),
    ],
    sizes: [
      { size: '4Y',  stock: 7 },
      { size: '6Y',  stock: 8 },
      { size: '8Y',  stock: 6 },
      { size: '10Y', stock: 4 },
      { size: '12Y', stock: 2 },
    ],
    colors: [
      { name: 'Olive',  hex: '#6B7A47' },
      { name: 'Khaki',  hex: '#C3AA7A' },
    ],
    material: '98% Cotton, 2% Elastane Twill',
    care_instructions: 'Machine wash warm. Tumble dry.',
    tags: ['kids', 'boys', 'cargo', 'pants', 'max'],
    featured: false,
    active: true,
  },
];

async function seed() {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});

    console.log('🌱 Seeding 12 products...');
    const inserted = await Product.insertMany(products);

    console.log(`✅ Seeded ${inserted.length} products:`);
    inserted.forEach((p) =>
      console.log(`   [${p.brand}] ${p.category.toUpperCase()} — ${p.name} (₨${p.price_pkr.toLocaleString()})`)
    );

    const featuredCount = inserted.filter((p) => p.featured).length;
    console.log(`\n   📌 Featured: ${featuredCount}`);
    console.log(`   👗 Women:    ${inserted.filter((p) => p.category === 'women').length}`);
    console.log(`   👔 Men:      ${inserted.filter((p) => p.category === 'men').length}`);
    console.log(`   🧒 Kids:     ${inserted.filter((p) => p.category === 'kids').length}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
