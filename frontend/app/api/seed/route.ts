import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { cookies } from 'next/headers';

function isAdmin() {
  const cookieStore = cookies();
  const adminAuth = cookieStore.get('gulf_admin_auth');
  return adminAuth && adminAuth.value === 'true';
}

const SAMPLE_PRODUCTS = [
  // ── Women ────────────────────────────────────────────────────────────────
  {
    name: "Classic Linen Blend Dress",
    slug: "classic-linen-blend-dress-splash",
    brand: "Splash",
    category: "women",
    subcategory: "dresses",
    description: "Elegant midi dress crafted from a breathable linen blend. Features a subtle V-neckline and a cinched waist for a flattering silhouette.",
    price_pkr: 8500,
    compare_price_pkr: 10500,
    images: [],          // add Cloudinary URLs from admin panel
    sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 12 }, { size: "L", stock: 8 }],
    colors: [{ name: "Desert Sand", hex: "#EAE0CF" }],
    material: "55% Linen, 45% Cotton",
    care_instructions: "Machine wash cold. Line dry.",
    tags: ["new", "featured"],
    featured: true, active: true,
  },
  {
    name: "Floral Wrap Midi Skirt",
    slug: "floral-wrap-midi-skirt-splash",
    brand: "Splash",
    category: "women",
    subcategory: "bottoms",
    description: "A feminine wrap-style midi skirt with a delicate floral print. Pairs beautifully with tucked-in basics.",
    price_pkr: 5800,
    images: [],
    sizes: [{ size: "XS", stock: 4 }, { size: "S", stock: 9 }, { size: "M", stock: 7 }, { size: "L", stock: 3 }],
    colors: [{ name: "Blush Floral", hex: "#E8C5B0" }, { name: "Sage", hex: "#8FA97D" }],
    material: "100% Viscose",
    care_instructions: "Hand wash. Do not tumble dry.",
    tags: ["new"],
    featured: true, active: true,
  },
  {
    name: "Linen Relaxed Blazer",
    slug: "linen-relaxed-blazer-max",
    brand: "Max",
    category: "women",
    subcategory: "tops",
    description: "A relaxed-fit linen blazer that transitions effortlessly from work to weekend. Clean, minimal, and versatile.",
    price_pkr: 9200,
    compare_price_pkr: 12000,
    images: [],
    sizes: [{ size: "S", stock: 6 }, { size: "M", stock: 10 }, { size: "L", stock: 4 }],
    colors: [{ name: "Off White", hex: "#F5EFE4" }, { name: "Mocha", hex: "#7A5C3A" }],
    material: "100% Linen",
    care_instructions: "Dry clean recommended.",
    tags: ["sale"],
    featured: false, active: true,
  },
  {
    name: "Embroidered Cotton Kaftan",
    slug: "embroidered-cotton-kaftan-rb",
    brand: "R&B",
    category: "women",
    subcategory: "dresses",
    description: "A flowing kaftan with delicate hand-embroidered details at the neckline. Inspired by Gulf heritage, designed for modern living.",
    price_pkr: 11500,
    images: [],
    sizes: [{ size: "S", stock: 8 }, { size: "M", stock: 6 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }],
    colors: [{ name: "Cream Gold", hex: "#E8C97A" }],
    material: "100% Cotton",
    care_instructions: "Hand wash cold. Iron on low heat.",
    tags: ["new", "featured"],
    featured: true, active: true,
  },

  // ── Men ──────────────────────────────────────────────────────────────────
  {
    name: "Tailored Chino Trousers",
    slug: "tailored-chino-trousers-max",
    brand: "Max",
    category: "men",
    subcategory: "bottoms",
    description: "Versatile chino trousers offering a comfortable slim fit. Perfect for both office wear and casual weekend outings.",
    price_pkr: 5200,
    images: [],
    sizes: [{ size: "30", stock: 10 }, { size: "32", stock: 15 }, { size: "34", stock: 20 }, { size: "36", stock: 5 }],
    colors: [{ name: "Navy", hex: "#1A2E44" }, { name: "Khaki", hex: "#B5A07A" }],
    material: "98% Cotton, 2% Elastane",
    care_instructions: "Machine wash warm. Tumble dry low.",
    tags: ["new"],
    featured: true, active: true,
  },
  {
    name: "Slim Fit Oxford Shirt",
    slug: "slim-fit-oxford-shirt-max",
    brand: "Max",
    category: "men",
    subcategory: "tops",
    description: "A classic slim-fit Oxford shirt made from premium cotton. Crisp enough for meetings, comfortable enough for all day.",
    price_pkr: 4500,
    compare_price_pkr: 5500,
    images: [],
    sizes: [{ size: "S", stock: 8 }, { size: "M", stock: 12 }, { size: "L", stock: 10 }, { size: "XL", stock: 6 }],
    colors: [{ name: "White", hex: "#FDFAF6" }, { name: "Sky Blue", hex: "#87CEEB" }, { name: "Light Pink", hex: "#FFB6C1" }],
    material: "100% Cotton",
    care_instructions: "Machine wash cold. Iron while damp.",
    tags: ["sale"],
    featured: false, active: true,
  },
  {
    name: "Linen Short Sleeve Shirt",
    slug: "linen-short-sleeve-shirt-splash",
    brand: "Splash",
    category: "men",
    subcategory: "tops",
    description: "Easy-care linen shirt with a relaxed cut. The perfect Gulf summer essential.",
    price_pkr: 4200,
    images: [],
    sizes: [{ size: "M", stock: 14 }, { size: "L", stock: 18 }, { size: "XL", stock: 9 }, { size: "XXL", stock: 4 }],
    colors: [{ name: "Sand", hex: "#EAE0CF" }, { name: "Olive", hex: "#708238" }],
    material: "55% Linen, 45% Cotton",
    care_instructions: "Machine wash cold.",
    tags: ["new", "featured"],
    featured: true, active: true,
  },
  {
    name: "Slim Jogger Trousers",
    slug: "slim-jogger-trousers-rb",
    brand: "R&B",
    category: "men",
    subcategory: "bottoms",
    description: "Modern slim joggers that pair well with everything from sneakers to loafers. Elasticated waist for all-day comfort.",
    price_pkr: 3800,
    images: [],
    sizes: [{ size: "S", stock: 7 }, { size: "M", stock: 11 }, { size: "L", stock: 8 }, { size: "XL", stock: 5 }],
    colors: [{ name: "Charcoal", hex: "#444444" }, { name: "Navy", hex: "#1A2E44" }],
    material: "80% Cotton, 20% Polyester",
    care_instructions: "Machine wash warm.",
    tags: [],
    featured: false, active: true,
  },

  // ── Kids ─────────────────────────────────────────────────────────────────
  {
    name: "Printed Cotton T-Shirt Set",
    slug: "printed-cotton-tshirt-set-max",
    brand: "Max",
    category: "kids",
    subcategory: "tops",
    description: "Fun printed tee for active kids. Made from soft 100% cotton that's gentle on skin and easy to wash.",
    price_pkr: 1800,
    images: [],
    sizes: [{ size: "4Y", stock: 12 }, { size: "6Y", stock: 15 }, { size: "8Y", stock: 10 }, { size: "10Y", stock: 8 }],
    colors: [{ name: "Royal Blue", hex: "#4169E1" }, { name: "Red", hex: "#CC3333" }],
    material: "100% Cotton",
    care_instructions: "Machine wash warm.",
    tags: ["new"],
    featured: true, active: true,
  },
  {
    name: "Girls Floral Dress",
    slug: "girls-floral-dress-max",
    brand: "Max",
    category: "kids",
    subcategory: "dresses",
    description: "A cheerful floral dress with a smocked bodice and flutter sleeves — perfect for everyday wear and special occasions.",
    price_pkr: 2600,
    compare_price_pkr: 3200,
    images: [],
    sizes: [{ size: "4Y", stock: 8 }, { size: "6Y", stock: 10 }, { size: "8Y", stock: 7 }],
    colors: [{ name: "Pink Floral", hex: "#FFAEC9" }],
    material: "100% Cotton",
    care_instructions: "Machine wash cold.",
    tags: ["sale"],
    featured: false, active: true,
  },
  {
    name: "Boys Cargo Shorts",
    slug: "boys-cargo-shorts-max",
    brand: "Max",
    category: "kids",
    subcategory: "bottoms",
    description: "Durable cargo shorts with multiple pockets — designed to keep up with active boys all day.",
    price_pkr: 2200,
    images: [],
    sizes: [{ size: "6Y", stock: 9 }, { size: "8Y", stock: 12 }, { size: "10Y", stock: 8 }, { size: "12Y", stock: 5 }],
    colors: [{ name: "Khaki", hex: "#B5A07A" }, { name: "Olive", hex: "#708238" }],
    material: "100% Cotton Twill",
    care_instructions: "Machine wash warm.",
    tags: [],
    featured: false, active: true,
  },
  {
    name: "Kids Knit Cardigan",
    slug: "kids-knit-cardigan-max",
    brand: "Max",
    category: "kids",
    subcategory: "tops",
    description: "A soft button-up cardigan for cooler days. Knitted from a cotton blend that's warm but lightweight.",
    price_pkr: 3100,
    images: [],
    sizes: [{ size: "4Y", stock: 6 }, { size: "6Y", stock: 8 }, { size: "8Y", stock: 6 }, { size: "10Y", stock: 4 }],
    colors: [{ name: "Camel", hex: "#C19A6B" }, { name: "Navy", hex: "#1A2E44" }],
    material: "60% Cotton, 40% Acrylic",
    care_instructions: "Hand wash cold. Lay flat to dry.",
    tags: ["new"],
    featured: true, active: true,
  },
];

export async function POST(request: Request) {
  let passwordFromReq = null;
  try {
    const body = await request.json();
    passwordFromReq = body.password || body.ADMIN_PASSWORD;
  } catch {
    // Ignore JSON parse error if body is empty
  }

  // Require admin auth or ADMIN_PASSWORD to run seed
  if (!isAdmin() && passwordFromReq !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false, message: 'Unauthorized. Please provide ADMIN_PASSWORD or login to admin panel.' }, { status: 401 });
  }

  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert new
    await Product.insertMany(SAMPLE_PRODUCTS);
    
    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, message: 'Seed failed' }, { status: 500 });
  }
}
