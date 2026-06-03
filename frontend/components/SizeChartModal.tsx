'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

const CHARTS: Record<string, { headers: string[]; rows: (string | number)[][] }> = {
  women: {
    headers: ['Size', 'Chest (in)', 'Waist (in)', 'Hip (in)'],
    rows: [
      ['XS', '32', '24', '35'],
      ['S',  '34', '26', '37'],
      ['M',  '36', '28', '39'],
      ['L',  '38', '30', '41'],
      ['XL', '40', '32', '43'],
      ['XXL','42', '34', '45'],
    ]
  },
  men: {
    headers: ['Size', 'Chest (in)', 'Waist (in)', 'Hip (in)'],
    rows: [
      ['S',  '36-38', '30-32', '37-39'],
      ['M',  '39-41', '33-35', '40-42'],
      ['L',  '42-44', '36-38', '43-45'],
      ['XL', '45-47', '39-41', '46-48'],
      ['XXL','48-50', '42-44', '49-51'],
    ]
  },
  kids: {
    headers: ['Age', 'Height (cm)', 'Chest (cm)'],
    rows: [
      ['2Y',  '92',  '52'],
      ['4Y',  '104', '56'],
      ['6Y',  '116', '60'],
      ['8Y',  '128', '64'],
      ['10Y', '140', '68'],
      ['12Y', '152', '72'],
      ['14Y', '164', '76'],
    ]
  }
};

export default function SizeChartModal({ isOpen, onClose, category }: SizeChartModalProps) {
  // Default to women if category is somehow missing or different (like 'bottoms' which we can handle later if needed)
  const chartData = CHARTS[category] || CHARTS['women'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70]
                       w-full max-w-lg bg-cream border border-sand-dark shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-sand-dark">
              <h2 className="font-display text-xl text-ink">Size Guide</h2>
              <button onClick={onClose} className="p-1 text-ink-light hover:text-ink transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="font-body text-sm text-ink-light mb-6">
                Measurements are in inches (or cm for kids) and represent body measurements, not garment measurements.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      {chartData.headers.map((h, i) => (
                        <th key={i} className="font-body text-xs tracking-wider uppercase text-ink-light pb-3 border-b border-sand-dark font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.rows.map((row, i) => (
                      <tr key={i} className="border-b border-sand-dark/50 last:border-0">
                        {row.map((cell, j) => (
                          <td key={j} className="py-3 font-body text-sm text-ink">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-sand border-t border-sand-dark text-center">
              <p className="font-body text-xs text-ink-light">Need help? WhatsApp us for sizing advice.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
