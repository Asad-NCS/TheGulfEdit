import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { cookies } from 'next/headers';

function isAdmin() {
  const cookieStore = cookies();
  const adminAuth = cookieStore.get('gulf_admin_auth');
  return adminAuth && adminAuth.value === 'true';
}

export async function POST(request: Request) {
  if (!isAdmin()) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await request.json();

    const product = await Product.create({
      name: body.name,
      slug: body.slug,
      brand: body.brand,
      category: body.category,
      subcategory: body.subcategory,
      description: body.description,
      price_pkr: Number(body.price_pkr),
      compare_price_pkr: body.compare_price_pkr ? Number(body.compare_price_pkr) : undefined,
      images: body.images || [],
      sizes: body.sizes || [],
      colors: body.colors || [],
      material: body.material || '',
      care_instructions: body.care_instructions || '',
      tags: body.tags || [],
      featured: body.featured === true,
      active: body.active !== false
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    console.error('Admin Products POST error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
