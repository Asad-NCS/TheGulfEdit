import type { Metadata } from 'next';
import { Ruler } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Size Guide',
  description: 'Detailed size charts for Women, Men, and Kids clothing at The Gulf Edit.',
};

const SECTIONS = [
  {
    id: 'women',
    title: 'Women',
    desc: 'Measurements refer to body size, not garment dimensions.',
    cols: ['Size', 'Chest (in)', 'Waist (in)', 'Hip (in)', 'Chest (cm)', 'Waist (cm)', 'Hip (cm)'],
    rows: [
      ['XS', '32', '24', '35', '81', '61', '89'],
      ['S',  '34', '26', '37', '86', '66', '94'],
      ['M',  '36', '28', '39', '91', '71', '99'],
      ['L',  '38', '30', '41', '96', '76', '104'],
      ['XL', '40', '32', '43', '101', '81', '109'],
      ['XXL','42', '34', '45', '106', '86', '114'],
    ]
  },
  {
    id: 'men',
    title: 'Men',
    desc: 'Measurements refer to body size, not garment dimensions.',
    cols: ['Size', 'Chest (in)', 'Waist (in)', 'Hip (in)', 'Chest (cm)', 'Waist (cm)', 'Hip (cm)'],
    rows: [
      ['S',  '36-38', '30-32', '37-39', '91-96',   '76-81',   '94-99'],
      ['M',  '39-41', '33-35', '40-42', '99-104',  '84-89',   '102-107'],
      ['L',  '42-44', '36-38', '43-45', '107-112', '91-96',   '109-114'],
      ['XL', '45-47', '39-41', '46-48', '114-119', '99-104',  '117-122'],
      ['XXL','48-50', '42-44', '49-51', '122-127', '107-112', '124-129'],
    ]
  },
  {
    id: 'kids',
    title: 'Kids',
    desc: 'Sizing is based on average height and age.',
    cols: ['Age', 'Height (cm)', 'Chest (cm)', 'Waist (cm)'],
    rows: [
      ['2Y',  '92',  '52', '50'],
      ['4Y',  '104', '56', '54'],
      ['6Y',  '116', '60', '56'],
      ['8Y',  '128', '64', '58'],
      ['10Y', '140', '68', '62'],
      ['12Y', '152', '72', '66'],
      ['14Y', '164', '76', '70'],
    ]
  },
  {
    id: 'bottoms',
    title: 'Bottoms (Waist Sizes)',
    desc: 'Standard sizing for trousers, jeans, and chinos.',
    cols: ['Size', 'Waist (in)', 'Hip (in)', 'Inseam (in)'],
    rows: [
      ['26', '26', '35', '30'],
      ['28', '28', '37', '30'],
      ['30', '30', '39', '32'],
      ['32', '32', '41', '32'],
      ['34', '34', '43', '34'],
      ['36', '36', '45', '34'],
      ['38', '38', '47', '34'],
    ]
  }
];

export default function SizeGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-sand text-ink rounded-full mb-6">
          <Ruler size={32} strokeWidth={1.5} />
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-4">Size Guide</h1>
        <p className="font-body text-ink-light">
          Find your perfect fit. Our garments follow standard Gulf sizing from Landmark Group.
        </p>
      </div>

      <div className="space-y-16">
        {SECTIONS.map((section) => (
          <div key={section.id} id={section.id} className="scroll-mt-32">
            <div className="mb-6">
              <h2 className="font-display text-2xl text-ink mb-2">{section.title}</h2>
              <p className="font-body text-sm text-ink-light">{section.desc}</p>
            </div>
            
            <div className="overflow-x-auto border border-sand-dark bg-cream">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-sand border-b border-sand-dark">
                    {section.cols.map((col, i) => (
                      <th key={i} className="py-4 px-6 font-body text-xs tracking-wider uppercase text-ink font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-body text-sm text-ink">
                  {section.rows.map((row, i) => (
                    <tr key={i} className="border-b border-sand-dark last:border-0 hover:bg-sand/30 transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className={`py-4 px-6 ${j === 0 ? 'font-medium' : 'text-ink-light'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* How to Measure */}
      <div className="mt-20 pt-16 border-t border-sand-dark">
        <h2 className="font-display text-2xl text-ink mb-8 text-center">How to Measure</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="bg-sand p-6 border border-sand-dark">
            <h3 className="font-display text-lg text-ink mb-2">1. Chest</h3>
            <p className="font-body text-sm text-ink-light leading-relaxed">
              Measure around the fullest part of your chest, keeping the measuring tape horizontal.
            </p>
          </div>
          <div className="bg-sand p-6 border border-sand-dark">
            <h3 className="font-display text-lg text-ink mb-2">2. Waist</h3>
            <p className="font-body text-sm text-ink-light leading-relaxed">
              Measure around the narrowest part (typically where your body bends side to side), keeping the tape horizontal.
            </p>
          </div>
          <div className="bg-sand p-6 border border-sand-dark">
            <h3 className="font-display text-lg text-ink mb-2">3. Hip</h3>
            <p className="font-body text-sm text-ink-light leading-relaxed">
              Measure around the fullest part of your hips, keeping the tape horizontal.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
