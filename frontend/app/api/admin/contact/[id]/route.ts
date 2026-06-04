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
    const { read } = await request.json();

    const message = await Contact.findByIdAndUpdate(params.id, { read }, { new: true });
    if (!message) return NextResponse.json({ success: false, message: 'Message not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: message });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
