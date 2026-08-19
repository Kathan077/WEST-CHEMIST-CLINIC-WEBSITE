'use client';

import { API_URL } from '@/config';
import React, { useState, useEffect, useRef } from 'react';
import './blog.css';
import '../patients/dashboard.css';
import Sidebar from '@/components/Sidebar';

/* ─ SVG Icons ─ */
const I = ({ d, s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {String(d).split(' M').map((seg, i) => (
      <path key={i} d={i === 0 ? seg : 'M' + seg} />
    ))}
  </svg>
);

const ICONS = {
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  cal:     "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  users:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  search:  "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  logout:  "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  doc:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  plus:    "M12 5v14M5 12h14",
  trash:   "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2",
  arrowL:  "M19 12H5M12 19l-7-7 7-7",
  upload:  "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  clock:   "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2",
  tool:    "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z",
  share:   "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8 M16 6l-4-4-4 4 M12 2v13",
  globe:   "M12 2a10 10 0 100 20 10 10 0 000-20z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  info:    "M12 16v-4 M12 8h.01 M12 2a10 10 0 1010 10A10 10 0 0012 2z",
};

const WELLBEING_ICONS = {
  calculator: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="12" cy="12" r="5" />
      <path d="M12 12l2.5-2.5" />
    </svg>
  ),
  droplet: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13s-7 8.7-7 13a7 7 0 0 0 7 7z" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <path d="M11 8v6M8 11h6" />
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  thermometer: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  clipboard: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  )
};

const SUBJECT_OPTIONS = [
  'General Health',
  'Travel Health',
  'Weight Loss',
  'Pharmacy News',
  'Wellness',
  'PHARMACY ear care',
  'Aesthetics'
];

/* ── Icon Picker Library ── */
const IP = (paths, vb = '0 0 24 24') => ({ paths: Array.isArray(paths) ? paths : [paths], vb });
const ICON_PICKER_LIBRARY = [
  // ─ Health ─
  { key: 'heart',       label: 'Heart',        cat: 'Health', ...IP('M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z') },
  { key: 'heartbeat',   label: 'Heartbeat',    cat: 'Health', ...IP('M22 12h-4l-3 9L9 3l-3 9H2') },
  { key: 'activity',   label: 'Activity',     cat: 'Health', ...IP('M22 12h-4l-3 9L9 3l-3 9H2') },
  { key: 'stethoscope',label: 'Stethoscope',  cat: 'Health', ...IP(['M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3', 'M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4']) },
  { key: 'thermometer',label: 'Thermometer',  cat: 'Health', ...IP('M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z') },
  { key: 'droplet',    label: 'Droplet',      cat: 'Health', ...IP('M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13s-7 8.7-7 13a7 7 0 0 0 7 7z') },
  { key: 'brain',      label: 'Brain',        cat: 'Health', ...IP(['M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.73A3 3 0 0 1 3.34 9a2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.84-2.76Z','M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.73 3 3 0 0 0 2.13-5.27 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.84-2.76Z']) },
  { key: 'eye',        label: 'Eye',          cat: 'Health', ...IP(['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z']) },
  { key: 'bone',       label: 'Bone',         cat: 'Health', ...IP('M18.5 5.5a4.5 4.5 0 0 1 0 6.364L12 18.364l-1.414-1.414 6.364-6.364a2.5 2.5 0 0 0-3.536-3.536L7 13.364l-1.414-1.414L11.95 5.586a4.5 4.5 0 0 1 6.55-.086zM5.5 18.5a4.5 4.5 0 0 1 0-6.364L12 5.636l1.414 1.414L7.05 13.414a2.5 2.5 0 0 0 3.536 3.536L17 10.636l1.414 1.414L12.05 18.414a4.5 4.5 0 0 1-6.55.086z') },
  { key: 'lungs',      label: 'Lungs',        cat: 'Health', ...IP(['M6 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2', 'M20 12h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2', 'M12 2v10', 'M6 12a6 6 0 0 0 6 6 6 6 0 0 0 6-6']) },
  { key: 'pill',       label: 'Pill',         cat: 'Health', ...IP(['M10.5 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5', 'M2 12H10', 'M22 12H14', 'M13.5 4H20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6.5']) },
  { key: 'syringe',    label: 'Syringe',      cat: 'Health', ...IP(['m18 2 4 4','m17 7 3-3','M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 9']) },
  { key: 'bandage',    label: 'Bandage',      cat: 'Health', ...IP(['M10 10.01V10','M14 14.01V14','m14.5 9.5-5 5','M8.5 8.5A2.5 2.5 0 0 0 6 11v2a2.5 2.5 0 0 0 5 0V11a2.5 2.5 0 0 0-2.5-2.5Z']) },
  // ─ Medical ─
  { key: 'cross',      label: 'Med Cross',    cat: 'Medical', ...IP(['M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z']) },
  { key: 'hospital',   label: 'Hospital',     cat: 'Medical', ...IP(['M12 6v4','M14 14h-4','M14 18h-4','M14 8h-4','M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2','M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18']) },
  { key: 'clipboard',  label: 'Clipboard',    cat: 'Medical', ...IP(['M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2', 'M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z']) },
  { key: 'microscope', label: 'Microscope',   cat: 'Medical', ...IP(['M6 18h8','M3 22h18','M14 22a7 7 0 1 0 0-14h-1','M9 14h.01','M9 3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z','M9 7l1 3h2l1-3']) },
  { key: 'shield',     label: 'Shield',       cat: 'Medical', ...IP('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z') },
  { key: 'dna',        label: 'DNA',          cat: 'Medical', ...IP(['M2 15c6.667-6 13.333 0 20-6','M2 9c6.667 6 13.333 0 20 6','M2 12h20','M2 18h20','M2 6h20']) },
  { key: 'virus',      label: 'Virus',        cat: 'Medical', ...IP(['M12 8a4 4 0 0 0 0 8 4 4 0 0 0 0-8Z','M12 2v2.5','M12 19.5V22','M4.93 4.93l1.77 1.77','M17.3 17.3l1.77 1.77','M2 12h2.5','M19.5 12H22','M4.93 19.07l1.77-1.77','M17.3 6.7l1.77-1.77']) },
  { key: 'scale',      label: 'BMI Scale',    cat: 'Medical', ...IP(['M12 3a1 1 0 0 1 1 1v7.5a.5.5 0 0 1-1 0V4a1 1 0 0 1-1-1Z','M3 14a9 9 0 1 0 18 0']) },
  // ─ Fitness ─
  { key: 'dumbbell',   label: 'Dumbbell',     cat: 'Fitness', ...IP(['M14.4 14.4 9.6 9.6','M18.657 5.343a4 4 0 0 1 0 5.657l-1.414 1.414a4 4 0 0 1-5.657-5.657l1.414-1.414a4 4 0 0 1 5.657 0Z','M5.343 18.657a4 4 0 0 1 0-5.657l1.414-1.414a4 4 0 0 1 5.657 5.657l-1.414 1.414a4 4 0 0 1-5.657 0Z']) },
  { key: 'bike',       label: 'Cycling',      cat: 'Fitness', ...IP(['M5.5 17a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z','M13 17a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z','M8 17V5l7 3 3 3h1','M8 12H5']) },
  { key: 'footprints', label: 'Steps',        cat: 'Fitness', ...IP(['M4 16v-2.38C4 11.5 2.97 10.63 3 8c.03-2.69 2.16-4.95 4.85-5A5 5 0 0 1 13 8c0 2.38-1 3.5-1 5.5V16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z','M4 20h9','M9 20v1','M6.5 8.5h1']) },
  { key: 'moon',       label: 'Sleep',        cat: 'Fitness', ...IP('M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z') },
  { key: 'sun',        label: 'Wellness',     cat: 'Fitness', ...IP(['M12 2v2','M12 20v2','m4.93 4.93-1.41 1.41','m16.95 16.95-1.41 1.41','M2 12h2','M20 12h2','m6.34 17.66-1.41 1.41','m19.07 4.93-1.41 1.41','M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z']) },
  { key: 'flame',      label: 'Calories',     cat: 'Fitness', ...IP('M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z') },
  // ─ Food ─
  { key: 'apple',      label: 'Nutrition',    cat: 'Food', ...IP(['M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z','M10 2c1 .5 2 2 2 5']) },
  { key: 'leaf',       label: 'Organic',      cat: 'Food', ...IP('M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12') },
  { key: 'salad',      label: 'Diet',         cat: 'Food', ...IP(['M7 21h10','M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z','M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.4 2.4 0 0 1 .45 3.56A7 7 0 0 1 12 12Z']) },
  // ─ Tools ─
  { key: 'calculator', label: 'Calculator',   cat: 'Tools', ...IP(['M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Z','M8 7h8','M8 11h8','M8 15h5']) },
  { key: 'search',     label: 'Search',       cat: 'Tools', ...IP(['M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0']) },
  { key: 'zap',        label: 'Quick Check',  cat: 'Tools', ...IP('M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z') },
  { key: 'chart',      label: 'Chart',        cat: 'Tools', ...IP(['M3 3v18h18','M7 16v-5','M11 16V7','M15 16v-9','M19 16v-3']) },
  { key: 'beaker',     label: 'Test',         cat: 'Tools', ...IP(['M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2','M8.5 2h7','M14.5 16h-5']) },
  // ─ Info ─
  { key: 'info',       label: 'Info',         cat: 'Info', ...IP(['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z','M12 16v-4','M12 8h.01']) },
  { key: 'alert',      label: 'Alert',        cat: 'Info', ...IP(['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01']) },
  { key: 'book',       label: 'Guide',        cat: 'Info', ...IP(['M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20']) },
  { key: 'lightbulb',  label: 'Tips',         cat: 'Info', ...IP(['M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5','M9 18h6','M10 22h4']) },
  { key: 'question',   label: 'FAQ',          cat: 'Info', ...IP(['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z','M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3','M12 17h.01']) },
  { key: 'star',       label: 'Featured',     cat: 'Info', ...IP('M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z') },
];

/* A small inline icon renderer for picker items */
const PickerIcon = ({ item, size = 22 }) => (
  <svg viewBox={item.vb} width={size} height={size} fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {item.paths.map((p, i) => <path key={i} d={p} />)}
  </svg>
);

/* Emoji-panel style icon picker component */
function IconPickerPanel({ selectedKey, onSelect }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [cat, setCat] = React.useState('All');
  const panelRef = React.useRef(null);
  const searchRef = React.useRef(null);

  const cats = ['All', ...Array.from(new Set(ICON_PICKER_LIBRARY.map(i => i.cat)))];
  const selected = ICON_PICKER_LIBRARY.find(i => i.key === selectedKey) || ICON_PICKER_LIBRARY[0];

  const filtered = ICON_PICKER_LIBRARY.filter(i => {
    const matchCat = cat === 'All' || i.cat === cat;
    const matchQ   = !query || i.label.toLowerCase().includes(query.toLowerCase()) || i.key.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  /* Close on outside click */
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* Focus search on open */
  React.useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={panelRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          padding: '9px 14px', background: '#ffffff',
          border: '1.5px solid #e2e8f0', borderRadius: '10px',
          cursor: 'pointer', outline: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          transition: 'border-color .15s', color: 'var(--t1)', fontSize: '0.83rem',
          fontWeight: '600', fontFamily: 'var(--f)'
        }}
      >
        <span style={{ color: 'var(--purple)', display: 'flex' }}>
          <PickerIcon item={selected} size={20} />
        </span>
        <span>{selected.label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, marginLeft: 2 }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Picker panel */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 9999,
          width: '360px', background: '#ffffff',
          border: '1.5px solid #e2e8f0', borderRadius: '14px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.14)', overflow: 'hidden',
          animation: 'fadeUp .18s ease both'
        }}>
          {/* Search bar */}
          <div style={{ padding: '12px 12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '7px 12px', marginBottom: '10px' }}>
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
            {/* Category pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px' }}>
              {cats.map(c => (
                <button key={c} type="button" onClick={() => setCat(c)}
                  style={{ flexShrink: 0, padding: '4px 12px', borderRadius: '20px', border: '1.5px solid', fontSize: '0.74rem', fontWeight: '700', cursor: 'pointer', outline: 'none', fontFamily: 'var(--f)', transition: 'all .15s',
                    background: cat === c ? 'var(--purple)' : 'transparent',
                    borderColor: cat === c ? 'var(--purple)' : '#e2e8f0',
                    color: cat === c ? '#fff' : 'var(--t3)'
                  }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Icon grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', padding: '10px', maxHeight: '260px', overflowY: 'auto' }}>
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
                    gap: '4px', padding: '10px 4px', borderRadius: '8px', cursor: 'pointer', outline: 'none',
                    border: isSel ? '2px solid var(--purple)' : '2px solid transparent',
                    background: isSel ? 'rgba(75,45,113,0.07)' : 'transparent',
                    color: isSel ? 'var(--purple)' : '#475569',
                    transition: 'all .12s',
                  }}
                >
                  <PickerIcon item={item} size={20} />
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

export default function BlogManagerPage() {
  // Core States
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [adminUser, setAdminUser] = useState(null);
  const [activeView, setActiveView] = useState('list'); // 'list' or 'editor'
  const [editingBlog, setEditingBlog] = useState(null); // null if creating

  // Blog Manager tab selection
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' | 'hours' | 'tools' | 'social'

  // Opening Hours state
  const [hoursForm, setHoursForm] = useState({ mon_fri: '', sat: '', sun: '' });
  // Social settings state
  const [socialForm, setSocialForm] = useState({ title: '', content: '', instagram_url: '' });
  const [socialImages, setSocialImages] = useState([]);
  const [uploadingSocial, setUploadingSocial] = useState(false);
  const [extSocialUrl, setExtSocialUrl] = useState('');
  // Tools list state
  const [toolsHeader, setToolsHeader] = useState({ title: '', content: '' });
  const [toolsList, setToolsList] = useState([]);

  // Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [externalUrl, setExternalUrl] = useState('');
  const [verificationTitle, setVerificationTitle] = useState('Medically Verified');
  const [verificationSubtitle, setVerificationSubtitle] = useState('By PHARMACY Team');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Active Preview image index
  const [activePreviewImgIdx, setActivePreviewImgIdx] = useState(0);

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Custom modal dialog state
  const [activeDialog, setActiveDialog] = useState(null); // { type: 'link'|'category'|'clear', value?: string, onSubmit: (val?: string) => void }

  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);

  // Selection preservation helpers
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRangeRef.current = selection.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRangeRef.current);
    }
  };

  const insertImageIntoEditor = (imageUrl) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const selection = window.getSelection();
    let range = null;
    if (selection && selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
    }
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.maxWidth = '100%';
    img.style.borderRadius = '12px';
    img.style.margin = '12px 0';
    img.style.display = 'block';
    
    if (range && editorRef.current.contains(range.commonAncestorContainer)) {
      range.insertNode(img);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      editorRef.current.appendChild(img);
    }
    
    setDescription(editorRef.current.innerHTML);
  };

  // Fetch admin, categories, blogs and settings on load
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    if (!token) { window.location.replace('/admin'); return; }
    if (user) setAdminUser(JSON.parse(user));

    fetchCategories();
    fetchBlogs();
    fetchSettings();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setCategories(data.data);
        if (!editingBlog) {
          setSubject(data.data[0].name);
        }
      } else {
        const defaultCats = SUBJECT_OPTIONS.map(name => ({ name }));
        setCategories(defaultCats);
      }
    } catch (err) {
      console.error(err);
      const defaultCats = SUBJECT_OPTIONS.map(name => ({ name }));
      setCategories(defaultCats);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/blogs`);
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data);
      } else {
        showToast(data.message || 'Failed to fetch blogs', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error loading blogs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const [hoursRes, toolsHdrRes, toolsListRes, socialRes] = await Promise.all([
        fetch(`${API_URL}/api/contents/clinic-hours`),
        fetch(`${API_URL}/api/contents/health-tools-header`),
        fetch(`${API_URL}/api/contents/health-tools-list`),
        fetch(`${API_URL}/api/contents/social-feed-header`)
      ]);
      
      const hoursJson = await hoursRes.json();
      const toolsHdrJson = await toolsHdrRes.json();
      const toolsListJson = await toolsListRes.json();
      const socialJson = await socialRes.json();

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
      if (socialJson.success && socialJson.data) {
        setSocialForm({
          title: socialJson.data.title || '',
          content: socialJson.data.content || '',
          instagram_url: socialJson.data.metadata?.instagram_url || ''
        });
        // Load social post images dynamically from metadata
        const imgs = [];
        let i = 0;
        while (true) {
          const url = socialJson.data.metadata?.[`social_img_${i}`];
          if (url === undefined) break;
          if (url.trim()) imgs.push(url.trim());
          i++;
        }
        setSocialImages(imgs);
      }
    } catch (err) {
      console.error("Error loading blog settings:", err);
    }
  };

  const handleSaveHours = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const finalContent = `Mon - Fri: ${hoursForm.mon_fri}\nSaturday: ${hoursForm.sat}\nSunday: ${hoursForm.sun}`;
    try {
      const res = await fetch(`${API_URL}/api/contents/clinic-hours`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Clinic Opening Hours',
          content: finalContent,
          metadata: {
            mon_fri: hoursForm.mon_fri,
            sat: hoursForm.sat,
            sun: hoursForm.sun
          }
        })
      });
      if (res.ok) {
        showToast("Clinic hours updated successfully!");
      } else {
        showToast("Failed to update clinic hours", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating clinic hours", "error");
    }
  };

  const handleSaveTools = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const resHeader = await fetch(`${API_URL}/api/contents/health-tools-header`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: toolsHeader.title,
          content: toolsHeader.content
        })
      });
      
      const resList = await fetch(`${API_URL}/api/contents/health-tools-list`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Interactive Health Tools List',
          content: JSON.stringify(toolsList)
        })
      });

      if (resHeader.ok && resList.ok) {
        showToast("Interactive health tools updated successfully!");
      } else {
        showToast("Failed to update health tools", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving health tools changes", "error");
    }
  };

  const handleSocialImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    setUploadingSocial(true);
    try {
      const res = await fetch(`${API_URL}/api/blogs/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setSocialImages(prev => [...prev.filter(Boolean), ...data.urls]);
        showToast('Social gallery images uploaded successfully!');
      } else {
        showToast(data.message || 'File upload failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error during file upload', 'error');
    } finally {
      setUploadingSocial(false);
      e.target.value = ''; // clear input
    }
  };

  const handleAddExtSocialUrl = () => {
    if (!extSocialUrl) return;
    setSocialImages(prev => [...prev.filter(Boolean), extSocialUrl.trim()]);
    setExtSocialUrl('');
    showToast('External social image added!');
  };

  const handleSaveSocial = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      // Build metadata with instagram URL + all social post images
      const metadata = { instagram_url: socialForm.instagram_url };
      socialImages.filter(Boolean).forEach((url, i) => {
        if (url.trim()) metadata[`social_img_${i}`] = url.trim();
      });

      const res = await fetch(`${API_URL}/api/contents/social-feed-header`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: socialForm.title,
          content: socialForm.content,
          metadata
        })
      });
      if (res.ok) {
        showToast("Social feed settings updated successfully!");
      } else {
        showToast("Failed to update social settings", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving social settings", "error");
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.replace('/admin');
  };

  // Helper to generate slug from title
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove special characters
      .trim()
      .replace(/\s+/g, '-'); // replace spaces with hyphens
    setSlug(autoSlug);
  };

  // ExecCommand rich editor formatter
  const executeCmd = (command, value = null) => {
    document.execCommand(command, false, value);
    
    // Collapse selection and turn off styling toggle so next characters are typed normally
    if (command === 'bold' || command === 'italic') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          selection.collapseToEnd();
          // Toggle command off for the new cursor position
          document.execCommand(command, false, null);
        }
      }
    }

    if (editorRef.current) {
      setDescription(editorRef.current.innerHTML);
    }
  };

  // Clear selection formatting, or trigger custom modal to empty editor if no selection exists
  const handleClear = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.getRangeAt(0).collapsed) {
      document.execCommand('removeFormat', false, null);
      if (editorRef.current) {
        setDescription(editorRef.current.innerHTML);
      }
    } else {
      setActiveDialog({
        type: 'clear',
        onSubmit: () => {
          if (editorRef.current) {
            editorRef.current.innerHTML = '';
            setDescription('');
          }
        }
      });
    }
  };

  // Create Category on Database backend
  const createCategoryOnBackend = async (trimmedName) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: trimmedName })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(`Category "${trimmedName}" created successfully!`);
        setCategories([...categories, data.data]);
        setSubject(trimmedName);
      } else {
        showToast(data.message || 'Failed to create category', 'error');
        if (categories.length > 0) setSubject(categories[0].name);
      }
    } catch (err) {
      console.error(err);
      showToast('Network error creating category', 'error');
      if (categories.length > 0) setSubject(categories[0].name);
    }
  };


  // Handle file uploads to backend
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    setUploading(true);
    try {
      const res = await fetch(`${API_URL}/api/blogs/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setImages([...images, ...data.urls]);
        showToast('Images uploaded successfully!');
        if (images.length === 0) setActivePreviewImgIdx(0);
      } else {
        showToast(data.message || 'File upload failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error during file upload', 'error');
    } finally {
      setUploading(false);
      e.target.value = ''; // clear input
    }
  };

  // Add external image link
  const handleAddExternalUrl = () => {
    if (!externalUrl) return;
    if (!externalUrl.startsWith('http://') && !externalUrl.startsWith('https://') && !externalUrl.startsWith('/')) {
      showToast('Please enter a valid image URL', 'error');
      return;
    }
    setImages([...images, externalUrl.trim()]);
    setExternalUrl('');
    if (images.length === 0) setActivePreviewImgIdx(0);
    showToast('Image URL added!');
  };

  const handleRemoveImage = (index) => {
    const filtered = images.filter((_, idx) => idx !== index);
    setImages(filtered);
    if (activePreviewImgIdx >= filtered.length) {
      setActivePreviewImgIdx(Math.max(0, filtered.length - 1));
    }
  };

  // Open Form for creating or editing
  const openEditor = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setTitle(blog.title);
      setSlug(blog.slug);
      setSubject(blog.subject);
      setDescription(blog.description);
      setImages(blog.images || []);
      setVerificationTitle(blog.verificationTitle || 'Medically Verified');
      setVerificationSubtitle(blog.verificationSubtitle || 'By PHARMACY Team');
      setActivePreviewImgIdx(0);
      
      // Seed contentEditable block
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = blog.description;
        }
      }, 80);
    } else {
      setEditingBlog(null);
      setTitle('');
      setSlug('');
      setSubject(categories.length > 0 ? categories[0].name : SUBJECT_OPTIONS[0]);
      setDescription('');
      setImages([]);
      setVerificationTitle('Medically Verified');
      setVerificationSubtitle('By PHARMACY Team');
      setActivePreviewImgIdx(0);

      // Seed contentEditable block
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
      }, 80);
    }
    setActiveView('editor');
  };

  // Handle Form submit
  const handleSaveBlog = async (e) => {
    e.preventDefault();
    const cleanText = description.replace(/<[^>]*>/g, '').trim();
    if (!title.trim() || !slug.trim() || !subject.trim() || !cleanText) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    const blogData = {
      title,
      slug: slug.trim().toLowerCase(),
      subject,
      description,
      images,
      verificationTitle,
      verificationSubtitle,
      date: editingBlog ? editingBlog.date : new Date()
    };

    const token = localStorage.getItem('adminToken');

    try {
      const url = editingBlog 
        ? `${API_URL}/api/blogs/${editingBlog._id}` 
        : `${API_URL}/api/blogs`;
      
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(blogData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!');
        fetchBlogs();
        setActiveView('list');
      } else {
        showToast(data.message || 'Failed to save blog post', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error saving blog post', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete blog
  const handleDeleteBlog = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this blog post?')) return;

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Blog post deleted successfully');
        setBlogs(blogs.filter(b => b._id !== id));
      } else {
        showToast(data.message || 'Failed to delete blog post', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error deleting blog post', 'error');
    }
  };

  // Format image url for safe display
  const getFullImgUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1505751172107-160bf2a35368?w=600&q=80';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    const normalizedImg = img.startsWith('/') ? img : `/${img}`;
    const normalizedApi = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    return `${normalizedApi}${normalizedImg}`;
  };

  const adjustContentImages = (html) => {
    if (!html) return '';
    return html.replace(/src=["']\/([^"']+)["']/g, (match, path) => {
      if (path.startsWith('http://') || path.startsWith('https://')) return match;
      const normalizedApi = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      return `src="${normalizedApi}/${path}"`;
    });
  };

  // Filtered blogs for display
  const filteredBlogs = blogs.filter(b => 
    b.title?.toLowerCase().includes(search.toLowerCase()) || 
    b.subject?.toLowerCase().includes(search.toLowerCase())
  );

  // Linkify helper to auto-detect plain text URLs
  const linkify = (text) => {
    if (!text) return '';
    const urlPattern = /(?<!(?:href|src)=["']|url\()(https?:\/\/[^\s<"'`>\)]+)/g;
    return text.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: var(--purple); text-decoration: underline; font-weight: 600;">$1</a>');
  };

  return (
    <div className="dash">
      {/* ══ SIDEBAR ══ */}
      <Sidebar activePage="blog" />

      {/* ══ MAIN WORKSPACE ══ */}
      <div className="dash_main">
        {/* Header */}
        <header className="dash_hdr">
          <div className="dash_hdr_left">
            <h2>Blog Management</h2>
            <p>Write health articles, news posts, and manage resources on the main site.</p>
          </div>
        </header>

        {/* Tab switcher row (only in list view) */}
        {activeView === 'list' && (
          <div className="blog_tabs_row">
            {[
              { key: 'articles', label: 'Articles',         icon: ICONS.doc   },
              { key: 'hours',    label: 'Clinic Hours',     icon: ICONS.clock },
              { key: 'tools',    label: 'Interactive Tools',icon: ICONS.tool  },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                type="button"
                className={`blog_tab_btn${activeTab === key ? ' active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                <I d={icon} s={15} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}

        {activeView === 'list' ? (
          <div className="blog_mgr_container">
            {activeTab === 'articles' && (
              <>
                {/* Toolbar */}
                <div className="blog_toolbar">
                  <div className="blog_search_box">
                    <I d={ICONS.search} />
                    <input
                      type="text"
                      placeholder="Search articles by title or category..."
                      className="blog_search_input"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <button className="create_blog_btn" onClick={() => openEditor()}>
                    <I d={ICONS.plus} s={16} />
                    <span>Write New Article</span>
                  </button>
                </div>

                {/* Blogs List Grid */}
                {loading ? (
                  <div className="dash_loading">
                    <div className="spin"></div>
                    <p>Loading PHARMACY articles...</p>
                  </div>
                ) : filteredBlogs.length === 0 ? (
                  <div className="tbl_wrap" style={{ padding: '60px 40px', textAlignment: 'center', color: 'var(--t3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <I d={ICONS.doc} s={48} />
                    <h3>No articles found</h3>
                    <p>There are no blog posts matching your search query. Write a new post to get started!</p>
                  </div>
                ) : (
                  <div className="blog_grid">
                    {filteredBlogs.map(post => (
                      <div className="blog_card" key={post._id}>
                        <div className="blog_card_img_container">
                          <img 
                            src={getFullImgUrl(post.images[0])} 
                            alt={post.title} 
                            className="blog_card_img"
                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1505751172107-160bf2a35368?w=600&q=80'}
                          />
                          <span className="blog_card_badge">{post.subject}</span>
                        </div>

                        <div className="blog_card_content">
                          <span className="blog_card_date">{new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <h3 className="blog_card_title" title={post.title}>{post.title}</h3>
                          
                          {/* Strip HTML tags for clean card description */}
                          <p className="blog_card_desc">
                            {post.description?.replace(/<[^>]*>/g, '') || ''}
                          </p>

                          <div className="blog_card_url" title="Slug identifier for url">
                            🔗 /{post.slug}
                          </div>

                          <div className="blog_card_actions">
                            <button className="blog_btn_edit" onClick={() => openEditor(post)}>
                              <I d={ICONS.edit} s={13} />
                              Edit
                            </button>
                            <button className="blog_btn_delete" onClick={() => handleDeleteBlog(post._id)}>
                              <I d={ICONS.trash} s={13} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Clinic Hours Tab Content */}
            {activeTab === 'hours' && (
              <form onSubmit={handleSaveHours} className="editor_pane" style={{ background: '#fff', border: '1px solid var(--border)', padding: '28px', borderRadius: '16px', boxShadow: 'var(--sh)', maxWidth: '640px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--t1)', margin: 0, borderBottom: '1.5px solid var(--border)', paddingBottom: '12px' }}>Configure Clinic Opening Hours</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form_field_group">
                    <label className="form_label">Monday - Friday Hours</label>
                    <input
                      type="text"
                      className="form_input"
                      value={hoursForm.mon_fri}
                      onChange={(e) => setHoursForm({ ...hoursForm, mon_fri: e.target.value })}
                      placeholder="e.g. 8:30 AM - 6:30 PM"
                      required
                    />
                  </div>
                  <div className="form_field_group">
                    <label className="form_label">Saturday Hours</label>
                    <input
                      type="text"
                      className="form_input"
                      value={hoursForm.sat}
                      onChange={(e) => setHoursForm({ ...hoursForm, sat: e.target.value })}
                      placeholder="e.g. 9:00 AM - 2:00 PM"
                      required
                    />
                  </div>
                  <div className="form_field_group">
                    <label className="form_label">Sunday Hours</label>
                    <input
                      type="text"
                      className="form_input"
                      value={hoursForm.sun}
                      onChange={(e) => setHoursForm({ ...hoursForm, sun: e.target.value })}
                      placeholder="e.g. 9:00 AM - 12:00 PM"
                      required
                    />
                  </div>
                </div>

                <div className="form_action_bar" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '12px' }}>
                  <button type="submit" className="form_btn_save" style={{ height: 'auto', padding: '10px 24px', borderRadius: '10px' }}>
                    Save Hours Changes
                  </button>
                </div>
              </form>
            )}

            {/* Health Tools Tab Content */}
            {activeTab === 'tools' && (
              <form onSubmit={handleSaveTools} className="editor_pane" style={{ background: '#fff', border: '1px solid var(--border)', padding: '28px', borderRadius: '16px', boxShadow: 'var(--sh)', maxWidth: '780px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--t1)', margin: 0, borderBottom: '1.5px solid var(--border)', paddingBottom: '12px' }}>Configure Wellbeing Tools Section</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form_field_group">
                    <label className="form_label">Section Title Header</label>
                    <input
                      type="text"
                      className="form_input"
                      value={toolsHeader.title}
                      onChange={(e) => setToolsHeader({ ...toolsHeader, title: e.target.value })}
                      placeholder="e.g. Interactive Health Tools"
                      required
                    />
                  </div>
                  <div className="form_field_group">
                    <label className="form_label">Section Subtitle Description</label>
                    <input
                      type="text"
                      className="form_input"
                      value={toolsHeader.content}
                      onChange={(e) => setToolsHeader({ ...toolsHeader, content: e.target.value })}
                      placeholder="e.g. Free tools to help you monitor and understand your wellbeing."
                      required
                    />
                  </div>

                  <hr style={{ border: 'none', borderTop: '1.5px solid var(--border)', margin: '20px 0 24px' }} />
                  <label className="form_label" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--t1)', marginBottom: '16px', display: 'block' }}>Manage Tool Cards</label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {toolsList.map((tool, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          background: '#ffffff', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '16px', 
                          padding: '24px', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '20px',
                          position: 'relative',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                        }}
                      >
                        {/* Card index label */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                            Tool Card #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => setToolsList(toolsList.filter((_, i) => i !== idx))}
                            style={{ 
                              background: 'rgba(239, 68, 68, 0.06)', 
                              border: '1px solid rgba(239, 68, 68, 0.15)', 
                              color: '#ef4444', 
                              padding: '5px 12px', 
                              borderRadius: '8px', 
                              fontSize: '.75rem', 
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              outline: 'none'
                            }}
                          >
                            Remove Card
                          </button>
                        </div>

                        {/* Tool Name & Description row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="form_field_group" style={{ margin: 0 }}>
                            <label className="form_label">Tool Name</label>
                            <input
                              type="text"
                              className="form_input"
                              value={tool.title || ''}
                              onChange={(e) => {
                                const updated = [...toolsList];
                                updated[idx].title = e.target.value;
                                setToolsList(updated);
                              }}
                              placeholder="e.g. BMI Calculator"
                              required
                            />
                          </div>
                          <div className="form_field_group" style={{ margin: 0 }}>
                            <label className="form_label">Brief Description</label>
                            <input
                              type="text"
                              className="form_input"
                              value={tool.desc || ''}
                              onChange={(e) => {
                                const updated = [...toolsList];
                                updated[idx].desc = e.target.value;
                                setToolsList(updated);
                              }}
                              placeholder="e.g. Check your BMI in seconds."
                              required
                            />
                          </div>
                        </div>

                        {/* Icon selector section */}
                        <div>
                          <label className="form_label" style={{ marginBottom: '10px', display: 'block' }}>Choose Icon</label>
                          <IconPickerPanel
                            selectedKey={tool.icon && tool.icon !== '__custom__' ? tool.icon : 'heart'}
                            onSelect={(key) => {
                              const updated = [...toolsList];
                              updated[idx].icon = key;
                              updated[idx].customSvg = '';
                              setToolsList(updated);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setToolsList([...toolsList, { title: '', icon: 'heart', desc: '' }])}
                    style={{
                      background: 'transparent',
                      border: '1.5px dashed var(--purple)',
                      color: 'var(--purple)',
                      padding: '10px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '.85rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                      marginTop: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    + Add New Interactive Tool
                  </button>
                </div>

                <div className="form_action_bar" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '12px' }}>
                  <button type="submit" className="form_btn_save" style={{ height: 'auto', padding: '10px 24px', borderRadius: '10px' }}>
                    Save Tools Changes
                  </button>
                </div>
              </form>
            )}


          </div>
        ) : (
          /* ══ EDIT / CREATE WORKSPACE ══ */
          <div className="blog_mgr_container">
            <div className="editor_workspace">
              {/* Form Input Section */}
              <form onSubmit={handleSaveBlog} className="editor_pane">
                <div className="editor_title_bar">
                  <h3 className="editor_pane_title">
                    {editingBlog ? 'Edit Blog Article' : 'Compose New Article'}
                  </h3>
                  <button type="button" className="editor_back_btn" onClick={() => setActiveView('list')}>
                    <I d={ICONS.arrowL} s={14} />
                    <span>Back to Articles</span>
                  </button>
                </div>

                <div className="form_field_group">
                  <label className="form_label">Article Title <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Understanding High Blood Pressure"
                    className="form_input"
                    value={title}
                    onChange={handleTitleChange}
                  />
                </div>

                <div className="form_field_group">
                  <label className="form_label">URL Slug Link</label>
                  <input
                    type="text"
                    required
                    readOnly
                    placeholder="Auto-generated from title..."
                    className="form_input"
                    value={slug}
                    style={{ background: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }}
                  />
                  <span className="form_input_helper">This defines the address path and is auto-generated from the article title.</span>
                </div>

                <div className="form_field_group">
                  <label className="form_label">Category Subject <span style={{ color: '#ef4444' }}>*</span></label>
                  <select
                    className="form_select"
                    value={subject}
                    onChange={(e) => {
                      if (e.target.value === 'ADD_NEW_CAT') {
                        setActiveDialog({
                          type: 'category',
                          value: '',
                          onSubmit: (name) => {
                            if (name && name.trim()) {
                              createCategoryOnBackend(name.trim());
                            } else {
                              if (categories.length > 0) setSubject(categories[0].name);
                            }
                          }
                        });
                      } else {
                        setSubject(e.target.value);
                      }
                    }}
                  >
                    {categories.map(opt => (
                      <option key={opt._id || opt.name} value={opt.name}>{opt.name}</option>
                    ))}
                    <option value="ADD_NEW_CAT" style={{ color: 'var(--purple)', fontWeight: 'bold' }}>
                      ➕ Add New Category...
                    </option>
                  </select>
                </div>

                {/* Verification Badge Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form_field_group">
                    <label className="form_label">Verification Badge Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Medically Verified"
                      className="form_input"
                      value={verificationTitle}
                      onChange={(e) => setVerificationTitle(e.target.value)}
                    />
                  </div>
                  <div className="form_field_group">
                    <label className="form_label">Verification Badge Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. By PHARMACY Team"
                      className="form_input"
                      value={verificationSubtitle}
                      onChange={(e) => setVerificationSubtitle(e.target.value)}
                    />
                  </div>
                </div>

                {/* Multiple Images section */}
                <div className="form_field_group">
                  <label className="form_label">Article Photos (Multiple allowed)</label>
                  
                  {/* Multer drag/drop mock uploader */}
                  <div className="uploader_dropzone" onClick={() => fileInputRef.current.click()}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                    <div className="uploader_icon">
                      <I d={ICONS.upload} s={24} />
                    </div>
                    <span className="uploader_text">
                      {uploading ? 'Processing files...' : 'Upload Image Files'}
                    </span>
                    <span className="uploader_subtext">JPG, PNG, or WEBP. Max 10MB per file.</span>
                  </div>

                  {/* External URLs Paste */}
                  <div className="external_image_input_row">
                    <input
                      type="text"
                      placeholder="Or paste external image URL..."
                      className="form_input"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                    />
                    <button type="button" className="add_url_btn" onClick={handleAddExternalUrl}>
                      Add Link
                    </button>
                  </div>

                  {/* Previews grid */}
                  {images.length > 0 && (
                    <div className="photo_previews_grid">
                      {images.map((img, idx) => (
                        <div className="photo_preview_wrapper" key={idx} onClick={() => setActivePreviewImgIdx(idx)}>
                          <img 
                            src={getFullImgUrl(img)} 
                            alt="preview" 
                            className="photo_preview_img"
                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1505751172107-160bf2a35368?w=600&q=80'}
                          />
                          <button 
                            type="button" 
                            className="remove_preview_btn" 
                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Long Description and contentEditable visual editor */}
                <div className="form_field_group">
                  <label className="form_label">Description Content <span style={{ color: '#ef4444' }}>*</span></label>
                  
                  {/* Toolbar */}
                  <div className="editor_toolbar">
                    <button type="button" className="toolbar_btn bold_tool" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCmd('bold')} title="Make selected text bold">B</button>
                    <button type="button" className="toolbar_btn italic_tool" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCmd('italic')} title="Make selected text italic">I</button>
                    <button 
                      type="button" 
                      className="toolbar_btn" 
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        saveSelection();
                        setActiveDialog({
                          type: 'link',
                          value: 'https://',
                          onSubmit: (url) => {
                            if (url && url.trim()) {
                              restoreSelection();
                              executeCmd('createLink', url.trim());
                            }
                          }
                        });
                      }}
                      title="Insert hyperlink"
                    >Link 🔗</button>
                    <button 
                      type="button" 
                      className="toolbar_btn" 
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        saveSelection();
                        setActiveDialog({
                          type: 'image_url',
                          value: 'https://',
                          onSubmit: (url) => {
                            if (url && url.trim()) {
                              restoreSelection();
                              insertImageIntoEditor(url.trim());
                            }
                          }
                        });
                      }}
                      title="Insert image from URL"
                    >Image 🖼️</button>
                    <button type="button" className="toolbar_btn" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCmd('insertUnorderedList')} title="Insert bullet list">• List</button>
                    <button type="button" className="toolbar_btn" onMouseDown={(e) => e.preventDefault()} onClick={handleClear} title="Clear formatting">Clear ✕</button>
                    <span style={{ fontSize: '.68rem', color: 'var(--t3)', marginLeft: 'auto', display: 'flex', alignItems: 'center', fontWeight: '500' }}>
                      Highlight text to format. Drag & drop images below.
                    </span>
                  </div>

                  <div
                    ref={editorRef}
                    contentEditable={true}
                    spellCheck={true}
                    autoCorrect="on"
                    autoCapitalize="sentences"
                    id="blog_description_editor"
                    className="editor_content_editable"
                    placeholder="Write your PHARMACY article content here... (Drag & drop images here)"
                    onInput={(e) => setDescription(e.target.innerHTML)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = e.dataTransfer.files;
                      if (files && files.length > 0) {
                        const file = files[0];
                        if (file.type.startsWith('image/')) {
                          const formData = new FormData();
                          formData.append('files', file);
                          try {
                            showToast('Uploading dropped image...', 'info');
                            const res = await fetch(`${API_URL}/api/blogs/upload`, {
                              method: 'POST',
                              body: formData
                            });
                            const data = await res.json();
                            if (data.success && data.urls && data.urls.length > 0) {
                              const fullUrl = data.urls[0].startsWith('http') ? data.urls[0] : `${API_URL}${data.urls[0]}`;
                              insertImageIntoEditor(fullUrl);
                              showToast('Image inserted successfully!');
                            } else {
                              showToast(data.message || 'Image upload failed', 'error');
                            }
                          } catch (err) {
                            console.error(err);
                            showToast('Error uploading image', 'error');
                          }
                        }
                      }
                    }}
                  />
                </div>

                <div className="form_action_bar">
                  <button type="button" className="form_btn_cancel" onClick={() => setActiveView('list')}>
                    Cancel
                  </button>
                  <button type="submit" className="form_btn_save" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving changes...' : (editingBlog ? 'Update Article' : 'Publish Article')}
                  </button>
                </div>
              </form>

              {/* Side-by-side Live Preview Pane */}
              <div className="preview_pane">
                <span className="preview_label">Live Article Preview</span>
                
                {title || description || images.length > 0 ? (
                  <div className="preview_layout_grid">
                    <div className="preview_article_col">
                      <article className="dash_banner" style={{ background: '#fff', border: '1.5px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 16, color: 'var(--t2)', boxShadow: 'none', padding: '24px', margin: 0, animation: 'none' }}>
                        <div className="preview_article_header">
                          <span className="preview_article_subject">{subject}</span>
                          <h2 className="preview_article_title" style={{ color: 'var(--t1)' }}>{title || 'Untitled Article'}</h2>
                          <span className="preview_article_date">
                            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        {images.length > 0 && (
                          <div className="preview_photos_area">
                            <div className="preview_main_img_box" style={{ position: 'relative' }}>
                              <img 
                                src={getFullImgUrl(images[activePreviewImgIdx])} 
                                alt="blog main visual" 
                                className="preview_main_img"
                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1505751172107-160bf2a35368?w=600&q=80'}
                              />
                              <div style={{
                                position: 'absolute',
                                bottom: '16px',
                                right: '16px',
                                background: '#ffffff',
                                borderRadius: '12px',
                                border: '1px solid rgba(75, 45, 113, 0.08)',
                                boxShadow: '0 8px 24px rgba(75, 45, 113, 0.08)',
                                padding: '8px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                zIndex: 10
                              }}>
                                <div style={{
                                  width: '28px',
                                  height: '28px',
                                  background: 'rgba(0, 132, 115, 0.06)',
                                  borderRadius: '6px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'var(--accent, #008473)',
                                  flexShrink: 0
                                }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', textAlign: 'left' }}>
                                  <strong style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--t1)' }}>{verificationTitle || 'Medically Verified'}</strong>
                                  <span style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 600 }}>{verificationSubtitle || 'By PHARMACY Team'}</span>
                                </div>
                              </div>
                            </div>
                            {images.length > 1 && (
                              <div className="preview_thumbnails_strip">
                                {images.map((img, idx) => (
                                  <div 
                                    className={`preview_thumbnail_box${idx === activePreviewImgIdx ? ' active_thumb' : ''}`}
                                    key={idx}
                                    onClick={() => setActivePreviewImgIdx(idx)}
                                  >
                                    <img 
                                      src={getFullImgUrl(img)} 
                                      alt="thumbnail" 
                                      className="preview_thumbnail_img"
                                      onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1505751172107-160bf2a35368?w=600&q=80'}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Formatted body markup rendered safely with linkify detection */}
                        <div 
                          className="preview_article_body"
                          dangerouslySetInnerHTML={{ __html: linkify(adjustContentImages(description)) || '<span style="color:var(--t4);">Start writing description to see it here...</span>' }}
                        />
                      </article>
                    </div>

                    <div className="preview_sidebar_col">
                      <div className="preview_booking_card">
                        <div className="preview_booking_header">
                          <span className="preview_price_label">Premium PHARMACY Care</span>
                          <h3 className="preview_card_title" style={{ height: 'auto', display: 'block', overflow: 'visible', margin: 0 }}>West Chemist Clinic</h3>
                        </div>
                        <div className="preview_booking_meta">
                          <div className="preview_meta_item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--purple)', flexShrink: 0 }}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                            <span>NHS & Private Services Available</span>
                          </div>
                        </div>
                        <button type="button" className="preview_book_btn" disabled>
                          Book Your Appointment
                        </button>
                        <div className="preview_booking_footer">
                          <div className="preview_trust_badge">
                            <span>Verified Professional Service</span>
                          </div>
                          <p className="preview_card_hint">Fast availability • No GP referral needed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="preview_empty_state">
                    <I d={ICONS.doc} s={36} />
                    <h4>Preview is empty</h4>
                    <p>Enter title, photos, and description to see a live visual output.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ CUSTOM POP-UP DIALOGS ══ */}
      {activeDialog && (
        <div className="adm_modal_overlay" style={{ zIndex: 10000 }}>
          <div className="adm_modal" style={{ maxWidth: '420px', animation: 'scaleIn 0.25s cubic-bezier(.22,1,.36,1) both', padding: '24px' }}>
            <div className="adm_modal_header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid var(--border)', paddingBottom: '12px' }}>
              <span className="srv_modal_title" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--t1)' }}>
                {activeDialog.type === 'link' && '🔗 Insert Hyperlink'}
                {activeDialog.type === 'image_url' && '🖼️ Insert Image URL'}
                {activeDialog.type === 'category' && '➕ Create New Category'}
                {activeDialog.type === 'clear' && '⚠️ Reset Editor Content'}
              </span>
              <button 
                type="button" 
                className="srv_modal_close" 
                onClick={() => {
                  if (activeDialog.type === 'category' && categories.length > 0) {
                    setSubject(categories[0].name);
                  }
                  setActiveDialog(null);
                }}
                style={{ background: 'transparent', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: 'var(--t4)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '16px 0 0 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeDialog.type === 'clear' ? (
                <p style={{ fontSize: '.86rem', color: 'var(--t3)', lineHeight: 1.5, margin: 0 }}>
                  This will permanently delete all typed text and formatting inside the editor workspace. This action cannot be undone.
                </p>
              ) : (
                <div className="form_field_group">
                  <label className="form_label" style={{ fontSize: '.8rem', color: 'var(--t3)' }}>
                    {activeDialog.type === 'link' && 'Enter destination URL link:'}
                    {activeDialog.type === 'image_url' && 'Enter image URL link:'}
                    {activeDialog.type === 'category' && 'Enter Category Name:'}
                  </label>
                  <input
                    type="text"
                    autoFocus
                    className="form_input"
                    value={activeDialog.value || ''}
                    onChange={(e) => setActiveDialog({ ...activeDialog, value: e.target.value })}
                    placeholder={
                      activeDialog.type === 'link' ? 'https://example.com' :
                      activeDialog.type === 'image_url' ? 'https://example.com/image.jpg' : 'e.g. Health Tips'
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        activeDialog.onSubmit(activeDialog.value);
                        setActiveDialog(null);
                      }
                    }}
                    style={{ marginTop: '4px' }}
                  />
                </div>
              )}
            </div>

            <div className="adm_modal_footer" style={{ marginTop: '24px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="form_btn_cancel"
                style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '.8rem', height: 'auto' }}
                onClick={() => {
                  if (activeDialog.type === 'category' && categories.length > 0) {
                    setSubject(categories[0].name);
                  }
                  setActiveDialog(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="form_btn_save"
                style={{ 
                  padding: '8px 18px', 
                  borderRadius: '8px', 
                  fontSize: '.8rem',
                  height: 'auto',
                  background: activeDialog.type === 'clear' ? '#e11d48' : 'var(--purple)',
                  borderColor: activeDialog.type === 'clear' ? '#e11d48' : 'var(--purple)',
                  boxShadow: 'none'
                }}
                onClick={() => {
                  activeDialog.onSubmit(activeDialog.value);
                  setActiveDialog(null);
                }}
              >
                {activeDialog.type === 'link' && 'Insert Link'}
                {activeDialog.type === 'image_url' && 'Insert Image'}
                {activeDialog.type === 'category' && 'Create Category'}
                {activeDialog.type === 'clear' && 'Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TOAST NOTIFICATIONS ══ */}
      {toast && (
        <div className={`dash_toast ${toast.type === 'error' ? 'toast_err' : ''}`} style={{ borderLeftColor: toast.type === 'error' ? '#ef4444' : 'var(--em)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: toast.type === 'error' ? '#ef4444' : 'var(--em)' }} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

