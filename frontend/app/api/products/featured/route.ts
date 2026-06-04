import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET() {
  try {
    await connectDB();
    
    // Only return products that are explicitly featured and have stock in at least one size
    const products = await Product.find({ 
      featured: true,
      'sizes.stock': { $gt: 0 } 
    })
    .sort({ createdAt: -1 })
    .limit(8);

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.error('Featured products error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
