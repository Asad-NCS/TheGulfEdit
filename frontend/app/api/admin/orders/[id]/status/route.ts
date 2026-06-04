import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
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
    const { status } = await request.json();

    const order = await Order.findById(params.id);
    if (!order) return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });

    order.status = status;
    await order.save(); // This triggers the pre-save hook to update statusHistory

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error('Order status update error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
