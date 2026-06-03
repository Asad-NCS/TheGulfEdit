import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/lib/cart-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import './globals.css';

export const metadata: Metadata = {
  title:       { default: 'The Gulf Edit', template: '%s | The Gulf Edit' },
  description: 'Authentic Gulf fashion from Oman — Splash, Max, R&B — delivered across Pakistan. Cash on Delivery.',
  keywords:    ['gulf fashion', 'pakistan online store', 'splash', 'max', 'rnb', 'oman brands', 'cod'],
  openGraph: {
    type:        'website',
    siteName:    'The Gulf Edit',
    title:       'The Gulf Edit — Gulf Fashion, Delivered to You',
    description: 'Authentic Gulf brands from Oman, delivered across Pakistan. Cash on Delivery.',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-cream text-ink font-body antialiased">
        <CartProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppFloat />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1A1610',
                color:      '#FDFAF6',
                fontFamily: '"DM Sans", sans-serif',
                fontSize:   '14px',
                borderRadius: '0',
                border:     '1px solid #C4953A',
              },
              success: { iconTheme: { primary: '#C4953A', secondary: '#1A1610' } },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
