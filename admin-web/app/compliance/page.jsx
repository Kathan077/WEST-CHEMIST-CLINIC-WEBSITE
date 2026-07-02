'use client';

import { API_URL } from '@/config';

import React, { useState, useEffect } from 'react';
import '../patients/dashboard.css';

/* ─ SVG Icons ─ */
const I = ({ d, s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const ICONS = {
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  cal:     "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  users:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  search:  "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  logout:  "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15",
  check:   "M20 6L9 17l-5-5",
  doc:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  info:    "M12 16v-4 M12 8h.01 M12 2a10 10 0 1010 10A10 10 0 0012 2z",
};

const renderCheckStatus = (status) => {
  const isDone = status === 'done';
  return (
    <span className={`comp_check_badge ${isDone ? 'passed' : 'pending'}`}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        {isDone ? (
          <path d="M20 6L9 17l-5-5" />
        ) : (
          <>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </>
        )}
      </svg>
      {isDone ? 'Passed' : 'Pending'}
    </span>
  );
};

export default function AdminCompliancePage() {
  const [verifications, setVerifications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState({ passed: 0, pending: 0, rejected: 0, total: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.replace('/admin');
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    if (!token) {
      window.location.replace('/admin');
      return;
    }
    if (user) {
      setAdminUser(JSON.parse(user));
    }

    const fetchPatientsAndVerifications = async () => {
      try {
        const resPatients = await fetch(`${API_URL}/api/patients`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataPatients = await resPatients.json();
        
        if (resPatients.ok && dataPatients.success) {
          const patientsList = dataPatients.data || [];
          const tempVerifications = [];

          for (const patient of patientsList) {
            const resVer = await fetch(`${API_URL}/api/verifications/patient/${patient._id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const dataVer = await resVer.json();
            if (resVer.ok && dataVer.success && dataVer.data.length > 0) {
              dataVer.data.forEach(ver => {
                tempVerifications.push({
                  ...ver,
                  patientName: patient.fullName,
                  patientMobile: patient.mobile,
                  patientEmail: patient.email
                });
              });
            }
          }

          tempVerifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setVerifications(tempVerifications);
          setFiltered(tempVerifications);

          // Calculate stats
          const passed = tempVerifications.filter(v => v.status === 'approved').length;
          const pending = tempVerifications.filter(v => v.status === 'pending').length;
          const rejected = tempVerifications.filter(v => v.status === 'rejected').length;
          setStats({ passed, pending, rejected, total: tempVerifications.length });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientsAndVerifications();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(!q ? verifications : verifications.filter(v =>
      v.patientName?.toLowerCase().includes(q) ||
      v.patientMobile?.includes(q) ||
      v.patientEmail?.toLowerCase().includes(q) ||
      v.idType?.toLowerCase().includes(q)
    ));
  }, [search, verifications]);

  const nav = [
    { label: 'Dashboard',    path: '/admin/patients',                 icon: ICONS.home },
    { label: 'Appointments', path: '/admin/appointments',             icon: ICONS.cal },
    { label: 'Patients',     path: '/admin/patients?view=patients',   icon: ICONS.users },
    { label: 'Compliance',   path: '/admin/compliance',               icon: ICONS.shield, active: true },
    { label: 'Services & Content', path: '/admin/services',           icon: ICONS.edit },
    { label: 'Blog Manager', path: '/admin/blog',                       icon: ICONS.doc },
    { label: 'About Page',   path: '/admin/about',                    icon: ICONS.info },
  ];

  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good Morning' : hr < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="dash">
      {/* ══ SIDEBAR ══ */}
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
          {!isMobile && <div className="sb_section"><div className="sb_section_label">General</div></div>}
          <div style={{ padding: '0 14px' }}>
            {nav.map(n => (
              <a key={n.label} href={n.path} className={`sb_link${n.active ? ' active' : ''}`}>
                <I d={n.icon} />
                <span>{n.label}</span>
              </a>
            ))}
          </div>

          {!isMobile && <div className="sb_section" style={{ marginTop: 8 }}><div className="sb_section_label">Settings</div></div>}
          <div style={{ padding: '0 14px' }}>
            <a className="sb_link" href="#" onClick={e => { e.preventDefault(); logout(); }}>
              <I d={ICONS.logout} /><span>Log Out</span>
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
              <button className="sb_logout" onClick={logout} title="Sign Out"><I d={ICONS.logout} s={14} /></button>
            </div>
          </div>
        )}
      </aside>

      {/* ══ MAIN ══ */}
      <div className="dash_main">
        {/* Header */}
        <header className="dash_hdr">
          <div className="dash_hdr_left">
            <h2>{greet}, {adminUser?.username || 'Admin'} 👋</h2>
            <p>GPhC identity verification audits & document check logs.</p>
          </div>
        </header>

        {/* Info Cards */}
        <div className="dash_stats">
          {[
            { label: 'Passed Audits', val: stats.passed, total: 100, iconPath: ICONS.check, cls: 'c1', up: true, trend: '98% secure' },
            { label: 'Awaiting Verification', val: stats.pending, total: 20, iconPath: ICONS.cal, cls: 'c2', up: false, trend: stats.pending > 0 ? 'Action needed' : 'Clean queue' },
            { label: 'Failed Checks', val: stats.rejected, total: 20, iconPath: ICONS.shield, cls: 'c3', up: false, trend: stats.rejected > 0 ? 'Review fail' : '0 issues' },
            { label: 'Total Audited', val: stats.total, total: 120, iconPath: ICONS.users, cls: 'c4', up: true, trend: 'GDPR Audited' }
          ].map((s, idx) => (
            <div key={idx} className={`stat_card ${s.cls}`} style={{animationDelay:`${idx*0.08}s`}}>
              <div className="stat_top">
                <span className="stat_lbl">{s.label}</span>
                <div className={`stat_trend ${s.up?'up':'dn'}`}>
                  {s.trend}
                </div>
              </div>
              <div className="stat_main">
                <div className="stat_num_wrapper">
                  <span className="stat_num">{s.val}</span>
                  <span className="stat_total">/{s.total}</span>
                </div>
                <div className="stat_icon_box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.iconPath}/>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Table View */}
        <div className="dash_table_section">
          <div className="panel">
            <div className="tbl_toolbar">
              <div className="tbl_search">
                <I d={ICONS.search} s={14} />
                <input placeholder="Search patient name, email, document…"
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button className="tbl_filter_btn" onClick={() => window.location.reload()}>
                <I d={ICONS.refresh} s={13} />
                Refresh Logs
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              {loading ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--t3)' }}>
                  Running compliance audit checks...
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'var(--t3)' }}>
                  No verification check logs matches your search parameters.
                </div>
              ) : (
                <table className="patients_table">
                  <thead>
                    <tr>
                      <th>Patient Profile</th>
                      <th>Doc Type</th>
                      <th>MRZ Verification</th>
                      <th>Anti-Tamper Scan</th>
                      <th>Document Readability</th>
                      <th>Visual Clarity (Blur Check)</th>
                      <th>Final Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((ver, idx) => (
                      <tr key={ver._id} style={{ animationDelay: `${idx * 0.04}s` }}>
                        <td>
                          <div style={{ fontWeight: '700', color: 'var(--t1)' }}>{ver.patientName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--t3)', marginTop: '2px' }}>{ver.patientMobile}</div>
                        </td>
                        <td>
                          <span style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', background: '#f4effa', color: '#4b2d71', padding: '3px 8px', borderRadius: '6px' }}>
                            {ver.idType}
                          </span>
                        </td>
                        <td>
                          {renderCheckStatus(ver.checks?.mrz)}
                        </td>
                        <td>
                          {renderCheckStatus(ver.checks?.tampering)}
                        </td>
                        <td>
                          {renderCheckStatus(ver.checks?.readable)}
                        </td>
                        <td>
                          {renderCheckStatus(ver.checks?.blur)}
                        </td>
                        <td>
                          <span className={`badge ${ver.status}`}>
                            {ver.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
