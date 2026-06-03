import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-display text-[8rem] sm:text-[10rem] text-gold/20 leading-none mb-4 select-none">
        404
      </h1>
      <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
        Page Not Found
      </h2>
      <p className="font-body text-ink-light max-w-md mx-auto mb-8">
        The page you are looking for doesn't exist or has been moved. Let's get you back to the latest Gulf fashion.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/" className="btn-primary">
          Return Home
        </Link>
        <Link href="/shop" className="btn-outline bg-transparent border-sand-dark text-ink hover:border-ink">
          Shop New Arrivals <ArrowRight size={16} strokeWidth={1.5} className="ml-1 inline" />
        </Link>
      </div>
    </div>
  );
}
