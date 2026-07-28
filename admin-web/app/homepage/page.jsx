'use client';

import { API_URL } from '@/config';
import React, { useState, useEffect, useRef } from 'react';
import '../patients/dashboard.css';
import '../services/services.css';
import Sidebar from '@/components/Sidebar';
import './homepage.css';

/* ── SVG Icons ── */
const I = ({ d, s = 16 }) => {
  if (Array.isArray(d)) {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {d.map((path, idx) => <path key={idx} d={path} />)}
      </svg>
    );
  }
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
};

const ICONS = {
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  cal:     "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  users:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",
  logout:  "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  plus:    "M12 5v14M5 12h14",
  trash:   "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  doc:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  info:    "M12 16v-4 M12 8h.01 M12 2a10 10 0 1010 10A10 10 0 0012 2z",
  globe:   "M12 2a10 10 0 1010 10A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  clock:   "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  upload:  "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
};

/* ── Icon Picker Library ── */
const IP = (paths, vb = '0 0 24 24') => ({ paths: Array.isArray(paths) ? paths : [paths], vb });
const ICON_PICKER_LIBRARY = [
  // ─ Health ─
  { key: 'heart',       label: 'Heart',        cat: 'Health', ...IP('M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z') },
  { key: 'activity',    label: 'Activity',     cat: 'Health', ...IP('M22 12h-4l-3 9L9 3l-3 9H2') },
  { key: 'stethoscope', label: 'Stethoscope',  cat: 'Health', ...IP(['M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3', 'M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4']) },
  { key: 'thermometer', label: 'Thermometer',  cat: 'Health', ...IP('M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z') },
  { key: 'droplet',     label: 'Droplet',      cat: 'Health', ...IP('M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13s-7 8.7-7 13a7 7 0 0 0 7 7z') },
  { key: 'eye',         label: 'Eye',          cat: 'Health', ...IP(['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z']) },
  { key: 'brain',       label: 'Brain',        cat: 'Health', ...IP(['M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.73A3 3 0 0 1 3.34 9a2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.84-2.76Z','M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.73 3 3 0 0 0 2.13-5.27 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.84-2.76Z']) },
  // ─ Medical ─
  { key: 'shield',      label: 'Shield',       cat: 'Medical', ...IP('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z') },
  { key: 'cross',       label: 'Med Cross',    cat: 'Medical', ...IP('M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z') },
  { key: 'hospital',    label: 'Hospital',     cat: 'Medical', ...IP(['M12 6v4','M14 14h-4','M14 18h-4','M14 8h-4','M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2','M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18']) },
  { key: 'pill',        label: 'Pill',         cat: 'Medical', ...IP(['M10.5 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5','M2 12H10','M22 12H14','M13.5 4H20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6.5']) },
  { key: 'syringe',     label: 'Syringe',      cat: 'Medical', ...IP(['m18 2 4 4','m17 7 3-3','M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 9']) },
  { key: 'scale',       label: 'BMI Scale',    cat: 'Medical', ...IP(['M12 3a1 1 0 0 1 1 1v7.5a.5.5 0 0 1-1 0V4a1 1 0 0 1-1-1Z','M3 14a9 9 0 1 0 18 0']) },
  // ─ Awards & Trust ─
  { key: 'award',       label: 'Award',        cat: 'Awards', ...IP(['M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z','M8.21 13.89 7 23l5-3 5 3-1.21-9.12']) },
  { key: 'medal',       label: 'Medal',        cat: 'Awards', ...IP(['M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 3.8A2 2 0 0 1 6 3h12a2 2 0 0 1 1.6.8l1.6 1.14a2 2 0 0 1 .14 2.2L16.79 15','M11 12 5.12 2.2','M13 12l5.88-9.8','M8 7h8','M12 15v6','M9 18h6']) },
  { key: 'star',        label: 'Star',         cat: 'Awards', ...IP('M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z') },
  { key: 'trophy',      label: 'Trophy',       cat: 'Awards', ...IP(['M6 9H4.5a2.5 2.5 0 0 1 0-5H6','M18 9h1.5a2.5 2.5 0 0 0 0-5H18','M4 22h16','M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 19.75 7 21.24 7 22','M14 14.66V17c0 .55.47.98.97 1.21C16.15 19.75 17 21.24 17 22','M18 2H6v7a6 6 0 0 0 12 0V2Z']) },
  { key: 'check_circle',label: 'Check OK',     cat: 'Awards', ...IP(['M22 11.08V12a10 10 0 1 1-5.93-9.14','M9 11l3 3L22 4']) },
  { key: 'thumbsup',    label: 'Thumbs Up',    cat: 'Awards', ...IP('M7 10v12 M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z') },
  // ─ Clock & Time ─
  { key: 'clock',       label: 'Clock',        cat: 'Time', ...IP(['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z','M12 6v6l4 2']) },
  { key: 'calendar',    label: 'Calendar',     cat: 'Time', ...IP(['M8 2v4','M16 2v4','M3 10h18','M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z']) },
];

const getImgUrl = (img) => {
  if (!img) return '';
  if (typeof img !== 'string') return img;
  if (img.startsWith('data:')) return img;
  const normalizedApi = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const uploadsIdx = img.indexOf('uploads/');
  if (uploadsIdx !== -1) {
    const relativeUploadPath = img.substring(uploadsIdx);
    return `${normalizedApi}/${relativeUploadPath}`;
  }
  return img;
};

const ICON_PICKER_LIBRARY_EXT = [
  ...ICON_PICKER_LIBRARY,
  { key: 'timer',       label: 'Timer',        cat: 'Time', ...IP(['M10 2h4','M12 14l4-4','M4.6 11a8 8 0 1 0 16.4 4.7 8 8 0 0 0-16.4-4.7Z']) },
  { key: 'sunrise',     label: 'Quick Service',cat: 'Time', ...IP(['M12 2v8','M4.93 10.93l1.41 1.41','M2 18h2','M20 18h2','M19.07 10.93l-1.41 1.41','M22 22H2','M16 6l-4 4-4-4','M12 18a6 6 0 0 0 0-12v0']) },
  // ─ Fitness ─
  { key: 'dumbbell',    label: 'Dumbbell',     cat: 'Fitness', ...IP(['M14.4 14.4 9.6 9.6','M18.657 5.343a4 4 0 0 1 0 5.657l-1.414 1.414a4 4 0 0 1-5.657-5.657l1.414-1.414a4 4 0 0 1 5.657 0Z','M5.343 18.657a4 4 0 0 1 0-5.657l1.414-1.414a4 4 0 0 1 5.657 5.657l-1.414 1.414a4 4 0 0 1-5.657 0Z']) },
  { key: 'moon',        label: 'Sleep',        cat: 'Fitness', ...IP('M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z') },
  { key: 'sun',         label: 'Wellness',     cat: 'Fitness', ...IP(['M12 2v2','M12 20v2','m4.93 4.93-1.41 1.41','m16.95 16.95-1.41 1.41','M2 12h2','M20 12h2','m6.34 17.66-1.41 1.41','m19.07 4.93-1.41 1.41','M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z']) },
  { key: 'flame',       label: 'Calories',     cat: 'Fitness', ...IP('M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z') },
  // ─ Food ─
  { key: 'apple',       label: 'Nutrition',    cat: 'Food', ...IP(['M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z','M10 2c1 .5 2 2 2 5']) },
  { key: 'leaf',        label: 'Organic',      cat: 'Food', ...IP('M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12') },
  // ─ Tools ─
  { key: 'calculator',  label: 'Calculator',   cat: 'Tools', ...IP(['M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Z','M8 7h8','M8 11h8','M8 15h5']) },
  { key: 'zap',         label: 'Quick',        cat: 'Tools', ...IP('M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z') },
  { key: 'info',        label: 'Info',         cat: 'Tools', ...IP(['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z','M12 16v-4','M12 8h.01']) },
  { key: 'globe',       label: 'Global',       cat: 'Tools', ...IP(['M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z','M2 12h20','M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z']) },
  { key: 'users',       label: 'Team',         cat: 'Tools', ...IP(['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z','M23 21v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75']) },
  { key: 'book',        label: 'Guide',        cat: 'Tools', ...IP(['M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20']) }
];

/* ── Badge Picker Options ── */
const BADGE_PICKER_OPTIONS = [
  { label: '✦ Healthcare Excellence', value: '✦ Healthcare Excellence' },
  { label: '✦ New Healthcare Feature', value: '✦ New Healthcare Feature' },
  { label: '✦ Award-Winning Pharmacy', value: '✦ Award-Winning Pharmacy' },
  { label: '✦ GPhC Regulated Service', value: '✦ GPhC Regulated Service' },
  { label: '✦ NHS Partner Pharmacy', value: '✦ NHS Partner Pharmacy' },
  { label: '✦ Trusted Clinical Care', value: '✦ Trusted Clinical Care' },
  { label: '✦ Book Online Today', value: '✦ Book Online Today' },
  { label: '✦ Same-Day Appointments', value: '✦ Same-Day Appointments' },
  { label: '✦ Expert Health Advice', value: '✦ Expert Health Advice' },
  { label: '✦ Safe & Confidential', value: '✦ Safe & Confidential' },
  { label: '🏆 Award-Winning Care', value: '🏆 Award-Winning Care' },
  { label: '💊 Prescription Services', value: '💊 Prescription Services' },
  { label: '🩺 Clinical Excellence', value: '🩺 Clinical Excellence' },
  { label: '⭐ 5-Star Rated Pharmacy', value: '⭐ 5-Star Rated Pharmacy' },
  { label: '🔬 Evidence-Based Care', value: '🔬 Evidence-Based Care' },
  { label: '🛡️ Patient Safety First', value: '🛡️ Patient Safety First' },
  { label: '📅 Easy Online Booking', value: '📅 Easy Online Booking' },
  { label: '🌟 Premium Health Service', value: '🌟 Premium Health Service' },
];

/* ── Badge Picker Panel Component ── */
function BadgePickerPanel({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [customVal, setCustomVal] = React.useState(value || '');
  const panelRef = React.useRef(null);

  React.useEffect(() => { setCustomVal(value || ''); }, [value]);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div style={{ position: 'relative' }} ref={panelRef}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          className="srv_input"
          value={customVal}
          placeholder="e.g. ✦ Award-Winning Pharmacy"
          onChange={e => { setCustomVal(e.target.value); onChange(e.target.value); }}
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          title="Choose from badge presets"
          style={{
            padding: '10px 14px', background: 'var(--purple)', color: '#fff',
            border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700',
            fontSize: '0.8rem', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'var(--f)'
          }}
        >
          🏷️ Presets
        </button>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 9999,
          background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '14px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.14)', overflow: 'hidden',
          animation: 'fadeUp .18s ease both'
        }}>
          <div style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Badge Presets</span>
          </div>
          <div style={{ maxHeight: '240px', overflowY: 'auto', padding: '8px' }}>
            {BADGE_PICKER_OPTIONS.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { onChange(opt.value); setCustomVal(opt.value); setOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px',
                  borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.83rem',
                  fontFamily: 'var(--f)', fontWeight: '600', transition: 'all .12s',
                  background: value === opt.value ? 'rgba(75,45,113,0.08)' : 'transparent',
                  color: value === opt.value ? 'var(--purple)' : 'var(--t1)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(75,45,113,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = value === opt.value ? 'rgba(75,45,113,0.08)' : 'transparent'}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const PickerIcon = ({ item, size = 18 }) => (
  <svg viewBox={item.vb} width={size} height={size} fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {item.paths.map((p, i) => <path key={i} d={p} />)}
  </svg>
);

function IconPickerPanel({ selectedKey, onSelect }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');
  const panelRef = useRef(null);
  const searchRef = useRef(null);

  const cats = ['All', ...Array.from(new Set(ICON_PICKER_LIBRARY.map(i => i.cat)))];
  const selected = ICON_PICKER_LIBRARY.find(i => i.key === selectedKey) || ICON_PICKER_LIBRARY[0];

  const filtered = ICON_PICKER_LIBRARY.filter(i => {
    const matchCat = cat === 'All' || i.cat === cat;
    const matchQ   = !query || i.label.toLowerCase().includes(query.toLowerCase()) || i.key.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          padding: '10px 16px', background: '#ffffff',
          border: '1px solid var(--border)', borderRadius: '10px',
          cursor: 'pointer', outline: 'none', transition: 'border-color .15s',
          color: 'var(--t1)', fontSize: '0.83rem', fontWeight: '600', fontFamily: 'var(--f)'
        }}
      >
        <span style={{ color: 'var(--purple)', display: 'flex' }}>
          <PickerIcon item={selected} size={18} />
        </span>
        <span>{selected.label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, marginLeft: 2 }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="icon_picker_panel_wrap" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 9999 }}>
          <div style={{ padding: '12px 12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '7px 12px', marginBottom: '10px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search icons…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', color: 'var(--t1)', fontFamily: 'var(--f)' }}
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, lineHeight: 1 }}>✕</button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px' }}>
              {cats.map(c => (
                <button key={c} type="button" onClick={() => setCat(c)}
                  style={{ flexShrink: 0, padding: '4px 12px', borderRadius: '20px', border: '1px solid', fontSize: '0.74rem', fontWeight: '700', cursor: 'pointer', outline: 'none', fontFamily: 'var(--f)', transition: 'all .15s',
                    background: cat === c ? 'var(--purple)' : 'transparent',
                    borderColor: cat === c ? 'var(--purple)' : '#e2e8f0',
                    color: cat === c ? '#fff' : 'var(--t3)'
                  }}>{c}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', padding: '10px', maxHeight: '200px', overflowY: 'auto' }}>
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '32px 0', color: '#94a3b8', fontSize: '0.8rem' }}>No icons found</div>
            )}
            {filtered.map(item => {
              const isSel = selectedKey === item.key;
              return (
                <button key={item.key} type="button" title={item.label}
                  onClick={() => { onSelect(item.key); setOpen(false); }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '4px', padding: '8px 4px', borderRadius: '8px', cursor: 'pointer', outline: 'none',
                    border: isSel ? '2px solid var(--purple)' : '2px solid transparent',
                    background: isSel ? 'rgba(75,45,113,0.07)' : 'transparent',
                    color: isSel ? 'var(--purple)' : '#475569',
                    transition: 'all .12s',
                  }}
                >
                  <PickerIcon item={item} size={18} />
                  <span style={{ fontSize: '0.58rem', fontWeight: '600', textAlign: 'center', lineHeight: 1.2, color: isSel ? 'var(--purple)' : '#94a3b8' }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomepageCMSPage() {
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [uploadingSlideIdx, setUploadingSlideIdx] = useState(null);
  const slideFileRefs = useRef({});
  const [uploadingWlImage, setUploadingWlImage] = useState(false);
  const wlFileRef = useRef(null);
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);
  const aboutFileRef = useRef(null);

  // Slide image upload handler
  const handleSlideImageUpload = async (e, slideIdx) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    formData.append('files', files[0]);
    setUploadingSlideIdx(slideIdx);
    try {
      const res = await fetch(`${API_URL}/api/blogs/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.urls && data.urls.length > 0) {
        const url = data.urls[0];
        updateSlide(slideIdx, 'image', url);
        showToast('Slide image uploaded successfully!');
      } else {
        showToast(data.message || 'Upload failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error during image upload', 'error');
    } finally {
      setUploadingSlideIdx(null);
      if (slideFileRefs.current[slideIdx]) slideFileRefs.current[slideIdx].value = '';
    }
  };
  
  const handleWlImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    formData.append('files', files[0]);
    setUploadingWlImage(true);
    try {
      const res = await fetch(`${API_URL}/api/blogs/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.urls && data.urls.length > 0) {
        const url = data.urls[0];
        updateAppointmentCta('image', url);
        showToast('Weight Loss CTA image uploaded successfully!');
      } else {
        showToast(data.message || 'Upload failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error during image upload', 'error');
    } finally {
      setUploadingWlImage(false);
      if (wlFileRef.current) wlFileRef.current.value = '';
    }
  };

  const handleAboutImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    formData.append('files', files[0]);
    setUploadingAboutImage(true);
    try {
      const res = await fetch(`${API_URL}/api/blogs/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.urls && data.urls.length > 0) {
        const url = data.urls[0];
        updateAbout('image', url);
        showToast('About Section image uploaded successfully!');
      } else {
        showToast(data.message || 'Upload failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error during image upload', 'error');
    } finally {
      setUploadingAboutImage(false);
      if (aboutFileRef.current) aboutFileRef.current.value = '';
    }
  };

  // Tabs: 'hero' | 'about' | 'services' | 'hours' | 'how' | 'testimonials' | 'seo'
  const [activeTab, setActiveTab] = useState('hero');
  
  // Full Homepage Configuration State
  const [cmsData, setCmsData] = useState({
    heroSlides: [],
    heroStats: [],
    aboutSection: { title: '', subtitle: '', desc: '', image: '', yearsExperience: '', experienceLabel: '', features: [], ctaText: '', ctaUrl: '', secondaryCtaText: '', secondaryCtaUrl: '' },
    servicesSection: { title: '', subtitle: '', desc: '' },
    howItWorks: { title: '', subtitle: '', desc: '', steps: [] },
    testimonials: { title: '', subtitle: '', desc: '', reviews: [] },
    appointmentCta: { title: '', subtitle: '', desc: '', image: '', ctaText: '', ctaUrl: '', bullets: [] },
    footerCta: { title: '', ctaText: '', ctaUrl: '' },
    seoSettings: { metaTitle: '', metaDescription: '', metaKeywords: '', canonicalUrl: '', logoUrl: '', ogTitle: '', ogDescription: '', ogImage: '' }
  });

  const updateCmsState = (data) => {
    setCmsData(prev => ({
      ...prev,
      ...data,
      aboutSection: { ...prev.aboutSection, ...(data.aboutSection || {}) },
      servicesSection: { ...prev.servicesSection, ...(data.servicesSection || {}) },
      howItWorks: { ...prev.howItWorks, ...(data.howItWorks || {}) },
      testimonials: { ...prev.testimonials, ...(data.testimonials || {}) },
      appointmentCta: { ...prev.appointmentCta, ...(data.appointmentCta || {}) },
      footerCta: { ...prev.footerCta, ...(data.footerCta || {}) },
      seoSettings: { ...prev.seoSettings, ...(data.seoSettings || {}) }
    }));
  };

  // Hours settings state
  const [hoursForm, setHoursForm] = useState({ mon_fri: '', sat: '', sun: '' });
  // Tools list state
  const [toolsHeader, setToolsHeader] = useState({ title: '', content: '' });
  const [toolsList, setToolsList] = useState([]);
  const [services, setServices] = useState([]);

  // Custom Modal dialogs
  const [modalConfig, setModalConfig] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const triggerAlert = (message) => {
    setModalConfig({ type: 'alert', message, onConfirm: () => setModalConfig(null) });
  };

  const triggerConfirm = (message) => {
    return new Promise((resolve) => {
      setModalConfig({
        type: 'confirm',
        message,
        onConfirm: () => {
          setModalConfig(null);
          resolve(true);
        },
        onCancel: () => {
          setModalConfig(null);
          resolve(false);
        }
      });
    });
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 800);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.replace('/admin');
  };

  const fetchCmsData = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.replace('/admin');
      return;
    }

    try {
      const [resCms, hoursRes, toolsHdrRes, toolsListRes, resSrv] = await Promise.all([
        fetch(`${API_URL}/api/homepage`),
        fetch(`${API_URL}/api/contents/clinic-hours`),
        fetch(`${API_URL}/api/contents/health-tools-header`),
        fetch(`${API_URL}/api/contents/health-tools-list`),
        fetch(`${API_URL}/api/services`)
      ]);

      const resJson = await resCms.json();
      const hoursJson = await hoursRes.json();
      const toolsHdrJson = await toolsHdrRes.json();
      const toolsListJson = await toolsListRes.json();
      const srvJson = await resSrv.json();

      if (resJson.success && resJson.data) {
        updateCmsState(resJson.data);
      } else {
        triggerAlert('Failed to load Homepage CMS payload.');
      }

      if (hoursJson.success && hoursJson.data) {
        const meta = hoursJson.data.metadata || {};
        setHoursForm({
          mon_fri: meta.mon_fri || '',
          sat: meta.sat || '',
          sun: meta.sun || ''
        });
      }
      if (toolsHdrJson.success && toolsHdrJson.data) {
        setToolsHeader({
          title: toolsHdrJson.data.title || '',
          content: toolsHdrJson.data.content || ''
        });
      }
      if (toolsListJson.success && toolsListJson.data) {
        try {
          const parsed = JSON.parse(toolsListJson.data.content || '[]');
          setToolsList(parsed);
        } catch (e) {
          console.error(e);
        }
      }
      if (srvJson.success) {
        setServices(srvJson.data || []);
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Failed to establish connection to database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (user) setAdminUser(JSON.parse(user));
    fetchCmsData();
  }, []);

  // Save changes to backend
  const handlePublish = async () => {
    setPublishing(true);
    const token = localStorage.getItem('adminToken');
    try {
      const finalHoursContent = `Mon - Fri: ${hoursForm.mon_fri}\nSaturday: ${hoursForm.sat}\nSunday: ${hoursForm.sun}`;

      // Clean up bullets data: trim each string and filter out empty strings
      const cleanedCmsData = {
        ...cmsData,
        appointmentCta: {
          ...cmsData.appointmentCta,
          bullets: (cmsData.appointmentCta.bullets || []).map(b => b.trim()).filter(Boolean)
        }
      };

      const [resCms, resHours, resToolsHdr, resToolsList] = await Promise.all([
        fetch(`${API_URL}/api/homepage`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(cleanedCmsData)
        }),
        fetch(`${API_URL}/api/contents/clinic-hours`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: 'Clinic Opening Hours',
            content: finalHoursContent,
            metadata: {
              mon_fri: hoursForm.mon_fri,
              sat: hoursForm.sat,
              sun: hoursForm.sun
            }
          })
        }),
        fetch(`${API_URL}/api/contents/health-tools-header`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: toolsHeader.title,
            content: toolsHeader.content
          })
        }),
        fetch(`${API_URL}/api/contents/health-tools-list`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: 'Interactive Health Tools List',
            content: JSON.stringify(toolsList)
          })
        })
      ]);

      const data = await resCms.json();
      if (data.success && resHours.ok && resToolsHdr.ok && resToolsList.ok) {
        showToast('All homepage configurations successfully published live!');
        updateCmsState(data.data);
      } else {
        triggerAlert('Failed to publish some settings.');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Error saving homepage configurations.');
    } finally {
      setPublishing(false);
    }
  };

  // Re-seed default configurations (section-aware)
  const handleReSeed = async () => {
    const sectionLabels = {
      hero: 'Hero Slider & Stats',
      services: 'Services Intro',
      hours: 'Clinic Opening Hours',
      how: 'How It Works',
      testimonials: 'Patient Testimonials',
      weightLossCta: 'Weight Loss CTA',
      seo: 'SEO Metadata'
    };
    const sectionLabel = sectionLabels[activeTab] || activeTab;
    const approved = await triggerConfirm(`Are you sure you want to reset "${sectionLabel}" back to clinic defaults? Any unsaved custom changes to this section will be overwritten.`);
    if (!approved) return;

    setLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/homepage/seed?section=${encodeURIComponent(activeTab)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast(`"${sectionLabel}" reset to defaults successfully.`);
        updateCmsState(data.data);
      } else {
        triggerAlert('Reset failed: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Error running reset.');
    } finally {
      setLoading(false);
    }
  };



  // Modify states
  const updateSlide = (idx, field, value) => {
    setCmsData(prev => {
      const slides = [...prev.heroSlides];
      slides[idx] = { ...slides[idx], [field]: value };
      return { ...prev, heroSlides: slides };
    });
  };

  const addSlide = () => {
    setCmsData(prev => ({
      ...prev,
      heroSlides: [...prev.heroSlides, {
        badge: 'New Healthcare Feature',
        badgeIcon: 'award',
        words1: ['Your', 'Heading'],
        words2: ['Text', 'Here'],
        desc: 'New slide description details.',
        cta: 'Book Now',
        ctaUrl: '/book-appointment',
        secondaryCta: 'Our Services',
        secondaryCtaUrl: '/services',
        image: '/images/0a198cad-eabf-40b6-81dc-45dbd61ed432.png',
        fallback: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=90',
        overlay: ['rgba(15,4,40,0.70)', 'rgba(15,4,40,0.20)']
      }]
    }));
  };

  const deleteSlide = (idx) => {
    if (cmsData.heroSlides.length <= 1) {
      triggerAlert('You must keep at least one hero slide active.');
      return;
    }
    setCmsData(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((_, i) => i !== idx)
    }));
  };

  const updateStat = (idx, field, value) => {
    setCmsData(prev => {
      const stats = [...prev.heroStats];
      stats[idx] = { ...stats[idx], [field]: value };
      return { ...prev, heroStats: stats };
    });
  };

  const updateAbout = (field, value) => {
    setCmsData(prev => ({
      ...prev,
      aboutSection: { ...prev.aboutSection, [field]: value }
    }));
  };

  const updateAboutFeature = (idx, field, value) => {
    setCmsData(prev => {
      const features = [...prev.aboutSection.features];
      features[idx] = { ...features[idx], [field]: value };
      return { ...prev, aboutSection: { ...prev.aboutSection, features } };
    });
  };

  const updateServices = (field, value) => {
    setCmsData(prev => ({
      ...prev,
      servicesSection: { ...prev.servicesSection, [field]: value }
    }));
  };

  const updateHow = (field, value) => {
    setCmsData(prev => ({
      ...prev,
      howItWorks: { ...prev.howItWorks, [field]: value }
    }));
  };

  const updateHowStep = (idx, field, value) => {
    setCmsData(prev => {
      const steps = [...prev.howItWorks.steps];
      steps[idx] = { ...steps[idx], [field]: value };
      return { ...prev, howItWorks: { ...prev.howItWorks, steps } };
    });
  };

  const updateTestimonial = (field, value) => {
    setCmsData(prev => ({
      ...prev,
      testimonials: { ...prev.testimonials, [field]: value }
    }));
  };

  const updateReview = (idx, field, value) => {
    setCmsData(prev => {
      const reviews = [...prev.testimonials.reviews];
      reviews[idx] = { ...reviews[idx], [field]: value };
      return { ...prev, testimonials: { ...prev.testimonials, reviews } };
    });
  };

  const deleteReview = (idx) => {
    setCmsData(prev => ({
      ...prev,
      testimonials: { ...prev.testimonials, reviews: prev.testimonials.reviews.filter((_, i) => i !== idx) }
    }));
  };

  const addReview = () => {
    setCmsData(prev => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        reviews: [...prev.testimonials.reviews, { name: 'New Patient', role: 'Local Resident', text: 'Excellent service.', rating: 5, avatar: '/images/reviews/sarah.jpg' }]
      }
    }));
  };

  const updateAppointmentCta = (field, value) => {
    setCmsData(prev => ({
      ...prev,
      appointmentCta: { ...prev.appointmentCta, [field]: value }
    }));
  };

  const updateFooterCta = (field, value) => {
    setCmsData(prev => ({
      ...prev,
      footerCta: { ...prev.footerCta, [field]: value }
    }));
  };

  const updateSeo = (field, value) => {
    setCmsData(prev => ({
      ...prev,
      seoSettings: { ...prev.seoSettings, [field]: value }
    }));
  };

  const toggleServiceOnHome = async (id, currentVal) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    
    // Optimistic update
    setServices(prev => prev.map(s => s._id === id ? { ...s, onHome: !currentVal } : s));
    
    try {
      const res = await fetch(`${API_URL}/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ onHome: !currentVal })
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message || 'Failed to update service homepage status', 'error');
        // Revert
        setServices(prev => prev.map(s => s._id === id ? { ...s, onHome: currentVal } : s));
      } else {
        showToast('Service homepage status updated successfully!');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error updating service status', 'error');
      // Revert
      setServices(prev => prev.map(s => s._id === id ? { ...s, onHome: currentVal } : s));
    }
  };

  return (
    <div className="dash">
      {/* ══ SIDEBAR ══ */}
      <Sidebar activePage="homepage" />

      <div className="dash_main">
        <header className="dash_hdr" style={{ paddingLeft: isMobile ? '16px' : '36px', paddingRight: isMobile ? '16px' : '36px' }}>
          <div className="dash_hdr_left">
            <h2>Homepage CMS Manager</h2>
            <p>Edit every text, slider, badge, image, and SEO field on the clinic home page dynamically.</p>
          </div>
          <div className="dash_hdr_right" style={{ gap: '12px' }}>
            <button className="bk_btn_secondary btn_reset" onClick={handleReSeed} disabled={loading || publishing} style={{ width: 'auto', padding: '10px 18px' }}>
              Reset Section to Defaults
            </button>
            <button className="srv_add_btn" onClick={handlePublish} disabled={loading || publishing} style={{ width: 'auto' }}>
              {publishing ? 'Publishing...' : 'Publish Live Changes'}
            </button>
          </div>
        </header>

        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>
            <div className="adm_spinner" style={{ margin: '0 auto 16px' }} />
            <span>Loading Homepage configurations...</span>
          </div>
        ) : (
          <div className="cnt_layout" style={{ paddingLeft: isMobile ? '16px' : '36px', paddingRight: isMobile ? '16px' : '36px', boxSizing: 'border-box' }}>
            <div className="cnt_sidebar">
              <div className="cnt_sidebar_title" style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '4px 14px' }}>Sections</div>
              <button className={`cnt_sidebar_btn ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>Hero Slider & Stats</button>
              <button className={`cnt_sidebar_btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Services Intro</button>
              <button className={`cnt_sidebar_btn ${activeTab === 'hours' ? 'active' : ''}`} onClick={() => setActiveTab('hours')}>Clinic Opening Hours</button>
              <button className={`cnt_sidebar_btn ${activeTab === 'how' ? 'active' : ''}`} onClick={() => setActiveTab('how')}>How It Works</button>
              <button className={`cnt_sidebar_btn ${activeTab === 'testimonials' ? 'active' : ''}`} onClick={() => setActiveTab('testimonials')}>Patient Testimonials</button>
              <button className={`cnt_sidebar_btn ${activeTab === 'weightLossCta' ? 'active' : ''}`} onClick={() => setActiveTab('weightLossCta')}>Weight Loss CTA</button>
              <button className={`cnt_sidebar_btn ${activeTab === 'seo' ? 'active' : ''}`} onClick={() => setActiveTab('seo')}>SEO Metadata</button>
            </div>

            <div className="cnt_form_panel">
              {activeTab === 'hero' && (
                <div>
                  <div className="cnt_form_title">Hero Slider Slides & Statistics</div>
                  <div className="cnt_form_sub">Update background images, title word groupings, and slider CTAs.</div>
                  
                  {cmsData.heroSlides.map((slide, sIdx) => (
                    <div key={sIdx} className="slide_config_card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <strong style={{ color: 'var(--purple)' }}>Slide #{sIdx + 1} Configuration</strong>
                        <button className="action_link_btn cancel" onClick={() => deleteSlide(sIdx)} style={{ width: 'auto', padding: '4px 10px', fontSize: '0.78rem' }}>
                          <I d={ICONS.trash} s={12} /> Delete Slide
                        </button>
                      </div>

                      <div className="srv_form_grid">
                        <div className="srv_form_group full" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', background: 'rgba(75, 45, 113, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '150px' }}>
                            <label className="srv_label" style={{ marginBottom: 0 }}>Choose Badge Icon</label>
                            <IconPickerPanel
                              selectedKey={slide.badgeIcon || 'award'}
                              onSelect={val => updateSlide(sIdx, 'badgeIcon', val)}
                            />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '240px' }}>
                            <label className="srv_label" style={{ marginBottom: 0 }}>Badge Text Label</label>
                            <input
                              type="text"
                              className="srv_input"
                              value={slide.badge || ''}
                              placeholder="e.g. Expert Healthcare"
                              onChange={e => updateSlide(sIdx, 'badge', e.target.value)}
                              style={{ margin: 0 }}
                            />
                          </div>
                        </div>
                        <div className="srv_form_group full">
                          <label className="srv_label">Slide Background Image</label>
                          {/* Current preview */}
                          {slide.image && (
                            <div style={{ marginBottom: '10px', borderRadius: '10px', overflow: 'hidden', height: '100px', background: '#f1f5f9', position: 'relative' }}>
                              <img
                                src={getImgUrl(slide.image)}
                                alt="slide preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => e.target.style.opacity = 0.2}
                              />
                            </div>
                          )}
                          {/* Drag & Drop / Click to Upload */}
                          <div
                            onClick={() => slideFileRefs.current[sIdx]?.click()}
                            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--purple)'; }}
                            onDragLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                            onDrop={async e => {
                              e.preventDefault();
                              e.currentTarget.style.borderColor = '#e2e8f0';
                              const file = e.dataTransfer.files[0];
                              if (file && file.type.startsWith('image/')) {
                                const fakeEvent = { target: { files: [file] } };
                                await handleSlideImageUpload(fakeEvent, sIdx);
                              }
                            }}
                            style={{
                              border: '2px dashed #e2e8f0', borderRadius: '10px', padding: '16px',
                              textAlign: 'center', cursor: 'pointer', marginBottom: '10px',
                              background: '#f8fafc', transition: 'border-color .15s'
                            }}
                          >
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/webp"
                              ref={el => slideFileRefs.current[sIdx] = el}
                              style={{ display: 'none' }}
                              onChange={e => handleSlideImageUpload(e, sIdx)}
                            />
                            <div style={{ color: 'var(--purple)', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                              <I d={ICONS.upload} s={22} />
                            </div>
                            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--t2)' }}>
                              {uploadingSlideIdx === sIdx ? 'Uploading...' : 'Click or Drag & Drop to upload image'}
                            </span>
                            <br />
                            <span style={{ fontSize: '0.74rem', color: 'var(--t3)' }}>PNG, JPEG, WEBP — Max 10MB</span>
                          </div>
                          {/* Or paste URL */}
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.76rem', color: 'var(--t3)', flexShrink: 0 }}>Or URL:</span>
                            <input
                              type="text"
                              className="srv_input"
                              style={{ flex: 1 }}
                              value={slide.image}
                              placeholder="https://example.com/image.jpg or /images/photo.jpg"
                              onChange={e => updateSlide(sIdx, 'image', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="srv_form_group">
                          <label className="srv_label">Primary Heading Rows (Words Row 1 - Comma-Separated)</label>
                          <input type="text" className="srv_input" value={slide.words1.join(', ')} onChange={e => updateSlide(sIdx, 'words1', e.target.value.split(',').map(w => w.trim()))} />
                        </div>
                        <div className="srv_form_group">
                          <label className="srv_label">Primary Heading Accent Rows (Words Row 2 - Comma-Separated)</label>
                          <input type="text" className="srv_input" value={slide.words2.join(', ')} onChange={e => updateSlide(sIdx, 'words2', e.target.value.split(',').map(w => w.trim()))} />
                        </div>
                        <div className="srv_form_group full">
                          <label className="srv_label">Description Paragraph</label>
                          <textarea className="srv_textarea" rows={3} value={slide.desc} onChange={e => updateSlide(sIdx, 'desc', e.target.value)} />
                        </div>
                        <div className="srv_form_grid full">
                          <div className="srv_form_group">
                            <label className="srv_label">CTA Button Label</label>
                            <input type="text" className="srv_input" value={slide.cta} onChange={e => updateSlide(sIdx, 'cta', e.target.value)} />
                          </div>
                          <div className="srv_form_group">
                            <label className="srv_label">CTA Button Link</label>
                            <input type="text" className="srv_input" value={slide.ctaUrl} onChange={e => updateSlide(sIdx, 'ctaUrl', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button className="srv_add_btn" onClick={addSlide} style={{ marginBottom: '28px' }}>
                    <I d={ICONS.plus} s={14} /> Add New Hero Slide
                  </button>

                  <div className="cnt_form_title" style={{ marginTop: '20px', borderTop: '1px dashed #e2e8f0', paddingTop: '20px' }}>Hero Counters Stats</div>
                  <div className="srv_form_grid" style={{ marginTop: '12px' }}>
                    {cmsData.heroStats.map((stat, stIdx) => (
                      <div key={stIdx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div className="srv_form_group">
                          <label className="srv_label">Counter #{stIdx+1} Number</label>
                          <input type="text" className="srv_input" value={stat.number} onChange={e => updateStat(stIdx, 'number', e.target.value)} />
                        </div>
                        <div className="srv_form_group">
                          <label className="srv_label">Counter #{stIdx+1} Label</label>
                          <input type="text" className="srv_input" value={stat.label} onChange={e => updateStat(stIdx, 'label', e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}



              {activeTab === 'services' && (
                <div>
                  <div className="cnt_form_title">Services Section Header Info</div>
                  <div className="cnt_form_sub">Modify header text and select which services appear on the homepage.</div>

                  <div className="srv_form_grid">
                    <div className="srv_form_group">
                      <label className="srv_label">Section Title</label>
                      <input type="text" className="srv_input" value={cmsData.servicesSection.title} onChange={e => updateServices('title', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Section Subtitle</label>
                      <input type="text" className="srv_input" value={cmsData.servicesSection.subtitle} onChange={e => updateServices('subtitle', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Section Description Paragraph</label>
                      <textarea className="srv_textarea" rows={4} value={cmsData.servicesSection.desc} onChange={e => updateServices('desc', e.target.value)} />
                    </div>
                  </div>

                  <div className="cnt_form_title" style={{ marginTop: '30px', borderTop: '1px dashed #e2e8f0', paddingTop: '20px' }}>
                    Manage Homepage Services
                  </div>
                  <div className="cnt_form_sub">
                    Toggle which clinical services are displayed on the frontend homepage.
                  </div>

                  <div className="homepage_services_list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                    {services.map(srv => (
                      <div key={srv._id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 18px',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.2s ease'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: '#e2e8f0',
                            flexShrink: 0
                          }}>
                            {srv.img ? (
                              <img src={getImgUrl(srv.img)} alt={srv.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', background: 'var(--purple)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                {srv.title ? srv.title[0] : 'S'}
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: 'var(--t1)', fontSize: '0.9rem' }}>{srv.title}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--t3)', fontWeight: '600', marginTop: '2px' }}>{srv.cat || srv.parentCategory}</div>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <label className="switch" style={{
                            position: 'relative',
                            display: 'inline-block',
                            width: '40px',
                            height: '22px'
                          }}>
                            <input 
                              type="checkbox" 
                              checked={!!srv.onHome} 
                              onChange={() => toggleServiceOnHome(srv._id, srv.onHome)}
                              style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span className="slider round" style={{
                              position: 'absolute',
                              cursor: 'pointer',
                              top: 0, left: 0, right: 0, bottom: 0,
                              background: srv.onHome ? 'var(--teal)' : '#cbd5e1',
                              transition: '0.3s',
                              borderRadius: '34px'
                            }}>
                              <span style={{
                                position: 'absolute',
                                content: '""',
                                height: '16px',
                                width: '16px',
                                left: srv.onHome ? '21px' : '3px',
                                bottom: '3px',
                                background: 'white',
                                transition: '0.3s',
                                borderRadius: '50%'
                              }} />
                            </span>
                          </label>
                          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: srv.onHome ? 'var(--teal)' : 'var(--t3)', width: '64px', whiteSpace: 'nowrap' }}>
                            {srv.onHome ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'hours' && (
                <div>
                  <div className="cnt_form_title">Clinic Opening Hours</div>
                  <div className="cnt_form_sub">Configure hours displayed in the footer and contact sections of the website.</div>
                  
                  <div className="srv_form_grid">
                    <div className="srv_form_group">
                      <label className="srv_label">Monday - Friday Hours</label>
                      <input
                        type="text"
                        className="srv_input"
                        value={hoursForm.mon_fri}
                        onChange={(e) => setHoursForm({ ...hoursForm, mon_fri: e.target.value })}
                        placeholder="e.g. 8:30 AM - 6:30 PM"
                      />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Saturday Hours</label>
                      <input
                        type="text"
                        className="srv_input"
                        value={hoursForm.sat}
                        onChange={(e) => setHoursForm({ ...hoursForm, sat: e.target.value })}
                        placeholder="e.g. 9:00 AM - 2:00 PM"
                      />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Sunday Hours</label>
                      <input
                        type="text"
                        className="srv_input"
                        value={hoursForm.sun}
                        onChange={(e) => setHoursForm({ ...hoursForm, sun: e.target.value })}
                        placeholder="e.g. 9:00 AM - 12:00 PM"
                      />
                    </div>
                  </div>
                </div>
              )}





              {activeTab === 'how' && (
                <div>
                  <div className="cnt_form_title">How It Works / Steps Section</div>
                  <div className="cnt_form_sub">Modify step titles, numbers, description lines, and icons.</div>

                  <div className="srv_form_grid">
                    <div className="srv_form_group">
                      <label className="srv_label">Section Title</label>
                      <input type="text" className="srv_input" value={cmsData.howItWorks.title} onChange={e => updateHow('title', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Section Subtitle</label>
                      <input type="text" className="srv_input" value={cmsData.howItWorks.subtitle} onChange={e => updateHow('subtitle', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Section Description Paragraph</label>
                      <textarea className="srv_textarea" rows={3} value={cmsData.howItWorks.desc} onChange={e => updateHow('desc', e.target.value)} />
                    </div>
                  </div>

                  <div className="cnt_form_title" style={{ marginTop: '20px', borderTop: '1px dashed #e2e8f0', paddingTop: '20px' }}>Step Cards configuration</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
                    {cmsData.howItWorks.steps.map((step, stIdx) => (
                      <div key={stIdx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--purple)', display: 'block', marginBottom: '8px' }}>Step #{stIdx+1} Details</strong>
                        <div className="srv_form_grid">
                          <div className="srv_form_group">
                            <label className="srv_label">Step Number (e.g. 01)</label>
                            <input type="text" className="srv_input" value={step.stepNumber} onChange={e => updateHowStep(stIdx, 'stepNumber', e.target.value)} />
                          </div>
                          <div className="srv_form_group">
                            <label className="srv_label">Step Icon (search / shield / cal)</label>
                            <input type="text" className="srv_input" value={step.icon} onChange={e => updateHowStep(stIdx, 'icon', e.target.value)} />
                          </div>
                          <div className="srv_form_group full">
                            <label className="srv_label">Step Title</label>
                            <input type="text" className="srv_input" value={step.title} onChange={e => updateHowStep(stIdx, 'title', e.target.value)} />
                          </div>
                          <div className="srv_form_group full">
                            <label className="srv_label">Step Description</label>
                            <input type="text" className="srv_input" value={step.desc} onChange={e => updateHowStep(stIdx, 'desc', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'testimonials' && (
                <div>
                  <div className="cnt_form_title">Patient Testimonials & Reviews</div>
                  <div className="cnt_form_sub">Modify headers, edit names, ratings, text, or append new reviews.</div>

                  <div className="srv_form_grid">
                    <div className="srv_form_group">
                      <label className="srv_label">Section Title</label>
                      <input type="text" className="srv_input" value={cmsData.testimonials.title} onChange={e => updateTestimonial('title', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Section Subtitle</label>
                      <input type="text" className="srv_input" value={cmsData.testimonials.subtitle} onChange={e => updateTestimonial('subtitle', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Section Description Paragraph</label>
                      <textarea className="srv_textarea" rows={3} value={cmsData.testimonials.desc} onChange={e => updateTestimonial('desc', e.target.value)} />
                    </div>
                  </div>

                  <div className="cnt_form_title" style={{ marginTop: '20px', borderTop: '1px dashed #e2e8f0', paddingTop: '20px' }}>Active Reviews</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
                    {cmsData.testimonials.reviews.map((rev, rIdx) => (
                      <div key={rIdx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <strong style={{ fontSize: '0.8rem', color: 'var(--purple)' }}>Review #{rIdx+1} Details</strong>
                          <button className="action_link_btn cancel" onClick={() => deleteReview(rIdx)} style={{ width: 'auto', padding: '2px 8px', fontSize: '0.75rem', marginLeft: 'auto' }}>
                            <I d={ICONS.trash} s={12} /> Delete Review
                          </button>
                        </div>
                        <div className="srv_form_grid">
                          <div className="srv_form_group">
                            <label className="srv_label">Patient Name</label>
                            <input type="text" className="srv_input" value={rev.name} onChange={e => updateReview(rIdx, 'name', e.target.value)} />
                          </div>
                          <div className="srv_form_group">
                            <label className="srv_label">Patient Role/Location</label>
                            <input type="text" className="srv_input" value={rev.role} onChange={e => updateReview(rIdx, 'role', e.target.value)} />
                          </div>
                          <div className="srv_form_group">
                            <label className="srv_label">Patient Rating Stars (1-5)</label>
                            <input type="number" className="srv_input" min={1} max={5} value={rev.rating} onChange={e => updateReview(rIdx, 'rating', parseInt(e.target.value, 10))} />
                          </div>
                          <div className="srv_form_group">
                            <label className="srv_label">Patient Photo Link</label>
                            <input type="text" className="srv_input" value={rev.avatar} onChange={e => updateReview(rIdx, 'avatar', e.target.value)} />
                          </div>
                          <div className="srv_form_group full">
                            <label className="srv_label">Patient Testimonial Text</label>
                            <textarea className="srv_textarea" rows={3} value={rev.text} onChange={e => updateReview(rIdx, 'text', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="srv_add_btn" onClick={addReview} style={{ marginTop: '16px' }}>
                    <I d={ICONS.plus} s={14} /> Add New Patient Review
                  </button>
                </div>
              )}



              {activeTab === 'weightLossCta' && (
                <div>
                  <div className="cnt_form_title">Weight Loss CTA Section</div>
                  <div className="cnt_form_sub">Modify titles, images, links, and custom bullet points for the weight loss program teaser.</div>

                  <div className="srv_form_grid">
                    <div className="srv_form_group">
                      <label className="srv_label">Section Title</label>
                      <input 
                        type="text" 
                        className="srv_input" 
                        value={cmsData.appointmentCta.title || ''} 
                        onChange={e => updateAppointmentCta('title', e.target.value)} 
                      />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Section Subtitle</label>
                      <input 
                        type="text" 
                        className="srv_input" 
                        value={cmsData.appointmentCta.subtitle || ''} 
                        onChange={e => updateAppointmentCta('subtitle', e.target.value)} 
                      />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Section Description Paragraph</label>
                      <textarea 
                        className="srv_textarea" 
                        rows={4} 
                        value={cmsData.appointmentCta.desc || ''} 
                        onChange={e => updateAppointmentCta('desc', e.target.value)} 
                      />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">CTA Button Label</label>
                      <input 
                        type="text" 
                        className="srv_input" 
                        value={cmsData.appointmentCta.ctaText || ''} 
                        onChange={e => updateAppointmentCta('ctaText', e.target.value)} 
                      />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Section Presentation Image</label>
                      {/* Preview */}
                      {cmsData.appointmentCta.image && (
                        <div style={{ marginBottom: '10px', borderRadius: '10px', overflow: 'hidden', height: '180px', background: '#f1f5f9', position: 'relative', width: '320px' }}>
                          <img
                            src={getImgUrl(cmsData.appointmentCta.image)}
                            alt="Weight Loss CTA preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      
                      {/* Drag & Drop Upload block */}
                      <div
                        onClick={() => wlFileRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--purple)'; }}
                        onDragLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        onDrop={async e => {
                          e.preventDefault();
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          const file = e.dataTransfer.files[0];
                          if (file && file.type.startsWith('image/')) {
                            const fakeEvent = { target: { files: [file] } };
                            await handleWlImageUpload(fakeEvent);
                          }
                        }}
                        style={{
                          border: '2px dashed #e2e8f0', borderRadius: '10px', padding: '24px',
                          textAlign: 'center', cursor: 'pointer', marginBottom: '10px',
                          background: '#f8fafc', transition: 'border-color .15s', width: '100%', boxSizing: 'border-box'
                        }}
                      >
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          ref={wlFileRef}
                          style={{ display: 'none' }}
                          onChange={handleWlImageUpload}
                        />
                        <div style={{ color: 'var(--purple)', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                          <I d={ICONS.upload} s={22} />
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--t2)' }}>
                          {uploadingWlImage ? 'Uploading...' : 'Click or Drag & Drop to upload a new section image'}
                        </span>
                        <br />
                        <span style={{ fontSize: '0.74rem', color: 'var(--t3)' }}>PNG, JPEG, WEBP — Max 10MB</span>
                      </div>
                      
                      {/* Or paste link */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.76rem', color: 'var(--t3)', flexShrink: 0 }}>Or paste URL:</span>
                        <input 
                          type="text" 
                          className="srv_input" 
                          style={{ flex: 1 }}
                          value={cmsData.appointmentCta.image || ''} 
                          onChange={e => updateAppointmentCta('image', e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div className="srv_form_group full" style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '20px', marginTop: '10px' }}>
                      <label className="srv_label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Bullet Points List (One per line)</span>
                        <small style={{ fontWeight: 'normal', color: 'var(--t3)' }}>These list items display under the button and description.</small>
                      </label>
                      <textarea 
                        className="srv_textarea" 
                        rows={5} 
                        placeholder="e.g. Personalized expert support&#10;In-person or secure online consultations available"
                        value={(cmsData.appointmentCta.bullets || []).join('\n')} 
                        onChange={e => updateAppointmentCta('bullets', e.target.value.split('\n'))} 
                      />
                    </div>
                  </div>

                  {/* About Section Form fields merged here */}
                  <div className="cnt_form_title" style={{ marginTop: '40px', borderTop: '2px solid #e2e8f0', paddingTop: '30px' }}>About Section / Clinical Credibility Info</div>
                  <div className="cnt_form_sub">Modify history, statistics, features, and main graphics.</div>

                  <div className="srv_form_grid">
                    <div className="srv_form_group">
                      <label className="srv_label">Section Title</label>
                      <input type="text" className="srv_input" value={cmsData.aboutSection.title} onChange={e => updateAbout('title', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Section Subtitle</label>
                      <input type="text" className="srv_input" value={cmsData.aboutSection.subtitle} onChange={e => updateAbout('subtitle', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Description Content</label>
                      <textarea className="srv_textarea" rows={4} value={cmsData.aboutSection.desc} onChange={e => updateAbout('desc', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Feature Banner Image</label>
                      {/* Preview */}
                      {cmsData.aboutSection.image && (
                        <div style={{ marginBottom: '10px', borderRadius: '10px', overflow: 'hidden', height: '180px', background: '#f1f5f9', position: 'relative', width: '320px' }}>
                          <img
                            src={getImgUrl(cmsData.aboutSection.image)}
                            alt="About Section preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      
                      {/* Drag & Drop Upload block */}
                      <div
                        onClick={() => aboutFileRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--purple)'; }}
                        onDragLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        onDrop={async e => {
                          e.preventDefault();
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          const file = e.dataTransfer.files[0];
                          if (file && file.type.startsWith('image/')) {
                            const fakeEvent = { target: { files: [file] } };
                            await handleAboutImageUpload(fakeEvent);
                          }
                        }}
                        style={{
                          border: '2px dashed #e2e8f0', borderRadius: '10px', padding: '24px',
                          textAlign: 'center', cursor: 'pointer', marginBottom: '10px',
                          background: '#f8fafc', transition: 'border-color .15s', width: '100%', boxSizing: 'border-box'
                        }}
                      >
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          ref={aboutFileRef}
                          style={{ display: 'none' }}
                          onChange={handleAboutImageUpload}
                        />
                        <div style={{ color: 'var(--purple)', marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>
                          <I d={ICONS.upload} s={22} />
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--t2)' }}>
                          {uploadingAboutImage ? 'Uploading...' : 'Click or Drag & Drop to upload a new About Section image'}
                        </span>
                        <br />
                        <span style={{ fontSize: '0.74rem', color: 'var(--t3)' }}>PNG, JPEG, WEBP — Max 10MB</span>
                      </div>
                      
                      {/* Or paste link */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.76rem', color: 'var(--t3)', flexShrink: 0 }}>Or paste URL:</span>
                        <input 
                          type="text" 
                          className="srv_input" 
                          style={{ flex: 1 }}
                          value={cmsData.aboutSection.image || ''} 
                          onChange={e => updateAbout('image', e.target.value)} 
                        />
                      </div>
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Experience Counter (e.g. 15+)</label>
                      <input type="text" className="srv_input" value={cmsData.aboutSection.yearsExperience} onChange={e => updateAbout('yearsExperience', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Experience Badge Description Label</label>
                      <input type="text" className="srv_input" value={cmsData.aboutSection.experienceLabel} onChange={e => updateAbout('experienceLabel', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Primary Button Text</label>
                      <input type="text" className="srv_input" value={cmsData.aboutSection.ctaText || ''} onChange={e => updateAbout('ctaText', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Primary Button Link</label>
                      <input type="text" className="srv_input" value={cmsData.aboutSection.ctaUrl || ''} onChange={e => updateAbout('ctaUrl', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Secondary Button Text</label>
                      <input type="text" className="srv_input" value={cmsData.aboutSection.secondaryCtaText || ''} onChange={e => updateAbout('secondaryCtaText', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Secondary Button Link</label>
                      <input type="text" className="srv_input" value={cmsData.aboutSection.secondaryCtaUrl || ''} onChange={e => updateAbout('secondaryCtaUrl', e.target.value)} />
                    </div>
                  </div>

                  <div className="cnt_form_title" style={{ marginTop: '20px', borderTop: '1px dashed #e2e8f0', paddingTop: '20px' }}>Features Checkmarks</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
                    {cmsData.aboutSection.features.map((feat, fIdx) => (
                      <div key={fIdx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--purple)', display: 'block', marginBottom: '8px' }}>Feature #{fIdx+1} Details</strong>
                        <div className="srv_form_grid">
                          <div className="srv_form_group">
                            <label className="srv_label">Feature Icon</label>
                            <div style={{ marginTop: '4px' }}>
                              <IconPickerPanel selectedKey={feat.icon} onSelect={val => updateAboutFeature(fIdx, 'icon', val)} />
                            </div>
                          </div>
                          <div className="srv_form_group">
                            <label className="srv_label">Feature Title</label>
                            <input type="text" className="srv_input" value={feat.title} onChange={e => updateAboutFeature(fIdx, 'title', e.target.value)} />
                          </div>
                          <div className="srv_form_group full">
                            <label className="srv_label">Feature Description Text</label>
                            <input type="text" className="srv_input" value={feat.desc} onChange={e => updateAboutFeature(fIdx, 'desc', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div>
                  <div className="cnt_form_title">Homepage SEO & Open Graph Tags</div>
                  <div className="cnt_form_sub">Modify search engine headers, canonical listings, and social sharing links.</div>

                  <div className="srv_form_grid">
                    <div className="srv_form_group full">
                      <label className="srv_label">Meta HTML Title Tag</label>
                      <input type="text" className="srv_input" value={cmsData.seoSettings.metaTitle} onChange={e => updateSeo('metaTitle', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Meta HTML Description Tag</label>
                      <textarea className="srv_textarea" rows={3} value={cmsData.seoSettings.metaDescription} onChange={e => updateSeo('metaDescription', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Meta Keywords (Comma-Separated)</label>
                      <input type="text" className="srv_input" value={cmsData.seoSettings.metaKeywords} onChange={e => updateSeo('metaKeywords', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="cnt_toast">
          <span>{toast.message}</span>
        </div>
      )}

      {modalConfig && (
        <div className="custom_modal_overlay">
          <div className="custom_modal_box">
            <div className="modal_icon_circle">
              {modalConfig.type === 'confirm' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--purple)' }}>
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#be123c' }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              )}
            </div>
            <div className="modal_message">{modalConfig.message}</div>
            <div className="modal_actions">
              {modalConfig.type === 'confirm' && (
                <button type="button" className="modal_btn btn_cancel" onClick={modalConfig.onCancel}>
                  Cancel
                </button>
              )}
              <button type="button" className="modal_btn btn_confirm" onClick={modalConfig.onConfirm}>
                {modalConfig.type === 'confirm' ? 'Yes, Proceed' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
