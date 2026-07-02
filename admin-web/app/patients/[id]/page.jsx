'use client';

import { API_URL } from '@/config';
import { use, useState, useEffect, useCallback } from 'react';
import '../dashboard.css';

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
  bell:    "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  logout:  "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  doc:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  info:    "M12 16v-4 M12 8h.01 M12 2a10 10 0 1010 10A10 10 0 0012 2z",
};

const getServiceClass = (service) => {
  if (!service) return 'svc_default';
  const s = service.toLowerCase();
  if (s.includes('blood')) return 'svc_blood';
  if (s.includes('ear')) return 'svc_earwax';
  if (s.includes('vacc') || s.includes('flu') || s.includes('covid') || s.includes('immun')) return 'svc_vaccine';
  if (s.includes('consult') || s.includes('check') || s.includes('review')) return 'svc_consult';
  return 'svc_default';
};

export default function PatientDetailPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminUser, setAdminUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Load action statuses
  const [statusLoading, setStatusLoading] = useState(false);
  const [apptActionLoading, setApptActionLoading] = useState(null);
  const [rescheduleAppt, setRescheduleAppt] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch all patient related data
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) { window.location.replace('/admin'); return; }

    try {
      const [patientRes, apptsRes, verRes] = await Promise.all([
        fetch(`${API_URL}/api/patients/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/appointments/patient/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/verifications/patient/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const patientData = await patientRes.json();
      const apptsData = await apptsRes.json();
      const verData = await verRes.json();

      if (patientData.success) {
        setPatient(patientData.data);
        setError('');
      } else {
        setError(patientData.message || 'Failed to load patient records');
      }

      if (apptsData.success) {
        // Sort appointments: newest first
        setAppointments(apptsData.data.sort((a, b) => new Date(b.date + 'T' + (b.time.split(' ')[0])) - new Date(a.date + 'T' + (a.time.split(' ')[0]))));
      }

      if (verData.success && verData.data.length > 0) {
        setVerification(verData.data[0]);
      } else {
        setVerification(null);
      }
    } catch (err) {
      console.error(err);
      setError('Connection failure. Make sure backend is online.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (user) setAdminUser(JSON.parse(user));
    
    // Initial fetch
    fetchData();

    // Automatic update live sync (refreshes data background updates every 8 seconds)
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.replace('/admin');
  };

  // Toggle patient block / active status
  const togglePatientStatus = async () => {
    if (!patient) return;
    const newStatus = patient.status === 'blocked' ? 'active' : 'blocked';
    setStatusLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/patients/${patient._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setPatient(prev => prev ? { ...prev, status: newStatus } : null);
      } else {
        alert(data.message || 'Failed to update patient status');
      }
    } catch (err) {
      console.error(err);
      alert('Network error updating patient status');
    } finally {
      setStatusLoading(false);
    }
  };

  // Approve appointment directly from timeline
  const handleApproveAppt = async (apptId) => {
    setApptActionLoading(apptId);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/appointments/${apptId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ adminNote: 'Approved via Patient Profile Audit' })
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(prev => prev.map(a => a._id === apptId ? { ...a, ...data.data } : a));
      } else {
        alert(data.message || 'Failed to approve appointment');
      }
    } catch (err) {
      console.error(err);
      alert('Network error approving appointment');
    } finally {
      setApptActionLoading(null);
    }
  };

  // Reject appointment directly from timeline
  const handleRejectAppt = async (apptId) => {
    setApptActionLoading(apptId);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/appointments/${apptId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ adminNote: 'Rejected via Patient Profile Audit' })
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(prev => prev.map(a => a._id === apptId ? { ...a, ...data.data } : a));
      } else {
        alert(data.message || 'Failed to reject appointment');
      }
    } catch (err) {
      console.error(err);
      alert('Network error rejecting appointment');
    } finally {
      setApptActionLoading(null);
    }
  };

  // Reschedule handler
  const handleReschedule = async (apptId, newDate, newTime, adminNote) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/appointments/${apptId}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          newDate,
          newTime,
          adminNote: adminNote || 'Rescheduled via Patient Profile Audit'
        })
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(prev => prev.map(a => a._id === apptId ? { ...a, ...data.data } : a));
        setRescheduleAppt(null);
      } else {
        alert(data.message || 'Failed to reschedule appointment');
      }
    } catch (err) {
      console.error(err);
      alert('Network error rescheduling appointment');
    }
  };

  const nav = [
    {label:'Dashboard',    path:'/admin/patients',                   icon:ICONS.home},
    {label:'Appointments', path:'/admin/appointments',               icon:ICONS.cal},
    {label:'Patients',     path:'/admin/patients?view=patients',     icon:ICONS.users, active: true},
    {label:'Schedule Manager', path:'/admin/schedule',               icon:ICONS.cal},
    {label:'Compliance',   path:'/admin/compliance',                 icon:ICONS.shield},
    {label:'Services & Content', path:'/admin/services',             icon:ICONS.edit},
    {label:'Blog Manager', path:'/admin/blog',                       icon:ICONS.doc},
    {label:'About Page',   path:'/admin/about',                      icon:ICONS.info},
  ];

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

        <div style={{flex:1,overflowY:'auto'}}>
          {!isMobile && <div className="sb_section"><div className="sb_section_label">General</div></div>}
          <div style={{padding:'0 14px'}}>
            {nav.map(n => (
              <a key={n.label} href={n.path} className={`sb_link${n.active?' active':''}`}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={n.icon}/>
                </svg>
                <span>{n.label}</span>
              </a>
            ))}
          </div>

          {!isMobile && <div className="sb_section" style={{marginTop:8}}><div className="sb_section_label">Settings</div></div>}
          <div style={{padding:'0 14px'}}>
            <a className="sb_link" href="#" onClick={e=>{e.preventDefault();logout()}}>
              <I d={ICONS.logout}/><span>Log Out</span>
            </a>
          </div>
        </div>

        {!isMobile && (
          <div className="sb_foot">
            <div className="sb_user">
              <div className="sb_av">{(adminUser?.username||'A')[0].toUpperCase()}</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="sb_uname">{adminUser?.username||'Admin'}</div>
                <div className="sb_urole">Administrator</div>
              </div>
              <button className="sb_logout" onClick={logout} title="Sign Out"><I d={ICONS.logout} s={14}/></button>
            </div>
          </div>
        )}
      </aside>

      {/* ══ MAIN ══ */}
      <div className="dash_main">
        {/* Header */}
        <header className="dash_hdr">
          <div className="dash_hdr_left">
            <h2>Patient Audit Workspace</h2>
            <p>Review compliance documents and trace patient health records.</p>
          </div>
          <div className="dash_hdr_right">
            <button className="back_patients_btn" onClick={() => window.location.href = '/admin/patients?view=patients'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginRight: 6, verticalAlign: 'middle'}}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back to Patient Directory
            </button>
          </div>
        </header>

        {loading ? (
          <div className="details_page_loading">
            <span className="spin" />
            <span>Loading patient file records...</span>
          </div>
        ) : error ? (
          <div className="details_page_error">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{color: '#dc2626', marginBottom: 8}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <h3>Error Loading File</h3>
            <p>{error}</p>
            <button className="back_patients_btn" onClick={() => window.location.href = '/admin/patients?view=patients'}>
              Back to Patient Directory
            </button>
          </div>
        ) : patient ? (
          <div className="details_workspace_grid">
            
            {/* Column 1: Profile & Statutory GPhC Compliance Card */}
            <div className="details_left_column">
              
              {/* Profile Overview */}
              <div className="patient_profile_card">
                <div className="profile_avatar_wrapper" style={{
                  background: `linear-gradient(135deg, ${
                    ['var(--teal)', 'var(--lavender)', 'var(--purple)', 'var(--pine)', 'var(--sage)'][patient.fullName.length % 5]
                  }, var(--lavender))`
                }}>
                  {patient.fullName ? patient.fullName[0].toUpperCase() : 'P'}
                </div>
                <h2>{patient.fullName.replace(/\b\w/g, c => c.toUpperCase())}</h2>
                <div style={{ display: 'flex', gap: '8px', margin: '8px 0 16px 0' }}>
                  <span className={`badge ${patient.status === 'blocked' ? 'blocked' : 'active'}`}>
                    {patient.status === 'blocked' ? 'Blocked' : 'Active'}
                  </span>
                </div>

                <button 
                  className={`status_toggle_btn ${patient.status === 'blocked' ? 'unblock' : 'block'}`}
                  onClick={togglePatientStatus}
                  disabled={statusLoading}
                >
                  {statusLoading ? (
                    <span className="spin_inline" />
                  ) : patient.status === 'blocked' ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6}}><path d="M20 6L9 17l-5-5"/></svg>
                      Activate Account
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6}}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                      Block Account
                    </>
                  )}
                </button>
              </div>

              {/* Contact Card */}
              <div className="details_pane_card">
                <h3>Contact Details</h3>
                <div className="details_info_table">
                  <div className="info_table_row">
                    <span className="info_table_label">Mobile Phone</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a href={`tel:${patient.mobile}`} className="info_table_value link">
                        {patient.mobile}
                      </a>
                      <button 
                        className="copy_icon_btn" 
                        onClick={() => { navigator.clipboard.writeText(patient.mobile); alert('Copied mobile!'); }}
                        title="Copy number"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      </button>
                    </div>
                  </div>
                  <div className="info_table_row">
                    <span className="info_table_label">Email Address</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {patient.email ? (
                        <a href={`mailto:${patient.email}`} className="info_table_value link">
                          {patient.email}
                        </a>
                      ) : (
                        <span className="info_table_value none">Not provided</span>
                      )}
                      {patient.email && (
                        <button 
                          className="copy_icon_btn" 
                          onClick={() => { navigator.clipboard.writeText(patient.email); alert('Copied email!'); }}
                          title="Copy email"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="info_table_row">
                    <span className="info_table_label">Joined Date</span>
                    <span className="info_table_value">
                      {new Date(patient.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Identity Verification Vault */}
              <div className="details_pane_card">
                <h3>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginRight: 6, verticalAlign: 'text-bottom'}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Statutory GPhC ID Check
                </h3>
                {verification ? (
                  <div className="gphc_verification_card">
                    <div className="ver_header_wrap">
                      <span className="ver_label">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginRight: 6, verticalAlign: 'text-bottom'}}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 13h4M15 17h4M5 20c0-2 4-3 4-3s4 1 4 3"/></svg>
                        {verification.idType === 'passport' ? 'UK Passport' : 'Driving Licence'}
                      </span>
                      <span className={`comp_check_badge ${verification.status === 'approved' ? 'passed' : verification.status === 'rejected' ? 'failed' : 'pending'}`}>
                        {verification.status === 'approved' ? 'Passed' : verification.status === 'rejected' ? 'Failed' : 'Pending'}
                      </span>
                    </div>

                    <div className="gphc_check_list">
                      <div className="gphc_check_item">
                        <span className={`status_indicator ${verification.checks?.mrz === 'done' ? 'success' : 'pending'}`} />
                        <span>MRZ & Barcode Validation</span>
                      </div>
                      <div className="gphc_check_item">
                        <span className={`status_indicator ${verification.checks?.blur === 'done' ? 'success' : 'pending'}`} />
                        <span>Image Clarity Assessment</span>
                      </div>
                      <div className="gphc_check_item">
                        <span className={`status_indicator ${verification.checks?.tampering === 'done' ? 'success' : verification.checks?.tampering === 'failed' ? 'failed' : 'pending'}`} />
                        <span>Hologram Inspection</span>
                      </div>
                      <div className="gphc_check_item">
                        <span className={`status_indicator ${verification.checks?.readable === 'done' ? 'success' : 'pending'}`} />
                        <span>Readability & OCR Extraction</span>
                      </div>
                    </div>

                    {verification.documentUrl && (
                      <div className="compliance_id_preview">
                        <img 
                          src={`${API_URL}/uploads/${verification.documentUrl}`} 
                          alt="Patient Identity ID" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="id_fallback_label">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginBottom: 6, color: '#64748b'}}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          <span>DOCUMENT_SECURE_VAULT.PDF</span>
                          <small>GPhC-v4.2 Secure Encryption</small>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="drawer_no_ver">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginRight: 6, verticalAlign: 'text-bottom', color: '#dc2626'}}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <strong>No Identity Record:</strong> This patient registered under bypass-override demo mode without a GPhC-compliant identity document.
                  </div>
                )}
              </div>

            </div>

            {/* Column 2: Appointment history log timeline */}
            <div className="details_right_column">
              <div className="details_pane_card">
                <h3>Appointment Booking Ledger</h3>
                
                {appointments.length === 0 ? (
                  <div className="drawer_no_records">
                    No appointment booking logs found for this patient.
                  </div>
                ) : (
                  <div className="timeline_list">
                    {appointments.map((ap) => {
                      const isPending = ap.status === 'pending' || ap.status === 'confirmed';
                      return (
                        <div key={ap._id} className="timeline_item">
                          <div className="timeline_marker">
                            <span className={`timeline_dot ${ap.status === 'confirmed' ? 'pending' : ap.status}`} />
                            <div className="timeline_line" />
                          </div>
                          <div className="timeline_content">
                            <div className="timeline_header">
                              <span className={`adm_service_tag ${getServiceClass(ap.service)}`}>
                                {ap.service}
                              </span>
                              <span className={`badge ${ap.status === 'confirmed' ? 'pending' : ap.status}`}>
                                {ap.status === 'confirmed' ? 'Pending' : ap.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="timeline_details">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{color: '#64748b'}}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                <span><strong>{ap.date}</strong> at <strong>{ap.time}</strong></span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{color: '#64748b'}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                <span>{ap.clinic.replace(/^(West Chemist\s*[\-—–\s]+\s*)/i, '').trim()}</span>
                              </div>
                              {ap.adminNote && (
                                <div className="timeline_note">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{marginRight: 6, verticalAlign: 'middle', color: '#64748b'}}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/></svg>
                                  <em>{ap.adminNote}</em>
                                </div>
                              )}
                            </div>

                            {/* Actions on pending slots directly in timeline */}
                            {isPending && (
                              <div className="timeline_actions">
                                <button 
                                  className="timeline_btn reject"
                                  onClick={() => handleRejectAppt(ap._id)}
                                  disabled={apptActionLoading === ap._id}
                                >
                                  {apptActionLoading === ap._id ? 'Rejecting...' : 'Reject'}
                                </button>
                                <button 
                                  className="timeline_btn reschedule"
                                  onClick={() => setRescheduleAppt(ap)}
                                  disabled={apptActionLoading === ap._id}
                                  style={{ background: '#f5f3ff', color: 'var(--purple)', border: '1px solid rgba(75, 45, 113, 0.15)' }}
                                >
                                  Reschedule
                                </button>
                                <button 
                                  className="timeline_btn approve"
                                  onClick={() => handleApproveAppt(ap._id)}
                                  disabled={apptActionLoading === ap._id}
                                >
                                  {apptActionLoading === ap._id ? 'Approving...' : 'Approve'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : null}
      </div>

      {/* Reschedule Modal */}
      {rescheduleAppt && (
        <RescheduleModal 
          appointment={rescheduleAppt} 
          onClose={() => setRescheduleAppt(null)} 
          onConfirm={handleReschedule} 
        />
      )}
    </div>
  );
}

/* ─── Reschedule Modal Component ─── */
function RescheduleModal({ appointment, onClose, onConfirm }) {
  const [newDate, setNewDate] = useState(appointment?.date || '');
  const [newTime, setNewTime] = useState(appointment?.time || '');
  const [note, setNote]       = useState('');
  const [busy, setBusy]       = useState(false);
  const [slots, setSlots]     = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const minDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!newDate) {
      setSlots([]);
      return;
    }
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await fetch(`${API_URL}/api/appointments/slots?clinic=${encodeURIComponent(appointment.clinic)}&date=${newDate}`);
        const data = await res.json();
        if (data.success) {
          setSlots(data.slots);
        } else {
          const defaultTimes = ["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","01:00 PM","01:30 PM","02:00 PM","02:30 PM","03:00 PM","04:00 PM","04:30 PM","05:00 PM","05:30 PM","06:00 PM"];
          setSlots(defaultTimes.map(t => ({ time: t, available: true })));
        }
      } catch (err) {
        const defaultTimes = ["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","01:00 PM","01:30 PM","02:00 PM","02:30 PM","03:00 PM","04:00 PM","04:30 PM","05:00 PM","05:30 PM","06:00 PM"];
        setSlots(defaultTimes.map(t => ({ time: t, available: true })));
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [newDate, appointment.clinic]);

  const handleSubmit = async () => {
    if (!newDate || !newTime) return;
    setBusy(true);
    await onConfirm(appointment._id, newDate, newTime, note);
    setBusy(false);
  };

  return (
    <div className="adm_modal_overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm_modal" style={{
        background: '#ffffff', padding: '28px', borderRadius: '16px',
        maxWidth: '480px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--t1)' }}>Reschedule Appointment</h3>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }} onClick={onClose}>✕</button>
        </div>

        <div style={{ marginBottom: 20, padding: '14px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#475569' }}>
          <div style={{ fontWeight: 800, color: 'var(--t1)', marginBottom: 4 }}>
            Current schedule:
          </div>
          <div>{appointment?.date} at {appointment?.time}</div>
          <div style={{ marginTop: 4 }}>Service: <strong style={{ color: 'var(--purple)' }}>{appointment?.service}</strong></div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: 6 }}>New Date</label>
          <input
            type="date"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem' }}
            value={newDate}
            min={minDate}
            onChange={e => {
              setNewDate(e.target.value);
              setNewTime('');
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: 6 }}>New Time Slot {loadingSlots && '(Loading...)'}</label>
          <select 
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', background: '#fff' }}
            value={newTime} 
            onChange={e => setNewTime(e.target.value)}
            disabled={loadingSlots || !newDate}
          >
            <option value="">— {newDate ? 'Select slot' : 'Choose a date first'} —</option>
            {slots.map(s => (
              <option key={s.time} value={s.time} disabled={!s.available}>
                {s.time} {!s.available ? '(Booked)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: 6 }}>Admin Note (optional)</label>
          <textarea
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', minHeight: '60px', fontFamily: 'inherit' }}
            placeholder="Reason for reschedule"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }} onClick={onClose}>Cancel</button>
          <button
            style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: 'var(--purple)', color: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}
            onClick={handleSubmit}
            disabled={busy || loadingSlots || !newDate || !newTime}
          >
            {busy ? 'Saving…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
