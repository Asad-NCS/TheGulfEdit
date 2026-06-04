import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  try {
    await connectDB();
    
    // We allow getting an order by orderId for the confirmation page.
    // In a real app with no auth, you might want to require the sessionId or exact email to prevent scraping.
    const order = await Order.findOne({ orderId: params.orderId });
    
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error('Order detail error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
