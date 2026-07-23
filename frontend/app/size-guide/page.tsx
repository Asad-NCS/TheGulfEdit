'use client';

import { useState } from 'react';
import { Ruler } from 'lucide-react';

// ─── Size data ──────────────────────────────────────────────────────────────
type Measurements = { chest: string; waist: string; hip: string };

const WOMEN: Record<string, Measurements> = {
  XS:  { chest: '32"', waist: '24"', hip: '35"' },
  S:   { chest: '34"', waist: '26"', hip: '37"' },
  M:   { chest: '36"', waist: '28"', hip: '39"' },
  L:   { chest: '38"', waist: '30"', hip: '41"' },
  XL:  { chest: '40"', waist: '32"', hip: '43"' },
  XXL: { chest: '42"', waist: '34"', hip: '45"' },
};

const MEN: Record<string, Measurements> = {
  S:   { chest: '36–38"', waist: '30–32"', hip: '37–39"' },
  M:   { chest: '39–41"', waist: '33–35"', hip: '40–42"' },
  L:   { chest: '42–44"', waist: '36–38"', hip: '43–45"' },
  XL:  { chest: '45–47"', waist: '39–41"', hip: '46–48"' },
  XXL: { chest: '48–50"', waist: '42–44"', hip: '49–51"' },
};

// Scale multipliers relative to the M/L base size
type Scale = { shoulder: number; waist: number; hip: number };
const WOMEN_SCALE: Record<string, Scale> = {
  XS:  { shoulder: 0.88, waist: 0.82, hip: 0.90 },
  S:   { shoulder: 0.93, waist: 0.89, hip: 0.94 },
  M:   { shoulder: 1.00, waist: 1.00, hip: 1.00 },
  L:   { shoulder: 1.07, waist: 1.11, hip: 1.07 },
  XL:  { shoulder: 1.13, waist: 1.22, hip: 1.13 },
  XXL: { shoulder: 1.19, waist: 1.33, hip: 1.19 },
};
const MEN_SCALE: Record<string, Scale> = {
  S:   { shoulder: 0.90, waist: 0.87, hip: 0.91 },
  M:   { shoulder: 0.95, waist: 0.94, hip: 0.95 },
  L:   { shoulder: 1.00, waist: 1.00, hip: 1.00 },
  XL:  { shoulder: 1.07, waist: 1.09, hip: 1.07 },
  XXL: { shoulder: 1.14, waist: 1.18, hip: 1.14 },
};

// ─── Body Silhouette SVG ────────────────────────────────────────────────────
// ViewBox: 0 0 420 460
// Body centered at x=210. Left label zone: x=0–110. Right arm zone: x=290–380.
function BodySilhouette({
  gender, scale, measurements, active, onHover,
}: {
  gender: 'women' | 'men';
  scale: Scale;
  measurements: Measurements;
  active: string | null;
  onHover: (k: string | null) => void;
}) {
  const isFemale = gender === 'women';
  const cx = 210;  // center X

  // ── Key body landmarks (base = M/L size) ──
  // All widths are HALF-widths from center
  const HEAD_R    = 24;
  const HEAD_CY   = 28;
  const NECK_HW   = 10;
  const NECK_TOP  = HEAD_CY + HEAD_R;          // 52
  const NECK_BOT  = NECK_TOP + 18;             // 70

  const SHW = 82 * scale.shoulder;             // shoulder half-width
  const CHW = isFemale ? 66 * 1 : 70 * 1;     // chest half-width (chest scales with shoulder for simplicity)
  const shChest = (SHW / 82) * CHW;
  const WW  = isFemale ? 48 * scale.waist : 58 * scale.waist;   // waist half-width
  const HW  = isFemale ? 70 * scale.hip   : 66 * scale.hip;     // hip half-width

  const SHOULDER_Y  = NECK_BOT + 2;            // 72
  const CHEST_Y     = SHOULDER_Y + 40;         // 112
  const UNDERBUST_Y = CHEST_Y + 22;            // 134 (only for women)
  const WAIST_Y     = UNDERBUST_Y + (isFemale ? 30 : 22); // 164 / 156
  const HIP_Y       = WAIST_Y + 38;            // 202 / 194
  const CROTCH_Y    = HIP_Y + 28;              // 230
  const LEG_BOT_Y   = CROTCH_Y + 170;          // 400

  const LEG_HW   = 18;                         // each leg half-width
  const LEG_GAP  = isFemale ? 8 : 10;          // gap between legs at crotch

  // Arm shape
  const ARM_TOP_Y    = SHOULDER_Y + 4;
  const ARM_BOT_Y    = WAIST_Y + 10;
  const ARM_OUTER_HW = isFemale ? 13 : 16;
  const ARM_INNER_HW = 3;

  // Left body outline (from shoulder going down left side)
  const leftBody = [
    `M ${cx} ${NECK_BOT}`,
    // Neck corners → left shoulder
    `L ${cx - NECK_HW} ${NECK_BOT}`,
    `C ${cx - NECK_HW} ${NECK_BOT + 2}, ${cx - SHW} ${SHOULDER_Y - 2}, ${cx - SHW} ${SHOULDER_Y}`,
    // Shoulder → chest
    `C ${cx - SHW} ${CHEST_Y - 14}, ${cx - shChest} ${CHEST_Y - 4}, ${cx - shChest} ${CHEST_Y}`,
    // Chest → waist (hourglass for women, slight taper for men)
    `C ${cx - shChest} ${isFemale ? UNDERBUST_Y - 4 : WAIST_Y - 18}, ${cx - WW} ${WAIST_Y - 6}, ${cx - WW} ${WAIST_Y}`,
    // Waist → hip
    `C ${cx - WW} ${HIP_Y - 16}, ${cx - HW} ${HIP_Y - 4}, ${cx - HW} ${HIP_Y}`,
    // Hip → crotch
    `C ${cx - HW} ${CROTCH_Y - 8}, ${cx - LEG_GAP - LEG_HW * 2} ${CROTCH_Y - 2}, ${cx - LEG_GAP - LEG_HW} ${CROTCH_Y}`,
    // Left leg down
    `L ${cx - LEG_GAP - LEG_HW * 2} ${LEG_BOT_Y}`,
    `L ${cx - LEG_GAP} ${LEG_BOT_Y}`,
    // Inner crotch
    `L ${cx - LEG_GAP} ${CROTCH_Y + 8}`,
    // Right inner leg going up (mirror)
    `L ${cx + LEG_GAP} ${CROTCH_Y + 8}`,
    `L ${cx + LEG_GAP} ${LEG_BOT_Y}`,
    `L ${cx + LEG_GAP + LEG_HW * 2} ${LEG_BOT_Y}`,
    // Right crotch → hip
    `C ${cx + LEG_GAP + LEG_HW} ${CROTCH_Y}, ${cx + HW} ${CROTCH_Y - 8}, ${cx + HW} ${HIP_Y}`,
    // Hip → waist (right side)
    `C ${cx + HW} ${HIP_Y - 4}, ${cx + WW} ${WAIST_Y - 16}, ${cx + WW} ${WAIST_Y}`,
    // Waist → chest (right side)
    `C ${cx + WW} ${WAIST_Y - 6}, ${cx + shChest} ${isFemale ? UNDERBUST_Y - 4 : WAIST_Y - 18}, ${cx + shChest} ${CHEST_Y}`,
    // Chest → shoulder (right side)
    `C ${cx + shChest} ${CHEST_Y - 4}, ${cx + SHW} ${SHOULDER_Y - 14}, ${cx + SHW} ${SHOULDER_Y}`,
    // Shoulder → neck top right
    `C ${cx + SHW} ${SHOULDER_Y - 2}, ${cx + NECK_HW} ${NECK_BOT + 2}, ${cx + NECK_HW} ${NECK_BOT}`,
    `L ${cx} ${NECK_BOT}`,
    `Z`,
  ].join(' ');

  // Left arm
  const LA = [
    `M ${cx - SHW + 2} ${ARM_TOP_Y}`,
    `C ${cx - SHW - ARM_OUTER_HW} ${ARM_TOP_Y + 10}, ${cx - SHW - ARM_OUTER_HW - 4} ${ARM_BOT_Y - 30}, ${cx - SHW - ARM_OUTER_HW + 2} ${ARM_BOT_Y}`,
    `L ${cx - SHW - ARM_INNER_HW} ${ARM_BOT_Y}`,
    `C ${cx - SHW - ARM_INNER_HW + 2} ${ARM_BOT_Y - 30}, ${cx - SHW + ARM_INNER_HW} ${ARM_TOP_Y + 8}, ${cx - SHW + ARM_INNER_HW + 2} ${ARM_TOP_Y}`,
    `Z`,
  ].join(' ');

  // Right arm (mirror)
  const RA = [
    `M ${cx + SHW - 2} ${ARM_TOP_Y}`,
    `C ${cx + SHW + ARM_OUTER_HW} ${ARM_TOP_Y + 10}, ${cx + SHW + ARM_OUTER_HW + 4} ${ARM_BOT_Y - 30}, ${cx + SHW + ARM_OUTER_HW - 2} ${ARM_BOT_Y}`,
    `L ${cx + SHW + ARM_INNER_HW} ${ARM_BOT_Y}`,
    `C ${cx + SHW + ARM_INNER_HW - 2} ${ARM_BOT_Y - 30}, ${cx + SHW - ARM_INNER_HW} ${ARM_TOP_Y + 8}, ${cx + SHW - ARM_INNER_HW - 2} ${ARM_TOP_Y}`,
    `Z`,
  ].join(' ');

  // ── Callout data (numbered markers, no text labels on figure) ──
  const markers = [
    { key: 'chest', num: '1', y: CHEST_Y, bodyEdgeX: cx + shChest },
    { key: 'waist', num: '2', y: WAIST_Y, bodyEdgeX: cx + WW      },
    { key: 'hip',   num: '3', y: HIP_Y,   bodyEdgeX: cx + HW      },
  ];

  return (
    <svg viewBox="0 0 420 460" className="w-full max-w-[280px] mx-auto" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="figGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#E8DDD0" />
          <stop offset="100%" stopColor="#D4C4B0" />
        </linearGradient>
      </defs>

      {/* Head */}
      <circle cx={cx} cy={HEAD_CY} r={HEAD_R}
        fill="url(#figGrad)" stroke="#1A1610" strokeWidth="1.8"
        style={{ transition: 'all 0.5s ease' }} />

      {/* Neck */}
      <rect x={cx - NECK_HW} y={NECK_TOP} width={NECK_HW * 2} height={NECK_BOT - NECK_TOP}
        fill="url(#figGrad)" />

      {/* Arms */}
      <path d={LA} fill="url(#figGrad)" stroke="#1A1610" strokeWidth="1.4" strokeLinejoin="round"
        style={{ transition: 'all 0.5s cubic-bezier(0.34,1.2,0.64,1)' }} />
      <path d={RA} fill="url(#figGrad)" stroke="#1A1610" strokeWidth="1.4" strokeLinejoin="round"
        style={{ transition: 'all 0.5s cubic-bezier(0.34,1.2,0.64,1)' }} />

      {/* Body */}
      <path d={leftBody} fill="url(#figGrad)" stroke="#1A1610" strokeWidth="1.8" strokeLinejoin="round"
        style={{ transition: 'all 0.5s cubic-bezier(0.34,1.2,0.64,1)' }} />

      {/* ── Numbered measurement markers ── */}
      {markers.map((m) => {
        const isActive = active === m.key;
        const gold = '#C4953A';
        const ink  = '#1A1610';
        const MARKER_R = 11;
        const markerX = m.bodyEdgeX + 20;

        return (
          <g key={m.key}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => onHover(m.key)}
            onMouseLeave={() => onHover(null)}
          >
            {/* Dashed guide line across body (left edge to marker) */}
            <line
              x1={cx - (m.key === 'chest' ? shChest : m.key === 'waist' ? WW : HW)}
              y1={m.y} x2={markerX - MARKER_R} y2={m.y}
              stroke={isActive ? gold : ink}
              strokeWidth={isActive ? 1 : 0.6}
              strokeDasharray="4 3"
              opacity={isActive ? 0.85 : 0.22}
              style={{ transition: 'all 0.25s ease' }}
            />
            {/* Short connector line from body edge to marker */}
            <line
              x1={m.bodyEdgeX} y1={m.y} x2={markerX - MARKER_R} y2={m.y}
              stroke={isActive ? gold : ink}
              strokeWidth={isActive ? 1.5 : 0.8}
              opacity={isActive ? 1 : 0.4}
              style={{ transition: 'all 0.25s ease' }}
            />
            {/* Numbered circle marker */}
            <circle
              cx={markerX} cy={m.y} r={MARKER_R}
              fill={isActive ? gold : '#F5F0EA'}
              stroke={isActive ? gold : ink}
              strokeWidth={isActive ? 0 : 1}
              style={{ transition: 'all 0.25s ease' }}
            />
            <text
              x={markerX} y={m.y + 4}
              fontSize="11" fontWeight="700"
              fill={isActive ? '#FDFAF6' : ink}
              fontFamily="DM Sans, sans-serif"
              textAnchor="middle"
              style={{ transition: 'all 0.25s ease', userSelect: 'none' }}
            >
              {m.num}
            </text>
          </g>
        );
      })}
    </svg>
  );
}


// ─── Full size tables ────────────────────────────────────────────────────────
const TABLE_SECTIONS = [
  {
    id: 'women', title: 'Women — Full Chart',
    cols: ['Size','Chest (in)','Waist (in)','Hip (in)','Chest (cm)','Waist (cm)','Hip (cm)'],
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
    id: 'men', title: 'Men — Full Chart',
    cols: ['Size','Chest (in)','Waist (in)','Hip (in)','Chest (cm)','Waist (cm)','Hip (cm)'],
    rows: [
      ['S',  '36–38','30–32','37–39','91–96',  '76–81',  '94–99'],
      ['M',  '39–41','33–35','40–42','99–104', '84–89',  '102–107'],
      ['L',  '42–44','36–38','43–45','107–112','91–96',  '109–114'],
      ['XL', '45–47','39–41','46–48','114–119','99–104', '117–122'],
      ['XXL','48–50','42–44','49–51','122–127','107–112','124–129'],
    ],
  },
  {
    id: 'kids', title: 'Kids',
    cols: ['Age','Height (cm)','Chest (cm)','Waist (cm)'],
    rows: [
      ['2Y','92','52','50'],['4Y','104','56','54'],
      ['6Y','116','60','56'],['8Y','128','64','58'],
      ['10Y','140','68','62'],['12Y','152','72','66'],['14Y','164','76','70'],
    ],
  },
  {
    id: 'bottoms', title: 'Bottoms (Waist Sizes)',
    cols: ['Size','Waist (in)','Hip (in)','Inseam (in)'],
    rows: [
      ['26','26','35','30'],['28','28','37','30'],['30','30','39','32'],
      ['32','32','41','32'],['34','34','43','34'],['36','36','45','34'],['38','38','47','34'],
    ],
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export default function SizeGuidePage() {
  const [gender, setGender]     = useState<'women' | 'men'>('women');
  const [wSize,  setWSize]      = useState('M');
  const [mSize,  setMSize]      = useState('L');
  const [active, setActive]     = useState<string | null>(null);

  const isWomen    = gender === 'women';
  const sizes      = isWomen ? Object.keys(WOMEN) : Object.keys(MEN);
  const curSize    = isWomen ? wSize : mSize;
  const setCurSize = isWomen ? setWSize : setMSize;
  const meas       = isWomen ? WOMEN[wSize] : MEN[mSize];
  const scale      = isWomen ? WOMEN_SCALE[wSize] : MEN_SCALE[mSize];

  const measCards = [
    { key: 'chest', num: '1', label: 'Chest', value: meas.chest, desc: 'Fullest part of chest, tape horizontal' },
    { key: 'waist', num: '2', label: 'Waist', value: meas.waist, desc: 'Narrowest point, keep tape relaxed'      },
    { key: 'hip',   num: '3', label: 'Hip',   value: meas.hip,   desc: 'Fullest part of hips and seat'           },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-sand rounded-full mb-6">
          <Ruler size={28} strokeWidth={1.5} />
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-4">Size Guide</h1>
        <p className="font-body text-ink-light text-sm">
          Find your perfect fit. Select a gender and size — hover the measurement cards to highlight each point.
        </p>
      </div>

      {/* ── Interactive silhouette ── */}
      <div className="border border-sand-dark bg-sand/40 p-6 md:p-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* LEFT — Figure + controls */}
          <div className="flex flex-col items-center gap-6">
            {/* Gender toggle */}
            <div className="inline-flex border border-sand-dark overflow-hidden">
              {(['women', 'men'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`px-10 py-2.5 font-body text-xs tracking-[0.18em] uppercase transition-all duration-200 ${
                    gender === g ? 'bg-ink text-cream' : 'text-ink-light hover:text-ink bg-cream'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* SVG Figure */}
            <BodySilhouette
              gender={gender}
              scale={scale}
              measurements={meas}
              active={active}
              onHover={setActive}
            />

            {/* Size buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setCurSize(s)}
                  className={`min-w-[48px] h-11 px-3 border font-body text-sm font-medium transition-all duration-200 ${
                    curSize === s
                      ? 'bg-ink text-cream border-ink shadow-md scale-105'
                      : 'border-sand-dark text-ink hover:border-ink bg-cream'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <p className="font-body text-[11px] text-ink-light/50 tracking-wider uppercase">
              Hover the cards on the right to highlight points
            </p>
          </div>

          {/* RIGHT — Measurement cards */}
          <div className="space-y-3">
            <div className="mb-6">
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-ink-light/50 mb-1">Selected</p>
              <p className="font-display text-6xl text-ink leading-none">{curSize}</p>
            </div>

            {measCards.map((m) => (
              <div
                key={m.key}
                onMouseEnter={() => setActive(m.key)}
                onMouseLeave={() => setActive(null)}
                className={`border p-5 cursor-default transition-all duration-200 ${
                  active === m.key
                    ? 'border-gold bg-gold/5 shadow-sm'
                    : 'border-sand-dark bg-cream hover:border-ink/20'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Numbered badge matching SVG marker */}
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold font-body shrink-0 transition-all duration-200 ${
                      active === m.key ? 'bg-gold text-cream' : 'bg-sand border border-sand-dark text-ink'
                    }`}>
                      {m.num}
                    </span>
                    <p className={`font-body text-[10px] tracking-[0.22em] uppercase transition-colors ${
                      active === m.key ? 'text-gold' : 'text-ink-light'
                    }`}>
                      {m.label}
                    </p>
                  </div>
                  <p className="font-display text-3xl text-ink shrink-0">{m.value}</p>
                </div>
                <p className="font-body text-xs text-ink-light/55 mt-1.5 pl-10">{m.desc}</p>
              </div>
            ))}

            <p className="font-body text-[11px] text-ink-light/40 pt-1">
              * Body measurements, not garment dimensions.
            </p>
          </div>
        </div>
      </div>

      {/* ── Full size tables ── */}
      <div className="space-y-14">
        {TABLE_SECTIONS.map((s) => (
          <div key={s.id} id={s.id} className="scroll-mt-32">
            <h2 className="font-display text-2xl text-ink mb-5">{s.title}</h2>
            <div className="overflow-x-auto border border-sand-dark bg-cream">
              <table className="w-full text-left border-collapse min-w-[480px]">
                <thead>
                  <tr className="bg-sand border-b border-sand-dark">
                    {s.cols.map((c, i) => (
                      <th key={i} className="py-3.5 px-5 font-body text-xs tracking-wider uppercase text-ink font-medium">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-body text-sm text-ink">
                  {s.rows.map((row, i) => (
                    <tr key={i} className="border-b border-sand-dark last:border-0 hover:bg-sand/30 transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className={`py-4 px-5 ${j === 0 ? 'font-medium' : 'text-ink-light'}`}>
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
      <div className="mt-20 pt-14 border-t border-sand-dark">
        <h2 className="font-display text-2xl text-ink mb-8 text-center">How to Measure</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { n: '1', t: 'Chest', d: 'Wrap the tape around the fullest part of your chest, keeping it horizontal and parallel to the floor.' },
            { n: '2', t: 'Waist', d: 'Measure around the narrowest part of your torso — where your body naturally bends when you lean sideways.' },
            { n: '3', t: 'Hip',   d: 'Measure around the fullest part of your hips and seat, keeping the tape horizontal throughout.' },
          ].map((m) => (
            <div key={m.n} className="bg-sand p-6 border border-sand-dark">
              <p className="font-display text-3xl text-gold/30 mb-1">{m.n}</p>
              <h3 className="font-display text-lg text-ink mb-2">{m.t}</h3>
              <p className="font-body text-sm text-ink-light leading-relaxed">{m.desc || m.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
