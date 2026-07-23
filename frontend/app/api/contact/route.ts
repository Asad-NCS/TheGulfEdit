import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/lib/models/Contact';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    await Contact.create(body);
    
    return NextResponse.json({ success: true, message: 'Message sent successfully. We will get back to you soon on WhatsApp.' });
  } catch (error: any) {
    console.error('Contact POST error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('gulf_admin_auth');
    if (!adminAuth || adminAuth.value !== 'true') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const messages = await Contact.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    console.error('Contact GET error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
