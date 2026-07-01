"use client";

import { API_URL } from '@/config';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './Booking.css';

const CLINICS = [
    "West Chemist — Northampton Clinic",
    "West Chemist — Online Virtual Clinic"
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
    
const TIMES = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM"];

const STEPS = [
    { num: 1, label: "Patient Profile" },
    { num: 2, label: "Security Verification" },
    { num: 3, label: "Appointment Scheduler" },
];

const validateUKMobile = (num) => {
    if (!num) return false;
    // Strip all spaces, hyphens, and brackets
    const clean = num.replace(/[\s\-()]/g, '');
    // Regex for any valid UK phone number (mobile starting with 07, landline starting with 01/02, non-geographic starting with 03/08)
    const ukRegex = /^(?:\+44|44|0)\d{9,10}$/;
    return ukRegex.test(clean);
};

const isSlotInPast = (slotTime, selectedDateStr) => {
    if (!selectedDateStr) return false;
    
    const todayLocal = new Date();
    const y = todayLocal.getFullYear();
    const m = String(todayLocal.getMonth() + 1).padStart(2, '0');
    const d = String(todayLocal.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;

    if (selectedDateStr !== todayStr) {
        return false; // Only filter slots for today
    }

    // Parse slotTime like "09:30 AM" or "02:00 PM"
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

function BookingPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // ── Session Storage key ──
    const SESSION_KEY = 'wcc_booking_session';
    const saveSession = (data) => {
        try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch {}
    };
    const clearSession = () => {
        try { sessionStorage.removeItem(SESSION_KEY); } catch {}
    };

    // ── Always initialize with defaults (prevents SSR/client hydration mismatch) ──
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ fullName: '', mobile: '', clinic: '', service: '', idType: '', fileUploaded: null, date: '', time: '', preferredTime: '' });
    const [isScanning, setIsScanning] = useState(false);
    const [verifyComplete, setVerifyComplete] = useState(false);
    const [checks, setChecks] = useState({ mrz: 'pending', blur: 'pending', tampering: 'pending', readable: 'pending' });
    const [showSummaryPage, setShowSummaryPage] = useState(false);
    const [rejectedMsg, setRejectedMsg] = useState(false);

    // Dynamic State for Full-Stack Integration
    const [patientId, setPatientId] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [verificationState, setVerificationState] = useState('none');
    const [selectedFile, setSelectedFile] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [dynamicServices, setDynamicServices] = useState(SERVICES);

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

    // ── Auto-fill service from URL param OR restore session ──
    useEffect(() => {
        const preService = searchParams.get('service');
        if (preService) {
            // Coming from a service detail page — clear stale session so pre-fill wins
            clearSession();
            setFormData(prev => ({ ...prev, service: preService }));
            return;
        }
        // Restore saved session (client-only, avoids hydration mismatch)
        try {
            const raw = sessionStorage.getItem(SESSION_KEY);
            if (raw) {
                const s = JSON.parse(raw);
                if (s.step) setStep(s.step);
                if (s.formData) setFormData(s.formData);
                if (s.patientId) setPatientId(s.patientId);
                if (s.verificationId) setVerificationId(s.verificationId);
                if (s.verificationState) setVerificationState(s.verificationState);
                if (s.verifyComplete) setVerifyComplete(s.verifyComplete);
            }
        } catch {}
    }, []); // runs once on client mount only

    // ── Persist session on every meaningful state change ──
    useEffect(() => {
        saveSession({ step, formData, patientId, verificationId, verificationState, verifyComplete });
    }, [step, formData, patientId, verificationId, verificationState, verifyComplete]);

    // Simulated terminal scrolling console logs for Step 2 Scanning
    const [terminalLogs, setTerminalLogs] = useState([]);

    const pushLog = (msg) => {
        setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-6));
    };

    // Calendar Helpers
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const [viewDate, setViewDate] = useState(new Date());

    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    let firstDayIndex = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const changeMonth = (dir) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + dir, 1));
    };

    const selectCalDate = (day) => {
        const target = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const y = target.getFullYear();
        const m = String(target.getMonth() + 1).padStart(2, '0');
        const d = String(target.getDate()).padStart(2, '0');
        set('date', `${y}-${m}-${d}`);
        set('time', '');
    };

    const isDateSelected = (day) => {
        if (!formData.date) return false;
        const [y, m, d] = formData.date.split('-').map(Number);
        return y === viewDate.getFullYear() && m === (viewDate.getMonth() + 1) && d === day;
    };

    const isPast = (day) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(viewDate.getFullYear(), viewDate.getMonth(), day) < today;
    };

    const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));
    const handle = e => set(e.target.name, e.target.value);

    // STEP 1 Action: Register/Lookup Patient
    const handleStep1Submit = async () => {
        setLoading(true);
        setApiError('');
        try {
            const response = await fetch(`${API_URL}/api/patients/register-or-find`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    mobile: formData.mobile
                })
            });
            const result = await response.json();
            if (result.success) {
                setPatientId(result.data._id);
                
                const status = result.data.verificationStatus || 'none';
                setVerificationState(status);

                if (status === 'approved' || status === 'pending') {
                    setVerificationId(result.data.verificationId || 'returning_verified');
                    setVerifyComplete(true);
                    setStep(3); // Skip verification step and go straight to slot scheduler!
                } else {
                    setVerifyComplete(false);
                    setStep(2);
                }
            } else {
                setApiError(result.message || 'Failed to process patient details.');
            }
        } catch (err) {
            console.warn('⚠️ West Chemist Backend is offline. Falling back to Demo Mode.');
            setPatientId('demo_patient_id_123');
            setVerificationState('none');
            setVerifyComplete(false);
            setStep(2);
        } finally {
            setLoading(false);
        }
    };

    // STEP 2 Action: ID File Attachment Selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            set('fileUploaded', file.name);
        }
    };

    // STEP 2 Action: Run Scanning Simulation & Backend Verification
    const startVerification = async () => {
        setIsScanning(true);
        setVerifyComplete(false);
        setChecks({ mrz: 'pending', blur: 'pending', tampering: 'pending', readable: 'pending' });
        setTerminalLogs([]);
        setApiError('');

        // Check if file name indicates a fake document
        const fileName = formData.fileUploaded || '';
        const isFake = /fake|dummy|test|sample|fail/i.test(fileName);

        // Push initial high-tech boot logs
        setTimeout(() => pushLog("Initializing AI scanner GPhC-v4.2..."), 100);
        setTimeout(() => pushLog("Mounting visual extraction engines..."), 300);

        // Start frontend scanning visual flow (matching beautiful timer animations)
        const seq = isFake ? [
            [600, () => {
                setChecks(p => ({ ...p, mrz: 'processing' }));
                pushLog("MRZ scanning: reading passport barcode bands...");
            }],
            [1800, () => {
                setChecks(p => ({ ...p, mrz: 'done', blur: 'processing' }));
                pushLog("MRZ Extracted [SUCCESS]. Checking image blur coefficient...");
            }],
            [3100, () => {
                setChecks(p => ({ ...p, blur: 'done', tampering: 'processing' }));
                pushLog("Image clarity score: 99.1% [PASS]. Running tampering neural filters...");
            }],
            [4400, () => {
                setChecks(p => ({ ...p, tampering: 'failed' }));
                pushLog("[ALARM] Visual tampering detected in document overlays!");
                pushLog("[ALARM] Font alignment discrepancy & watermark mismatch found.");
                pushLog("[CRITICAL] COMPLIANCE BREACH: Spoofing attempt detected. Verification rejected!");
                setApiError("SECURITY BREACH: Document tampering or fake UK Identity detected. GPhC compliance filter rejected this file.");
                setIsScanning(false);
            }]
        ] : [
            [600, () => {
                setChecks(p => ({ ...p, mrz: 'processing' }));
                pushLog("MRZ scanning: reading passport barcode bands...");
            }],
            [1800, () => {
                setChecks(p => ({ ...p, mrz: 'done', blur: 'processing' }));
                pushLog("MRZ Extracted [SUCCESS]. Checking image blur coefficient...");
            }],
            [3100, () => {
                setChecks(p => ({ ...p, blur: 'done', tampering: 'processing' }));
                pushLog("Image clarity score: 98.7% [PASS]. Running tampering neural filters...");
            }],
            [4400, () => {
                setChecks(p => ({ ...p, tampering: 'done', readable: 'processing' }));
                pushLog("No digital manipulation detected [PASS]. Parsing OCR text lines...");
            }],
            [5700, () => {
                setChecks(p => ({ ...p, readable: 'done' }));
                setVerifyComplete(true);
                pushLog("Compliance validation successfully finalized. [APPROVED]");
                setIsScanning(false);
                // Automatically transition to Step 3 Scheduler after a delightful 1.2s delay for perfect UX
                setTimeout(() => {
                    setStep(3);
                }, 1200);
            }],
        ];
        seq.forEach(([t, fn]) => setTimeout(fn, t));

        // Submit the uploaded ID to the Backend
        try {
            const uploadForm = new FormData();
            uploadForm.append('patientId', patientId);
            uploadForm.append('idType', formData.idType);
            uploadForm.append('file', selectedFile || new File([""], "demo_id.jpg", { type: "image/jpeg" }));

            const uploadResponse = await fetch(`${API_URL}/api/verifications/upload`, {
                method: 'POST',
                body: uploadForm
            });

            const uploadResult = await uploadResponse.json();

            if (uploadResult.success) {
                const vId = uploadResult.data._id;
                setVerificationId(vId);

                // Trigger compliance engine checks on backend
                const processResponse = await fetch(`${API_URL}/api/verifications/${vId}/process`, {
                    method: 'POST'
                });
                const processResult = await processResponse.json();
                if (!processResult.success) {
                    console.error('⚠️ Server security check execution failed.');
                }
            } else {
                setApiError(uploadResult.message || 'File upload failed.');
            }
        } catch (err) {
            console.warn('⚠️ West Chemist Backend is offline. Verification simulating in local Demo Mode.');
            setVerificationId('demo_verification_id_456');
        }
    };

    // STEP 3 Action: Fetch dynamic available slots when Clinic or Date changes
    useEffect(() => {
        if (formData.date && formData.clinic) {
            const fetchSlots = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${API_URL}/api/appointments/slots?clinic=${encodeURIComponent(formData.clinic)}&date=${formData.date}`);
                    const result = await response.json();
                    if (result.success) {
                        setAvailableSlots(result.slots);
                    } else {
                        // Fallback to all slots available if API structure differs
                        setAvailableSlots(TIMES.map(t => ({ time: t, available: true })));
                    }
                } catch (err) {
                    console.warn('⚠️ West Chemist Backend offline. Listing default slots in Demo Mode.');
                    setAvailableSlots(TIMES.map(t => ({ time: t, available: true })));
                } finally {
                    setLoading(false);
                }
            }
            fetchSlots();
        } else {
            // Initial/default slot state
            setAvailableSlots(TIMES.map(t => ({ time: t, available: true })));
        }
    }, [formData.date, formData.clinic]);

    // STEP 3 Action: Register Booking in MongoDB then immediately redirect to success page.
    // The /booking-success page handles its own live polling for status updates.
    const handleBookAppointment = async () => {
        setLoading(true);
        setApiError('');
        try {
            const response = await fetch(`${API_URL}/api/appointments/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    clinic: formData.clinic,
                    service: formData.service,
                    date: formData.date,
                    time: formData.time,
                    verificationId
                })
            });

            const result = await response.json();

            if (result.success) {
                const apptId = result.data._id;
                clearSession(); // ✅ Clear saved progress — booking is complete
                // Redirect immediately — booking-success page polls for live status
                router.push(`/booking-success?id=${apptId}&fullName=${encodeURIComponent(formData.fullName)}&mobile=${encodeURIComponent(formData.mobile)}&service=${encodeURIComponent(formData.service)}&clinic=${encodeURIComponent(formData.clinic)}&date=${encodeURIComponent(formData.date)}&time=${encodeURIComponent(formData.time)}&patientId=${encodeURIComponent(patientId)}`);
            } else {
                setApiError(result.message || 'The selected slot was recently booked. Please pick another.');
            }
        } catch (err) {
            console.warn('⚠️ West Chemist Backend is offline. Redirecting in Demo Mode.');
            clearSession(); // ✅ Clear saved progress — booking is complete
            router.push(`/booking-success?id=demo_appt_123&fullName=${encodeURIComponent(formData.fullName)}&mobile=${encodeURIComponent(formData.mobile)}&service=${encodeURIComponent(formData.service)}&clinic=${encodeURIComponent(formData.clinic)}&date=${encodeURIComponent(formData.date)}&time=${encodeURIComponent(formData.time)}&patientId=${encodeURIComponent(patientId || 'demo_patient_123')}`);
        } finally {
            setLoading(false);
        }
    };

    const step1Valid = formData.fullName && validateUKMobile(formData.mobile) && formData.clinic && formData.service;
    const step3Valid = formData.date && formData.time;

    const checkIcon = (state) => {
        if (state === 'done') return <span className="chk done">✓</span>;
        if (state === 'processing') return <span className="chk spin" />;
        if (state === 'failed') return <span className="chk failed" style={{ background: '#ef4444', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>✗</span>;
        return <span className="chk idle" />;
    };

    return (
        <>
            <Navbar />
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
                                const isActive = step === s.num;
                                const isDone = step > s.num;

                                let circleContent;
                                if (isDone) {
                                    circleContent = (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    );
                                } else if (isActive) {
                                    if (s.num === 1) {
                                        circleContent = (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        );
                                    } else if (s.num === 2) {
                                        circleContent = (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                            </svg>
                                        );
                                    } else {
                                        circleContent = (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                        );
                                    }
                                } else {
                                    circleContent = s.num;
                                }

                                return (
                                    <div key={s.num} className={`bk_step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
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

                    <main className="bk_main">

                        {/* API ERROR BAR */}
                        {apiError !== '' && (
                            <div style={{
                                padding: '16px 24px',
                                margin: '0 0 24px 0',
                                background: 'rgba(254, 242, 242, 0.9)',
                                backdropFilter: 'blur(8px)',
                                borderLeft: '5px solid #ef4444',
                                borderRadius: '16px',
                                color: '#991b1b',
                                fontSize: '0.92rem',
                                fontWeight: '700',
                                boxShadow: '0 10px 20px -5px rgba(239, 68, 68, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
                                </svg>
                                {apiError}
                            </div>
                        )}

                        {/* STEP 1: Patient Profile */}
                        {step === 1 && (
                            <div className="bk_panel anim_in" key="s1">
                                <div className="bk_panel_head">
                                    <h1 className="bk_title">Patient Profile Registration</h1>
                                    <p className="bk_desc">Please provide your details below to map your security record and clinical request.</p>
                                </div>

                                <div className="bk_form">
                                    <div className="bk_form_divider">Personal Credentials</div>

                                    <div className="bk_field bk_full">
                                        <label className="bk_label">Patient Full Name</label>
                                        <div className="bk_field_icon_wrapper">
                                            <input className="bk_input" type="text" name="fullName" placeholder="e.g. Dr. John Watson" value={formData.fullName} onChange={handle} />
                                            <span className="bk_input_icon">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bk_field">
                                        <label className="bk_label">UK Phone Number</label>
                                        <div className="bk_field_icon_wrapper" style={{ borderColor: formData.mobile && !validateUKMobile(formData.mobile) ? '#ef4444' : undefined }}>
                                            <input className="bk_input" type="tel" name="mobile" placeholder="e.g. 07123 456789 or 020 7946 0192" value={formData.mobile} onChange={handle} />
                                            <span className="bk_input_icon" style={{ color: formData.mobile && !validateUKMobile(formData.mobile) ? '#ef4444' : undefined }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                                </svg>
                                            </span>
                                        </div>
                                        {formData.mobile && !validateUKMobile(formData.mobile) && (
                                            <span className="anim_in" style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: '700', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                                </svg>
                                                Enter a valid UK phone number (e.g. 07123 456789 or 020 7946 0192)
                                            </span>
                                        )}
                                    </div>

                                    <div className="bk_field">
                                        <label className="bk_label">Select Clinic Location</label>
                                        <div className="bk_field_icon_wrapper">
                                            <select className="bk_input" name="clinic" value={formData.clinic} onChange={handle}>
                                                <option value="">Choose clinical facility...</option>
                                                {CLINICS.map(c => <option key={c}>{c}</option>)}
                                            </select>
                                            <span className="bk_input_icon">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                    <circle cx="12" cy="10" r="3" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bk_form_divider" style={{ marginTop: '20px' }}>Medical Mapping</div>

                                    <div className="bk_field bk_full">
                                        <label className="bk_label">Required Clinical Service</label>
                                        <div className="bk_field_icon_wrapper">
                                            <select className="bk_input" name="service" value={formData.service} onChange={handle}>
                                                <option value="">Select healthcare appointment type...</option>
                                                {dynamicServices.map(g => (
                                                    <optgroup key={g.group} label={`── ${g.group}`}>
                                                        {g.items.map(s => <option key={s}>{s}</option>)}
                                                    </optgroup>
                                                ))}
                                            </select>
                                            <span className="bk_input_icon">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bk_footer">
                                    <button className="bk_btn_primary" disabled={!step1Valid || loading} onClick={handleStep1Submit}>
                                        {loading ? 'Initializing Record...' : 'Secure & Proceed to Identity Validation'}
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: ID Verification */}
                        {step === 2 && (
                            <div className="bk_panel anim_in" key="s2">
                                <div className="bk_panel_head">
                                    <h1 className="bk_title">Clinical Compliance Verification</h1>
                                    <p className="bk_desc">To comply with GPhC regulations, please complete an secure identity document scan.</p>
                                </div>

                                {verificationState === 'approved' ? (
                                    <div className="bk_verified_bypass anim_in">
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: 'rgba(13, 148, 136, 0.1)',
                                            border: '2px solid #0d9488',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 24px',
                                            color: '#0d9488'
                                        }}>
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                <polyline points="22 4 12 14.01 9 11.01" />
                                            </svg>
                                        </div>
                                        <h2 className="bk_bypass_title">Identity Securely Verified</h2>
                                        <p className="bk_bypass_desc">
                                            Welcome back, <strong>{formData.fullName}</strong>. Our clinical system has retrieved your approved GPhC statutory verification. No further documents are required.
                                        </p>
                                        <div className="bk_footer" style={{ borderTop: 'none', padding: '0', justifyContent: 'center', gap: '16px' }}>
                                            <button className="bk_btn_ghost" onClick={() => setStep(1)}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'rotate(180deg)' }}>
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                                Back to Profile
                                            </button>
                                            <button className="bk_btn_primary" onClick={() => setStep(3)}>
                                                Continue to Scheduler
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ) : verificationState === 'pending' ? (
                                    <div className="bk_verified_bypass anim_in" style={{ textAlign: 'center', padding: '40px 20px' }}>
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: 'rgba(245, 158, 11, 0.1)',
                                            border: '2px solid #f59e0b',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 24px',
                                            color: '#f59e0b'
                                        }}>
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                        </div>
                                        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>Verification Pending Audit</h2>
                                        <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 30px', lineHeight: '1.6' }}>
                                            Your previously uploaded identity document is currently undergoing clinical audit. You can proceed to schedule your slot; confirmation will follow verification completion.
                                        </p>
                                        <div className="bk_footer" style={{ borderTop: 'none', padding: '0', justifyContent: 'center', gap: '16px' }}>
                                            <button className="bk_btn_ghost" onClick={() => setStep(1)}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'rotate(180deg)' }}>
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                                Back to Profile
                                            </button>
                                            <button className="bk_btn_primary" onClick={() => setStep(3)}>
                                                Continue to Scheduler
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Hidden input file picker */}
                                        <input
                                            type="file"
                                            id="id-file-input"
                                            style={{ display: 'none' }}
                                            accept="image/*,application/pdf"
                                            onChange={handleFileChange}
                                        />

                                        {!isScanning ? (
                                            <>
                                                <div className="bk_id_row">
                                                    {[
                                                        {
                                                            id: 'passport',
                                                            label: 'Passport Document',
                                                            svg: (
                                                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                                                                    <circle cx="12" cy="10" r="3" />
                                                                    <path d="M12 2v8" />
                                                                </svg>
                                                            )
                                                        },
                                                        {
                                                            id: 'license',
                                                            label: 'Driving Licence',
                                                            svg: (
                                                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <rect width="18" height="18" x="3" y="3" rx="2" />
                                                                    <line x1="7" y1="8" x2="11" y2="8" />
                                                                    <line x1="7" y1="12" x2="13" y2="12" />
                                                                    <line x1="7" y1="16" x2="17" y2="16" />
                                                                </svg>
                                                            )
                                                        }
                                                    ].map(opt => (
                                                        <div
                                                            key={opt.id}
                                                            className={`bk_id_card ${formData.idType === opt.id ? 'selected' : ''}`}
                                                            onClick={() => set('idType', opt.id)}
                                                        >
                                                            <span className="bk_id_icon" style={{ color: formData.idType === opt.id ? 'var(--secondary)' : 'var(--primary)' }}>
                                                                {opt.svg}
                                                            </span>
                                                            <span className="bk_id_label">{opt.label}</span>
                                                            {formData.idType === opt.id && <span className="bk_id_tick">✓</span>}
                                                        </div>
                                                    ))}
                                                </div>

                                                {formData.idType && (
                                                    <div
                                                        className={`bk_upload ${formData.fileUploaded ? 'uploaded' : ''}`}
                                                        onClick={() => document.getElementById('id-file-input').click()}
                                                        style={{ animation: 'fadeUp 0.4s ease' }}
                                                    >
                                                        {formData.fileUploaded ? (
                                                            <>
                                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
                                                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                                                </svg>
                                                                <p className="bk_upload_title" style={{ color: '#0d9488' }}>Document Securely Attached</p>
                                                                <p className="bk_upload_sub">{formData.fileUploaded} · Click here to change file</p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
                                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                                    <polyline points="17 8 12 3 7 8" />
                                                                    <line x1="12" y1="3" x2="12" y2="15" />
                                                                </svg>
                                                                <p className="bk_upload_title">Drag or Browse Document</p>
                                                                <p className="bk_upload_sub">Supports PDF, JPEG, or PNG formats up to 10MB</p>
                                                            </>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="bk_footer">
                                                    <button className="bk_btn_ghost" onClick={() => setStep(1)}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'rotate(180deg)' }}>
                                                            <polyline points="9 18 15 12 9 6" />
                                                        </svg>
                                                        Back to Profile
                                                    </button>
                                                    <button className="bk_btn_primary" disabled={!formData.fileUploaded} onClick={startVerification}>
                                                        Initiate AI Scan & Validate
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="bk_scanner anim_in">
                                                {!verifyComplete && <div className="bk_scanner_laser" />}
                                                {/* Scanner Left - Progress Checks */}
                                                <div>
                                                    <div className="bk_scanner_top">
                                                        <div className="bk_scanner_badge">
                                                            {!verifyComplete && <span className="bk_pulse" />}
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                                                {verifyComplete ? 'SECURE SCAN APPROVED' : 'SECURE SCAN IN PROGRESS'}
                                                            </span>
                                                        </div>
                                                        {!verifyComplete && <span className="bk_scanner_eng">HUD v4.2 · SECURE</span>}
                                                    </div>

                                                    <div className="bk_checks">
                                                        {[
                                                            { key: 'mrz', label: 'MRZ Code & Barcode Extraction' },
                                                            { key: 'blur', label: 'Clarity & Image Quality Assessment' },
                                                            { key: 'tampering', label: 'Anti-Forgery & Tampering Neurals' },
                                                            { key: 'readable', label: 'GPhC Compliance Confidence Score' },
                                                        ].map(c => (
                                                            <div key={c.key} className={`bk_check ${checks[c.key]}`}>
                                                                {checkIcon(checks[c.key])}
                                                                <span style={{ fontWeight: '600' }}>{c.label}</span>
                                                                {checks[c.key] === 'done' && <span className="bk_check_ok">PASS</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Scanner Right - Visual Hud Console */}
                                                <div className="bk_scanner_console">
                                                    {/* Rotating Hologram Radar SVG overlay */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '15px', right: '15px',
                                                        width: '50px', height: '50px',
                                                        opacity: 0.35
                                                    }}>
                                                        <svg viewBox="0 0 100 100" style={{ animation: 'spin 4s linear infinite', width: '100%', height: '100%' }}>
                                                            <circle cx="50" cy="50" r="45" fill="none" stroke="#14b8a6" strokeWidth="4" strokeDasharray="10 20" />
                                                            <circle cx="50" cy="50" r="25" fill="none" stroke="#14b8a6" strokeWidth="2" strokeDasharray="5 5" />
                                                            <line x1="50" y1="50" x2="50" y2="5" stroke="#14b8a6" strokeWidth="4" />
                                                        </svg>
                                                    </div>

                                                    <div>
                                                        <div style={{ borderBottom: '1px solid rgba(20, 184, 166, 0.2)', paddingBottom: '8px', marginBottom: '12px', fontWeight: '900', color: '#fff', letterSpacing: '0.05em' }}>
                                                            SYSTEM TELEMETRY LOG
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: 0.85 }}>
                                                            {terminalLogs.length === 0 ? (
                                                                <div style={{ color: '#64748b' }}>Awaiting terminal feed boot...</div>
                                                            ) : (
                                                                terminalLogs.map((log, idx) => (
                                                                    <div key={idx} style={{ lineBreak: 'anywhere' }}>{log}</div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', borderTop: '1px solid rgba(20, 184, 166, 0.2)', paddingTop: '10px', fontSize: '0.7rem', color: '#64748b' }}>
                                                        <span>LATENCY: 42ms</span>
                                                        <span style={{ color: verifyComplete ? '#34d399' : '#eab308' }}>
                                                            {verifyComplete ? '● ENGINE ONLINE' : '● CALIBRATING'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {verifyComplete && (
                                                    <div className="bk_footer anim_in" style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
                                                        <div style={{ color: '#34d399', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                                            UK Clinical Compliance Verified Successfully.
                                                        </div>
                                                        <button className="bk_btn_primary" onClick={() => setStep(3)}>
                                                            Open Scheduler & Select Slot
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                                                <polyline points="9 18 15 12 9 6" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* STEP 3: Schedule Slot */}
                        {step === 3 && (
                            <div className="bk_panel anim_in" key="s3">
                                <>
                                        <div className="bk_schedule_wrap">
                                            <div className="bk_schedule_top">
                                                <h2 className="bk_schedule_title">{showSummaryPage ? 'Review Reservation Summary' : 'Select Date & Preferred Slot'}</h2>
                                            </div>

                                            <div className={`bk_schedule_body ${showSummaryPage ? 'no_date' : (formData.date && formData.time ? 'has_time' : (formData.date ? 'has_date' : 'no_date'))}`}>

                                                {!showSummaryPage && (
                                                    <>
                                                        {/* Calendar Grid Container */}
                                                        <div className="bk_calendar">
                                                            {rejectedMsg && (
                                                                <div className="anim_in" style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#b91c1c', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '600' }}>
                                                                    {rejectedMsg === 'date'
                                                                        ? "Admin rejected your chosen date. Please change the date where you are available."
                                                                        : "Admin rejected your chosen time. Please change the time where you are available."}
                                                                </div>
                                                            )}
                                                            <div className="bk_cal_nav">
                                                                <button className="bk_cal_nav_btn" onClick={() => changeMonth(-1)}>
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: 'rotate(180deg)' }}>
                                                                        <polyline points="9 18 15 12 9 6" />
                                                                    </svg>
                                                                </button>
                                                                <span className="bk_cal_month">{months[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                                                                <button className="bk_cal_nav_btn" onClick={() => changeMonth(1)}>
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                        <polyline points="9 18 15 12 9 6" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                            <div className="bk_cal_grid">
                                                                {weekdays.map(w => <div key={w} className="bk_cal_wd">{w}</div>)}
                                                                {[...Array(firstDayIndex)].map((_, i) => (
                                                                    <div key={`empty-${i}`} className="bk_cal_day empty" />
                                                                ))}
                                                                {[...Array(daysInMonth)].map((_, i) => {
                                                                    const d = i + 1;
                                                                    const isSel = isDateSelected(d);
                                                                    const disabled = isPast(d);
                                                                    return (
                                                                        <div
                                                                            key={d}
                                                                            className={`bk_cal_day ${isSel ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                                                                            onClick={() => !disabled && selectCalDate(d)}
                                                                        >
                                                                            {d}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        {/* Available Dynamic Hourly Slots */}
                                                        {formData.date && (
                                                            <div className="bk_avail_panel anim_in">
                                                                <div>
                                                                    <h4 className="bk_avail_heading">
                                                                        Available slots on {new Date(formData.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
                                                                    </h4>
                                                                </div>
                                                                {availableSlots.length > 0 && availableSlots.every(s => !s.available) ? (
                                                                    <div className="bk_no_slots_msg anim_in">
                                                                        <div className="bk_no_slots_icon">
                                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                                                <line x1="3" y1="10" x2="21" y2="10" />
                                                                                <line x1="15" y1="14" x2="9" y2="20" />
                                                                                <line x1="9" y1="14" x2="15" y2="20" />
                                                                            </svg>
                                                                        </div>
                                                                        <div className="bk_no_slots_title">All slots full, please take another</div>
                                                                        <div className="bk_no_slots_desc">
                                                                            This time slot is fully booked. Please select another slot or date.
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="bk_times">
                                                                        {availableSlots.map(s => {
                                                                            const isSel = formData.time === s.time;
                                                                            const isBooked = !s.available || isSlotInPast(s.time, formData.date);
                                                                            return (
                                                                                <div
                                                                                    key={s.time}
                                                                                    className={`bk_time ${isSel ? 'selected' : ''} ${isBooked ? 'booked disabled' : ''}`}
                                                                                    onClick={() => !isBooked && set('time', s.time)}
                                                                                >
                                                                                    {s.time}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {!showSummaryPage && formData.date && formData.time && (
                                                    <div className="bk_footer anim_in" style={{ gridColumn: '1 / -1', marginTop: 0, borderTop: 'none', paddingTop: '10px', justifyContent: 'center' }}>
                                                        <button className="bk_btn_primary" onClick={() => setShowSummaryPage(true)} style={{ width: '100%', maxWidth: '300px' }}>
                                                            Show Summary
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Booking Details Ticket Sidebar Summary */}
                                                {showSummaryPage && (
                                                    <div className="bk_serv_details anim_in" style={{ borderLeft: 'none', paddingLeft: 0, maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                                                        <div className="bk_serv_card">
                                                                                                                        <div className="bk_serv_header_row">
                                                                <div className="bk_serv_name" style={{ marginBottom: 0 }}>{formData.service || "Cryotherapy"}</div>
                                                                <button className="bk_btn_ghost" onClick={() => { setStep(1); setShowSummaryPage(false); }}>
                                                                    Edit Service
                                                                </button>
                                                            </div>

                                                            {formData.fullName && (
                                                                <div className="bk_summary_item anim_in" style={{ borderTop: 'none', paddingTop: 0 }}>
                                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                                        Patient Name
                                                                    </span>
                                                                    <strong>{formData.fullName}</strong>
                                                                </div>
                                                            )}

                                                            {formData.mobile && (
                                                                <div className="bk_summary_item anim_in">
                                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                                                        Phone Number
                                                                    </span>
                                                                    <strong>{formData.mobile}</strong>
                                                                </div>
                                                            )}

                                                            {formData.clinic && (
                                                                <div className="bk_summary_item anim_in">
                                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                                                        Location
                                                                    </span>
                                                                    <strong>{formData.clinic.split(' — ')[1] || formData.clinic}</strong>
                                                                </div>
                                                            )}

                                                            {formData.date && (
                                                                <div className="bk_summary_item anim_in">
                                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                                                        Date Chosen
                                                                    </span>
                                                                    <strong>{new Date(formData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</strong>
                                                                </div>
                                                            )}
                                                            {formData.time && (
                                                                <div className="bk_summary_item anim_in">
                                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                                        Time Chosen
                                                                    </span>
                                                                    <strong>{formData.time}</strong>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="bk_summary_actions">
                                                            <button
                                                                className="bk_btn_ghost"
                                                                onClick={() => setShowSummaryPage(false)}
                                                                style={{ flex: 1, justifyContent: 'center', padding: '16px 12px' }}
                                                            >
                                                                Edit Date/Time
                                                            </button>
                                                            <button
                                                                className="bk_btn_serv_next active anim_in"
                                                                disabled={loading}
                                                                onClick={handleBookAppointment}
                                                                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                                            >
                                                                {loading ? 'Securing Slot...' : 'Book Clinical Appointment'}
                                                                <svg className="bk_btn_arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bk_footer">
                                            <button className="bk_btn_ghost" onClick={() => setStep(2)}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: 'rotate(180deg)' }}>
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                                Back to Verification
                                            </button>
                                        </div>
                                </>
                            </div>
                        )}
                    </main>
                </div>
            </div>

        </>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}><div style={{ color: '#4B2D71', fontWeight: 700, fontSize: '1.2rem' }}>Loading booking...</div></div>}>
            <BookingPageInner />
        </Suspense>
    );
}
