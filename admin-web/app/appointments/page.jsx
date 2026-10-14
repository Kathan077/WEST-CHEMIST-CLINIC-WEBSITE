'use client';

import { API_URL } from '@/config';

import { useState, useEffect, useCallback, useRef } from 'react';
import './appointments.css';
import '../patients/dashboard.css';
import Sidebar from '@/components/Sidebar';

const SLOTS = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","01:00 PM","01:30 PM",
  "02:00 PM","02:30 PM","03:00 PM","04:00 PM",
  "04:30 PM","05:00 PM","05:30 PM","06:00 PM"
];

const STATUS_CONFIG = {
  pending:     { label: 'Pending' },
  confirmed:   { label: 'Pending' },
  approved:    { label: 'Approved' },
  rejected:    { label: 'Rejected' },
  cancelled:   { label: 'Cancelled' },
  rescheduled: { label: 'Rescheduled' },
};

/* ─── Icon helpers ─── */
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  home:      "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  cal:       "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  users:     "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  check:     "M20 6L9 17l-5-5",
  x:         "M18 6L6 18M6 6l12 12",
  clock:     "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  search:    "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  refresh:   "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
  logout:    "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  shield:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",
  edit:      "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  doc:       "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  info:      "M12 16v-4 M12 8h.01 M12 2a10 10 0 1010 10A10 10 0 0012 2z",
  globe:     "M12 2a10 10 0 1010 10A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
};
const getDocUrl = (rawUrl) => {
  if (!rawUrl) return null;
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
  const clean = rawUrl.replace(/\\/g, '/');
  const uploadIdx = clean.indexOf('/uploads/');
  if (uploadIdx !== -1) {
    return `${API_URL}${clean.substring(uploadIdx)}`;
  }
  if (clean.startsWith('/')) {
    return `${API_URL}${clean}`;
  }
  return `${API_URL}/uploads/ids/${clean}`;
};

/* ─── Toast Component ─── */
function Toast({ message, type, onHide }) {
  useEffect(() => {
    const t = setTimeout(onHide, 3200);
    return () => clearTimeout(t);
  }, [onHide]);

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  return (
    <div className={`adm_toast ${type}`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}

/* ─── Reschedule Modal ─── */
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
          setSlots(SLOTS.map(t => ({ time: t, available: true })));
        }
      } catch (err) {
        setSlots(SLOTS.map(t => ({ time: t, available: true })));
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
    <div className="adm_modal_overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm_modal">
        <div className="adm_modal_header">
          <span className="adm_modal_title">🔄 Reschedule Appointment</span>
          <button className="adm_modal_close" onClick={onClose}>✕</button>
        </div>

        <div style={{ marginBottom: 20, padding: '16px', background: 'var(--blue-light)', borderRadius: 12, border: '1px solid rgba(75, 45, 113, 0.12)', fontSize: '0.85rem', color: 'var(--t2)' }}>
          <div style={{ fontWeight: 700, color: 'var(--blue)', marginBottom: 4, fontSize: '0.95rem' }}>
            {appointment?.patientId?.fullName || 'Patient'}
          </div>
          <div>Current schedule: <strong style={{ color: 'var(--t1)' }}>{appointment?.date}</strong> at <strong style={{ color: 'var(--t1)' }}>{appointment?.time}</strong></div>
          <div style={{ marginTop: 4, fontWeight: 500 }}>Service: <span style={{ color: 'var(--blue)', fontWeight: 600 }}>{appointment?.service}</span></div>
        </div>

        <div className="adm_modal_field">
          <label className="adm_modal_label">New Date</label>
          <input
            type="date"
            className="adm_modal_input"
            value={newDate}
            min={minDate}
            onChange={e => {
              setNewDate(e.target.value);
              setNewTime('');
            }}
          />
        </div>

        <div className="adm_modal_field">
          <label className="adm_modal_label">New Time Slot {loadingSlots && '(Loading...)'}</label>
          <select 
            className="adm_modal_select" 
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

        <div className="adm_modal_field">
          <label className="adm_modal_label">Admin Note (optional)</label>
          <textarea
            className="adm_modal_note"
            placeholder="e.g. Rescheduled due to clinic closure on original date"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>

        <div className="adm_modal_footer">
          <button className="adm_modal_btn cancel_btn" onClick={onClose}>Cancel</button>
          <button
            className="adm_modal_btn confirm_btn"
            onClick={handleSubmit}
            disabled={busy || loadingSlots || !newDate || !newTime}
            style={{ opacity: (busy || loadingSlots || !newDate || !newTime) ? 0.6 : 1 }}
          >
            {busy ? 'Saving…' : 'Confirm Reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewApptModal({ appointment, onClose, onApprove, onReject, onReschedule }) {
  const [adminNote, setAdminNote] = useState(appointment.adminNote || '');
  const [savingNote, setSavingNote] = useState(false);

  const handleSaveNote = async () => {
    setSavingNote(true);
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`${API_URL}/api/appointments/${appointment._id}/reschedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          newDate: appointment.date,
          newTime: appointment.time,
          adminNote: adminNote
        })
      });
      appointment.adminNote = adminNote;
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNote(false);
    }
  };

  const status = appointment.status;
  const isPending = status === 'confirmed' || status === 'pending';
  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';

  return (
    <div className="adm_modal_overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="adm_modal details_modal" style={{ maxWidth: '580px', width: '95%' }}>
        <div className="adm_modal_header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem' }}>📋</span>
            <span className="adm_modal_title">Appointment Details</span>
          </div>
          <button className="adm_modal_close" onClick={onClose}>✕</button>
        </div>

        <div className="details_modal_body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '12px 0' }}>
          {/* Patient Header Card */}
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              fontSize: '1.35rem',
              fontWeight: '800',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, var(--teal), var(--lavender))',
              flexShrink: 0
            }}>
              {appointment.patientId?.fullName ? appointment.patientId.fullName[0].toUpperCase() : 'P'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--t1)', textTransform: 'capitalize' }}>
                {appointment.patientId?.fullName || 'Anonymous Patient'}
              </h3>
              <div style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--t3)', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <span>📞 +44 {appointment.patientId?.mobile || '—'}</span>
                {appointment.patientId?.email && <span>✉️ {appointment.patientId.email}</span>}
              </div>
            </div>
          </div>

          {/* Service & Booking Details Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--t3)', fontWeight: '600' }}>Pharmacy Service</span>
              <span className={`adm_service_tag ${getServiceClass(appointment.service)}`} style={{ margin: 0 }}>
                {appointment.service}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--t3)', fontWeight: '600' }}>Clinic Branch</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--t1)', fontWeight: '700' }}>
                {appointment.clinic?.replace(/^(West Chemist\s*[\-—–\s]+\s*)/i, '').trim()}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--t3)', fontWeight: '600' }}>Date & Time</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--t1)', fontWeight: '700' }}>
                {new Date(appointment.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                <span style={{ color: 'var(--teal)', fontWeight: '800', marginLeft: '8px' }}>@ {appointment.time}</span>
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--t3)', fontWeight: '600' }}>Booking Status</span>
              <span className={`adm_badge ${appointment.status === 'confirmed' ? 'pending' : appointment.status}`} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                <span className={`adm_badge_dot ${appointment.status === 'confirmed' ? 'pending' : appointment.status}`} />
                {appointment.status === 'confirmed' ? 'Pending Review' : appointment.status.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--t3)', fontWeight: '600' }}>ID Verification</span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#0d9488',
                background: 'rgba(13, 148, 136, 0.08)',
                border: '1px solid rgba(13, 148, 136, 0.2)',
                padding: '3px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span>✓</span> In-Person Check on Arrival
              </span>
            </div>

            {appointment.isRescheduleRequested && (
              <div style={{
                marginTop: '6px',
                padding: '12px',
                background: 'rgba(94, 53, 177, 0.08)',
                border: '1px solid rgba(94, 53, 177, 0.2)',
                borderRadius: '10px',
                color: '#5e35b1',
                fontSize: '0.82rem',
                lineHeight: '1.4'
              }}>
                <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.88rem' }}>🔄 Reschedule Requested</strong>
                Patient requested to move this booking to:<br/>
                <strong>Date:</strong> {new Date(appointment.rescheduledDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}<br/>
                <strong>Time:</strong> {appointment.rescheduledTime}
              </div>
            )}
          </div>

          {/* Audit Notes (Internal) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--t2)' }}>Internal Pharmacist / Audit Notes</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Add internal notes e.g., verified on arrival..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  background: '#f8fafc'
                }}
              />
              <button
                onClick={handleSaveNote}
                disabled={savingNote}
                style={{
                  padding: '9px 14px',
                  background: 'var(--purple)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {savingNote ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* Status summary banner if already approved/rejected */}
          {isApproved && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(13, 148, 136, 0.06)',
              border: '1px solid rgba(13, 148, 136, 0.2)',
              color: '#0f766e',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <strong>✓ Confirmed Booking:</strong> This appointment is approved. Patient ID will be verified in person at reception.
            </div>
          )}
          {isRejected && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#be123c',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <strong>✗ Cancelled / Rejected:</strong> This appointment booking was rejected.
            </div>
          )}
        </div>

        <div className="adm_modal_footer" style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', gap: '12px' }}>
          <button className="adm_modal_btn cancel_btn" onClick={onClose} style={{ marginRight: 'auto' }}>
            Close
          </button>

          {isPending && (
            <>
              <button
                className="adm_modal_btn cancel_btn"
                onClick={() => onReject(appointment._id)}
                style={{ background: '#fef2f2', color: '#be123c', border: '1px solid rgba(239, 68, 68, 0.2)' }}
              >
                Reject Booking
              </button>
              {onReschedule && (
                <button
                  className="adm_modal_btn"
                  onClick={() => onReschedule(appointment)}
                  style={{ background: '#f8fafc', color: 'var(--t1)', border: '1px solid #cbd5e1' }}
                >
                  Reschedule...
                </button>
              )}
              <button
                className="adm_modal_btn confirm_btn"
                onClick={() => onApprove(appointment._id, adminNote)}
                style={{ background: 'var(--teal)', color: '#fff' }}
              >
                {appointment.isRescheduleRequested ? 'Approve Reschedule' : 'Approve & Confirm Slot'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const getServiceClass = (service) => {
  if (!service) return 'svc_default';
  const s = service.toLowerCase();
  if (s.includes('blood')) return 'svc_blood';
  if (s.includes('ear')) return 'svc_earwax';
  if (s.includes('vacc') || s.includes('flu') || s.includes('covid') || s.includes('immun')) return 'svc_vaccine';
  if (s.includes('consult') || s.includes('check') || s.includes('review')) return 'svc_consult';
  return 'svc_default';
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [loading,      setLoading]       = useState(true);
  const [error,        setError]         = useState('');
  const [search,       setSearch]        = useState('');
  const [statusFilter, setStatusFilter]  = useState('all');
  const [adminUser,    setAdminUser]     = useState(null);
  const [toast,        setToast]         = useState(null);
  const [modalAppt,    setModalAppt]     = useState(null);
  const [viewingAppt,  setViewingAppt]   = useState(null);
  const [spinning,     setSpinning]      = useState(false);
  const [isMobile,     setIsMobile]      = useState(false);

  const CLINICS = [
    "West Chemist — Northampton Branch",
    "West Chemist — East London Consultation Hub"
  ];
  const [selectedBranch, setSelectedBranch] = useState("West Chemist — Northampton Branch");

  useEffect(() => {
    const val = localStorage.getItem('adminSelectedBranch');
    if (val && CLINICS.includes(val)) {
      setSelectedBranch(val);
    }
  }, []);

  const handleBranchChange = (branch) => {
    setSelectedBranch(branch);
    localStorage.setItem('adminSelectedBranch', branch);
    window.dispatchEvent(new Event('adminBranchChanged'));
  };

  useEffect(() => {
    const handleSync = () => {
      const val = localStorage.getItem('adminSelectedBranch');
      if (val && CLINICS.includes(val) && val !== selectedBranch) {
        setSelectedBranch(val);
      }
    };
    window.addEventListener('adminBranchChanged', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('adminBranchChanged', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [selectedBranch]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  /* ─── Auth Guard ─── */
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user  = localStorage.getItem('adminUser');
    if (!token) { window.location.replace('/admin'); return; }
    if (user) setAdminUser(JSON.parse(user));
  }, []);

  /* ─── Fetch All Appointments ─── */
  const fetchAppointments = useCallback(async (spin = false) => {
    if (spin) setSpinning(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res  = await fetch(`${API_URL}/api/appointments/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to load appointments');
      }
    } catch {
      setError('Cannot reach backend. Make sure the server is running on port 5000.');
    } finally {
      setLoading(false);
      setTimeout(() => setSpinning(false), 700);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  /* ─── Filtering & Sorting ─── */
  useEffect(() => {
    let result = appointments.filter(a => a.clinic === selectedBranch);
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        result = result.filter(a => a.status === 'pending' || a.status === 'confirmed');
      } else {
        result = result.filter(a => a.status === statusFilter);
      }
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.patientId?.fullName?.toLowerCase().includes(q) ||
        a.patientId?.mobile?.includes(q) ||
        a.service?.toLowerCase().includes(q)
      );
    }

    // Sort: pending reviews & reschedule requests always top, then newest request first
    result.sort((a, b) => {
      const aIsNew = a.status === 'pending' || a.status === 'confirmed' || a.isRescheduleRequested;
      const bIsNew = b.status === 'pending' || b.status === 'confirmed' || b.isRescheduleRequested;

      if (aIsNew && !bIsNew) return -1;
      if (!aIsNew && bIsNew) return 1;

      // Within the same status priority group, sort by createdAt descending (newest request first)
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (dateB !== dateA) {
        return dateB - dateA;
      }
      
      // Fallback to appointment date/time
      const apptDateA = new Date(a.date).getTime();
      const apptDateB = new Date(b.date).getTime();
      return apptDateB - apptDateA;
    });

    setFiltered(result);
  }, [appointments, statusFilter, search, selectedBranch]);

  /* ─── Admin Actions ─── */
  const adminAction = async (id, action, body = {}) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res  = await fetch(`${API_URL}/api/appointments/${id}/${action}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(prev =>
          prev.map(a => a._id === id ? { ...a, ...data.data } : a)
        );
        showToast(data.message, 'success');
        return true;
      } else {
        showToast(data.message || 'Action failed', 'error');
        return false;
      }
    } catch {
      showToast('Network error — is the backend running?', 'error');
      return false;
    }
  };

  const handleApprove   = (id, note) => adminAction(id, 'approve', { adminNote: note || 'Approved by admin' });
  const handleReject    = (id) => adminAction(id, 'reject',  { adminNote: 'Rejected by admin' });
  const handleReschedule = async (id, newDate, newTime, adminNote) => {
    const ok = await adminAction(id, 'reschedule', { newDate, newTime, adminNote });
    if (ok) setModalAppt(null);
  };

  /* ─── Stats ─── */
  const branchAppts = appointments.filter(a => a.clinic === selectedBranch);
  const stats = {
    total:    branchAppts.length,
    pending:  branchAppts.filter(a => a.status === 'pending' || a.status === 'confirmed').length,
    approved: branchAppts.filter(a => a.status === 'approved').length,
    rejected: branchAppts.filter(a => a.status === 'rejected').length,
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.replace('/admin');
  };

  return (
    <div className="adm_shell">

      {/* ─── Toast ─── */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}

      {/* ─── Reschedule Modal ─── */}
      {modalAppt && (
        <RescheduleModal
          appointment={modalAppt}
          onClose={() => setModalAppt(null)}
          onConfirm={handleReschedule}
        />
      )}

      {/* ─── View & Compliance Audit Modal ─── */}
      {viewingAppt && (
        <ViewApptModal
          appointment={viewingAppt}
          onClose={() => setViewingAppt(null)}
          onApprove={async (id) => {
            await handleApprove(id);
            setViewingAppt(null);
          }}
          onReject={async (id) => {
            await handleReject(id);
            setViewingAppt(null);
          }}
          onReschedule={(appt) => {
            setViewingAppt(null);
            setModalAppt(appt);
          }}
        />
      )}

      {/* ══ SIDEBAR ══ */}
      <Sidebar activePage="appointments" />

      {/* ════ MAIN ════ */}
      <main className="adm_main">

        {/* ── Header ── */}
        <header className="adm_header">
          <div>
            <div className="adm_header_greet" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              Appointment <span>Management</span>
              <span className="badge-premium">Live Feed</span>
            </div>
            <div className="adm_header_sub">Review, approve, reject & reschedule patient appointments</div>
          </div>
          <div className="adm_header_right">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginRight: '16px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--t3)' }}>Location:</span>
              <select
                value={selectedBranch}
                onChange={(e) => handleBranchChange(e.target.value)}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--t1)',
                  background: '#ffffff',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border)',
                  cursor: 'pointer',
                  fontWeight: '700',
                  outline: 'none',
                  boxShadow: 'var(--sh)'
                }}
              >
                <option value="West Chemist — Northampton Branch">Northampton Branch</option>
                <option value="West Chemist — East London Consultation Hub">East London Consultation Hub</option>
              </select>
            </div>
            <div className="adm_live_dot">Live</div>
            <div className="adm_hdr_avatar" style={{cursor:'default'}}>
              <div className="adm_hdr_av_img">{(adminUser?.username||'A')[0].toUpperCase()}</div>
              <div className="adm_hdr_av_info">
                <div className="adm_hdr_av_name">{adminUser?.username||'Admin'}</div>
                <div className="adm_hdr_av_role">Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Stats ── */}
        <section className="adm_stats">
          {[
            { 
              label: 'Total Booked',  
              value: stats.total,    
              cls: 's-blue',    
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--blue)'}}>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              ) 
            },
            { 
              label: 'Awaiting Review', 
              value: stats.pending, 
              cls: 's-amber',  
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--amber)'}}>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ) 
            },
            { 
              label: 'Approved',      
              value: stats.approved, 
              cls: 's-green', 
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--teal)'}}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) 
            },
            { 
              label: 'Rejected',      
              value: stats.rejected, 
              cls: 's-red',    
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--red)'}}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              ) 
            },
          ].map(s => (
            <div key={s.label} className={`adm_stat_card ${s.cls}`}>
              <div className={`adm_stat_icon ${s.cls}`}>{s.icon}</div>
              <div>
                <div className="adm_stat_num">{s.value}</div>
                <div className="adm_stat_label">{s.label}</div>
              </div>
            </div>
          ))}
        </section>

        {/* ── Content Wrapper ── */}
        <div className="adm_content">
          {/* ── Toolbar ── */}
          <div className="adm_toolbar">
          <div className="adm_search">
            <svg className="adm_search_icon" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={ICONS.search} />
            </svg>
            <input
              type="text"
              placeholder="Search patient, service, clinic…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {['all','pending','approved','rejected','rescheduled','cancelled'].map(s => (
            <button
              key={s}
              className={`adm_filter_btn ${statusFilter === s ? 'active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label || s}
            </button>
          ))}

          <button
            className={`adm_refresh_btn ${spinning ? 'spinning' : ''}`}
            onClick={() => fetchAppointments(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={ICONS.refresh} />
            </svg>
            Refresh
          </button>
        </div>

        {/* ── Table ── */}
        <div className="adm_table_panel">
          {/* Head */}
          <div className="adm_table_head">
            {['Patient', 'Service', 'Clinic / Date & Time', 'Status', 'Admin Note', 'Actions'].map(h => (
              <div key={h} className="adm_th">{h}</div>
            ))}
          </div>

          {/* Body */}
          {loading ? (
            <div className="adm_loading">
              <div className="adm_spinner" />
              <div className="adm_loading_text">Loading appointments from database…</div>
            </div>
          ) : error ? (
            <div className="adm_empty">
              <div className="adm_empty_icon">⚠️</div>
              <h3>Connection Error</h3>
              <p>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="adm_empty">
              <div className="adm_empty_icon">📭</div>
              <h3>No appointments found</h3>
              <p>Try adjusting your search or filter settings.</p>
            </div>
          ) : (
            filtered.map((appt, idx) => {
              const patient = appt.patientId;
              const sc = STATUS_CONFIG[appt.status] || STATUS_CONFIG.pending;
              const isVirtual = appt.clinic?.toLowerCase().includes('virtual') || appt.clinic?.toLowerCase().includes('online');
              const displayClinic = appt.clinic
                ? appt.clinic.replace(/^(West Chemist\s*[\-—–\s]+\s*)/i, '').trim()
                : '—';

              return (
                <div 
                  key={appt._id} 
                  className="adm_row clickable_row"
                  style={{ animationDelay: `${idx * 0.04}s`, cursor: 'pointer' }}
                  onClick={(e) => {
                    if (e.target.closest('.adm_actions') || e.target.closest('button')) {
                      return;
                    }
                    setViewingAppt(appt);
                  }}
                >

                  {/* Patient */}
                  <div className="adm_td" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="td_avatar" style={{
                      background: `linear-gradient(135deg, ${
                        ['var(--teal)', 'var(--lavender)', 'var(--purple)', 'var(--pine)', 'var(--sage)'][patient?.fullName?.length % 5 || 0]
                      }, var(--lavender))`
                    }}>
                      {patient?.fullName ? patient.fullName[0].toUpperCase() : 'P'}
                    </div>
                    <div>
                      <div className="adm_patient_name">
                        {patient?.fullName ? patient.fullName.replace(/\b\w/g, c => c.toUpperCase()) : '—'}
                      </div>
                      <div className="adm_patient_mobile">
                        {patient?.mobile || '—'}
                      </div>
                      {appt.verificationId?.documentUrl && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 2, fontSize: '0.7rem', color: '#0d9488', fontWeight: 600 }}>
                          <span>🪪</span>
                          <span>{appt.verificationId.idType === 'passport' ? 'Passport' : 'Licence'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Service */}
                  <div className="adm_td">
                    <span className={`adm_service_tag ${getServiceClass(appt.service)}`}>{appt.service}</span>
                  </div>

                  {/* Date & Time */}
                  <div className="adm_td">
                    <div className="adm_datetime_wrapper">
                      <div className="adm_datetime">
                        {new Date(appt.date).toLocaleDateString('en-GB', {
                          weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </div>
                      <div className="adm_time">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 4, verticalAlign: 'middle', opacity: 0.7 }}>
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span style={{ verticalAlign: 'middle' }}>{appt.time}</span>
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <span className={isVirtual ? 'clinic_virtual' : 'clinic_physical'}>
                          {isVirtual ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 4, verticalAlign: 'middle' }}>
                              <path d="M23 7l-7 5 7 5V7z" />
                              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                            </svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 4, verticalAlign: 'middle' }}>
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                          )}
                          <span style={{ verticalAlign: 'middle' }}>{displayClinic}</span>
                        </span>
                      </div>
                      {appt.isRescheduleRequested && appt.rescheduledDate && (
                        <div style={{
                          marginTop: 6,
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: '#5e35b1',
                          background: 'rgba(94, 53, 177, 0.08)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          display: 'inline-block',
                          border: '1px solid rgba(94, 53, 177, 0.15)'
                        }}>
                          🔄 Reschedule: {new Date(appt.rescheduledDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} @ {appt.rescheduledTime}
                        </div>
                      )}
                      {!appt.isRescheduleRequested && appt.rescheduledDate && (
                        <div className="adm_was_scheduled">
                          Was: {appt.rescheduledDate} {appt.rescheduledTime}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="adm_td">
                    <span className={`adm_badge ${appt.status === 'confirmed' ? 'pending' : appt.status}`}>
                      <span className={`adm_badge_dot ${appt.status === 'confirmed' ? 'pending' : appt.status}`} />
                      {sc.label}
                    </span>
                  </div>

                  {/* Note */}
                  <div className="adm_td note_cell" style={{ color: 'var(--t3)', fontSize: '0.82rem', fontStyle: appt.adminNote ? 'normal' : 'italic' }}>
                    {appt.adminNote || 'No note'}
                  </div>

                  {/* Actions */}
                  <div className="adm_td">
                    <div className="adm_actions">
                      {appt.status !== 'approved' && appt.status !== 'cancelled' && appt.status !== 'rejected' && (
                        <button
                          className="adm_action_btn approve"
                          onClick={() => handleApprove(appt._id, appt.isRescheduleRequested ? 'Reschedule request approved by Superintendent Pharmacist' : undefined)}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d={ICONS.check} />
                          </svg>
                          {appt.isRescheduleRequested ? 'Approve Resched.' : 'Approve'}
                        </button>
                      )}

                      {appt.status !== 'rejected' && appt.status !== 'cancelled' && (
                        <button
                          className="adm_action_btn reject"
                          onClick={() => handleReject(appt._id)}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d={ICONS.x} />
                          </svg>
                          Reject
                        </button>
                      )}


                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
        </div>
      </main>
    </div>
  );
}

