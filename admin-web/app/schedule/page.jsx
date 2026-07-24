'use client';

import { API_URL } from '@/config';
import { useState, useEffect, useCallback } from 'react';
import '../patients/dashboard.css';
import './Schedule.css';
import Sidebar from '@/components/Sidebar';

/* ── SVG Icons ── */
const I = ({ d, s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

const ICONS = {
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  cal:     "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  users:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  search:  "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  logout:  "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  info:    "M12 16v-4 M12 8h.01 M12 2a10 10 0 1010 10A10 10 0 0012 2z",
  doc:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  plus:    "M12 5v14M5 12h14",
  trash:   "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2",
  copy:    "M8 17a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H8zM16 9h4a2 2 0 012 2v10a2 2 0 01-2 2H12a2 2 0 01-2-2v-4",
  arrowL:  "M15 19l-7-7 7-7",
  arrowR:  "M9 5l7 7-7 7",
  upload:  "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  download:"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  globe:   "M12 2a10 10 0 1010 10A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
};

const STANDARD_HOURS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM",
  "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM"
];

export default function SchedulePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminUser, setAdminUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Calendar Engine States
  const [currentView, setCurrentView] = useState('month'); // 'month', 'week', 'day'
  const [viewDate, setViewDate] = useState(new Date());    // Month scope anchor
  const [selectedDates, setSelectedDates] = useState([]);  // List of active "YYYY-MM-DD" dates
  const [multiSelectMode, setMultiSelectMode] = useState(true); // Default true for flexible date setup
  const [searchDateInput, setSearchDateInput] = useState('');

  // Data States
  const [schedules, setSchedules] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  // Slots Editor Config States
  const [activeSlots, setActiveSlots] = useState([...STANDARD_HOURS]);
  const [slotDuration, setSlotDuration] = useState(30); // 10, 15, 20, 30, 45, 60
  const [slotBuffer, setSlotBuffer] = useState(0);
  const [maxAppointments, setMaxAppointments] = useState(1);
  const [lunchStart, setLunchStart] = useState('01:00 PM');
  const [lunchEnd, setLunchEnd] = useState('02:00 PM');
  const [breakStart, setBreakStart] = useState('11:00 AM');
  const [breakEnd, setBreakEnd] = useState('11:15 AM');
  const [customSlotTime, setCustomSlotTime] = useState('');
  const [isClosed, setIsClosed] = useState(false);

  // Holiday Setup States
  const [holidayName, setHolidayName] = useState('');
  const [holidayType, setHolidayType] = useState('specific-date'); // 'specific-date', 'date-range', 'recurring-yearly', 'recurring-monthly'
  const [bulkHolidaysText, setBulkHolidaysText] = useState(''); // comma-separated YYYY-MM-DDs

  // Schedule Clipboard
  const [scheduleClipboard, setScheduleClipboard] = useState(null);

  const [busy, setBusy] = useState(false);

  // Custom Modal dialogs
  const [modalConfig, setModalConfig] = useState(null);

  const triggerAlert = (message) => {
    setModalConfig({ type: 'alert', message, onConfirm: () => setModalConfig(null) });
  };

  const triggerSuccess = (message) => {
    setModalConfig({ type: 'success', message, onConfirm: () => setModalConfig(null) });
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

  const CLINICS = [
    "West Chemist — Northampton Clinic",
    "West Chemist — Online Virtual Clinic"
  ];

  const [selectedBranch, setSelectedBranch] = useState("West Chemist — Northampton Clinic");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 800);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch Schedules, Holidays, and Bookings
  const fetchAllData = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) { window.location.replace('/admin'); return; }

    try {
      setLoading(true);
      // Fetch schedules & holidays
      const res = await fetch(`${API_URL}/api/schedule?branch=${encodeURIComponent(selectedBranch)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSchedules(data.schedules || []);
        setHolidays(data.holidays || []);
      }

      // Fetch bookings to display fully booked cells
      const apptsRes = await fetch(`${API_URL}/api/appointments/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const apptsData = await apptsRes.json();
      if (apptsData.success) {
        setAppointments(apptsData.appointments || apptsData.data || []);
      }
    } catch (err) {
      console.error(err);
      setError('Connection failure loading schedules.');
    } finally {
      setLoading(false);
    }
  }, [selectedBranch]);

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (user) setAdminUser(JSON.parse(user));
    fetchAllData();
  }, [fetchAllData]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.replace('/admin');
  };

  // Helper to format date objects to local "YYYY-MM-DD"
  const formatDateString = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Handle Date Selection (multi-select / range / single)
  const handleDateClick = (dateStr) => {
    if (multiSelectMode) {
      if (selectedDates.includes(dateStr)) {
        setSelectedDates(prev => prev.filter(d => d !== dateStr));
      } else {
        setSelectedDates(prev => [...prev, dateStr]);
      }
    } else {
      setSelectedDates([dateStr]);
    }
  };

  // Select a whole column (e.g. all Mondays in month)
  const handleSelectDayOfWeek = (dayIndex) => {
    const datesInMonth = [];
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dObj = new Date(year, month, day);
      if (dObj.getDay() === dayIndex) {
        datesInMonth.push(formatDateString(dObj));
      }
    }

    // Toggle logic: if all are selected, unselect them; else select all
    const allSelected = datesInMonth.every(d => selectedDates.includes(d));
    if (allSelected) {
      setSelectedDates(prev => prev.filter(d => !datesInMonth.includes(d)));
    } else {
      setSelectedDates(prev => [...new Set([...prev, ...datesInMonth])]);
    }
  };

  // Select all Saturdays & Sundays in current viewed month
  const handleSelectWeekends = () => {
    const datesInMonth = [];
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dObj = new Date(year, month, day);
      const dayOfWeek = dObj.getDay(); // 0 = Sunday, 6 = Saturday
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        datesInMonth.push(formatDateString(dObj));
      }
    }

    const allSelected = datesInMonth.every(d => selectedDates.includes(d));
    if (allSelected) {
      setSelectedDates(prev => prev.filter(d => !datesInMonth.includes(d)));
    } else {
      setSelectedDates(prev => [...new Set([...prev, ...datesInMonth])]);
    }
  };

  // Select all Mondays through Fridays in current viewed month
  const handleSelectWeekdays = () => {
    const datesInMonth = [];
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dObj = new Date(year, month, day);
      const dayOfWeek = dObj.getDay(); // 1-5 = Mon-Fri
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        datesInMonth.push(formatDateString(dObj));
      }
    }

    const allSelected = datesInMonth.every(d => selectedDates.includes(d));
    if (allSelected) {
      setSelectedDates(prev => prev.filter(d => !datesInMonth.includes(d)));
    } else {
      setSelectedDates(prev => [...new Set([...prev, ...datesInMonth])]);
    }
  };

  // Clear all selected dates
  const handleClearAllSelected = () => {
    setSelectedDates([]);
  };

  // Month navigation
  const changeMonth = (direction) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + direction, 1));
  };

  // Search/Jump to date
  const handleSearchDate = () => {
    if (!searchDateInput) return;
    const dateObj = new Date(searchDateInput);
    if (!isNaN(dateObj.getTime())) {
      setViewDate(dateObj);
      setSelectedDates([searchDateInput]);
    }
  };

  // Bulk Holiday Action
  const handleMarkHolidays = async () => {
    if (selectedDates.length === 0 && !bulkHolidaysText) {
      triggerAlert('Select dates on the calendar or paste bulk dates to mark holidays.');
      return;
    }

    setBusy(true);
    const token = localStorage.getItem('adminToken');

    // Compile dates list
    let datesList = [...selectedDates];
    if (bulkHolidaysText) {
      const parsed = bulkHolidaysText.split(',').map(d => d.trim()).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d));
      datesList = [...new Set([...datesList, ...parsed])];
    }

    const payload = datesList.map(dObjStr => {
      const parts = dObjStr.split('-');
      return {
        holidayType: holidayType,
        startDateStr: dObjStr,
        month: parseInt(parts[1], 10) - 1,
        day: parseInt(parts[2], 10),
        name: holidayName || 'Clinic Holiday'
      };
    });

    try {
      const res = await fetch(`${API_URL}/api/schedule/holiday-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ holidays: payload, branch: selectedBranch })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Selected holidays successfully blocked!');
        setHolidayName('');
        setBulkHolidaysText('');
        setSelectedDates([]);
        fetchAllData();
      } else {
        triggerAlert(data.message || 'Failed to save holidays');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Error saving holidays');
    } finally {
      setBusy(false);
    }
  };

  // Remove holidays
  const handleRemoveHolidays = async () => {
    if (selectedDates.length === 0) {
      triggerAlert('Select dates on the calendar to unblock holidays.');
      return;
    }
    setBusy(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/schedule/holiday-remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ dates: selectedDates, branch: selectedBranch })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Selected holidays successfully unblocked!');
        setSelectedDates([]);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Error unblocking holidays');
    } finally {
      setBusy(false);
    }
  };

  // Generate Slots dynamically
  const handleGenerateSlots = () => {
    // Simple parser
    const parseTimeToMin = (t) => {
      const match = t.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
      if (!match) return 0;
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };

    const formatMinToTime = (min) => {
      let h = Math.floor(min / 60);
      const m = min % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      if (h > 12) h -= 12;
      if (h === 0) h = 12;
      return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')} ${ampm}`;
    };

    const startMin = parseTimeToMin("09:00 AM");
    const endMin = parseTimeToMin("06:00 PM");
    const lunchS = parseTimeToMin(lunchStart);
    const lunchE = parseTimeToMin(lunchEnd);
    const breakS = parseTimeToMin(breakStart);
    const breakE = parseTimeToMin(breakEnd);

    const generated = [];
    let current = startMin;
    const step = parseInt(slotDuration, 10);
    const gap = parseInt(slotBuffer, 10);

    while (current + step <= endMin) {
      const duringLunch = current >= lunchS && current < lunchE;
      const duringBreak = current >= breakS && current < breakE;
      if (!duringLunch && !duringBreak) {
        generated.push(formatMinToTime(current));
      }
      current += step + gap;
    }
    setActiveSlots(generated);
    triggerSuccess(`Generated ${generated.length} slots based on work hours.`);
  };

  // Add manual time slot
  const handleAddCustomSlot = () => {
    if (!customSlotTime) return;
    // Format check (HH:MM AM/PM)
    const match = customSlotTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) {
      alert('Please enter slot in valid format: e.g. "09:15 AM" or "02:45 PM"');
      return;
    }
    let h = parseInt(match[1], 10);
    const m = match[2];
    const ampm = match[3].toUpperCase();
    const paddedH = String(h).padStart(2, '0');
    const slotString = `${paddedH}:${m} ${ampm}`;
    
    if (activeSlots.includes(slotString)) {
      alert('Slot already exists in active list.');
      return;
    }
    setActiveSlots(prev => [...prev, slotString].sort((a, b) => {
      const getMin = (t) => {
        const p = t.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
        let hr = parseInt(p[1], 10);
        if (p[3].toUpperCase() === 'PM' && hr < 12) hr += 12;
        if (p[3].toUpperCase() === 'AM' && hr === 12) hr = 0;
        return hr * 60 + parseInt(p[2], 10);
      };
      return getMin(a) - getMin(b);
    }));
    setCustomSlotTime('');
  };

  // Delete individual slot
  const handleDeleteSlot = (slot) => {
    setActiveSlots(prev => prev.filter(s => s !== slot));
  };

  // Open/Close Clinic bulk overrides
  const handleClinicOpenClose = async (statusClosed) => {
    if (selectedDates.length === 0) {
      triggerAlert('Select dates on the calendar first.');
      return;
    }
    const approved = await triggerConfirm(`Are you sure you want to set clinic status to ${statusClosed ? 'Closed' : 'Open'} for selected dates?`);
    if (!approved) return;

    setBusy(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/schedule/clinic-toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ dates: selectedDates, isClosed: statusClosed, branch: selectedBranch })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess(`Clinic successfully ${statusClosed ? 'Closed' : 'Opened'}!`);
        setSelectedDates([]);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Error updating clinic open/closed settings');
    } finally {
      setBusy(false);
    }
  };

  // Save Config Slots to database
  const handleSaveSchedules = async (targetType) => {
    if (selectedDates.length === 0 && targetType === 'specific-date') {
      triggerAlert('Select dates on the calendar to apply schedules.');
      return;
    }

    setBusy(true);
    const token = localStorage.getItem('adminToken');

    const payload = {
      slots: activeSlots,
      duration: slotDuration,
      buffer: slotBuffer,
      maxAppointments,
      lunchStart,
      lunchEnd,
      breakStart,
      breakEnd,
      isClosed: isClosed,
      branch: selectedBranch
    };

    if (targetType === 'default') {
      payload.applyToAll = true;
    } else if (targetType === 'specific-date') {
      payload.dates = selectedDates;
    } else if (targetType === 'weekly') {
      // Map selected dates to their dayOfWeek representation
      const wd = selectedDates.map(dStr => new Date(dStr).getDay());
      payload.weeklyDays = [...new Set(wd)];
    } else if (targetType === 'monthly') {
      const md = selectedDates.map(dStr => new Date(dStr).getDate());
      payload.monthlyDays = [...new Set(md)];
    }

    try {
      const res = await fetch(`${API_URL}/api/schedule/bulk-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Schedule configurations successfully applied!');
        setSelectedDates([]);
        fetchAllData();
      } else {
        triggerAlert(data.message || 'Error saving configurations');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Error saving schedules to database.');
    } finally {
      setBusy(false);
    }
  };

  // Copy / Clipboard Functions
  const handleCopyClipboard = () => {
    setScheduleClipboard({
      slots: activeSlots,
      duration: slotDuration,
      buffer: slotBuffer,
      maxAppointments,
      lunchStart,
      lunchEnd,
      breakStart,
      breakEnd,
      isClosed
    });
    triggerSuccess('Copied active schedule configurations to clipboard!');
  };

  const handlePasteClipboard = () => {
    if (!scheduleClipboard) {
      triggerAlert('No schedule template copied. Click Copy Timing template first.');
      return;
    }
    setActiveSlots(scheduleClipboard.slots);
    setSlotDuration(scheduleClipboard.duration);
    setSlotBuffer(scheduleClipboard.buffer);
    setMaxAppointments(scheduleClipboard.maxAppointments);
    setLunchStart(scheduleClipboard.lunchStart);
    setLunchEnd(scheduleClipboard.lunchEnd);
    setBreakStart(scheduleClipboard.breakStart);
    setBreakEnd(scheduleClipboard.breakEnd);
    setIsClosed(scheduleClipboard.isClosed);
    triggerSuccess('Pasted schedule template to editor slots successfully!');
  };

  // Clear Overrides
  const handleClearSchedules = async (all) => {
    const confirmation = all 
      ? 'Are you sure you want to clear ALL overrides and holidays? This resets the calendar to default.'
      : 'Are you sure you want to clear overrides for selected dates?';
    const approved = await triggerConfirm(confirmation);
    if (!approved) return;

    setBusy(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/schedule/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          clearAllOverrides: !!all,
          dates: selectedDates,
          branch: selectedBranch
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccess('Schedules successfully cleared!');
        setSelectedDates([]);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Failed to clear schedules');
    } finally {
      setBusy(false);
    }
  };

  // Import / Export JSON Schedule Database Backup
  const handleExportBackup = () => {
    const backupData = JSON.stringify({ schedules, holidays }, null, 2);
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `west-chemist-schedule-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    triggerSuccess('Schedules configurations exported successfully.');
  };

  const handleImportBackup = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.schedules || !parsed.holidays) {
          triggerAlert('Invalid backup schema. schedules and holidays are required.');
          return;
        }

        const approved = await triggerConfirm('Importing database will overwrite all your current configurations. Do you want to proceed?');
        if (!approved) return;
        
        setBusy(true);
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${API_URL}/api/schedule/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ...parsed, branch: selectedBranch })
        });
        const data = await res.json();
        if (data.success) {
          triggerSuccess('Schedules successfully restored from JSON backup!');
          fetchAllData();
        }
      } catch (err) {
        triggerAlert('Failed parsing JSON file: ' + err.message);
      } finally {
        setBusy(false);
      }
    };
    reader.readAsText(file);
  };

  // Render Calendar Grid Helper
  const renderCalendarMonth = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    // Normalize index so Monday is 0, Sunday is 6
    const adjustedFirstIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const totalDays = new Date(year, month + 1, 0).getDate();

    const cells = [];

    // Empty buffer cells for starting weekday
    for (let i = 0; i < adjustedFirstIndex; i++) {
      cells.push(<div key={`empty-${i}`} className="cal_cell empty"></div>);
    }

    // Days cells
    for (let day = 1; day <= totalDays; day++) {
      const dateObj = new Date(year, month, day);
      const dStr = formatDateString(dateObj);
      const isSelected = selectedDates.includes(dStr);

      // Check Holiday Status
      let isHoliday = false;
      let labelHoliday = '';
      const holidayMatch = holidays.find(h => {
        if (h.holidayType === 'specific-date' && h.startDateStr === dStr) return true;
        if (h.holidayType === 'date-range' && dStr >= h.startDateStr && dStr <= (h.endDateStr || h.startDateStr)) return true;
        if (h.holidayType === 'recurring-yearly' && h.month === month && h.day === day) return true;
        if (h.holidayType === 'recurring-monthly' && h.day === day) return true;
        return false;
      });
      if (holidayMatch) {
        isHoliday = true;
        labelHoliday = holidayMatch.name;
      }

      // Check Schedule Override / Closed status
      let scheduleClosed = false;
      let scheduleSlotsCount = null;

      const specificDateSch = schedules.find(s => s.scheduleType === 'specific-date' && s.dateStr === dStr);
      const yearlySch = schedules.find(s => s.scheduleType === 'yearly' && s.month === month && s.day === day);
      const monthlySch = schedules.find(s => s.scheduleType === 'monthly' && s.dayOfMonth === day);
      const weeklySch = schedules.find(s => s.scheduleType === 'weekly' && s.dayOfWeek === dateObj.getDay());
      const defaultSch = schedules.find(s => s.scheduleType === 'default');

      const matchedSch = specificDateSch || yearlySch || monthlySch || weeklySch || defaultSch;
      if (matchedSch) {
        scheduleClosed = matchedSch.isClosed;
        scheduleSlotsCount = matchedSch.slots ? matchedSch.slots.length : null;
      }

      // Check Fully Booked Status (Compare active slots to appointment count)
      let isFullyBooked = false;
      if (!scheduleClosed && !isHoliday && scheduleSlotsCount !== null) {
        const slotsCapacityLimit = matchedSch.maxAppointments || 1;
        const totalAvailCount = scheduleSlotsCount * slotsCapacityLimit;
        
        // Count bookings for this day
        const dayBookings = appointments.filter(appt => appt.date === dStr && appt.status !== 'cancelled' && appt.status !== 'rejected');
        if (dayBookings.length >= totalAvailCount && totalAvailCount > 0) {
          isFullyBooked = true;
        }
      }

      // Select style class
      let cellClass = 'cal_cell';
      let badgeLabel = '';
      let isOpenDay = false;
      if (isHoliday) {
        cellClass += ' holiday_blocked';
        badgeLabel = labelHoliday || 'Holiday';
      } else if (scheduleClosed) {
        cellClass += ' clinic_closed';
        badgeLabel = 'Clinic Closed';
      } else if (isFullyBooked) {
        cellClass += ' fully_booked';
        badgeLabel = 'Fully Booked';
      } else {
        cellClass += ' open_day';
        isOpenDay = true;
        badgeLabel = `${scheduleSlotsCount !== null ? scheduleSlotsCount : 16}`;
      }

      if (isSelected) cellClass += ' selected';

      cells.push(
        <div 
          key={dStr} 
          className={cellClass} 
          onClick={() => handleDateClick(dStr)}
        >
          <span className="day_num">{day}</span>
          <span className="cell_badge">
            {isOpenDay ? (
              <>
                <span className="badge_count">{badgeLabel}</span>
                <span className="badge_text"> slots</span>
              </>
            ) : (
              <span className="badge_text">{badgeLabel}</span>
            )}
          </span>
        </div>
      );
    }

    return cells;
  };

  const weekdaysHeader = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="dash">
      {/* ══ SIDEBAR ══ */}
      <Sidebar activePage="schedule" />

      {/* ══ MAIN WORKSPACE ══ */}
      <div className="dash_main">
        {/* Header */}
        <header className="dash_hdr">
          <div className="dash_hdr_left">
            <h2>Dynamic Operational Calendar & Schedules</h2>
            <p>Google Calendar-inspired scheduler to manage holiday blocks, durations, buffers, and slots templates.</p>
          </div>
          <div className="dash_hdr_right">
            <div className="backup_tools">
              <button className="bk_btn_secondary" onClick={handleExportBackup} title="Export database backup JSON" style={{ width: 'auto', padding: '8px 14px' }}>
                <I d={ICONS.download} s={14} /> Export Backup
              </button>
              <label className="bk_btn_secondary file_label" title="Restore database from JSON backup" style={{ width: 'auto', padding: '8px 14px', cursor: 'pointer' }}>
                <I d={ICONS.upload} s={14} /> Import Backup
                <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        </header>

        {/* Branch Selector Bar */}
        <div className="branch_select_bar">
          <label className="form_label" style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: 'var(--t1)' }}>
            Select Clinic Location Branch:
          </label>
          <select 
            className="bk_input" 
            style={{ maxWidth: '340px' }}
            value={selectedBranch} 
            onChange={e => {
              setSelectedBranch(e.target.value);
              setSelectedDates([]);
            }}
          >
            {CLINICS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="details_page_loading">
            <span className="spin" />
            <span>Loading schedule config...</span>
          </div>
        ) : (
          <div className="details_workspace_grid">
            
            {/* COLUMN 1: INTERACTIVE MODERN CALENDAR GRID */}
            <div className="details_left_column" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="details_pane_card calendar_container_card">
                {/* Calendar Header Tools */}
                <div className="cal_header_row">
                  <div className="cal_nav_cluster">
                    <button className="cal_arrow_btn" onClick={() => changeMonth(-1)}><I d={ICONS.arrowL} s={16} /></button>
                    <h4>{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                    <button className="cal_arrow_btn" onClick={() => changeMonth(1)}><I d={ICONS.arrowR} s={16} /></button>
                    <button className="cal_today_btn" onClick={() => setViewDate(new Date())}>Today</button>
                  </div>
                  
                  <div className="cal_options_cluster">
                    <div className="cal_search_box">
                      <input 
                        type="date" 
                        value={searchDateInput} 
                        onChange={e => setSearchDateInput(e.target.value)} 
                        placeholder="Jump to date"
                      />
                      <button onClick={handleSearchDate}><I d={ICONS.search} s={14} /></button>
                    </div>
                    
                    <button 
                      className={multiSelectMode ? 'bk_btn_primary' : 'bk_btn_secondary'} 
                      onClick={() => {
                        setMultiSelectMode(!multiSelectMode);
                        setSelectedDates([]);
                      }}
                      style={{ width: 'auto', padding: '8px 16px' }}
                    >
                      {multiSelectMode ? 'Multi-Select Active' : 'Single-Select Mode'}
                    </button>
                  </div>
                </div>

                {/* Quick Selection Helpers */}
                <div className="quick_select_row" style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '4px' }}>
                    Quick Select:
                  </span>
                  <button type="button" className="cal_today_btn" onClick={handleSelectWeekends} style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}>
                    Saturdays & Sundays (Weekends)
                  </button>
                  <button type="button" className="cal_today_btn" onClick={handleSelectWeekdays} style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}>
                    Weekdays (Mon-Fri)
                  </button>
                  <button type="button" className="cal_today_btn btn_reset" onClick={handleClearAllSelected} style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}>
                    Clear Selection
                  </button>
                </div>

                {/* Day of Week Label Header */}
                <div className="cal_weekdays_grid">
                  {weekdaysHeader.map((w, idx) => (
                    <div 
                      key={w} 
                      className="weekday_header" 
                      onClick={() => handleSelectDayOfWeek(idx === 6 ? 0 : idx + 1)}
                      title={`Click to toggle all ${w}s in current month`}
                    >
                      {w}
                    </div>
                  ))}
                </div>

                {/* Main Days Grid */}
                <div className="cal_days_grid">
                  {renderCalendarMonth()}
                </div>

                {/* Calendar Color Codes Legend */}
                <div className="cal_legend_row">
                  <div className="legend_item"><span className="legend_dot open" /> Open Slots</div>
                  <div className="legend_item"><span className="legend_dot closed" /> Clinic Closed</div>
                  <div className="legend_item"><span className="legend_dot holiday" /> Blocked Holiday</div>
                  <div className="legend_item"><span className="legend_dot booked" /> Fully Booked</div>
                </div>
              </div>

              {/* Bulk Holiday Range / Custom Holiday Block */}
              <div className="details_pane_card">
                <h3>Bulk Holiday Block & Range Management</h3>
                <p className="pane_help">Block single dates, ranges, or custom recurring templates directly on the calendar.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '15px', marginTop: '14px' }}>
                  <div>
                    <label className="form_label">Holiday Reason / Label</label>
                    <input 
                      className="bk_input" 
                      type="text" 
                      value={holidayName} 
                      onChange={e => setHolidayName(e.target.value)} 
                      placeholder="e.g. Christmas Day, Clinic Outage"
                    />
                  </div>

                  <div>
                    <label className="form_label">Holiday Occurrence Type</label>
                    <select 
                      className="bk_input" 
                      value={holidayType} 
                      onChange={e => setHolidayType(e.target.value)}
                    >
                      <option value="specific-date">Specific Selected Date(s) Only</option>
                      <option value="date-range">Custom Range Block</option>
                      <option value="recurring-yearly">Recurring Yearly (Every year this day)</option>
                      <option value="recurring-monthly">Recurring Monthly (Every month this day)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '14px' }}>
                  <label className="form_label">Paste Bulk Holiday Dates (Comma-separated YYYY-MM-DD)</label>
                  <textarea 
                    className="bk_input" 
                    rows={2} 
                    value={bulkHolidaysText} 
                    onChange={e => setBulkHolidaysText(e.target.value)}
                    placeholder="e.g. 2026-07-04, 2026-07-15, 2026-08-30"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '16px' }}>
                  <button 
                    className="bk_btn_primary btn_holiday" 
                    onClick={handleMarkHolidays}
                    disabled={busy}
                  >
                    Block Holiday Status
                  </button>
                  <button 
                    className="bk_btn_primary btn_unblock" 
                    onClick={handleRemoveHolidays}
                    disabled={busy}
                  >
                    Unblock Selected Dates
                  </button>
                </div>
              </div>

            </div>

            {/* COLUMN 2: TIME SLOT & CAPACITY TEMPLATE SETTINGS */}
            <div className="details_right_column" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="details_pane_card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3>Time Slots Configuration</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="mini_action_btn" onClick={handleCopyClipboard} title="Copy config to template"><I d={ICONS.copy} s={12} /></button>
                    <button className="mini_action_btn" onClick={handlePasteClipboard} title="Paste template config"><I d={ICONS.plus} s={12} /></button>
                  </div>
                </div>
                
                <div className="date_selected_banner">
                  <strong>Selected Dates ({selectedDates.length}):</strong>
                  <div className="selected_dates_tags">
                    {selectedDates.slice(0, 5).map(d => <span key={d} className="date_tag">{d}</span>)}
                    {selectedDates.length > 5 && <span className="date_tag">+{selectedDates.length - 5} more</span>}
                    {selectedDates.length === 0 && <span className="no_dates">Click days on calendar to select</span>}
                  </div>
                </div>

                {/* Clinic Status Toggles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <button className="bk_btn_primary btn_open" onClick={() => handleClinicOpenClose(false)}>
                    Open Clinic
                  </button>
                  <button className="bk_btn_primary btn_close" onClick={() => handleClinicOpenClose(true)}>
                    Close Clinic
                  </button>
                </div>

                {/* Duration & Buffer settings */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div>
                    <label className="form_label">Slot Duration</label>
                    <select className="bk_input" value={slotDuration} onChange={e => setSlotDuration(parseInt(e.target.value))}>
                      <option value={10}>10 Mins</option>
                      <option value={15}>15 Mins</option>
                      <option value={20}>20 Mins</option>
                      <option value={30}>30 Mins</option>
                      <option value={45}>45 Mins</option>
                      <option value={60}>60 Mins</option>
                    </select>
                  </div>

                  <div>
                    <label className="form_label">Buffer Time</label>
                    <select className="bk_input" value={slotBuffer} onChange={e => setSlotBuffer(parseInt(e.target.value))}>
                      <option value={0}>No Buffer</option>
                      <option value={5}>5 Mins</option>
                      <option value={10}>10 Mins</option>
                      <option value={15}>15 Mins</option>
                    </select>
                  </div>

                  <div>
                    <label className="form_label">Max Capacity</label>
                    <input className="bk_input" type="number" min={1} value={maxAppointments} onChange={e => setMaxAppointments(parseInt(e.target.value))} />
                  </div>
                </div>

                {/* Lunch & Break config */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div>
                    <label className="form_label">Lunch Break Start</label>
                    <input className="bk_input" type="text" value={lunchStart} onChange={e => setLunchStart(e.target.value)} placeholder="01:00 PM" />
                  </div>
                  <div>
                    <label className="form_label">Lunch Break End</label>
                    <input className="bk_input" type="text" value={lunchEnd} onChange={e => setLunchEnd(e.target.value)} placeholder="02:00 PM" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div>
                    <label className="form_label">Short Break Start</label>
                    <input className="bk_input" type="text" value={breakStart} onChange={e => setBreakStart(e.target.value)} placeholder="11:00 AM" />
                  </div>
                  <div>
                    <label className="form_label">Short Break End</label>
                    <input className="bk_input" type="text" value={breakEnd} onChange={e => setBreakEnd(e.target.value)} placeholder="11:15 AM" />
                  </div>
                </div>

                <button className="generate_slots_btn" onClick={handleGenerateSlots}>
                  Generate Slots from Working Hours (09 AM - 06 PM)
                </button>

                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />

                {/* Active Slots list & Manual Add */}
                <label className="form_label">Active Configured Slots</label>
                <div className="slots_editor_grid">
                  {activeSlots.map(s => (
                    <div key={s} className="slot_editor_bubble">
                      <span>{s}</span>
                      <button className="del_slot_btn" onClick={() => handleDeleteSlot(s)}>&times;</button>
                    </div>
                  ))}
                  {activeSlots.length === 0 && <div className="no_slots_placeholder">No time slots added. Generate or add manually.</div>}
                </div>

                <div className="add_custom_slot_row" style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <input 
                    type="text" 
                    className="bk_input" 
                    value={customSlotTime} 
                    onChange={e => setCustomSlotTime(e.target.value)}
                    placeholder="e.g. 09:15 AM"
                  />
                  <button className="bk_btn_primary" style={{ width: 'auto', padding: '10px 16px' }} onClick={handleAddCustomSlot}>Add Slot</button>
                </div>

                {/* Apply buttons */}
                <div style={{ marginTop: '20px' }}>
                  <label className="form_label">Apply Timing Configuration & Save</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <button className="bk_btn_primary" onClick={() => handleSaveSchedules('specific-date')} disabled={busy || selectedDates.length === 0}>
                      Apply to Selected Dates
                    </button>
                    <button className="bk_btn_primary" onClick={() => handleSaveSchedules('default')} disabled={busy}>
                      Save as Default Template
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                     <button className="bk_btn_primary btn_weekly" onClick={() => handleSaveSchedules('weekly')} disabled={busy || selectedDates.length === 0}>
                       Apply as Weekly Template
                     </button>
                     <button className="bk_btn_primary btn_monthly" onClick={() => handleSaveSchedules('monthly')} disabled={busy || selectedDates.length === 0}>
                       Apply as Monthly Template
                     </button>
                  </div>
                </div>

                {/* Clear options */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                   <button className="bk_btn_secondary" onClick={() => handleClearSchedules(false)} disabled={busy || selectedDates.length === 0}>
                     Clear Overrides
                   </button>
                    <button className="bk_btn_secondary btn_reset" onClick={() => handleClearSchedules(true)} disabled={busy}>
                      Reset Calendar
                    </button>
                </div>
              </div>
          </div>

          </div>
        )}
      </div>

      {/* ══ CUSTOM POPUP MODAL ══ */}
      {modalConfig && (
        <div className="custom_modal_overlay">
          <div className="custom_modal_box">
            <div className="modal_icon_circle">
              {modalConfig.type === 'confirm' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--purple)' }}>
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              ) : modalConfig.type === 'success' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#10b981' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#be123c' }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
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
