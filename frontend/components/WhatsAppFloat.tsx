'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000';

export default function WhatsAppFloat() {
  return (
    <motion.a
      href={`https://wa.me/${WA}?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20an%20order.`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2
                 bg-[#25D366] text-white rounded-full shadow-lg
                 px-4 py-3 font-body text-sm font-medium
                 transition-shadow hover:shadow-xl"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={20} strokeWidth={1.5} fill="white" />
      <span className="hidden sm:inline">WhatsApp</span>
    </motion.a>
  );
}
