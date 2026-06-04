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
  {
    name: "Classic Linen Blend Dress",
    slug: "classic-linen-blend-dress-splash",
    brand: "Splash",
    category: "women",
    description: "Elegant midi dress crafted from a breathable linen blend. Features a subtle V-neckline and a cinched waist for a flattering silhouette.",
    price_pkr: 8500,
    images: [
      "https://picsum.photos/seed/dress1/600/800",
      "https://picsum.photos/seed/dress1-alt/600/800"
    ],
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 12 },
      { size: "L", stock: 8 }
    ],
    colors: [{ name: "Desert Sand", hex: "#EAE0CF" }],
    material: "55% Linen, 45% Cotton",
    care_instructions: "Machine wash cold. Line dry.",
    featured: true
  },
  {
    name: "Tailored Chino Trousers",
    slug: "tailored-chino-trousers-max",
    brand: "Max",
    category: "men",
    description: "Versatile chino trousers offering a comfortable slim fit. Perfect for both office wear and casual weekend outings.",
    price_pkr: 5200,
    images: [
      "https://picsum.photos/seed/chino1/600/800"
    ],
    sizes: [
      { size: "30", stock: 10 },
      { size: "32", stock: 15 },
      { size: "34", stock: 20 },
      { size: "36", stock: 5 }
    ],
    colors: [{ name: "Navy Blue", hex: "#1A2E44" }],
    material: "98% Cotton, 2% Elastane",
    care_instructions: "Machine wash warm. Tumble dry low.",
    featured: true
  }
];

export async function POST(request: Request) {
  // Require admin auth to run seed
  if (!isAdmin()) return NextResponse.json({ success: false, message: 'Unauthorized. Please login to admin panel first.' }, { status: 401 });

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
