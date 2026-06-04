import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Cart from '@/lib/models/Cart';
import Product from '@/lib/models/Product';

export async function GET(request: Request, { params }: { params: { sessionId: string } }) {
  try {
    await connectDB();
    
    let cart = await Cart.findOne({ sessionId: params.sessionId });
    if (!cart) {
      cart = await Cart.create({ sessionId: params.sessionId, items: [] });
    }
    
    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { sessionId: string } }) {
  try {
    await connectDB();
    const { productId, size, color, colorHex, quantity = 1 } = await request.json();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    const sizeData = product.sizes.find((s: any) => s.size === size);
    if (!sizeData || sizeData.stock < quantity) {
      return NextResponse.json({ success: false, message: 'Insufficient stock for this size' }, { status: 400 });
    }

    let cart = await Cart.findOne({ sessionId: params.sessionId });
    if (!cart) {
      cart = await Cart.create({ sessionId: params.sessionId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId && item.size === size && item.color === color
    );

    if (existingItemIndex > -1) {
      const newQty = cart.items[existingItemIndex].quantity + quantity;
      if (sizeData.stock < newQty) {
        return NextResponse.json({ success: false, message: 'Cannot add more than available stock' }, { status: 400 });
      }
      cart.items[existingItemIndex].quantity = newQty;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        brand: product.brand,
        image: product.images[0] || '',
        slug: product.slug,
        size,
        color,
        colorHex,
        quantity,
        price_pkr: product.price_pkr
      });
    }

    await cart.save();
    return NextResponse.json({ success: true, data: cart });
  } catch (error: any) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
