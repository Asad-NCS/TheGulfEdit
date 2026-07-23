import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { cookies } from 'next/headers';

function isAdmin() {
  const cookieStore = cookies();
  const adminAuth = cookieStore.get('gulf_admin_auth');
  return adminAuth && adminAuth.value === 'true';
}

// GET single order
export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const order = await Order.findById(params.id);
    if (!order) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: order });
  } catch {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

// PUT - update status + tracking
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await request.json();
    const { status, note, tracking } = body;

    const order = await Order.findById(params.id);
    if (!order) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });

    const updateData: any = {};

    if (status) {
      updateData.status = status;
      // Push to statusHistory
      updateData.$push = {
        statusHistory: {
          status,
          note: note || '',
          updatedAt: new Date()
        }
      };
    }

    if (tracking) {
      updateData['tracking.courier'] = tracking.courier || order.tracking?.courier;
      updateData['tracking.trackingNumber'] = tracking.trackingNumber || order.tracking?.trackingNumber;
      updateData['tracking.trackingUrl'] = tracking.trackingUrl || order.tracking?.trackingUrl;
      if (tracking.estimatedDelivery) {
        updateData['tracking.estimatedDelivery'] = tracking.estimatedDelivery;
      }
    }

    const updated = await Order.findByIdAndUpdate(
      params.id,
      updateData.$push ? { $set: updateData, $push: updateData.$push } : { $set: updateData },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Admin order PUT error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
