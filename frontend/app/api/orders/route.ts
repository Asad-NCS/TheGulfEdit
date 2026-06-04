import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import Cart from '@/lib/models/Cart';
import Product from '@/lib/models/Product';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    await connectDB();
    const { sessionId, customer } = await request.json();

    const cart = await Cart.findOne({ sessionId });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart is empty' }, { status: 400 });
    }

    // Verify stock one last time and deduct
    let subtotal_pkr = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json({ success: false, message: `Product ${item.name} no longer exists` }, { status: 400 });
      }
      
      const sizeData = product.sizes.find((s: any) => s.size === item.size);
      if (!sizeData || sizeData.stock < item.quantity) {
        return NextResponse.json({ success: false, message: `Insufficient stock for ${item.name} (${item.size})` }, { status: 400 });
      }

      sizeData.stock -= item.quantity;
      await product.save();
      
      subtotal_pkr += item.price_pkr * item.quantity;
    }

    const shipping_pkr = subtotal_pkr >= 5000 ? 0 : 250;
    const total_pkr = subtotal_pkr + shipping_pkr;

    const newOrder = await Order.create({
      sessionId,
      customer,
      items: cart.items,
      subtotal_pkr,
      shipping_pkr,
      total_pkr,
      status: 'pending',
      statusHistory: [{ status: 'pending' }]
    });

    // Empty the cart
    cart.items = [];
    await cart.save();

    return NextResponse.json({ success: true, data: { orderId: newOrder.orderId } });
  } catch (error: any) {
    console.error('Order POST error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Minimal protection for listing orders
    // In production, verify the admin token properly via middleware/cookies here too if needed,
    // but middleware.ts currently doesn't protect /api/orders.
    // Let's check the cookie directly in the route for admin APIs
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('gulf_admin_auth');
    if (!adminAuth || adminAuth.value !== 'true') {
        // Just return empty or unauthorized if not admin, but some might need their own orders?
        // Our app doesn't have user auth, so /api/orders GET is purely admin.
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const orders = await Order.find().sort({ createdAt: -1 }).limit(limit);
    const total = await Order.countDocuments();

    return NextResponse.json({ 
      success: true, 
      data: orders,
      pagination: { total } 
    });
  } catch (error: any) {
    console.error('Order GET error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
