import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const size = searchParams.get('size');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const query: any = {};
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (size) query['sizes.size'] = size;
    
    if (minPrice || maxPrice) {
      query.price_pkr = {};
      if (minPrice) query.price_pkr.$gte = Number(minPrice);
      if (maxPrice) query.price_pkr.$lte = Number(maxPrice);
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price_pkr: 1 };
    if (sort === 'price_desc') sortOption = { price_pkr: -1 };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(limit),
      Product.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Products error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
