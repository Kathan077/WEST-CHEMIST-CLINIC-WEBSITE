'use client';

import { API_URL } from '@/config';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import './track.css';

// Determine dynamic appointment status based on current date
const getDynamicStatus = (apt) => {
    if (apt.status === 'cancelled') {
        return 'cancelled';
    }
    if (apt.status === 'rejected') {
        return 'rejected';
    }
    if (apt.status === 'pending' || apt.status === 'confirmed') {
        return 'pending';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let apptDate;
    if (typeof apt.date === 'string' && apt.date.includes('-')) {
        const datePart = apt.date.split('T')[0];
        const parts = datePart.split('-');
        apptDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    } else {
        apptDate = new Date(apt.date);
        apptDate.setHours(0, 0, 0, 0);
    }

    if (today.getTime() === apptDate.getTime()) {
        return 'appointment_day';
    } else if (today.getTime() > apptDate.getTime()) {
        return 'expired';
    } else {
        return 'upcoming';
    }
};

const TIMES = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM"];

function TrackBookingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [cancellingId, setCancellingId] = useState(null);
    const [error, setError] = useState('');
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    // Reschedule states
    const [reschedulingId, setReschedulingId] = useState(null);
    const [rescheduleDate, setRescheduleDate] = useState('');
    const [rescheduleTime, setRescheduleTime] = useState('');
    const [rescheduleSlots, setRescheduleSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [submittingReschedule, setSubmittingReschedule] = useState(false);

    // Fetch details
    const fetchBookings = async (searchMobile) => {
        if (!searchMobile) return;
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            const res = await fetch(`${API_URL}/api/appointments/track?mobile=${encodeURIComponent(searchMobile)}`);
            const data = await res.json();
            if (data.success) {
                setPatient(data.patient);
                setAppointments(data.appointments);
            } else {
                setError(data.message || 'No active clinical bookings found.');
                setPatient(null);
                setAppointments([]);
            }
        } catch (err) {
            setError('Failed to contact tracking service. Please ensure the clinic server is online.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-search if mobile query parameter exists
    useEffect(() => {
        const mobileParam = searchParams.get('mobile');
        if (mobileParam) {
            setMobile(mobileParam);
            fetchBookings(mobileParam);
        }
    }, [searchParams]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!mobile.trim()) return;
        
        // Update URL search parameters without reloading
        const params = new URLSearchParams();
        params.set('mobile', mobile.trim());
        router.push(`/track-booking?${params.toString()}`);
        
        fetchBookings(mobile.trim());
    };

    // Handle Appointment Cancellation
    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to cancel this clinical appointment reservation? This slot will be released back to the general public.')) {
            return;
        }

        setCancellingId(appointmentId);
        setError('');
        setSuccessMessage('');
        try {
            const res = await fetch(`${API_URL}/api/appointments/${appointmentId}/cancel`, {
                method: 'PUT'
            });
            const result = await res.json();
            if (result.success) {
                setSuccessMessage('Your clinical slot was successfully cancelled.');
                // Update local status without full refetch
                setAppointments(prev => 
                    prev.map(apt => apt._id === appointmentId ? { ...apt, status: 'cancelled' } : apt)
                );
            } else {
                setError(result.message || 'Failed to cancel appointment.');
            }
        } catch (err) {
            setError('Error contacting server. Please try again.');
        } finally {
            setCancellingId(null);
        }
    };

    // Handle reschedule date change and load slots
    const handleRescheduleDateChange = async (appointment, dateVal) => {
        setRescheduleDate(dateVal);
        setRescheduleTime('');
        if (!dateVal) {
            setRescheduleSlots([]);
            return;
        }
        setLoadingSlots(true);
        try {
            const res = await fetch(`${API_URL}/api/appointments/slots?clinic=${encodeURIComponent(appointment.clinic)}&date=${dateVal}`);
            const data = await res.json();
            if (data.success) {
                setRescheduleSlots(data.slots);
            } else {
                setRescheduleSlots(TIMES.map(t => ({ time: t, available: true })));
            }
        } catch (err) {
            setRescheduleSlots(TIMES.map(t => ({ time: t, available: true })));
        } finally {
            setLoadingSlots(false);
        }
    };

    // Submit patient reschedule request to backend
    const handleSubmitReschedule = async (appointmentId) => {
        if (!rescheduleDate || !rescheduleTime) {
            setError('Please select both a date and a time slot.');
            return;
        }

        setSubmittingReschedule(true);
        setError('');
        setSuccessMessage('');
        try {
            const res = await fetch(`${API_URL}/api/appointments/${appointmentId}/request-reschedule`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newDate: rescheduleDate, newTime: rescheduleTime })
            });
            const result = await res.json();
            if (result.success) {
                setSuccessMessage('Your clinical reschedule request has been registered. Superintendent Pharmacist will audit shortly.');
                setAppointments(prev => 
                    prev.map(apt => apt._id === appointmentId ? { 
                        ...apt, 
                        status: 'pending', 
                        isRescheduleRequested: true,
                        rescheduledDate: rescheduleDate,
                        rescheduledTime: rescheduleTime,
                        adminNote: 'Patient requested reschedule. Awaiting clinical verification.'
                    } : apt)
                );
                setReschedulingId(null);
                setRescheduleDate('');
                setRescheduleTime('');
                setRescheduleSlots([]);
            } else {
                setError(result.message || 'Failed to submit reschedule request.');
            }
        } catch (err) {
            setError('Error submitting reschedule request. Please try again.');
        } finally {
            setSubmittingReschedule(false);
        }
    };

    // Google Maps Direction URL matcher
    const getDirectionsLink = (clinic) => {
        const query = encodeURIComponent(clinic || 'West Chemist Pharmacy');
        return `https://www.google.com/maps/search/?api=1&query=${query}`;
    };

    const handleDownloadTicket = async (ticketId, serviceName) => {
        const element = document.getElementById(`ticket-${ticketId}`);
        if (!element) return;
        
        try {
            // Find and hide action buttons during capture
            const actionBar = element.querySelector('.ticket_action_bar');
            let originalDisplay = '';
            if (actionBar) {
                originalDisplay = actionBar.style.display;
                actionBar.style.display = 'none';
            }
            
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            
            if (actionBar) {
                actionBar.style.display = originalDisplay || 'flex';
            }
            
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `West_Chemist_Ticket_${serviceName.replace(/\s+/g, '_')}.png`;
            link.href = image;
            link.click();
        } catch (err) {
            console.error('Download error:', err);
            alert('Failed to generate download.');
        }
    };

    const handleDownloadAll = async () => {
        for (const apt of appointments) {
            await handleDownloadTicket(apt._id, apt.service);
        }
    };

    return (
        <div className="track_page_wrap">
            <div className="track_container">
                <div className="track_header">
                    <h1 className="track_page_title">Patient Tracking Center</h1>
                    <p className="track_page_desc">
                        Retrieve, download, print, or manage active clinical boarding tickets registered under your name.
                    </p>
                </div>

                {/* Search Form */}
                <div className="search_glass_panel">
                    <form onSubmit={handleSearchSubmit}>
                        <label className="input_label">Verify Mobile Number</label>
                        <div className="uk_phone_wrapper">
                            <div className="uk_flag_addon">
                                <svg width="20" height="15" viewBox="0 0 60 30" fill="none">
                                    <clipPath id="s">
                                        <path d="M0 0h60v30H0z"/>
                                    </clipPath>
                                    <g clipPath="url(#s)">
                                        <path d="M0 0h60v30H0z" fill="#012169"/>
                                        <path d="M0 0l60 30M60 0L0 30" stroke="#fff" strokeWidth="6"/>
                                        <path d="M0 0l60 30M60 0L0 30" stroke="#C8102E" strokeWidth="4"/>
                                        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/>
                                        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/>
                                    </g>
                                </svg>
                                <span>+44</span>
                            </div>
                            <input 
                                type="tel" 
                                className="premium_input" 
                                placeholder="e.g. 7700900077" 
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn_glow_search" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: 'spin 1s linear infinite' }}>
                                        <circle cx="12" cy="12" r="10" opacity="0.25"/>
                                        <path d="M12 2a10 10 0 0 1 10 10" />
                                    </svg>
                                    <span>Retrieving Database...</span>
                                </>
                            ) : (
                                <>
                                    <span>Search Secure Records</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="5" y1="12" x2="19" y2="12"/>
                                        <polyline points="12 5 19 12 12 19"/>
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* User feedback */}
                {error && <div className="track_error_msg" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', width: '100%', background: '#fff1f2', color: '#9f1239', padding: '16px', borderRadius: '16px', fontWeight: '700', border: '1px solid #ffe4e6' }}>{error}</div>}
                {successMessage && <div className="track_success_msg" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', width: '100%', background: '#ecfdf5', color: '#065f46', padding: '16px', borderRadius: '16px', fontWeight: '700', border: '1px solid #d1fae5' }}>{successMessage}</div>}

                {/* Patient Information Banner */}
                {patient && (
                    <div className="patient_profile_card">
                        <div className="patient_info_details">
                            <h2>Patient Account: {patient.fullName}</h2>
                            <p>Linked Phone Contact: +44 {patient.mobile}</p>
                        </div>
                        <button onClick={handleDownloadAll} className="patient_badge" style={{ background: 'rgba(255, 255, 255, 0.15)', cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            <span>Download All Tickets</span>
                        </button>
                    </div>
                )}

                {/* Grid of Boarding Pass Tickets */}
                {patient && (
                    <div className="tickets_grid">
                        {appointments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', background: '#ffffff', borderRadius: '24px', gridColumn: '1 / -1' }}>
                                <p style={{ color: '#64748b', fontWeight: '700' }}>No appointment reservations found for this patient record.</p>
                            </div>
                        ) : (
                            appointments.map((apt) => {
                                const dynamicStatus = getDynamicStatus(apt);
                                return (
                                    <div className="pro_ticket" key={apt._id} id={`ticket-${apt._id}`}>
                                        {/* Top Header of Ticket */}
                                        <div className="ticket_top_header">
                                            <div className="ticket_top_text_group">
                                                <div className="ticket_top_title">West Chemist Clinic</div>
                                                <div className="ticket_top_subtitle">Secure Medical Booking</div>
                                            </div>
                                            <div className={`status_badge ${apt.isRescheduleRequested ? 'pending' : dynamicStatus}`}>
                                                <span className="status_dot"></span>
                                                <span>{
                                                    apt.isRescheduleRequested ? 'PENDING RESCHEDULE' :
                                                    dynamicStatus === 'appointment_day' ? 'APPOINTMENT DAY' : 
                                                    dynamicStatus === 'pending' ? 'AWAITING AUDIT' :
                                                    dynamicStatus.toUpperCase()
                                                }</span>
                                            </div>
                                        </div>

                                    {/* Ticket Perforation Separator */}
                                    <div className="ticket_perforation_line">
                                        <div className="punch_hole left"></div>
                                        <div className="punch_hole right"></div>
                                    </div>

                                    {/* Body details */}
                                    <div className="ticket_body">
                                        <div className="ticket_info_grid">
                                            <div className="ticket_info_cell">
                                                <span className="ticket_label_txt">Patient Name</span>
                                                <span className="ticket_value_txt" style={{ textTransform: 'capitalize' }}>{patient.fullName}</span>
                                            </div>
                                            
                                            <div className="ticket_info_cell">
                                                <span className="ticket_label_txt">Clinical Service</span>
                                                <span className="ticket_value_txt service_highlight">{apt.service}</span>
                                            </div>

                                            <div className="ticket_info_cell span_full">
                                                <span className="ticket_label_txt">Location Branch</span>
                                                <span className="ticket_value_txt">{apt.clinic}</span>
                                            </div>

                                            <div className="ticket_info_cell">
                                                <span className="ticket_label_txt">Date</span>
                                                <span className="ticket_value_txt" style={{ fontSize: '0.9rem' }}>
                                                    {new Date(apt.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            
                                            <div className="ticket_info_cell">
                                                <span className="ticket_label_txt">Time Slot</span>
                                                <span className="ticket_value_time">{apt.time}</span>
                                            </div>

                                            <div className="ticket_info_cell span_full">
                                                <span className="ticket_label_txt">GPhC Regulation</span>
                                                {apt.status === 'approved' ? (
                                                    <span className="compliance_status_badge" style={{ color: '#0d9488' }}>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: '#0d9488' }}>
                                                            <polyline points="20 6 9 17 4 12"/>
                                                        </svg>
                                                        <span>PASS (NHS VERIFIED ID)</span>
                                                    </span>
                                                ) : apt.status === 'rejected' ? (
                                                    <span className="compliance_status_badge" style={{ color: '#ef4444' }}>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: '#ef4444' }}>
                                                            <line x1="18" y1="6" x2="6" y2="18"/>
                                                            <line x1="6" y1="6" x2="18" y2="18"/>
                                                        </svg>
                                                        <span>REJECTED (FAILED COMPLIANCE)</span>
                                                    </span>
                                                ) : (
                                                    <span className="compliance_status_badge" style={{ color: '#d97706' }}>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: '#d97706' }}>
                                                            <circle cx="12" cy="12" r="10" />
                                                            <line x1="12" y1="8" x2="12" y2="12" />
                                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                                        </svg>
                                                        <span>AWAITING PHARMACIST AUDIT</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {apt.isRescheduleRequested && apt.rescheduledDate && apt.rescheduledTime && (
                                            <div style={{ padding: '12px 14px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '12px', color: '#b45309', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>⚠️ Reschedule requested to <strong>{new Date(apt.rescheduledDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong> at <strong>{apt.rescheduledTime}</strong></span>
                                            </div>
                                        )}

                                        {/* Action Buttons inside Card */}
                                        <div className="ticket_action_bar">
                                            <a 
                                                href={getDirectionsLink(apt.clinic)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="action_link_btn direction"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                                                </svg>
                                                <span>Directions</span>
                                            </a>
                                            
                                            <button 
                                                onClick={() => handleDownloadTicket(apt._id, apt.service)}
                                                className="action_link_btn print"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                    <polyline points="7 10 12 15 17 10"/>
                                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                                </svg>
                                                <span>Download</span>
                                            </button>

                                            {apt.status !== 'cancelled' && apt.status !== 'rejected' && !apt.isRescheduleRequested && (
                                                <button 
                                                    onClick={() => {
                                                        setReschedulingId(apt._id);
                                                        setRescheduleDate('');
                                                        setRescheduleTime('');
                                                        setRescheduleSlots([]);
                                                    }}
                                                    className="action_link_btn reschedule"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <polyline points="12 6 12 12 16 14"/>
                                                    </svg>
                                                    <span>Reschedule</span>
                                                </button>
                                            )}
                                        </div>

                                        {reschedulingId === apt._id && (
                                            <div className="reschedule_panel">
                                                <h4 className="reschedule_title">Select Date & Preferred Slot</h4>
                                                
                                                <div>
                                                    <label className="ticket_label_txt" style={{ marginBottom: '6px', display: 'block' }}>Select Date</label>
                                                    <input 
                                                        type="date" 
                                                        className="reschedule_input_date"
                                                        min={new Date().toISOString().split('T')[0]}
                                                        value={rescheduleDate}
                                                        onChange={(e) => handleRescheduleDateChange(apt, e.target.value)}
                                                    />
                                                </div>

                                                {rescheduleDate && (
                                                    <div>
                                                        <label className="ticket_label_txt" style={{ marginBottom: '6px', display: 'block' }}>Available Slots</label>
                                                        {loadingSlots ? (
                                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: 'spin 1s linear infinite' }}>
                                                                    <circle cx="12" cy="12" r="10" opacity="0.25"/>
                                                                    <path d="M12 2a10 10 0 0 1 10 10" />
                                                                </svg>
                                                                <span>Loading slots...</span>
                                                            </div>
                                                        ) : (
                                                            <div className="reschedule_slots_grid">
                                                                {rescheduleSlots.map((slot) => (
                                                                    <button
                                                                        key={slot.time}
                                                                        type="button"
                                                                        disabled={!slot.available}
                                                                        className={`reschedule_slot_btn ${rescheduleTime === slot.time ? 'selected' : ''}`}
                                                                        onClick={() => setRescheduleTime(slot.time)}
                                                                    >
                                                                        {slot.time}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="reschedule_actions">
                                                    <button 
                                                        type="button" 
                                                        className="reschedule_cancel_btn"
                                                        onClick={() => setReschedulingId(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="reschedule_submit_btn"
                                                        disabled={submittingReschedule || !rescheduleDate || !rescheduleTime}
                                                        onClick={() => handleSubmitReschedule(apt._id)}
                                                    >
                                                        {submittingReschedule ? 'Requesting...' : 'Request Reschedule'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Barcode */}
                                    <div className="ticket_footer_barcode">
                                        <div className="barcode_strip_img"></div>
                                        <span className="barcode_number_label">WCC-{apt._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                    </div>
                                    );
                                })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TrackBooking() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
                <p style={{ fontWeight: '700', fontSize: '1.2rem', color: '#64748b' }}>Loading Tracking Center...</p>
            </div>
        }>
            <TrackBookingContent />
        </Suspense>
    );
}
