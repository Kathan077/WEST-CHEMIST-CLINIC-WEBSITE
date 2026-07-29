'use client';

import React, { useState, useEffect } from 'react';
import { API_URL } from '@/config';

const ICONS = {
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  cal:     "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  users:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  doc:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  globe:   "M12 2a10 10 0 1010 10A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  info:    "M12 16v-4 M12 8h.01 M12 2a10 10 0 1010 10A10 10 0 0012 2z",
  logout:  "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
};

const I = ({ d, s = 17 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export default function Sidebar({ activePage }) {
  const [adminUser, setAdminUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [pendingCount, setPendingCount] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('adminUser');
    if (!stored) {
      window.location.href = '/';
      return;
    }
    try {
      setAdminUser(JSON.parse(stored));
    } catch (_) {}

    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);

    // Fetch pending appointments count for the badge
    const fetchPending = async () => {
      try {
        const res = await fetch(`${API_URL}/api/appointments`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.appointments)) {
            const count = data.appointments.filter(a => ['pending', 'confirmed'].includes(a.status)).length;
            setPendingCount(count || null);
          }
        }
      } catch (err) {
        console.error('Sidebar appointments error:', err);
      }
    };
    fetchPending();

    return () => window.removeEventListener('resize', check);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const nav = [
    { label: 'Dashboard',          path: '/patients',                   icon: ICONS.home,   active: activePage === 'dashboard' },
    { label: 'Appointments',       path: '/appointments',               icon: ICONS.cal,    badge: pendingCount || null, active: activePage === 'appointments' },
    { label: 'Patients',           path: '/patients?view=patients',     icon: ICONS.users,  active: activePage === 'patients' },
    { label: 'Schedule Manager',   path: '/schedule',                   icon: ICONS.cal,    active: activePage === 'schedule' },
    { label: 'Compliance',         path: '/compliance',                 icon: ICONS.shield, active: activePage === 'compliance' },
    { label: 'Services & Content', path: '/services',                   icon: ICONS.edit,   active: activePage === 'services' },
    { label: 'Vaccination Manager',path: '/vaccination',                icon: ICONS.doc,    active: activePage === 'vaccination' },
    { label: 'Weight Loss Manager',path: '/weight-loss',                icon: ICONS.doc,    active: activePage === 'weight-loss' },
    { label: 'Homepage CMS',       path: '/homepage',                   icon: ICONS.globe,  active: activePage === 'homepage' },
    { label: 'Blog Manager',       path: '/blog',                       icon: ICONS.doc,    active: activePage === 'blog' },
    { label: 'About Page',         path: '/about',                      icon: ICONS.info,   active: activePage === 'about' },
  ];

  return (
    <aside className="dash_sb">
      {!isMobile && (
        <div className="sb_logo">
          <div className="sb_logo_mark">W</div>
          <div className="sb_logo_name">
            West Chemist
            <small>Admin Portal</small>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {!isMobile && (
          <div className="sb_section">
            <div className="sb_section_label">General</div>
          </div>
        )}
        <div style={{ padding: '0 14px' }}>
          {nav.map(n => (
            <a key={n.label} href={n.path} className={`sb_link${n.active ? ' active' : ''}`}>
              <I d={n.icon} />
              <span>{n.label}</span>
              {n.badge ? <span className="sb_badge">{n.badge}</span> : null}
            </a>
          ))}
        </div>

        {!isMobile && (
          <div className="sb_section" style={{ marginTop: 8 }}>
            <div className="sb_section_label">Settings</div>
          </div>
        )}
        <div style={{ padding: '0 14px' }}>
          <a className="sb_link" href="#" onClick={e => { e.preventDefault(); logout(); }}>
            <I d={ICONS.logout} />
            <span>Log Out</span>
          </a>
        </div>
      </div>

      {!isMobile && (
        <div className="sb_foot">
          <div className="sb_user">
            <div className="sb_av">{(adminUser?.username || 'A')[0].toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sb_uname">{adminUser?.username || 'Admin'}</div>
              <div className="sb_urole">Administrator</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
