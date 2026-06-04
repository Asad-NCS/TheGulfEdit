import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { cookies } from 'next/headers';

function isAdmin() {
  const cookieStore = cookies();
  const adminAuth = cookieStore.get('gulf_admin_auth');
  return adminAuth && adminAuth.value === 'true';
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await request.json(); // For PUT we assume JSON for simplicity, though could be formData if updating images
    const updated = await Product.findByIdAndUpdate(params.id, body, { new: true });
    
    if (!updated) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const deleted = await Product.findByIdAndDelete(params.id);
    
    if (!deleted) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
