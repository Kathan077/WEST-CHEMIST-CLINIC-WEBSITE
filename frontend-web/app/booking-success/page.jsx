"use client";

import { API_URL } from '@/config';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../book-appointment/Booking.css';

function BookingSuccessContent() {
    const searchParams = useSearchParams();
    const apptId = searchParams.get('id') || '';

    // SearchParams fallbacks as initial state
    const [fullName, setFullName] = useState(searchParams.get('fullName') || 'Patient');
    const [mobile, setMobile] = useState(searchParams.get('mobile') || '');
    const [service, setService] = useState(searchParams.get('service') || 'Clinical Service');
    const [clinic, setClinic] = useState(searchParams.get('clinic') || 'West Chemist Clinic');
    const [date, setDate] = useState(searchParams.get('date') || '');
    const [time, setTime] = useState(searchParams.get('time') || '');
    const [patientId, setPatientId] = useState(searchParams.get('patientId') || '57849182');
    
    // Appointment status state
    const [status, setStatus] = useState('pending');
    const [adminNote, setAdminNote] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!apptId) {
            setLoading(false);
            return;
        }

        const fetchStatus = async () => {
            try {
                const res = await fetch(`${API_URL}/api/appointments/${apptId}`);
                const data = await res.json();
                if (data.success && data.data) {
                    const apt = data.data;
                    setStatus(apt.status);
                    setAdminNote(apt.adminNote || '');
                    if (apt.patientId) {
                        setFullName(apt.patientId.fullName || fullName);
                        setMobile(apt.patientId.mobile || mobile);
                    }
                    setService(apt.service || service);
                    setClinic(apt.clinic || clinic);
                    setDate(apt.date || date);
                    setTime(apt.time || time);
                    setPatientId(apt.patientId?._id || patientId);
                }
            } catch (err) {
                console.warn('⚠️ Backend offline or error fetching appointment status. Using search params.');
            } finally {
                setLoading(false);
            }
        };

        // Fetch immediately on mount
        fetchStatus();

        // Poll every 3 seconds to show live updates from pharmacist review
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, [apptId]);

    const formattedDate = date 
        ? new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : 'Pending Date Selection';

    // Determine details based on status
    let statusLabel = 'AWAITING AUDIT';
    let statusColor = '#d97706';
    let statusBg = 'rgba(217, 119, 6, 0.08)';
    let statusBorder = 'rgba(217, 119, 6, 0.2)';
    
    let headingTitle = 'Awaiting Pharmacist Audit!';
    let headingSubtitle = 'Your booking request has been securely registered. To comply with GPhC regulations, a Superintendent Pharmacist will verify your ID document shortly. You can track this booking below.';
    let iconGradient = 'linear-gradient(135deg, #d97706, #f59e0b)';
    let iconShadow = '0 10px 30px rgba(217, 119, 6, 0.35)';
    let topIcon = (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );

    let complianceLabel = 'PENDING REVIEW';
    let complianceColor = '#d97706';
    let complianceBg = 'rgba(217, 119, 6, 0.08)';
    
    let checklistStep3Icon = <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>●</span>;
    let checklistStep3Bg = '#f59e0b';
    let checklistStep3Label = 'Pharmacist Signature & Confirmation';
    let checklistStep3Sub = 'Superintendent Pharmacist review of secure credentials';

    if (status === 'approved') {
        statusLabel = 'APPROVED';
        statusColor = '#0d9488';
        statusBg = 'rgba(13, 148, 136, 0.08)';
        statusBorder = 'rgba(13, 148, 136, 0.2)';
        
        headingTitle = 'Booking Confirmed!';
        headingSubtitle = adminNote 
            ? `Your booking request has been audited and approved by our Superintendent Pharmacist: "${adminNote}"`
            : 'Your booking request has been audited and approved by our Superintendent Pharmacist. Your slot is now secure.';
        iconGradient = 'linear-gradient(135deg, #0d9488, #0f766e)';
        iconShadow = '0 10px 30px rgba(13, 148, 136, 0.35)';
        topIcon = (
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        );
        
        complianceLabel = 'PASS (NHS VERIFIED ID)';
        complianceColor = '#0d9488';
        complianceBg = 'rgba(13, 148, 136, 0.08)';
        
        checklistStep3Icon = (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4.5">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        );
        checklistStep3Bg = '#10b981';
        checklistStep3Label = 'Signature Audited & Approved';
        checklistStep3Sub = 'Superintendent Pharmacist has signed off on your compliance logs';
    } else if (status === 'rejected') {
        statusLabel = 'REJECTED';
        statusColor = '#ef4444';
        statusBg = 'rgba(239, 68, 68, 0.08)';
        statusBorder = 'rgba(239, 68, 68, 0.2)';
        
        headingTitle = 'Booking Rejected';
        headingSubtitle = adminNote 
            ? `Your booking was rejected by the Superintendent Pharmacist during compliance audit: "${adminNote}"`
            : 'Your booking was rejected by the Superintendent Pharmacist during compliance audit. Please check your credentials and try again.';
        iconGradient = 'linear-gradient(135deg, #ef4444, #dc2626)';
        iconShadow = '0 10px 30px rgba(239, 68, 68, 0.35)';
        topIcon = (
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        );
        
        complianceLabel = 'FAILED COMPLIANCE';
        complianceColor = '#ef4444';
        complianceBg = 'rgba(239, 68, 68, 0.08)';
        
        checklistStep3Icon = (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        );
        checklistStep3Bg = '#ef4444';
        checklistStep3Label = 'Audit Failed / Rejected';
        checklistStep3Sub = adminNote || 'ID document rejected due to discrepancy';
    } else if (status === 'cancelled') {
        statusLabel = 'CANCELLED';
        statusColor = '#64748b';
        statusBg = 'rgba(100, 116, 139, 0.08)';
        statusBorder = 'rgba(100, 116, 139, 0.2)';
        
        headingTitle = 'Booking Cancelled';
        headingSubtitle = 'This clinical booking reservation has been cancelled. The time slot has been released.';
        iconGradient = 'linear-gradient(135deg, #64748b, #475569)';
        iconShadow = '0 10px 30px rgba(100, 116, 139, 0.35)';
        topIcon = (
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        );
        
        complianceLabel = 'CANCELLED';
        complianceColor = '#64748b';
        complianceBg = 'rgba(100, 116, 139, 0.08)';
        
        checklistStep3Icon = (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        );
        checklistStep3Bg = '#64748b';
        checklistStep3Label = 'Slot Released / Cancelled';
        checklistStep3Sub = 'This booking has been cancelled and released';
    } else if (status === 'rescheduled') {
        statusLabel = 'RESCHEDULED';
        statusColor = '#8b5cf6';
        statusBg = 'rgba(139, 92, 246, 0.08)';
        statusBorder = 'rgba(139, 92, 246, 0.2)';
        
        headingTitle = 'Booking Rescheduled!';
        headingSubtitle = adminNote 
            ? `Your booking has been rescheduled: "${adminNote}"`
            : 'Your booking has been rescheduled to a new date/time by our clinic admin. Please check details below.';
        iconGradient = 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
        iconShadow = '0 10px 30px rgba(13, 148, 136, 0.35)';
        topIcon = (
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2" />
            </svg>
        );
        
        complianceLabel = 'RESCHEDULED (CONFIRMED)';
        complianceColor = '#8b5cf6';
        complianceBg = 'rgba(13, 148, 136, 0.08)';
        
        checklistStep3Icon = (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4.5">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        );
        checklistStep3Bg = '#8b5cf6';
        checklistStep3Label = 'Reschedule Complete';
        checklistStep3Sub = 'Rescheduled and verified by clinic administration';
    }

    const STEPS = [
        { num: 1, label: 'Identify Patient' },
        { num: 2, label: 'GPhC Security ID' },
        { num: 3, label: 'Schedule Slot' }
    ];

    return (
        <div className="bk_page">
            <div className="bk_wrap">
                {/* ── LEFT SIDEBAR ── */}
                <aside className="bk_sidebar">
                    <div className="bk_brand">
                        <div className="bk_brand_icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </div>
                        <div>
                            <div className="bk_brand_name">West Chemist</div>
                            <div className="bk_brand_sub">Clinical Booking Portal</div>
                        </div>
                    </div>

                    <nav className="bk_steps">
                        {STEPS.map(s => {
                            const circleContent = (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            );

                            return (
                                <div key={s.num} className="bk_step done">
                                    <div className="bk_step_circle">
                                        {circleContent}
                                    </div>
                                    <div className="bk_step_info">
                                        <div className="bk_step_label">{s.label}</div>
                                        <div className="bk_step_sublabel">
                                            {s.num === 1 && "Patient Info"}
                                            {s.num === 2 && "GPhC Compliance"}
                                            {s.num === 3 && "Secure Slot"}
                                        </div>
                                    </div>
                                    {s.num < STEPS.length && <div className="bk_step_line" />}
                                </div>
                            );
                        })}
                    </nav>

                    <div className="bk_trust">
                        <div className="bk_trust_item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Secure SSL & GDPR Encrypted
                        </div>
                        <div className="bk_trust_item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            GPhC Registered (Reg. 12948)
                        </div>
                        <div className="bk_trust_item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            NHS Accredited Services
                        </div>
                    </div>
                </aside>

                {/* ── MAIN WORKSPACE ── */}
                <main className="bk_main">
                    <div className="bk_panel anim_in" style={{ padding: '48px 40px' }}>
                        <div className="bk_confirmed anim_in" style={{ textAlign: 'center' }}>
                            <div className="bk_confirmed_ring" style={{ background: iconGradient, boxShadow: iconShadow, margin: '0 auto 24px' }}>
                                {topIcon}
                            </div>
                            <h2 className="bk_confirmed_title" style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2rem', color: 'var(--primary)', marginBottom: '8px', letterSpacing: '-0.02em' }}>{headingTitle}</h2>
                            <p className="bk_confirmed_sub" style={{ maxWidth: '480px', margin: '0 auto 36px', lineHeight: '1.6', fontSize: '0.96rem', color: 'var(--text-muted)', fontWeight: 550 }}>
                                {headingSubtitle}
                            </p>

                            {/* Boarding Pass Clinical Ticket with Punch Holes */}
                            <div className="bk_ticket" style={{ maxWidth: '480px', margin: '0 auto 32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid rgba(226, 232, 240, 0.6)', paddingBottom: '14px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Clinical Ticket</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--primary)', fontFamily: 'Outfit' }}>West Chemist Clinic</div>
                                    </div>
                                    <div style={{ background: statusBg, border: `1px solid ${statusBorder}`, padding: '6px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={statusColor} strokeWidth="2.5">
                                            {status === 'approved' || status === 'confirmed' ? (
                                                <polyline points="20 6 9 17 4 12" />
                                            ) : status === 'rejected' || status === 'cancelled' ? (
                                                <>
                                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                                </>
                                            ) : (
                                                <>
                                                    <circle cx="12" cy="12" r="10"/>
                                                    <line x1="12" y1="8" x2="12" y2="12"/>
                                                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                                                </>
                                            )}
                                        </svg>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: statusColor }}>{statusLabel}</span>
                                    </div>
                                </div>

                                <div className="bk_ticket_row"><span>Patient</span><strong>{fullName}</strong></div>
                                <div className="bk_ticket_row"><span>Mobile</span><strong>{mobile}</strong></div>
                                <div className="bk_ticket_row"><span>Service Type</span><strong>{service}</strong></div>
                                <div className="bk_ticket_row"><span>Clinic Branch</span><strong>{clinic}</strong></div>

                                <div className="bk_ticket_divider" />

                                <div className="bk_ticket_row"><span>Reserved Date</span><strong>{formattedDate}</strong></div>
                                <div className="bk_ticket_row"><span>Reserved Time</span><strong className="bk_ticket_time">{time}</strong></div>
                                <div className="bk_ticket_row"><span>GPhC Compliance</span><strong className="bk_ticket_verified" style={{ color: complianceColor, background: complianceBg }}>{complianceLabel}</strong></div>

                                {/* Barcode block */}
                                <div className="bk_barcode">
                                    <div className="bk_barcode_lines"></div>
                                    <div className="bk_barcode_num">WCC-{patientId ? patientId.slice(-8).toUpperCase() : '57849182'}</div>
                                </div>
                            </div>

                            {/* Verification Workflow Timeline */}
                            <div style={{
                                width: '100%',
                                maxWidth: '480px',
                                margin: '0 auto 32px',
                                background: 'rgba(255, 255, 255, 0.6)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                border: '1px solid rgba(226, 232, 240, 0.9)',
                                borderRadius: '24px',
                                padding: '24px',
                                textAlign: 'left',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
                            }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '16px', letterSpacing: '-0.01em', fontFamily: 'Outfit' }}>GPhC Statutory Audit Checklist</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4.5">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>Secure Document Uploaded</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Identity document linked to patient profile</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4.5">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>AI Compliance Pre-Screen</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>MRZ extraction and tampering checks completed</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: checklistStep3Bg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {checklistStep3Icon}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b' }}>{checklistStep3Label}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{checklistStep3Sub}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '480px', margin: '20px auto 0 auto' }}>
                                <button 
                                    className="bk_btn_primary" 
                                    onClick={() => window.location.href = `/track-booking?mobile=${encodeURIComponent(mobile)}`} 
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    Track Your Booking
                                </button>
                                <button 
                                    className="bk_btn_ghost" 
                                    onClick={() => window.location.href = '/'} 
                                    style={{ width: '100%', border: '2px solid var(--primary)', color: 'var(--primary)', fontWeight: '800', borderRadius: '16px', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                    Return to Portal Home
                                </button>
                                <button 
                                    className="bk_btn_ghost" 
                                    onClick={() => window.location.href = '/book-appointment'} 
                                    style={{ width: '100%', border: '1px dashed var(--primary-light)', color: 'var(--primary)', fontWeight: '700', borderRadius: '16px', padding: '12px 20px', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                        <line x1="12" y1="14" x2="12" y2="18" />
                                        <line x1="10" y1="16" x2="14" y2="16" />
                                    </svg>
                                    Book Another Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function BookingSuccessPage() {
    return (
        <>
            <Navbar />
            <Suspense fallback={
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
                    <p style={{ fontWeight: '700', fontSize: '1.2rem', color: '#64748b' }}>Loading Success Ticket...</p>
                </div>
            }>
                <BookingSuccessContent />
            </Suspense>
            
        </>
    );
}
