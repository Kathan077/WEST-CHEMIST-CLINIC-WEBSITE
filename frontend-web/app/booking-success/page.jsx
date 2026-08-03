"use client";

import { API_URL } from '@/config';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../book-appointment/Booking.css';

const CLINICS = [
    "West Chemist — Northampton Branch",
    "West Chemist — East London Consultation Hub"
];

const SERVICES = [
    { 
        group: "Private Services", 
        items: [
            "Period Delay Service",
            "Weight Loss Management",
            "Ear Wax Removal",
            "Cryotherapy",
            "Travel Clinic"
        ] 
    },
    { 
        group: "NHS Services — Pharmacy First", 
        items: [
            "Ear Ache Treatment (Age 1-17)",
            "Impetigo Treatment",
            "Infected Insect Bites Treatment",
            "Shingles Treatment",
            "Sinusitis Treatment",
            "Sore Throat Treatment",
            "Urinary Tract Infection (UTI) Treatment"
        ] 
    },
    { 
        group: "NHS Services — Clinical", 
        items: [
            "Blood Pressure Testing",
            "Contraception Service",
            "Emergency Contraception Service"
        ] 
    },
    { 
        group: "NHS & Private Vaccinations", 
        items: [
            "Seasonal Flu Vaccination (NHS)",
            "Seasonal Flu Vaccination (Private)",
            "Covid Vaccination (NHS)",
            "Covid Vaccination (Private)",
            "Meningitis B Vaccination (NHS)",
            "Meningitis B Vaccination (Private)"
        ] 
    },
    { 
        group: "Travel Clinic — Vaccines & Tablets", 
        items: [
            "Chikungunya",
            "Cholera",
            "Dengue Fever",
            "DTP (Diphtheria / Tetanus / Polio)",
            "MMR",
            "Hepatitis A",
            "Hepatitis B",
            "Japanese Encephalitis",
            "Meningitis ACWY",
            "Meningitis B",
            "Rabies",
            "Tick-Borne Encephalitis",
            "Typhoid",
            "Yellow Fever",
            "Malaria Tablets"
        ] 
    }
];

const TIMES = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM",
    "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM"
];

const isSlotInPast = (slotTime, selectedDateStr) => {
    if (!selectedDateStr) return false;
    
    const todayLocal = new Date();
    const y = todayLocal.getFullYear();
    const m = String(todayLocal.getMonth() + 1).padStart(2, '0');
    const d = String(todayLocal.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;

    if (selectedDateStr !== todayStr) {
        return false;
    }

    const match = slotTime.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return false;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const ampm = match[3].toUpperCase();

    if (ampm === 'PM' && hours < 12) {
        hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
    }

    const slotDateTime = new Date();
    slotDateTime.setHours(hours, minutes, 0, 0);

    return todayLocal.getTime() > slotDateTime.getTime();
};

const CustomRescheduleCalendar = ({ selectedDate, onChange, clinic }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [holidays, setHolidays] = useState([]);
    const [schedules, setSchedules] = useState([]);
    
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetch(`${API_URL}/api/schedule?branch=${encodeURIComponent(clinic)}`);
                const data = await res.json();
                if (data.success) {
                    setHolidays(data.holidays || []);
                    setSchedules(data.schedules || []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        loadSettings();
    }, [clinic]);

    const getDayStatus = (date) => {
        const today = new Date();
        today.setHours(0,0,0,0);

        const maxDate = new Date();
        maxDate.setHours(23, 59, 59, 999);
        maxDate.setMonth(maxDate.getMonth() + 3);

        if (date < today || date > maxDate) return 'past';

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        const isHoliday = holidays.some(h => {
            if (h.holidayType === 'specific-date') {
                return h.startDateStr === dateStr;
            } else if (h.holidayType === 'yearly-recurring') {
                return h.month === date.getMonth() && h.day === date.getDate();
            }
            return false;
        });
        if (isHoliday) return 'holiday';

        const dayOfWeek = date.getDay();
        const dateOverride = schedules.find(s => s.scheduleType === 'specific-date' && s.dateStr === dateStr);
        if (dateOverride) {
            return dateOverride.isClosed ? 'closed' : 'open';
        }

        const weeklyConfig = schedules.find(s => s.scheduleType === 'weekly-recurring' && s.dayOfWeek === dayOfWeek);
        if (weeklyConfig && weeklyConfig.isClosed) {
            return 'closed';
        }

        const defaultTemplate = schedules.find(s => s.scheduleType === 'default');
        if (defaultTemplate && defaultTemplate.isClosed) {
            return 'closed';
        }

        return 'open';
    };

    const handlePrevMonth = () => {
        const today = new Date();
        const minMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        if (prevMonthDate < minMonthDate) return;
        setCurrentMonth(prevMonthDate);
    };

    const handleNextMonth = () => {
        const today = new Date();
        const maxMonthDate = new Date(today.getFullYear(), today.getMonth() + 3, 1);
        const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        if (nextMonthDate > maxMonthDate) return;
        setCurrentMonth(nextMonthDate);
    };

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const blanks = Array(firstDayIndex === 0 ? 6 : firstDayIndex - 1).fill(null);
    const dayNumbers = Array.from({ length: totalDays }, (_, i) => i + 1);
    const grid = [...blanks, ...dayNumbers];

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="custom_cal_wrap" style={{ marginTop: '10px', background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div className="custom_cal_hdr" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <button type="button" onClick={handlePrevMonth} className="cal_nav_btn" style={{ background: '#e2e8f0', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold' }}>‹</button>
                <span className="cal_hdr_title" style={{ fontWeight: '700', color: '#0f172a' }}>{monthNames[month]} {year}</span>
                <button type="button" onClick={handleNextMonth} className="cal_nav_btn" style={{ background: '#e2e8f0', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold' }}>›</button>
            </div>
            <div className="custom_cal_weekdays" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: '600', fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>
                <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
            </div>
            <div className="custom_cal_grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
                {grid.map((day, idx) => {
                    if (day === null) return <div key={`blank-${idx}`} className="cal_cell blank"></div>;

                    const dateObj = new Date(year, month, day);
                    const status = getDayStatus(dateObj);
                    const yyyy = year;
                    const mm = String(month + 1).padStart(2, '0');
                    const dd = String(day).padStart(2, '0');
                    const dateStr = `${yyyy}-${mm}-${dd}`;
                    const isSelected = selectedDate === dateStr;
                    const isSelectable = status === 'open';

                    return (
                        <button
                            key={`day-${day}`}
                            type="button"
                            disabled={!isSelectable}
                            onClick={() => onChange(dateStr)}
                            className={`cal_cell day_cell ${isSelected ? 'selected' : ''} ${status}`}
                            style={{
                                padding: '8px 0',
                                border: 'none',
                                borderRadius: '8px',
                                background: isSelected ? 'var(--primary)' : isSelectable ? '#fff' : '#f1f5f9',
                                color: isSelected ? '#fff' : isSelectable ? '#0f172a' : '#cbd5e1',
                                cursor: isSelectable ? 'pointer' : 'not-allowed',
                                fontWeight: isSelected ? '700' : '500',
                                boxShadow: isSelectable ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

function BookingSuccessContent() {
    const searchParams = useSearchParams();
    const apptId = searchParams.get('id') || '';

    // SearchParams fallbacks as initial state
    const [fullName, setFullName] = useState(searchParams.get('fullName') || 'Patient');
    const [mobile, setMobile] = useState(searchParams.get('mobile') || '');
    const [service, setService] = useState(searchParams.get('service') || 'Pharmacy Service');
    const [clinic, setClinic] = useState(searchParams.get('clinic') || 'West Chemist');
    const [date, setDate] = useState(searchParams.get('date') || '');
    const [time, setTime] = useState(searchParams.get('time') || '');
    const [patientId, setPatientId] = useState(searchParams.get('patientId') || '57849182');
    
    // Appointment status state
    const [status, setStatus] = useState('pending');
    const [adminNote, setAdminNote] = useState('');
    const [loading, setLoading] = useState(true);

    // Reschedule & Edit details states
    const [isEditing, setIsEditing] = useState(false);
    const [editClinic, setEditClinic] = useState(searchParams.get('clinic') || 'West Chemist');
    const [editService, setEditService] = useState(searchParams.get('service') || 'Clinical Service');
    const [editDate, setEditDate] = useState(searchParams.get('date') || '');
    const [editTime, setEditTime] = useState(searchParams.get('time') || '');
    const [editSlots, setEditSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [dynamicServices, setDynamicServices] = useState(SERVICES);
    const [errorMsg, setErrorMsg] = useState('');
    const [saving, setSaving] = useState(false);

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

                    // Sync the edit form states only if they are not actively editing
                    if (!isEditing) {
                        setEditClinic(apt.clinic || clinic);
                        setEditService(apt.service || service);
                        setEditDate(apt.date || date);
                        setEditTime(apt.time || time);
                    }
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
    }, [apptId, isEditing]);

    // Fetch dynamic services list
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                const json = await res.json();
                if (res.ok && json.success && json.data.length > 0) {
                    const groups = {};
                    json.data.forEach(s => {
                        const cat = s.parentCategory || s.cat || "General Service";
                        if (!groups[cat]) {
                            groups[cat] = [];
                        }
                        groups[cat].push(s.title);
                    });
                    const formatted = Object.keys(groups).map(g => ({
                        group: g,
                        items: groups[g]
                    }));
                    setDynamicServices(formatted);
                }
            } catch (err) {
                console.error("Failed to load dynamic booking services: ", err);
            }
        };
        fetchServices();
    }, []);

    // Load available slots dynamically for reschedule inputs
    useEffect(() => {
        if (editDate && editClinic) {
            const fetchSlots = async () => {
                setLoadingSlots(true);
                try {
                    const response = await fetch(`${API_URL}/api/appointments/slots?clinic=${encodeURIComponent(editClinic)}&date=${editDate}`);
                    const result = await response.json();
                    if (result.success) {
                        setEditSlots(result.slots);
                    } else {
                        setEditSlots(TIMES.map(t => ({ time: t, available: true })));
                    }
                } catch (err) {
                    setEditSlots(TIMES.map(t => ({ time: t, available: true })));
                } finally {
                    setLoadingSlots(false);
                }
            };
            fetchSlots();
        }
    }, [editDate, editClinic]);

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        if (!editClinic || !editService || !editDate || !editTime) {
            setErrorMsg('Please select date and preferred time slot.');
            return;
        }

        setSaving(true);
        setErrorMsg('');
        try {
            const res = await fetch(`${API_URL}/api/appointments/${apptId}/request-reschedule`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newDate: editDate,
                    newTime: editTime,
                    newClinic: editClinic,
                    newService: editService
                })
            });
            const result = await res.json();
            if (result.success) {
                setClinic(editClinic);
                setService(editService);
                setDate(editDate);
                setTime(editTime);
                setIsEditing(false);
            } else {
                setErrorMsg(result.message || 'Failed to reschedule. The chosen slot might be taken.');
            }
        } catch (err) {
            setErrorMsg('Failed to connect to the server. Please try again.');
        } finally {
            setSaving(false);
        }
    };

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

    let complianceLabel = 'PENDING ';
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
                    <div className="bk_panel bk_success_panel anim_in">
                        {isEditing ? (
                            <div className="bk_reschedule_form_wrap anim_in" style={{ textAlign: 'left', width: '100%' }}>
                                <h2 className="bk_confirmed_title" style={{ textAlign: 'center', marginBottom: '24px' }}>Edit Booking Details</h2>
                                {errorMsg && (
                                    <div style={{ padding: '12px', background: '#fff1f2', border: '1.5px solid #ffe4e6', borderRadius: '12px', color: '#be123c', fontSize: '0.85rem', fontWeight: '800', marginBottom: '16px' }}>
                                        {errorMsg}
                                    </div>
                                )}
                                <form onSubmit={handleSaveChanges} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div className="bk_field bk_full" style={{ marginBottom: 0 }}>
                                        <label className="bk_label">Patient Name</label>
                                        <div className="bk_field_text" style={{ padding: '12px 16px', background: '#f1f5f9', borderRadius: '12px', fontWeight: '600', color: '#475569' }}>
                                            {fullName}
                                        </div>
                                    </div>
                                    <div className="bk_field bk_full" style={{ marginBottom: 0 }}>
                                        <label className="bk_label">Mobile Number</label>
                                        <div className="bk_field_text" style={{ padding: '12px 16px', background: '#f1f5f9', borderRadius: '12px', fontWeight: '600', color: '#475569' }}>
                                            {mobile}
                                        </div>
                                    </div>
                                    <div className="bk_field bk_full" style={{ marginBottom: 0 }}>
                                        <label className="bk_label">Clinic Location</label>
                                        <div className="bk_field_icon_wrapper">
                                            <select 
                                                className="bk_input" 
                                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#fff' }}
                                                value={editClinic} 
                                                onChange={(e) => setEditClinic(e.target.value)}
                                                required
                                            >
                                                {CLINICS.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="bk_field bk_full" style={{ marginBottom: 0 }}>
                                        <label className="bk_label">Required Clinical Service</label>
                                        <div className="bk_field_icon_wrapper">
                                            <select 
                                                className="bk_input" 
                                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#fff' }}
                                                value={editService} 
                                                onChange={(e) => setEditService(e.target.value)}
                                                required
                                            >
                                                {dynamicServices.map(g => (
                                                    <optgroup key={g.group} label={`── ${g.group}`}>
                                                        {g.items.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </optgroup>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="bk_label" style={{ marginBottom: '8px', display: 'block' }}>Select Date</label>
                                        <CustomRescheduleCalendar 
                                            selectedDate={editDate}
                                            onChange={setEditDate}
                                            clinic={editClinic}
                                        />
                                    </div>

                                    {editDate && (
                                        <div>
                                            <label className="bk_label" style={{ marginBottom: '8px', display: 'block' }}>Preferred Time Slot</label>
                                            {loadingSlots ? (
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: 'spin 1s linear infinite' }}>
                                                        <circle cx="12" cy="12" r="10" opacity="0.25"/>
                                                        <path d="M12 2a10 10 0 0 1 10 10" />
                                                    </svg>
                                                    <span>Loading slots...</span>
                                                </div>
                                            ) : (
                                                <div className="bk_times" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                                                    {editSlots.length > 0 && editSlots.filter(s => s.available && !isSlotInPast(s.time, editDate)).length === 0 ? (
                                                        <p style={{ gridColumn: '1/-1', fontSize: '0.85rem', color: '#ef4444', fontWeight: '600' }}>All slots are full for this date.</p>
                                                    ) : (
                                                        editSlots
                                                            .filter(s => s.available && !isSlotInPast(s.time, editDate))
                                                            .map(s => {
                                                                const isSel = editTime === s.time;
                                                                return (
                                                                    <div
                                                                        key={s.time}
                                                                        className={`bk_time ${isSel ? 'selected' : ''}`}
                                                                        style={{ cursor: 'pointer', textAlign: 'center', padding: '10px', borderRadius: '8px', border: isSel ? '2px solid var(--primary)' : '1px solid #e2e8f0', background: isSel ? 'rgba(75, 45, 113, 0.05)' : '#fff', color: isSel ? 'var(--primary)' : '#0f172a', fontWeight: '600' }}
                                                                        onClick={() => setEditTime(s.time)}
                                                                    >
                                                                        {s.time}
                                                                    </div>
                                                                );
                                                            })
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                        <button
                                            type="button"
                                            className="bk_btn_ghost"
                                            style={{ flex: 1, justifyContent: 'center' }}
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bk_btn_primary"
                                            style={{ flex: 2, justifyContent: 'center' }}
                                            disabled={saving}
                                        >
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="bk_confirmed anim_in" style={{ textAlign: 'center' }}>
                                <div className="bk_confirmed_ring" style={{ background: iconGradient, boxShadow: iconShadow, margin: '0 auto 24px' }}>
                                    {topIcon}
                                </div>
                                <h2 className="bk_confirmed_title">{headingTitle}</h2>
                                <p className="bk_confirmed_sub">
                                    {headingSubtitle}
                                </p>

                                {/* Boarding Pass Clinical Ticket with Punch Holes */}
                                <div className="bk_ticket" style={{ maxWidth: '480px' }}>
                                    <div className="bk_ticket_header">
                                        <div className="bk_ticket_header_left">
                                            <div className="bk_ticket_super">Service Ticket</div>
                                            <div className="bk_ticket_title">West Chemist</div>
                                        </div>
                                        <div className="bk_ticket_status" style={{ background: statusBg, borderColor: statusBorder }}>
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
                                            <span style={{ color: statusColor }}>{statusLabel}</span>
                                        </div>
                                    </div>

                                    <div className="bk_ticket_table">
                                        <div className="bk_ticket_row"><span>Patient</span><strong>{fullName}</strong></div>
                                        <div className="bk_ticket_row"><span>Mobile</span><strong>{mobile}</strong></div>
                                        <div className="bk_ticket_row"><span>Service Type</span><strong>{service}</strong></div>
                                        <div className="bk_ticket_row">
                                            <span>Clinic Branch</span>
                                            <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                    <circle cx="12" cy="10" r="3" />
                                                </svg>
                                                {clinic}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="bk_ticket_divider" />

                                    <div className="bk_ticket_table">
                                        <div className="bk_ticket_row"><span>Reserved Date</span><strong>{formattedDate}</strong></div>
                                        <div className="bk_ticket_row"><span>Reserved Time</span><strong className="bk_ticket_time">{time}</strong></div>
                                        <div className="bk_ticket_row">
                                            <span>GPhC Compliance</span>
                                            <strong style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <span className="bk_ticket_verified" style={{ color: complianceColor, background: complianceBg }}>
                                                    {complianceLabel}
                                                </span>
                                            </strong>
                                        </div>
                                    </div>

                                    {/* Barcode block */}
                                    <div className="bk_barcode">
                                        <div className="bk_barcode_lines"></div>
                                        <div className="bk_barcode_num">WCC-{patientId ? patientId.slice(-8).toUpperCase() : '57849182'}</div>
                                    </div>
                                </div>

                                {/* Verification Workflow Timeline */}
                                <div className="bk_success_checklist">
                                    <h3 className="bk_checklist_title">GPhC Statutory Audit Checklist</h3>
                                    <div className="bk_checklist_wrapper">
                                        {/* Timeline connector line */}
                                        <div className="bk_checklist_line" style={{
                                            background: `linear-gradient(to bottom, #10b981 66%, ${checklistStep3Bg} 100%)`
                                        }} />
                                        
                                        <div className="bk_checklist_list">
                                            <div className="bk_checklist_item">
                                                <div className="bk_checklist_circle bk_circle_success">
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4.5">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </div>
                                                <div className="bk_checklist_content">
                                                    <div className="bk_checklist_headline">Secure Document Uploaded</div>
                                                    <div className="bk_checklist_sub">Identity document linked to patient profile</div>
                                                </div>
                                            </div>

                                            <div className="bk_checklist_item">
                                                <div className="bk_checklist_circle bk_circle_success">
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4.5">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </div>
                                                <div className="bk_checklist_content">
                                                    <div className="bk_checklist_headline">Compliance Pre-Screen</div>
                                                    <div className="bk_checklist_sub">MRZ extraction and tampering checks completed</div>
                                                </div>
                                            </div>

                                            <div className="bk_checklist_item">
                                                <div className="bk_checklist_circle" style={{
                                                    background: checklistStep3Bg,
                                                    borderColor: checklistStep3Bg,
                                                    color: 'white',
                                                    animation: (checklistStep3Bg === '#f59e0b' || checklistStep3Bg === '#d97706') ? 'goldPulse 2s infinite ease-in-out' : 'none'
                                                }}>
                                                    {checklistStep3Icon}
                                                </div>
                                                <div className="bk_checklist_content">
                                                    <div className="bk_checklist_headline">{checklistStep3Label}</div>
                                                    <div className="bk_checklist_sub">{checklistStep3Sub}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '480px', margin: '20px auto 0 auto' }}>
                                    {status === 'pending' && (
                                        <button 
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="bk_btn_ghost" 
                                            style={{ width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', border: '1.5px solid var(--primary)', color: 'var(--primary)', cursor: 'pointer', background: 'transparent', height: '54px', borderRadius: '14px', fontWeight: '700', fontSize: '0.95rem' }}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                            Reschedule / Edit Booking Details
                                        </button>
                                    )}
                                    <Link 
                                        href={`/track-booking?mobile=${encodeURIComponent(mobile)}`} 
                                        className="bk_btn_primary" 
                                        style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8" />
                                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                        Track Your Booking
                                    </Link>
                                    <Link 
                                        href="/" 
                                        className="bk_btn_ghost bk_btn_success_home" 
                                        style={{ width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg>
                                        Return to Portal Home
                                    </Link>
                                    <Link 
                                        href="/book-appointment" 
                                        className="bk_btn_ghost bk_btn_success_another" 
                                        style={{ width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
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
                                    </Link>
                                </div>
                            </div>
                        )}
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
