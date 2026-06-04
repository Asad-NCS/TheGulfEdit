import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/lib/models/Cart';
import Product from '@/lib/models/Product';

export async function PUT(request: Request, { params }: { params: { sessionId: string; itemId: string } }) {
  try {
    await connectDB();
    const { quantity } = await request.json();

    const cart = await Cart.findOne({ sessionId: params.sessionId });
    if (!cart) return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });

    const item = cart.items.id(params.itemId);
    if (!item) return NextResponse.json({ success: false, message: 'Item not found in cart' }, { status: 404 });

    if (quantity > 0) {
      const product = await Product.findById(item.productId);
      const sizeData = product?.sizes.find((s: any) => s.size === item.size);
      
      if (!sizeData || sizeData.stock < quantity) {
        return NextResponse.json({ success: false, message: 'Insufficient stock' }, { status: 400 });
      }
      item.quantity = quantity;
    } else {
      cart.items.pull(params.itemId);
    }

    await cart.save();
    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    console.error('Cart PUT error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { sessionId: string; itemId: string } }) {
  try {
    await connectDB();
    
    const cart = await Cart.findOne({ sessionId: params.sessionId });
    if (!cart) return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });

    cart.items.pull(params.itemId);
    await cart.save();
    
    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
