'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  subcategory?: string;
}

const CHARTS: Record<string, { headers: string[]; rows: (string | number)[][] }> = {
  women_tops: {
    headers: ['Size', 'Chest (in)', 'Shoulder (in)', 'Length (in)'],
    rows: [
      ['XS', '32', '14', '24'],
      ['S',  '34', '14.5', '25'],
      ['M',  '36', '15', '26'],
      ['L',  '38', '15.5', '27'],
      ['XL', '40', '16', '28'],
      ['XXL','42', '16.5', '29'],
    ]
  },
  women_bottoms: {
    headers: ['Size', 'Waist (in)', 'Hip (in)', 'Inseam (in)'],
    rows: [
      ['XS', '24', '35', '29'],
      ['S',  '26', '37', '30'],
      ['M',  '28', '39', '30'],
      ['L',  '30', '41', '31'],
      ['XL', '32', '43', '31'],
      ['XXL','34', '45', '32'],
    ]
  },
  men_tops: {
    headers: ['Size', 'Chest (in)', 'Shoulder (in)', 'Length (in)'],
    rows: [
      ['S',  '36-38', '17', '28'],
      ['M',  '39-41', '18', '29'],
      ['L',  '42-44', '19', '30'],
      ['XL', '45-47', '20', '31'],
      ['XXL','48-50', '21', '32'],
    ]
  },
  men_bottoms: {
    headers: ['Size', 'Waist (in)', 'Hip (in)', 'Inseam (in)'],
    rows: [
      ['30', '30', '38', '32'],
      ['32', '32', '40', '32'],
      ['34', '34', '42', '32'],
      ['36', '36', '44', '34'],
      ['38', '38', '46', '34'],
    ]
  },
  kids: {
    headers: ['Age', 'Height (cm)', 'Chest (cm)', 'Waist (cm)'],
    rows: [
      ['2Y',  '92',  '52', '50'],
      ['4Y',  '104', '56', '54'],
      ['6Y',  '116', '60', '56'],
      ['8Y',  '128', '64', '58'],
      ['10Y', '140', '68', '62'],
      ['12Y', '152', '72', '66'],
      ['14Y', '164', '76', '70'],
    ]
  }
};

export default function SizeChartModal({ isOpen, onClose, category, subcategory }: SizeChartModalProps) {
  // Determine if it's a bottom
  const isBottom = subcategory?.toLowerCase().match(/trouser|pant|jean|short|bottom|skirt/);
  
  // Construct the key (e.g. 'men_tops', 'women_bottoms')
  let chartKey = category;
  if (category !== 'kids') {
    chartKey = isBottom ? `${category}_bottoms` : `${category}_tops`;
  }
  
  const chartData = CHARTS[chartKey] || CHARTS['women_tops'];

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
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] bg-cream border border-sand-dark shadow-2xl flex flex-col pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-sand-dark flex-shrink-0">
                <h2 className="font-display text-2xl text-ink flex items-center gap-2">
                  <Ruler size={20} className="text-gold" /> Fit & Sizing Guide
                </h2>
                <button onClick={onClose} className="p-1 text-ink-light hover:text-ink transition-colors bg-sand rounded-full">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10">
                <div className="text-center mb-8">
                  <h3 className="font-display text-3xl text-ink capitalize mb-3">{category} Size Chart</h3>
                  <p className="font-body text-sm text-ink-light leading-relaxed max-w-md mx-auto">
                    General sizing guidelines. Measurements are in inches (or cm for kids) and represent body measurements, not garment dimensions.
                  </p>
                </div>
                
                <div className="overflow-x-auto border border-sand-dark shadow-sm bg-cream">
                  <table className="w-full text-left border-collapse min-w-[400px]">
                    <thead>
                      <tr className="bg-sand/30">
                        {chartData.headers.map((h, i) => (
                          <th key={i} className={`font-body text-xs tracking-widest uppercase text-ink-light py-4 px-6 border-b border-sand-dark font-semibold ${i === 0 ? 'text-left' : 'text-center'}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.rows.map((row, i) => (
                        <tr key={i} className="border-b border-sand-dark/50 last:border-0 hover:bg-sand/10 transition-colors">
                          {row.map((cell, j) => (
                            <td key={j} className={`py-4 px-6 font-body text-sm ${j === 0 ? 'font-semibold text-ink text-left' : 'text-ink-light text-center'}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 pt-6 border-t border-sand-dark flex flex-col items-center justify-center gap-2">
                  <p className="font-body text-xs text-ink-light tracking-wide uppercase">Need styling or sizing advice?</p>
                  <p className="font-body text-sm text-ink">WhatsApp us directly for personal assistance.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
