import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/lib/models/Contact';
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
    const body = await request.json();
    const updated = await Contact.findByIdAndUpdate(params.id, { read: body.read }, { new: true });
    if (!updated) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    await Contact.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
