'use client';

import { API_URL } from '@/config';
import { useState, useEffect, useCallback, useMemo } from 'react';
import './dashboard.css';
import Sidebar from '@/components/Sidebar';

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
  chevR:   "M9 18l6-6-6-6",
  chevL:   "M15 18l-6-6 6-6",
  filter:  "M22 3H2l8 9.46V19l4 2v-8.54L22 3",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15",
  check:   "M20 6L9 17l-5-5",
  doc:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  info:    "M12 16v-4 M12 8h.01 M12 2a10 10 0 1010 10A10 10 0 0012 2z",
  globe:   "M12 2a10 10 0 1010 10A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
};

/* ─ Doctor Illustration SVG ─ */
const DoctorSVG = () => (
  <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
    {/* body */}
    <ellipse cx="90" cy="145" rx="50" ry="28" fill="rgba(255,255,255,0.12)"/>
    <rect x="62" y="90" width="56" height="65" rx="16" fill="rgba(255,255,255,0.18)"/>
    {/* stethoscope */}
    <path d="M80 110 Q75 125 82 130 Q89 135 92 128" stroke="rgba(52,211,153,0.8)" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <circle cx="93" cy="126" r="5" fill="rgba(52,211,153,0.8)"/>
    {/* coat lines */}
    <path d="M80 92 L76 140 M100 92 L104 140" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
    {/* head */}
    <circle cx="90" cy="68" r="26" fill="rgba(255,255,255,0.25)"/>
    <circle cx="90" cy="68" r="22" fill="rgba(255,255,255,0.2)"/>
    {/* face features */}
    <circle cx="83" cy="65" r="2.5" fill="rgba(255,255,255,0.7)"/>
    <circle cx="97" cy="65" r="2.5" fill="rgba(255,255,255,0.7)"/>
    <path d="M84 75 Q90 80 96 75" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* hair */}
    <path d="M66 62 Q70 44 90 42 Q110 44 114 62" fill="rgba(255,255,255,0.18)"/>
    {/* cross badge */}
    <rect x="106" y="98" width="22" height="22" rx="6" fill="rgba(52,211,153,0.3)" stroke="rgba(52,211,153,0.5)" strokeWidth="1.5"/>
    <path d="M117 104 L117 114 M112 109 L122 109" stroke="rgba(52,211,153,0.9)" strokeWidth="2.5" strokeLinecap="round"/>
    {/* floating pills */}
    <ellipse cx="145" cy="60" rx="10" ry="5" rx2="10" fill="rgba(255,255,255,0.15)" transform="rotate(-30 145 60)"/>
    <ellipse cx="40" cy="90" rx="8" ry="4" fill="rgba(167,243,208,0.2)" transform="rotate(20 40 90)"/>
    <circle cx="152" cy="110" r="5" fill="rgba(255,255,255,0.12)"/>
    <circle cx="35" cy="55" r="4" fill="rgba(167,243,208,0.15)"/>
  </svg>
);

/* ─ Area Chart SVG ─ */
const AreaChart = ({ appts = [], selectedYear = 2026 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Calculate real bookings for each month
  const monthlyCounts = Array(12).fill(0);
  appts.forEach(appt => {
    if (!appt.date) return;
    const parts = appt.date.split('-');
    if (parts.length >= 2) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      if (year === selectedYear && month >= 0 && month < 12) {
        monthlyCounts[month]++;
      }
    }
  });

  const maxVal = Math.max(...monthlyCounts, 5); // Avoid flat line at zero

  // SVG dimensions
  const width = 560;
  const height = 150;
  const paddingLeft = 40;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 20;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = monthlyCounts.map((v, i) => {
    const x = paddingLeft + (i / 11) * chartWidth;
    const y = (paddingTop + chartHeight) - (v / maxVal) * chartHeight;
    return { x, y, value: v, month: months[i] };
  });

  // Calculate curve
  let linePath = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) / 2;
    const cp1y = p0.y;
    const cp2x = p0.x + (p1.x - p0.x) / 2;
    const cp2y = p1.y;
    linePath += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
  }

  const areaPath = `${linePath} L ${points[points.length - 1].x},130 L ${points[0].x},130 Z`;

  // Default to peak month
  const peakIndex = monthlyCounts.indexOf(Math.max(...monthlyCounts));
  const activeIdx = hoveredIndex !== null ? hoveredIndex : peakIndex;
  const activePt = points[activeIdx];

  // Tooltip dimensions
  const tooltipWidth = 110;
  const tooltipHeight = 26;
  const tx = activePt.x - tooltipWidth / 2;
  const ty = activePt.y - 35;

  return (
    <svg width="100%" height="150" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="g_em" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#206b5e" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#206b5e" stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      
      {/* Grid lines */}
      {[35, 70, 105, 130].map(y => (
        <line key={y} x1="0" y1={y} x2={width} y2={y} stroke="#eaf4f2" strokeWidth="0.8" strokeDasharray="3,3" />
      ))}
      
      {/* Dynamic Highlight Peak Capsule & Dashed line */}
      <rect 
        x={activePt.x - 15} 
        y={15} 
        width={30} 
        height={115} 
        rx={15} 
        fill="rgba(32, 107, 94, 0.05)" 
        className="chart_peak_capsule" 
        style={{ transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
      />
      <line 
        x1={activePt.x} 
        y1={15} 
        x2={activePt.x} 
        y2={130} 
        stroke="#206b5e" 
        strokeOpacity="0.3" 
        strokeWidth="1.5" 
        strokeDasharray="4,3" 
        style={{ transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
      />

      {/* Area fill */}
      <path d={areaPath} fill="url(#g_em)" style={{ transition: 'all 0.3s ease' }} />
        
      {/* Main path line */}
      <path d={linePath} stroke="#206b5e" strokeWidth="2.8" fill="none" strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />

      {/* Dots markers */}
      {points.map((pt, i) => (
        <circle 
          key={i} 
          cx={pt.x} 
          cy={pt.y} 
          r={i === activeIdx ? 5 : 3.5} 
          fill="#fff" 
          stroke="#206b5e" 
          strokeWidth={i === activeIdx ? 3 : 2} 
          style={{ transition: 'all 0.2s ease' }}
        />
      ))}
      
      {/* Glowing pulse ring on active dot */}
      <circle 
        className="chart_pulse_ring" 
        cx={activePt.x} 
        cy={activePt.y} 
        r="12" 
        fill="none" 
        stroke="#206b5e" 
        strokeOpacity="0.4" 
        strokeWidth="1.5" 
        style={{ 
          transformOrigin: `${activePt.x}px ${activePt.y}px`,
          transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      />

      {/* Tooltip Group */}
      <g 
        className="chart_tooltip_grp" 
        style={{ 
          cursor: 'pointer',
          transformOrigin: `${activePt.x}px ${activePt.y}px`,
          transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        <rect 
          x={tx} 
          y={ty} 
          width={tooltipWidth} 
          height={tooltipHeight} 
          rx={6} 
          fill="#1e1b4b" 
          style={{ transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
        <polygon 
          points={`${activePt.x - 6},${ty + tooltipHeight} ${activePt.x + 6},${ty + tooltipHeight} ${activePt.x},${activePt.y - 6}`} 
          fill="#1e1b4b" 
          style={{ transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
        <text 
          x={activePt.x} 
          y={ty + 16} 
          textAnchor="middle" 
          fontSize="9.5" 
          fontWeight="700" 
          fill="#ffffff"
          style={{ transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
        >
          {activePt.month}: {activePt.value} bookings
        </text>
      </g>

      {/* Interactive Hover Zones */}
      {points.map((pt, i) => (
        <circle
          key={`hover-${i}`}
          cx={pt.x}
          cy={pt.y}
          r="16"
          fill="transparent"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
        />
      ))}
    </svg>
  );
};

/* ─ Donut Chart SVG ─ */
const DonutChart = ({ patients = [] }) => {
  const total = patients.length;
  // Deterministic gender classification
  const maleCount = patients.filter(p => p._id && p._id.charCodeAt(p._id.length - 1) % 2 === 0).length;
  const femaleCount = total - maleCount;

  const malePct = total > 0 ? Math.round((maleCount / total) * 100) : 50;
  const femalePct = total > 0 ? 100 - malePct : 50;

  const r = 52;
  const cx = 70;
  const cy = 70;
  const stroke = 14;
  const circumference = 2 * Math.PI * r; // 326.72

  const maleDash = (malePct / 100) * circumference;
  const maleGap = circumference - maleDash;

  const femaleDash = (femalePct / 100) * circumference;
  const femaleGap = circumference - femaleDash;

  const femaleRotation = -90 + (malePct / 100) * 360;

  return (
    <svg width="140" height="140" className="donut_svg">
      {/* Slice 1 (Blue) - Male */}
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke="#0084f7" strokeWidth={stroke}
        strokeLinecap="round"
        className="donut_slice blue"
        style={{
          '--dash': `${maleDash.toFixed(2)}`,
          '--gap': `${maleGap.toFixed(2)}`,
          transformOrigin: '70px 70px',
          transform: 'rotate(-90deg)'
        }}
      />
      {/* Slice 2 (Yellow) - Female */}
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke="#ffb72a" strokeWidth={stroke}
        strokeLinecap="round"
        className="donut_slice yellow"
        style={{
          '--dash': `${femaleDash.toFixed(2)}`,
          '--gap': `${femaleGap.toFixed(2)}`,
          transformOrigin: '70px 70px',
          transform: `rotate(${femaleRotation.toFixed(2)}deg)`
        }}
      />
      <text x={cx} y={cy-5} textAnchor="middle" fontSize="10" fontWeight="600" fill="#94a3b8">Total Patients</text>
      <text x={cx} y={cy+15} textAnchor="middle" fontSize="22" fontWeight="800" fill="var(--purple)">{total}</text>
    </svg>
  );
};

/* ─ Calendar mini ─ */
const MiniCal = ({ appts = [], holidays = [], onToggleHoliday }) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const today = new Date();
  const m = today.getMonth(); const yr = today.getFullYear();
  const days = new Date(yr, m+1, 0).getDate();
  const start = new Date(yr, m, 1).getDay();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  
  // Group appointments of current month by day
  const dayAppts = {};
  appts.forEach(a => {
    if (!a.date) return;
    const parts = a.date.split('-');
    if (parts.length >= 3) {
      const y = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      if (y === yr && monthIndex === m) {
        const d = parseInt(parts[2], 10);
        if (!dayAppts[d]) dayAppts[d] = [];
        dayAppts[d].push(a);
      }
    }
  });

  const cells = [];
  for(let i=0;i<start;i++) cells.push(<div key={`e${i}`} className="cal_day other"/>);
  
  for(let d=1;d<=days;d++) {
    const dayRecords = dayAppts[d] || [];
    const hasAppt = dayRecords.length > 0;
    const hasApproved = dayRecords.some(r => r.status === 'approved');
    const dateStr = `${yr}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isHoliday = holidays.includes(dateStr);
    
    const colIndex = (start + d - 1) % 7;
    let alignmentClass = 'align_center';
    if (colIndex <= 1) {
      alignmentClass = 'align_left';
    } else if (colIndex >= 5) {
      alignmentClass = 'align_right';
    }
    
    cells.push(
      <div 
        key={d} 
        className={`cal_day${d===today.getDate()?' today':''}${hasAppt?' has_appt':''}${hasApproved?' has_approved':''}${isHoliday?' holiday':''}`}
        style={{ position: 'relative', cursor: 'pointer' }}
        onMouseEnter={() => hasAppt && setHoveredDay(d)}
        onMouseLeave={() => setHoveredDay(null)}
        onClick={() => {
          if (onToggleHoliday) {
            onToggleHoliday(dateStr);
          }
        }}
      >
        <span>{d}</span>
        
        {/* Hover Tooltip Box */}
        {hasAppt && hoveredDay === d && (
          <div className={`cal_day_tooltip ${alignmentClass}`} onClick={(e) => e.stopPropagation()}>
            <div className="cal_tooltip_header">
              {months[m]} {d}, {yr} Appointments
            </div>
            <div className="cal_tooltip_body">
              {dayRecords.map((ap, idx) => (
                <div key={idx} className="cal_tooltip_appt_item">
                  <div className="cal_tooltip_row">
                    <span className={`cal_tooltip_status_dot ${ap.status === 'confirmed' ? 'pending' : ap.status}`} />
                    <span className="cal_tooltip_time">{ap.time}</span>
                  </div>
                  <div className="cal_tooltip_name">
                    {ap.patientId?.fullName 
                      ? ap.patientId.fullName.replace(/\b\w/g, c => c.toUpperCase()) 
                      : 'Patient'}
                  </div>
                  <div className="cal_tooltip_service">{ap.service}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="cal_wrap">
      <div className="cal_hdr" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="cal_month">{months[m]} {yr}</span>
        <span style={{ fontSize: '0.62rem', color: '#94a3b8', background: '#f8fafc', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>Click date to toggle holiday</span>
      </div>
      <div className="cal_days">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=><div key={d} className="cal_day_name">{d}</div>)}
        {cells}
      </div>
    </div>
  );
};

/* ═══════════════════════════
   MAIN PAGE
═══════════════════════════ */
export default function AdminPatientsPage() {
  const [patients,   setPatients]   = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [appts,      setAppts]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [adminUser,  setAdminUser]  = useState(null);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [isMobile, setIsMobile] = useState(false);

  const [currentView, setCurrentView] = useState('dashboard');
  const [holidays, setHolidays] = useState([]);
  const [bulkStart, setBulkStart] = useState('');
  const [bulkEnd, setBulkEnd] = useState('');

  // Custom Modal dialogs & Toasts
  const [modalConfig, setModalConfig] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const triggerAlert = (message) => {
    setModalConfig({ type: 'alert', message, onConfirm: () => setModalConfig(null) });
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

    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view') || 'dashboard';
      setCurrentView(viewParam);
      if (viewParam === 'patients') {
        setTimeout(() => {
          const el = document.querySelector('.dash_table_section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    };
    handleUrlChange();
    // Listen for custom/popstate navigation changes
    window.addEventListener('popstate', handleUrlChange);
    // Periodically poll for URL query updates (since Next.js client routing doesn't always fire popstate on pushState)
    const checkInterval = setInterval(handleUrlChange, 200);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      clearInterval(checkInterval);
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good Morning' : hr < 17 ? 'Good Afternoon' : 'Good Evening';

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const [rP, rA, rH] = await Promise.all([
        fetch(`${API_URL}/api/patients`,               {headers:{Authorization:`Bearer ${token}`}}),
        fetch(`${API_URL}/api/appointments/admin/all`, {headers:{Authorization:`Bearer ${token}`}}),
        fetch(`${API_URL}/api/schedule?branch=${encodeURIComponent(selectedBranch)}`, {headers:{Authorization:`Bearer ${token}`}}),
      ]);
      const dP = await rP.json(); const dA = await rA.json(); const dH = await rH.json();
      if (dP.success) setPatients(dP.data);
      if (dA.success) setAppts(dA.data);
      if (dH.success && dH.holidays) {
        const datesList = dH.holidays
          .filter(h => h.holidayType === 'specific-date')
          .map(h => h.startDateStr);
        setHolidays(datesList);
      }
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [selectedBranch]);

  const toggleHoliday = async (dateStr) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    
    const isBlocked = holidays.includes(dateStr);
    const confirmMsg = isBlocked 
      ? `Remove ${dateStr} from blocked holidays? This will make time slots available again.`
      : `Block ${dateStr} as a clinic holiday? This will prevent patients from booking any slots on this day.`;

    const approved = await triggerConfirm(confirmMsg);
    if (!approved) return;
    
    let newList = isBlocked ? holidays.filter(d => d !== dateStr) : [...holidays, dateStr];
    setHolidays(newList);
    
    try {
      let res;
      if (!isBlocked) {
        const parts = dateStr.split('-');
        const payload = [{
          holidayType: 'specific-date',
          startDateStr: dateStr,
          month: parseInt(parts[1], 10) - 1,
          day: parseInt(parts[2], 10),
          name: 'Clinic Holiday'
        }];
        res = await fetch(`${API_URL}/api/schedule/holiday-bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ holidays: payload, branch: selectedBranch })
        });
      } else {
        res = await fetch(`${API_URL}/api/schedule/holiday-remove`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ dates: [dateStr], branch: selectedBranch })
        });
      }
      
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        triggerAlert(data.message || 'Failed to save holiday');
        fetchData(); // reload on error
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Network error saving holiday');
      fetchData(); // reload on error
    }
  };

  const handleBulkHolidayOverride = async (action) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    if (!bulkStart || !bulkEnd) {
      triggerAlert('Please select both Start Date and End Date for bulk action');
      return;
    }

    const startD = new Date(bulkStart);
    const endD = new Date(bulkEnd);
    if (endD < startD) {
      triggerAlert('End Date must be equal to or after Start Date');
      return;
    }

    const approved = await triggerConfirm(`Are you sure you want to bulk ${action === 'block' ? 'block' : 'unblock'} dates from ${bulkStart} to ${bulkEnd}?`);
    if (!approved) return;

    // Generate dates range in local YYYY-MM-DD
    const rangeDates = [];
    let currentD = new Date(startD);
    while (currentD <= endD) {
      const y = currentD.getFullYear();
      const m = String(currentD.getMonth() + 1).padStart(2, '0');
      const day = String(currentD.getDate()).padStart(2, '0');
      rangeDates.push(`${y}-${m}-${day}`);
      currentD.setDate(currentD.getDate() + 1);
    }

    let newList = [...holidays];
    if (action === 'block') {
      rangeDates.forEach(d => {
        if (!newList.includes(d)) newList.push(d);
      });
    } else {
      newList = newList.filter(d => !rangeDates.includes(d));
    }

    setHolidays(newList);
    setBulkStart('');
    setBulkEnd('');

    try {
      let res;
      if (action === 'block') {
        const payload = rangeDates.map(dObjStr => {
          const parts = dObjStr.split('-');
          return {
            holidayType: 'specific-date',
            startDateStr: dObjStr,
            month: parseInt(parts[1], 10) - 1,
            day: parseInt(parts[2], 10),
            name: 'Clinic Holiday'
          };
        });
        res = await fetch(`${API_URL}/api/schedule/holiday-bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ holidays: payload, branch: selectedBranch })
        });
      } else {
        res = await fetch(`${API_URL}/api/schedule/holiday-remove`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ dates: rangeDates, branch: selectedBranch })
        });
      }
      
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        triggerAlert(data.message || 'Failed to save bulk holidays');
        fetchData();
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Network error saving bulk holidays');
      fetchData();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user  = localStorage.getItem('adminUser');
    if (!token) { window.location.replace('/admin'); return; }
    if (user) setAdminUser(JSON.parse(user));
    
    // Initial fetch
    fetchData();

    // Live update interval (syncs automatically every 8 seconds when new requests arrive)
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, [fetchData]);


  const branchAppts = useMemo(() => appts.filter(a => a.clinic === selectedBranch), [appts, selectedBranch]);

  useEffect(() => {
    const approvedPatientIds = new Set(
      branchAppts
        .filter(a => a.status === 'approved')
        .map(a => typeof a.patientId === 'object' && a.patientId ? a.patientId._id : a.patientId)
        .filter(Boolean)
    );
    const approvedPatients = patients.filter(p => approvedPatientIds.has(p._id));
    const q = search.toLowerCase();
    setFiltered(!q ? approvedPatients : approvedPatients.filter(p =>
      p.fullName?.toLowerCase().includes(q) || p.mobile?.includes(q) || p.email?.toLowerCase().includes(q)
    ));
  }, [search, patients, branchAppts]);

  const logout = () => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser'); window.location.replace('/admin'); };

  const pending  = branchAppts.filter(a => ['pending', 'confirmed'].includes(a.status)).length;
  const approved = branchAppts.filter(a => a.status === 'approved').length;

  // Helper for trend calculations (last 30 days vs 30 days before that)
  const getTrend = (items, dateField = 'createdAt') => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    let currentPeriodCount = 0;
    let previousPeriodCount = 0;

    items.forEach(item => {
      const dateVal = item[dateField] ? new Date(item[dateField]) : null;
      if (!dateVal) return;
      if (dateVal >= thirtyDaysAgo && dateVal <= now) {
        currentPeriodCount++;
      } else if (dateVal >= sixtyDaysAgo && dateVal < thirtyDaysAgo) {
        previousPeriodCount++;
      }
    });

    if (previousPeriodCount === 0) {
      return {
        text: currentPeriodCount > 0 ? `+${currentPeriodCount * 100}%` : '0%',
        up: true
      };
    }
    const pct = ((currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100;
    return {
      text: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`,
      up: pct >= 0
    };
  };

  // Approved Patients set
  const approvedPatientIds = new Set(
    branchAppts
      .filter(a => a.status === 'approved')
      .map(a => typeof a.patientId === 'object' && a.patientId ? a.patientId._id : a.patientId)
      .filter(Boolean)
  );
  const approvedPatients = patients.filter(p => approvedPatientIds.has(p._id));

  // Patients Trend
  const patientsTrend = getTrend(approvedPatients);
  
  // Appointments Trend
  const apptsTrend = getTrend(branchAppts);

  // Pending Review Trend
  const pendingTrend = pending > 0 ? { text: `+${pending} new`, up: false } : { text: 'All clear', up: true };

  // Approved Today Stats & Trend
  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local format
  const approvedToday = branchAppts.filter(a => a.status === 'approved' && a.date === todayStr).length;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('en-CA');
  const approvedYesterday = branchAppts.filter(a => a.status === 'approved' && a.date === yesterdayStr).length;

  let approvedTodayTrend = '+0%';
  let approvedTodayUp = true;
  if (approvedYesterday === 0) {
    approvedTodayTrend = approvedToday > 0 ? `+${approvedToday * 100}%` : '0%';
    approvedTodayUp = approvedToday >= 0;
  } else {
    const diff = ((approvedToday - approvedYesterday) / approvedYesterday) * 100;
    approvedTodayTrend = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
    approvedTodayUp = diff >= 0;
  }

  // Calculate dynamic targets (denominators)
  const patientsTarget = approvedPatients.length > 0 ? Math.ceil(approvedPatients.length / 50) * 50 : 100;
  const apptsTarget = branchAppts.length > 0 ? Math.ceil(branchAppts.length / 50) * 50 : 150;
  const pendingTarget = pending > 0 ? Math.ceil(pending / 10) * 10 : 20;
  const todayApptsTotal = branchAppts.filter(a => a.date === todayStr).length;
  const approvedTodayTarget = todayApptsTotal > 0 ? todayApptsTotal : 10;

  const stats = [
    {label:'Total Patients',    val:approvedPatients.length, total: patientsTarget, iconPath:ICONS.users,  cls:'c1', trend:patientsTrend.text, up:patientsTrend.up},
    {label:'Appointments',      val:branchAppts.length,    total: apptsTarget,    iconPath:ICONS.cal,    cls:'c2', trend:apptsTrend.text,  up:apptsTrend.up},
    {label:'Pending',    val:pending,         total: pendingTarget,  iconPath:ICONS.shield, cls:'c3', trend:pendingTrend.text, up:pendingTrend.up},
    {label:'Approved Today',    val:approvedToday,   total: approvedTodayTarget, iconPath:ICONS.check,  cls:'c4', trend:approvedTodayTrend, up:approvedTodayUp},
  ];

  // Mini stats stack calculations
  const totalPatientsCount = approvedPatients.length;
  const maleCount = approvedPatients.filter(p => p._id && p._id.charCodeAt(p._id.length - 1) % 2 === 0).length;
  const femaleCount = totalPatientsCount - maleCount;
  const malePct = totalPatientsCount > 0 ? Math.round((maleCount / totalPatientsCount) * 100) : 50;
  const femalePct = totalPatientsCount > 0 ? 100 - malePct : 50;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newPatientsCount = approvedPatients.filter(p => new Date(p.createdAt) >= thirtyDaysAgo).length;
  const oldPatientsCount = totalPatientsCount - newPatientsCount;
  const rescheduledCount = branchAppts.filter(a => a.status === 'rescheduled').length;

  const getNewPatientsTrend = () => {
    const now = new Date();
    const thirtyDays = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDays = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    
    const newThis = approvedPatients.filter(p => {
      const d = new Date(p.createdAt);
      return d >= thirtyDays && d <= now;
    }).length;
    
    const newPrev = approvedPatients.filter(p => {
      const d = new Date(p.createdAt);
      return d >= sixtyDays && d < thirtyDays;
    }).length;

    if (newPrev === 0) {
      return { text: newThis > 0 ? `▲ +${newThis * 100}%` : '▲ 0%', cls: 'up' };
    }
    const diff = ((newThis - newPrev) / newPrev) * 100;
    return {
      text: `${diff >= 0 ? '▲' : '▼'} ${diff >= 0 ? '+' : ''}${diff.toFixed(0)}%`,
      cls: diff >= 0 ? 'up' : 'dn'
    };
  };

  const newPatientsTrend = getNewPatientsTrend();
  const oldPatientsTrend = { text: `• ${totalPatientsCount > 0 ? Math.round((oldPatientsCount / totalPatientsCount) * 100) : 0}% of total`, cls: 'neutral' };
  const rescheduledTrend = { text: `• ${branchAppts.length > 0 ? Math.round((rescheduledCount / branchAppts.length) * 100) : 0}% of appts`, cls: 'neutral' };

  // Calculate calendar highlights for the current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const calendarApptDays = branchAppts
    .filter(a => {
      if (!a.date) return false;
      const parts = a.date.split('-');
      if (parts.length >= 2) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        return y === currentYear && m === currentMonth;
      }
      return false;
    })
    .map(a => {
      const parts = a.date.split('-');
      return parseInt(parts[2], 10);
    });

  // Calculate selected year's bookings count for the title
  const activeYearBookings = branchAppts.filter(appt => {
    if (!appt.date) return false;
    const parts = appt.date.split('-');
    return parts.length >= 1 && parseInt(parts[0], 10) === selectedYear;
  }).length;

  return (
    <div className="dash">
      {/* ══ SIDEBAR ══ */}
      <Sidebar activePage={currentView === 'patients' ? 'patients' : 'dashboard'} />

      {/* ══ MAIN ══ */}
      <div className="dash_main">

        {/* Header */}
        <header className="dash_hdr">
          <div className="dash_hdr_left">
            {currentView === 'dashboard' ? (
              <>
                <h2>{greet}, {adminUser?.username || 'Admin'} 👋</h2>
                <p>Welcome to the West Chemist Admin Dashboard.</p>
              </>
            ) : (
              <>
                <h2>Patient Directory</h2>
                <p>Manage clinic patient registry and details.</p>
              </>
            )}
          </div>
          <div className="dash_hdr_right" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--t3)' }}>Clinic Location:</span>
            <select
              value={selectedBranch}
              onChange={(e) => handleBranchChange(e.target.value)}
              style={{
                fontSize: '0.82rem',
                color: 'var(--t1)',
                background: '#ffffff',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1.5px solid var(--border)',
                cursor: 'pointer',
                fontWeight: '700',
                outline: 'none',
                boxShadow: 'var(--sh)'
              }}
            >
              <option value="West Chemist — Northampton Clinic">Northampton Clinic</option>
              <option value="West Chemist — Online Virtual Clinic">Online Virtual Clinic</option>
            </select>
          </div>
        </header>

        {/* Welcome Banner */}
        {currentView === 'dashboard' && (
          <div className="dash_banner">
            <div className="banner_tag">⚕ West Chemist Clinical Portal</div>
            <h1 className="banner_h1">
              Manage Patients &<br/><span>Appointments Smartly</span>
            </h1>
            <p className="banner_sub">
              Complete control over your clinic — approve bookings, review compliance, and track patient health records in one beautiful dashboard.
            </p>
            <div className="banner_btns">
              <button className="banner_btn_p" onClick={()=>window.location.href='/admin/appointments'}>
                View Appointments
              </button>
              <button className="banner_btn_s" onClick={()=>window.location.href='/admin/compliance'}>
                Compliance Logs
              </button>
            </div>
            <div className="banner_stats">
              {[
                {v:`${approvedPatients.length}+`, l:'Total Patients'},
                {v:`${branchAppts.length}+`, l:'Appointments'},
                {v:`${pending}`, l:'Pending'},
                {v:'100%', l:'GDPR Compliant'},
              ].map((s,i) => (
                <div key={i} style={{display:'flex',flexDirection:'column'}}>
                  <div className="bstat_val">{s.v}</div>
                  <div className="bstat_lbl">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {currentView === 'dashboard' && (
          <div className="dash_stats">
            {stats.map((s,i) => (
              <div key={s.label} className={`stat_card ${s.cls}`} style={{animationDelay:`${i*0.08}s`}}>
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
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={s.iconPath}/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charts Grid */}
        {currentView === 'dashboard' && (
          <div className="dash_grid">
            {/* Column 1: Line/Area Chart */}
            <div className="panel" style={{ flex: 1 }}>
              <div className="panel_hdr">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="panel_title">Appointment Trends</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer' }} title="Appointment tracking logs">ⓘ</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    style={{
                      fontSize: '.75rem',
                      color: '#6b7280',
                      background: '#fcfaff',
                      padding: '4px 10px',
                      borderRadius: 8,
                      border: '1px solid #eef0f6',
                      cursor: 'pointer',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  >
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                  </select>
                </div>
              </div>
              
              <div className="chart_wrap">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--t1)' }}>{activeYearBookings} Bookings</span>
                  <span style={{ fontSize: '.75rem', fontWeight: 700, color: apptsTrend.up ? 'var(--pine)' : '#e11d48', background: apptsTrend.up ? '#eef7f5' : '#fff1f2', padding: '2px 8px', borderRadius: 100 }}>
                    {apptsTrend.up ? '↗' : '↘'} {apptsTrend.text} vs last month
                  </span>
                </div>
                
                <div className="chart_svg_wrap">
                  <AreaChart appts={branchAppts} selectedYear={selectedYear} />
                </div>
                
                <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginTop: 10, padding: '0 10px' }}>
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                    <span key={m} className="chart_month_lbl" style={{ fontSize: '.68rem', color: '#94a3b8', fontWeight: 600 }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Calendar */}
            <div className="panel" style={{ overflow: 'visible', position: 'relative', zIndex: 10 }}>
              <div className="panel_hdr">
                <span className="panel_title">Clinic Calendar</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                <MiniCal appts={branchAppts} holidays={holidays} onToggleHoliday={toggleHoliday} />
                
                {/* Bulk holiday range editor */}
                <div className="bulk_holiday_panel">
                  <span className="bulk_holiday_title">Bulk Holiday Selection</span>
                  <div className="bulk_holiday_grid">
                    <div className="bulk_holiday_field">
                      <label className="bulk_holiday_label">Start Date</label>
                      <input 
                        type="date" 
                        value={bulkStart} 
                        onChange={e => setBulkStart(e.target.value)} 
                        className="bulk_holiday_input"
                      />
                    </div>
                    <div className="bulk_holiday_field">
                      <label className="bulk_holiday_label">End Date</label>
                      <input 
                        type="date" 
                        value={bulkEnd} 
                        onChange={e => setBulkEnd(e.target.value)} 
                        className="bulk_holiday_input"
                      />
                    </div>
                  </div>
                  <div className="bulk_holiday_actions">
                    <button 
                      onClick={() => handleBulkHolidayOverride('block')} 
                      className="bulk_holiday_btn btn_block"
                    >
                      Block Range
                    </button>
                    <button 
                      onClick={() => handleBulkHolidayOverride('unblock')} 
                      className="bulk_holiday_btn btn_unblock"
                    >
                      Unblock Range
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Stack of 3 mini stats cards */}
            <div className="mini_stats_stack">
              <div className="mini_stat_row row_c1">
                <div className="mini_stat_inner">
                  <div className="mini_stat_left">
                    <span className="mini_stat_num">{newPatientsCount}</span>
                    <span className="mini_stat_lbl">New Patients</span>
                  </div>
                  <span className={`mini_stat_trend ${newPatientsTrend.cls}`}>{newPatientsTrend.text}</span>
                </div>
                <div className="mini_progress_track">
                  <div className="mini_progress_bar" style={{ width: `${totalPatientsCount > 0 ? (newPatientsCount / totalPatientsCount) * 100 : 0}%`, background: 'var(--pine)' }} />
                </div>
              </div>
              
              <div className="mini_stat_row row_c2">
                <div className="mini_stat_inner">
                  <div className="mini_stat_left">
                    <span className="mini_stat_num">{oldPatientsCount}</span>
                    <span className="mini_stat_lbl">Old Patients</span>
                  </div>
                  <span className={`mini_stat_trend ${oldPatientsTrend.cls}`}>{oldPatientsTrend.text}</span>
                </div>
                <div className="mini_progress_track">
                  <div className="mini_progress_bar" style={{ width: `${totalPatientsCount > 0 ? (oldPatientsCount / totalPatientsCount) * 100 : 0}%`, background: '#e11d48' }} />
                </div>
              </div>
              
              <div className="mini_stat_row row_c3">
                <div className="mini_stat_inner">
                  <div className="mini_stat_left">
                    <span className="mini_stat_num">{rescheduledCount}</span>
                    <span className="mini_stat_lbl">Rescheduled</span>
                  </div>
                  <span className={`mini_stat_trend ${rescheduledTrend.cls}`}>{rescheduledTrend.text}</span>
                </div>
                <div className="mini_progress_track">
                  <div className="mini_progress_bar" style={{ width: `${branchAppts.length > 0 ? (rescheduledCount / branchAppts.length) * 100 : 0}%`, background: 'var(--purple)' }} />
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Bottom Section: Table Grid */}
        <div className="dash_bottom_grid" style={{ gridTemplateColumns: '1fr' }}>
          {/* Left Column: Patients Table */}
          <div className="dash_table_section">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
              <div>
                <div style={{fontSize:'1rem',fontWeight:800,color:'var(--purple)'}}>Patient Management</div>
                <div style={{fontSize:'.78rem',color:'#6b7280',marginTop:2}}>
                  {filtered.length} of {approvedPatients.length} patients
                </div>
              </div>
              <a href="/admin/appointments" style={{fontSize:'.78rem',fontWeight:600,color:'var(--pine)',textDecoration:'none'}}>View Appointments →</a>
            </div>

            <div className="tbl_wrap">
              <div className="tbl_toolbar">
                <div className="tbl_search">
                  <I d={ICONS.search} s={14}/>
                  <input placeholder="Search patients name, id…"
                    value={search} onChange={e=>setSearch(e.target.value)}/>
                </div>
                <button className="tbl_filter_btn">
                  <I d={ICONS.filter} s={13}/>
                  Advanced Filter
                </button>
              </div>

              {loading ? (
                <div className="dash_loading">
                  <div className="spin"/>
                  <span>Loading patient records…</span>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th style={{width:40}}><input type="checkbox" style={{cursor:'pointer'}}/></th>
                      <th>ID</th>
                      <th>Patient Name</th>
                      <th>Mobile</th>
                      <th>Admit Date</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan="7" style={{textAlign:'center',padding:'40px',color:'#9ca3af',fontSize:'.85rem'}}>
                        No patients found.
                      </td></tr>
                    ) : filtered.map((p, i) => (
                      <tr key={p._id} style={{animationDelay:`${i*0.04}s`}}>
                        <td><input type="checkbox" style={{cursor:'pointer'}}/></td>
                        <td>
                          <span className="td_id">
                            {p._id.slice(-5).toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div className="td_avatar" style={{
                              background: `linear-gradient(135deg, ${
                                ['var(--teal)', 'var(--lavender)', 'var(--purple)', 'var(--pine)', 'var(--sage)'][p.fullName.length % 5]
                              }, var(--lavender))`
                            }}>
                              {p.fullName ? p.fullName[0].toUpperCase() : 'P'}
                            </div>
                            <div>
                              <div className="td_name">
                                {p.fullName.replace(/\b\w/g, c => c.toUpperCase())}
                              </div>
                              <div className="td_sub">Record Active</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--t2)', fontWeight: 600, fontSize: '.82rem' }}>{p.mobile}</td>
                        <td style={{ color: 'var(--t3)', fontSize: '.78rem', fontWeight: 500 }}>
                          {new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td>
                          <span className={`badge ${p.status === 'blocked' ? 'blocked' : 'active'}`}>
                            {p.status === 'blocked' ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td>
                          <button className="det_btn" onClick={() => window.location.href = `/admin/patients/${p._id}`}>
                            Details
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s' }}>
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </button>
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



      {modalConfig && (
        <div className="custom_modal_overlay">
          <div className="custom_modal_box">
            <div className="modal_icon_circle">
              {modalConfig.type === 'confirm' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--purple)' }}>
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#be123c' }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
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


