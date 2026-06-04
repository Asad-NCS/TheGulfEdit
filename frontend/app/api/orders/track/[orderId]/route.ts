import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  try {
    await connectDB();
    
    const order = await Order.findOne({ orderId: params.orderId })
      .select('orderId status statusHistory tracking items customer.name customer.city subtotal_pkr shipping_pkr total_pkr createdAt');
    
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error('Track order error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
