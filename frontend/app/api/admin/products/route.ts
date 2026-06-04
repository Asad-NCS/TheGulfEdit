import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { v2 as cloudinary } from 'cloudinary';
import { cookies } from 'next/headers';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function isAdmin() {
  const cookieStore = cookies();
  const adminAuth = cookieStore.get('gulf_admin_auth');
  return adminAuth && adminAuth.value === 'true';
}

export async function POST(request: Request) {
  if (!isAdmin()) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const formData = await request.formData();
    
    // Process images
    const images: string[] = [];
    const files = formData.getAll('images') as File[];
    
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const imageUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'gulfedit/products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!.secure_url);
          }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
      images.push(imageUrl);
    }

    const sizes = JSON.parse(formData.get('sizes') as string || '[]');
    const colors = JSON.parse(formData.get('colors') as string || '[]');

    const product = await Product.create({
      name: formData.get('name'),
      slug: formData.get('slug'),
      brand: formData.get('brand'),
      category: formData.get('category'),
      description: formData.get('description'),
      price_pkr: Number(formData.get('price_pkr')),
      images,
      sizes,
      colors,
      material: formData.get('material') || '',
      care_instructions: formData.get('care_instructions') || '',
      featured: formData.get('featured') === 'true'
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    console.error('Admin Products POST error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
