'use client';

import { useState } from 'react';
import { Ruler } from 'lucide-react';

// ── Size data ──────────────────────────────────────────────────────────────
const WOMEN_SIZES: Record<string, { chest: string; waist: string; hip: string }> = {
  XS:  { chest: '32"', waist: '24"', hip: '35"' },
  S:   { chest: '34"', waist: '26"', hip: '37"' },
  M:   { chest: '36"', waist: '28"', hip: '39"' },
  L:   { chest: '38"', waist: '30"', hip: '41"' },
  XL:  { chest: '40"', waist: '32"', hip: '43"' },
  XXL: { chest: '42"', waist: '34"', hip: '45"' },
};

const MEN_SIZES: Record<string, { chest: string; waist: string; hip: string }> = {
  S:   { chest: '36–38"', waist: '30–32"', hip: '37–39"' },
  M:   { chest: '39–41"', waist: '33–35"', hip: '40–42"' },
  L:   { chest: '42–44"', waist: '36–38"', hip: '43–45"' },
  XL:  { chest: '45–47"', waist: '39–41"', hip: '46–48"' },
  XXL: { chest: '48–50"', waist: '42–44"', hip: '49–51"' },
};

// Scale values for SVG silhouette (waist pinch, shoulder width, hip width)
const WOMEN_SCALE: Record<string, { shoulder: number; chest: number; waist: number; hip: number }> = {
  XS:  { shoulder: 0.88, chest: 0.88, waist: 0.80, hip: 0.90 },
  S:   { shoulder: 0.92, chest: 0.92, waist: 0.86, hip: 0.94 },
  M:   { shoulder: 1.00, chest: 1.00, waist: 1.00, hip: 1.00 },
  L:   { shoulder: 1.06, chest: 1.06, waist: 1.08, hip: 1.06 },
  XL:  { shoulder: 1.12, chest: 1.12, waist: 1.16, hip: 1.12 },
  XXL: { shoulder: 1.18, chest: 1.18, waist: 1.24, hip: 1.18 },
};

const MEN_SCALE: Record<string, { shoulder: number; chest: number; waist: number; hip: number }> = {
  S:   { shoulder: 0.90, chest: 0.90, waist: 0.87, hip: 0.91 },
  M:   { shoulder: 0.96, chest: 0.96, waist: 0.94, hip: 0.96 },
  L:   { shoulder: 1.00, chest: 1.00, waist: 1.00, hip: 1.00 },
  XL:  { shoulder: 1.07, chest: 1.07, waist: 1.08, hip: 1.07 },
  XXL: { shoulder: 1.14, chest: 1.14, waist: 1.16, hip: 1.14 },
};

// ── SVG Body Silhouette ────────────────────────────────────────────────────
function BodySilhouette({
  gender,
  scale,
  measurements,
  activePoint,
  onHover,
}: {
  gender: 'women' | 'men';
  scale: { shoulder: number; chest: number; waist: number; hip: number };
  measurements: { chest: string; waist: string; hip: string };
  activePoint: string | null;
  onHover: (pt: string | null) => void;
}) {
  const isFemale = gender === 'women';
  const cx = 100; // center x
  const headR = 14;
  const headCy = 24;
  const neckTop = headCy + headR;
  const neckBot = neckTop + 10;
  const shoulderW = 38 * scale.shoulder;
  const chestW    = (isFemale ? 32 : 34) * scale.chest;
  const waistW    = (isFemale ? 22 : 28) * scale.waist;
  const hipW      = (isFemale ? 34 : 32) * scale.hip;
  const torsoTop  = neckBot;
  const chestY    = torsoTop + 18;
  const waistY    = chestY + (isFemale ? 26 : 24);
  const hipY      = waistY + (isFemale ? 22 : 18);
  const groinY    = hipY + 16;
  const legBotY   = groinY + 90;
  const legGapX   = isFemale ? 9 : 11;
  const armTopY   = torsoTop + 5;
  const armBotY   = torsoTop + 70;
  const armW      = isFemale ? 9 : 11;

  // Smooth body path using cubic beziers
  const bodyPath = [
    // Left side: shoulder → chest → waist → hip → groin
    `M ${cx - shoulderW} ${torsoTop}`,
    `C ${cx - shoulderW} ${chestY - 8}, ${cx - chestW} ${chestY - 4}, ${cx - chestW} ${chestY}`,
    `C ${cx - chestW} ${waistY - 10}, ${cx - waistW} ${waistY - 4}, ${cx - waistW} ${waistY}`,
    `C ${cx - waistW} ${hipY - 8}, ${cx - hipW} ${hipY - 4}, ${cx - hipW} ${hipY}`,
    `C ${cx - hipW} ${hipY + 8}, ${cx - legGapX - 10} ${groinY - 4}, ${cx - legGapX} ${groinY}`,
    // Left leg
    `L ${cx - legGapX - 2} ${legBotY}`,
    // Right leg
    `L ${cx + legGapX + 2} ${legBotY}`,
    // Right side: groin → hip → waist → chest → shoulder (mirrored)
    `L ${cx + legGapX} ${groinY}`,
    `C ${cx + legGapX + 10} ${groinY - 4}, ${cx + hipW} ${hipY + 8}, ${cx + hipW} ${hipY}`,
    `C ${cx + hipW} ${hipY - 4}, ${cx + waistW} ${waistY - 8}, ${cx + waistW} ${waistY}`,
    `C ${cx + waistW} ${waistY - 4}, ${cx + chestW} ${chestY - 10}, ${cx + chestW} ${chestY}`,
    `C ${cx + chestW} ${chestY - 4}, ${cx + shoulderW} ${torsoTop + 4}, ${cx + shoulderW} ${torsoTop}`,
    `Z`,
  ].join(' ');

  // Left arm
  const leftArm = [
    `M ${cx - shoulderW + 2} ${armTopY}`,
    `C ${cx - shoulderW - armW} ${armTopY + 20}, ${cx - shoulderW - armW} ${armBotY - 20}, ${cx - shoulderW - armW + 4} ${armBotY}`,
    `L ${cx - shoulderW - 2} ${armBotY}`,
    `C ${cx - shoulderW + 4} ${armBotY - 20}, ${cx - shoulderW + 2} ${armTopY + 16}, ${cx - shoulderW + 2} ${armTopY}`,
    `Z`,
  ].join(' ');

  // Right arm
  const rightArm = [
    `M ${cx + shoulderW - 2} ${armTopY}`,
    `C ${cx + shoulderW + armW} ${armTopY + 20}, ${cx + shoulderW + armW} ${armBotY - 20}, ${cx + shoulderW + armW - 4} ${armBotY}`,
    `L ${cx + shoulderW + 2} ${armBotY}`,
    `C ${cx + shoulderW - 4} ${armBotY - 20}, ${cx + shoulderW - 2} ${armTopY + 16}, ${cx + shoulderW - 2} ${armTopY}`,
    `Z`,
  ].join(' ');

  const callouts = [
    {
      key: 'chest',
      label: 'Chest',
      value: measurements.chest,
      y: chestY,
      lineEndX: cx - chestW - 2,
    },
    {
      key: 'waist',
      label: 'Waist',
      value: measurements.waist,
      y: waistY,
      lineEndX: cx - waistW - 2,
    },
    {
      key: 'hip',
      label: 'Hip',
      value: measurements.hip,
      y: hipY,
      lineEndX: cx - hipW - 2,
    },
  ];

  return (
    <svg
      viewBox="0 0 200 250"
      className="w-full max-w-[240px] mx-auto"
      style={{ overflow: 'visible' }}
    >
      {/* Defs */}
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C4953A" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#C4953A" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Head */}
      <circle
        cx={cx} cy={headCy} r={headR}
        fill="#E8DDD0" stroke="#1A1610" strokeWidth="1.5"
        style={{ transition: 'all 0.4s ease' }}
      />
      {/* Neck */}
      <rect
        x={cx - 7} y={neckTop} width={14} height={neckBot - neckTop}
        fill="#E8DDD0" stroke="none"
      />

      {/* Arms */}
      <path d={leftArm} fill="#E8DDD0" stroke="#1A1610" strokeWidth="1.2"
        style={{ transition: 'all 0.4s ease' }} />
      <path d={rightArm} fill="#E8DDD0" stroke="#1A1610" strokeWidth="1.2"
        style={{ transition: 'all 0.4s ease' }} />

      {/* Body */}
      <path
        d={bodyPath}
        fill="url(#bodyGrad)"
        stroke="#1A1610"
        strokeWidth="1.5"
        strokeLinejoin="round"
        style={{ transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}
      />

      {/* Measurement callout lines */}
      {callouts.map((c) => {
        const isActive = activePoint === c.key;
        const textX = 12;
        return (
          <g
            key={c.key}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => onHover(c.key)}
            onMouseLeave={() => onHover(null)}
          >
            {/* Horizontal dashed line across body */}
            <line
              x1={cx - chestW - 30} y1={c.y} x2={cx + chestW + 4} y2={c.y}
              stroke={isActive ? '#C4953A' : '#1A1610'}
              strokeWidth={isActive ? '1' : '0.5'}
              strokeDasharray="3 3"
              opacity={isActive ? 1 : 0.35}
              style={{ transition: 'all 0.25s ease' }}
            />
            {/* Dot on body edge */}
            <circle
              cx={c.lineEndX} cy={c.y} r={isActive ? 3.5 : 2.5}
              fill={isActive ? '#C4953A' : '#1A1610'}
              style={{ transition: 'all 0.25s ease' }}
            />
            {/* Label box */}
            <rect
              x={textX - 4} y={c.y - 10} width={58} height={20}
              fill={isActive ? '#C4953A' : '#F5F0EA'}
              rx="2"
              style={{ transition: 'all 0.25s ease' }}
            />
            <text
              x={textX} y={c.y - 2}
              fontSize="6"
              fill={isActive ? '#FDFAF6' : '#8C7A5E'}
              fontFamily="DM Sans, sans-serif"
              fontWeight="500"
              letterSpacing="0.08em"
              style={{ textTransform: 'uppercase' }}
            >
              {c.label}
            </text>
            <text
              x={textX} y={c.y + 6}
              fontSize="7.5"
              fill={isActive ? '#FDFAF6' : '#1A1610'}
              fontFamily="Cormorant Garamond, serif"
              fontWeight="600"
            >
              {c.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Tables ─────────────────────────────────────────────────────────────────
const TABLE_SECTIONS = [
  {
    id: 'women',
    title: 'Women — Full Chart',
    cols: ['Size', 'Chest (in)', 'Waist (in)', 'Hip (in)', 'Chest (cm)', 'Waist (cm)', 'Hip (cm)'],
    rows: [
      ['XS','32','24','35','81','61','89'],
      ['S', '34','26','37','86','66','94'],
      ['M', '36','28','39','91','71','99'],
      ['L', '38','30','41','96','76','104'],
      ['XL','40','32','43','101','81','109'],
      ['XXL','42','34','45','106','86','114'],
    ],
  },
  {
    id: 'men',
    title: 'Men — Full Chart',
    cols: ['Size','Chest (in)','Waist (in)','Hip (in)','Chest (cm)','Waist (cm)','Hip (cm)'],
    rows: [
      ['S',  '36–38','30–32','37–39','91–96','76–81','94–99'],
      ['M',  '39–41','33–35','40–42','99–104','84–89','102–107'],
      ['L',  '42–44','36–38','43–45','107–112','91–96','109–114'],
      ['XL', '45–47','39–41','46–48','114–119','99–104','117–122'],
      ['XXL','48–50','42–44','49–51','122–127','107–112','124–129'],
    ],
  },
  {
    id: 'kids',
    title: 'Kids',
    cols: ['Age','Height (cm)','Chest (cm)','Waist (cm)'],
    rows: [
      ['2Y','92','52','50'],
      ['4Y','104','56','54'],
      ['6Y','116','60','56'],
      ['8Y','128','64','58'],
      ['10Y','140','68','62'],
      ['12Y','152','72','66'],
      ['14Y','164','76','70'],
    ],
  },
  {
    id: 'bottoms',
    title: 'Bottoms (Waist Sizes)',
    cols: ['Size','Waist (in)','Hip (in)','Inseam (in)'],
    rows: [
      ['26','26','35','30'],
      ['28','28','37','30'],
      ['30','30','39','32'],
      ['32','32','41','32'],
      ['34','34','43','34'],
      ['36','36','45','34'],
      ['38','38','47','34'],
    ],
  },
];

// ── Page ───────────────────────────────────────────────────────────────────
export default function SizeGuidePage() {
  const [gender, setGender] = useState<'women' | 'men'>('women');
  const [womenSize, setWomenSize] = useState('M');
  const [menSize, setMenSize] = useState('L');
  const [activePoint, setActivePoint] = useState<string | null>(null);

  const currentSize   = gender === 'women' ? womenSize : menSize;
  const setCurrentSize = gender === 'women' ? setWomenSize : setMenSize;
  const sizes         = gender === 'women' ? Object.keys(WOMEN_SIZES) : Object.keys(MEN_SIZES);
  const measurements  = gender === 'women' ? WOMEN_SIZES[womenSize] : MEN_SIZES[menSize];
  const scale         = gender === 'women' ? WOMEN_SCALE[womenSize] : MEN_SCALE[menSize];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-sand text-ink rounded-full mb-6">
          <Ruler size={28} strokeWidth={1.5} />
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-4">Size Guide</h1>
        <p className="font-body text-ink-light">
          Find your perfect fit. Hover over the measurements on the model to explore.
        </p>
      </div>

      {/* ── Interactive Silhouette Section ── */}
      <div className="bg-sand/50 border border-sand-dark p-8 md:p-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Controls + Silhouette */}
          <div className="flex flex-col items-center gap-6">
            {/* Gender toggle */}
            <div className="inline-flex border border-sand-dark bg-cream">
              {(['women', 'men'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`px-8 py-2.5 font-body text-xs tracking-[0.15em] uppercase transition-all duration-200 ${
                    gender === g
                      ? 'bg-ink text-cream'
                      : 'text-ink-light hover:text-ink'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Silhouette */}
            <div className="w-full relative py-4">
              <BodySilhouette
                gender={gender}
                scale={scale}
                measurements={measurements}
                activePoint={activePoint}
                onHover={setActivePoint}
              />
            </div>

            {/* Size selector */}
            <div className="flex flex-wrap justify-center gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setCurrentSize(s)}
                  className={`w-12 h-12 border font-body text-sm font-medium transition-all duration-200 ${
                    currentSize === s
                      ? 'bg-ink text-cream border-ink scale-110 shadow-md'
                      : 'border-sand-dark text-ink hover:border-ink bg-cream'
                  }`}
                  style={{ transition: 'all 0.2s ease' }}
                >
                  {s}
                </button>
              ))}
            </div>

            <p className="font-body text-[11px] text-ink-light/60 tracking-wider uppercase text-center">
              Hover callouts on the model · Select a size above
            </p>
          </div>

          {/* Right: Measurement cards */}
          <div className="space-y-4">
            <div className="mb-6">
              <p className="font-body text-xs tracking-[0.2em] uppercase text-ink-light/60 mb-1">Selected Size</p>
              <p className="font-display text-5xl text-ink">{currentSize}</p>
            </div>

            {[
              { key: 'chest', label: 'Chest', value: measurements.chest, desc: 'Fullest part of chest, tape horizontal' },
              { key: 'waist', label: 'Waist', value: measurements.waist, desc: 'Narrowest point, keep tape relaxed' },
              { key: 'hip',   label: 'Hip',   value: measurements.hip,   desc: 'Fullest part of hips & seat' },
            ].map((m) => (
              <div
                key={m.key}
                onMouseEnter={() => setActivePoint(m.key)}
                onMouseLeave={() => setActivePoint(null)}
                className={`border p-5 cursor-default transition-all duration-200 ${
                  activePoint === m.key
                    ? 'border-gold bg-gold/5'
                    : 'border-sand-dark bg-cream hover:border-ink/30'
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <p className={`font-body text-[10px] tracking-[0.2em] uppercase transition-colors ${
                    activePoint === m.key ? 'text-gold' : 'text-ink-light'
                  }`}>
                    {m.label}
                  </p>
                  <p className="font-display text-2xl text-ink">{m.value}</p>
                </div>
                <p className="font-body text-xs text-ink-light/60 mt-1">{m.desc}</p>
              </div>
            ))}

            <p className="font-body text-xs text-ink-light/50 pt-2">
              * Measurements are body measurements, not garment dimensions.
            </p>
          </div>
        </div>
      </div>

      {/* ── Full Size Charts ── */}
      <div className="space-y-16">
        {TABLE_SECTIONS.map((section) => (
          <div key={section.id} id={section.id} className="scroll-mt-32">
            <h2 className="font-display text-2xl text-ink mb-6">{section.title}</h2>
            <div className="overflow-x-auto border border-sand-dark bg-cream">
              <table className="w-full text-left border-collapse min-w-[500px]">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: '1', title: 'Chest', desc: 'Measure around the fullest part of your chest, keeping the tape horizontal and parallel to the floor.' },
            { num: '2', title: 'Waist', desc: 'Measure around the narrowest part of your torso — typically where your body bends when you lean sideways.' },
            { num: '3', title: 'Hip',   desc: 'Measure around the fullest part of your hips and seat, keeping the tape horizontal.' },
          ].map((m) => (
            <div key={m.num} className="bg-sand p-6 border border-sand-dark">
              <p className="font-display text-3xl text-gold/40 mb-2">{m.num}</p>
              <h3 className="font-display text-lg text-ink mb-2">{m.title}</h3>
              <p className="font-body text-sm text-ink-light leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
