'use client';

import { API_URL, getImageUrl } from '@/config';
import React, { useState, useEffect, useRef } from 'react';
import '../patients/dashboard.css';
import './weight-loss.css';
import Sidebar from '@/components/Sidebar';

/* ─── SVG Icon helper ─── */
const I = ({ d, s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {d.split(' M').map((seg, i) => (
      <path key={i} d={i === 0 ? seg : 'M' + seg} />
    ))}
  </svg>
);

const ICONS = {
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  cal:     "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  users:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10",
  logout:  "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  plus:    "M12 5v14M5 12h14",
  trash:   "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  search:  "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  weight:  "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  star:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  activity:"M22 12h-4l-3 9L9 3l-3 9H2",
  pill:    "M10.5 20H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v6.5",
  check:   "M20 6L9 17l-5-5",
  image:   "M21 19a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14zM3 15l5-5 4 4 3-3 5 5",
  upload:  "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  link:    "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  close:   "M18 6L6 18 M6 6l12 12",
  eye:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  syringe: "M17 3l4 4 M5 21l4-4 M14 4l6 6-10 10-6-6 M3 21l3-3 M21 3l-3 3",
  scale:   "M12 3v6m0 0l-3-3m3 3l3-3 M3 10h18 M5 10v8a2 2 0 002 2h10a2 2 0 002-2v-8",
  bolt:    "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  doc:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  info:    "M12 16v-4 M12 8h.01 M12 2a10 10 0 1010 10A10 10 0 0012 2z",
  save:    "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h9",
};

const slugify = t => (t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const WL_TREATMENTS = [
  { label: 'Wegovy (Semaglutide)', color: '#1a6b5c' },
  { label: 'Mounjaro (Tirzepatide)', color: '#4338ca' },
  { label: 'Orlistat', color: '#b45309' },
  { label: 'Lifestyle & Diet Plan', color: '#be185d' },
  { label: 'BMI Assessment', color: '#0369a1' },
];

const getImgUrl = img => {
  if (!img) return '';
  return getImageUrl(img);
};

export default function AdminWeightLossPage() {
  const [activeTab, setActiveTab]     = useState('services');
  const [services, setServices]       = useState([]);
  const [appts, setAppts]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [adminUser, setAdminUser]     = useState(null);
  const [isMobile, setIsMobile]       = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat]     = useState('all');
  const [toast, setToast]             = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Service Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode]     = useState('add');
  const [selectedId, setSelectedId]   = useState(null);
  const [isDragging, setIsDragging]   = useState(false);
  const [isUploadingImg, setIsUploadingImg] = useState(false);
  const [imgUploadMode, setImgUploadMode]   = useState('url');
  const [isSaving, setIsSaving]       = useState(false);
  const fileInputRef = useRef(null);

  // CMS state for editable sections
  const [loadingCMS, setLoadingCMS] = useState(true);
  const [isSavingCMS, setIsSavingCMS] = useState(false);
  const [cmsForm, setCmsForm] = useState({
    hero: {
      tag: 'Pharmacy Service',
      title: 'PHARMACYly Supervised',
      highlight: 'Weight Loss Program',
      desc: 'Achieve safe, sustainable weight reduction with next-generation medical treatments under professional PHARMACY supervision. We offer tailored Wegovy and Mounjaro programs designed for your biology.',
      btn1Text: 'Book Private Consultation',
      btn1Url: '/book-appointment?service=Weight%20Loss%20Clinic',
      btn2Text: 'Compare Treatments',
      btn2Url: '#comparison'
    },
    treatmentsHeader: {
      subtitle: 'PHARMACY Treatments',
      title: 'Our Weight Management Options',
      desc: 'We provide MHRA-approved medications and comprehensive health coaching to support your metabolic health journey.'
    },
    comparisonTable: {
      subtitle: 'Head to Head',
      title: 'Mounjaro vs Wegovy Comparison',
      desc: 'Compare the features, mechanism, and efficacy of the leading medical weight management treatments.',
      col1Name: 'Parameter',
      col2Name: 'Mounjaro® (Tirzepatide)',
      col3Name: 'Wegovy® (Semaglutide)',
      rows: []
    },
    howItWorks: {
      subtitle: 'Your Journey',
      title: 'How Our Weight Loss Program Works',
      desc: 'A simple, secure, and pharmacist-led process to help you get started safely.',
      steps: []
    },
    faqs: {
      subtitle: 'Support',
      title: 'Frequently Asked Questions',
      desc: 'Find clear, direct answers about our private weight loss management services.',
      items: []
    },
    cta: {
      eyebrow: 'Start Today',
      title: 'Ready to Begin Your Weight Loss Journey?',
      desc: 'Take control of your health. Book an in-person PHARMACY assessment today with our professional team.',
      btnText: 'Book Your Consultation Now',
      btnUrl: '/book-appointment?service=Weight%20Loss%20Clinic',
      note: 'Subject to PHARMACY suitability assessment. Patients must be aged 18 or over.'
    }
  });

  const blankForm = {
    title: '', cat: 'Weight Loss', parentCategory: 'Weight Management',
    duration: '30 Mins', desc: '', featuresText: '',
    img: '', color: '#1a6b5c', onHome: false, slug: '',
  };
  const [form, setForm] = useState(blankForm);

  /* ── Auth check ── */
  useEffect(() => {
    const stored = localStorage.getItem('adminUser');
    if (!stored) { window.location.href = '/'; return; }
    try { setAdminUser(JSON.parse(stored)); } catch (_) {}
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API_URL}/api/services?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const wl = data.data.filter(s => {
          const slug = (s.slug || '').toLowerCase();
          const cat = (s.cat || '').toLowerCase();
          const parentCat = (s.parentCategory || '').toLowerCase();
          const title = (s.title || '').toLowerCase();
          return (
            slug === 'wegovy' ||
            slug === 'mounjaro' ||
            slug.includes('weight') ||
            slug.includes('wegovy') ||
            slug.includes('mounjaro') ||
            cat.includes('weight') ||
            parentCat.includes('weight') ||
            title.includes('weight') ||
            title.includes('wegovy') ||
            title.includes('mounjaro') ||
            title.includes('ozempic') ||
            title.includes('saxenda') ||
            title.includes('slimming')
          );
        });
        setServices(wl);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ── Fetch appointments for stats ── */
  const fetchAppts = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const res  = await fetch(`${API_URL}/api/appointments`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setAppts(data.data || []);
    } catch (_) {}
  };

  /* ── Fetch CMS content ── */
  const fetchCMS = async () => {
    try {
      setLoadingCMS(true);
      const res = await fetch(`${API_URL}/api/weight-loss/cms?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.data) {
        setCmsForm(prev => ({
          hero: { ...prev.hero, ...(data.data.hero || {}) },
          treatmentsHeader: { ...prev.treatmentsHeader, ...(data.data.treatmentsHeader || {}) },
          comparisonTable: {
            ...prev.comparisonTable,
            ...(data.data.comparisonTable || {}),
            rows: Array.isArray(data.data.comparisonTable?.rows) ? data.data.comparisonTable.rows : prev.comparisonTable.rows
          },
          howItWorks: {
            ...prev.howItWorks,
            ...(data.data.howItWorks || {}),
            steps: Array.isArray(data.data.howItWorks?.steps) ? data.data.howItWorks.steps : prev.howItWorks.steps
          },
          faqs: {
            ...prev.faqs,
            ...(data.data.faqs || {}),
            items: Array.isArray(data.data.faqs?.items) ? data.data.faqs.items : prev.faqs.items
          },
          cta: { ...prev.cta, ...(data.data.cta || {}) }
        }));
      }
    } catch (e) {
      console.error('Error fetching CMS:', e);
    } finally {
      setLoadingCMS(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchAppts();
    fetchCMS();
  }, []);

  /* ── Toast helper ── */
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Save CMS section ── */
  const handleSaveCMS = async (sectionKey, customPayload) => {
    setIsSavingCMS(true);
    const token = localStorage.getItem('adminToken');
    try {
      const payload = customPayload || { [sectionKey]: cmsForm[sectionKey] };
      const res = await fetch(`${API_URL}/api/weight-loss/cms`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Section updated successfully!');
        if (data.data) {
          setCmsForm(prev => ({ ...prev, ...(data.data) }));
        }
      } else {
        showToast(data.message || 'Failed to update section', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error saving section', 'error');
    } finally {
      setIsSavingCMS(false);
    }
  };

  /* ── Image upload for services ── */
  const uploadImage = async (file) => {
    if (!file) return;
    setIsUploadingImg(true);
    try {
      const fd  = new FormData();
      fd.append('image', file);
      const res  = await fetch(`${API_URL}/api/services/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) { setForm(f => ({ ...f, img: data.url })); showToast('Image uploaded!'); }
      else showToast(data.message || 'Upload failed', 'error');
    } catch (e) { showToast('Upload error', 'error'); }
    finally { setIsUploadingImg(false); }
  };

  /* ── Open service modal ── */
  const openAdd = () => {
    setForm(blankForm); setModalMode('add'); setSelectedId(null);
    setImgUploadMode('url'); setIsModalOpen(true);
  };
  const openEdit = (svc) => {
    setForm({
      title: svc.title, cat: svc.cat || 'Weight Loss',
      parentCategory: svc.parentCategory || 'Weight Management',
      duration: svc.duration || '', desc: svc.desc || '',
      featuresText: (svc.features || []).join(', '),
      img: svc.img || '', color: svc.color || '#1a6b5c',
      onHome: svc.onHome || false, slug: svc.slug || '',
    });
    setModalMode('edit'); setSelectedId(svc._id);
    setImgUploadMode('url'); setIsModalOpen(true);
  };

  /* ── Save Service (create / update) ── */
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      features: form.featuresText.split(',').map(f => f.trim()).filter(Boolean),
    };
    delete payload.featuresText;

    try {
      let res, data;
      if (modalMode === 'add') {
        res  = await fetch(`${API_URL}/api/services`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        res  = await fetch(`${API_URL}/api/services/${selectedId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      data = await res.json();
      if (data.success || res.ok) {
        showToast(modalMode === 'add' ? 'Service added!' : 'Service updated!');
        setIsModalOpen(false);
        fetchServices();
      } else {
        showToast(data.message || 'Save failed', 'error');
      }
    } catch (e) { showToast('Network error', 'error'); }
    finally { setIsSaving(false); }
  };

  /* ── Delete Service ── */
  const handleDelete = async (id) => {
    if (!id) {
      showToast('Cannot delete service (missing ID).', 'error');
      setConfirmDelete(null);
      return;
    }
    setServices(prev => prev.filter(s => s._id !== id && s.slug !== id));
    try {
      const res  = await fetch(`${API_URL}/api/services/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success || res.ok) { showToast('Service deleted'); fetchServices(); }
      else { showToast(data.message || 'Delete failed', 'error'); fetchServices(); }
    } catch (e) { showToast('Network error', 'error'); fetchServices(); }
    finally { setConfirmDelete(null); }
  };

  /* ── Derived data ── */
  const wlAppts = appts.filter(a => (a.service || '').toLowerCase().includes('weight'));
  const filtered = services.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchQ  = !q || s.title?.toLowerCase().includes(q) || s.desc?.toLowerCase().includes(q);
    const matchC  = filterCat === 'all' || (s.cat || '').toLowerCase() === filterCat.toLowerCase();
    return matchQ && matchC;
  });
  const homeCount   = services.filter(s => s.onHome).length;

  return (
    <div className="dash wl_admin_page">

      {/* ── Sidebar ── */}
      <Sidebar activePage="weight-loss" />

      {/* ── Main content ── */}
      <div className="dash_main wl_main">

        {/* Hero Banner */}
        <div className="wl_hero_banner">
          <div className="wl_hero_content">
            <div className="wl_hero_icon">⚖️</div>
            <div>
              <h1 className="wl_hero_title">Weight Loss Management</h1>
              <p className="wl_hero_sub">Manage weight-loss programmes, treatments & patient resources</p>
            </div>
          </div>
          <div className="wl_hero_stats">
            <div className="wl_hero_stat">
              <span className="wl_stat_num">{services.length}</span>
              <span className="wl_stat_lbl">Services</span>
            </div>
            <div className="wl_hero_stat">
              <span className="wl_stat_num">{homeCount}</span>
              <span className="wl_stat_lbl">On Homepage</span>
            </div>
            <div className="wl_hero_stat">
              <span className="wl_stat_num">{wlAppts.length}</span>
              <span className="wl_stat_lbl">Appointments</span>
            </div>
          </div>
        </div>

        {/* ── TABS NAVIGATION ── */}
        <div className="wl_tabs_nav">
          <button className={`wl_tab_btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
            <I d={ICONS.pill} s={15} /> Treatment Services ({services.length})
          </button>
          <button className={`wl_tab_btn ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>
            <I d={ICONS.edit} s={15} /> Hero Section
          </button>
          <button className={`wl_tab_btn ${activeTab === 'headers' ? 'active' : ''}`} onClick={() => setActiveTab('headers')}>
            <I d={ICONS.doc} s={15} /> Section Headlines
          </button>
          <button className={`wl_tab_btn ${activeTab === 'comparison' ? 'active' : ''}`} onClick={() => setActiveTab('comparison')}>
            <I d={ICONS.activity} s={15} /> Comparison Table ({cmsForm.comparisonTable?.rows?.length || 0})
          </button>
          <button className={`wl_tab_btn ${activeTab === 'journey' ? 'active' : ''}`} onClick={() => setActiveTab('journey')}>
            <I d={ICONS.bolt} s={15} /> How It Works ({cmsForm.howItWorks?.steps?.length || 0})
          </button>
          <button className={`wl_tab_btn ${activeTab === 'faqs' ? 'active' : ''}`} onClick={() => setActiveTab('faqs')}>
            <I d={ICONS.info} s={15} /> FAQs ({cmsForm.faqs?.items?.length || 0})
          </button>
          <button className={`wl_tab_btn ${activeTab === 'cta' ? 'active' : ''}`} onClick={() => setActiveTab('cta')}>
            <I d={ICONS.star} s={15} /> Bottom CTA Banner
          </button>
        </div>

        {/* ════════ TAB 1: SERVICES & TREATMENTS ════════ */}
        {activeTab === 'services' && (
          <>
            {/* Toolbar */}
            <div className="wl_toolbar">
              <div className="wl_search_bar">
                <I d={ICONS.search} s={16} />
                <input
                  className="wl_search_input"
                  placeholder="Search weight-loss services…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="wl_filter_row">
                <button className="wl_btn_add" onClick={openAdd}>
                  <I d={ICONS.plus} s={16} /> Add Service
                </button>
              </div>
            </div>

            {/* Services Grid */}
            <div className="wl_content_area">
              {loading ? (
                <div className="wl_loading_state">
                  <div className="wl_spinner" />
                  <p>Loading weight-loss services…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="wl_empty_state">
                  <div className="wl_empty_icon">⚖️</div>
                  <h3>No weight-loss services found</h3>
                  <p>{searchQuery ? 'Try a different search term.' : 'Click "Add Service" to create your first weight-loss programme.'}</p>
                  {!searchQuery && (
                    <button className="wl_btn_add" style={{ margin: '16px auto 0', display: 'flex' }} onClick={openAdd}>
                      <I d={ICONS.plus} s={16} /> Add Service
                    </button>
                  )}
                </div>
              ) : (
                <div className="wl_grid">
                  {filtered.map(svc => (
                    <div className="wl_card" key={svc._id || svc.slug}>
                      <div className="wl_card_banner" style={{ background: `linear-gradient(135deg, ${svc.color || '#1a6b5c'}, ${svc.color || '#1a6b5c'}cc)` }}>
                        {svc.img && (
                          <img src={getImgUrl(svc.img)} alt={svc.title} className="wl_card_img" />
                        )}
                        <div className="wl_card_overlay" />
                        <div className="wl_card_badges">
                          {svc.onHome && <span className="wl_badge_home">🏠 Homepage</span>}
                          {svc.duration && <span className="wl_badge_dur">⏱ {svc.duration}</span>}
                        </div>
                      </div>
                      <div className="wl_card_body">
                        <div className="wl_card_cat">{svc.cat || 'Weight Loss'}</div>
                        <h3 className="wl_card_title">{svc.title}</h3>
                        <p className="wl_card_desc">{svc.desc}</p>
                        {svc.features?.length > 0 && (
                          <ul className="wl_card_features">
                            {svc.features.slice(0, 3).map((f, i) => (
                              <li key={i}><I d={ICONS.check} s={12} /> {f}</li>
                            ))}
                            {svc.features.length > 3 && <li className="wl_more_feat">+{svc.features.length - 3} more</li>}
                          </ul>
                        )}
                        <div className="wl_card_actions">
                          <button className="wl_btn_edit" onClick={() => openEdit(svc)}>
                            <I d={ICONS.edit} s={13} /> Edit
                          </button>
                          <button className="wl_btn_delete" onClick={() => setConfirmDelete(svc)}>
                            <I d={ICONS.trash} s={13} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Reference - Treatments */}
            <div className="wl_treatments_panel">
              <h2 className="wl_panel_heading">
                <I d={ICONS.pill} s={18} /> Available Treatment Tracks
              </h2>
              <div className="wl_treatments_grid">
                {WL_TREATMENTS.map((t, i) => (
                  <div className="wl_treatment_chip" key={i} style={{ borderLeft: `3px solid ${t.color}` }}>
                    <span className="wl_chip_dot" style={{ background: t.color }} />
                    {t.label}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ════════ TAB 2: HERO SECTION ════════ */}
        {activeTab !== 'services' && loadingCMS ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: '#64748b' }}>
            <div className="wl_spinner" style={{ margin: '0 auto 16px' }} />
            <p>Loading Weight Loss content…</p>
          </div>
        ) : (
          <>
            {activeTab === 'hero' && (
          <div className="wl_section_card">
            <div className="wl_card_title_row">
              <h2 className="wl_sec_title">
                <I d={ICONS.edit} s={18} /> Hero Banner Content
              </h2>
            </div>
            <p className="wl_sec_sub">Configure the main title, badges, description, and call-to-action buttons shown at the top of the Weight Loss page.</p>

            <form onSubmit={e => { e.preventDefault(); handleSaveCMS('hero'); }}>
              <div className="wl_form_2col">
                <div className="wl_form_group">
                  <label className="wl_label">Badge Tag</label>
                  <input
                    type="text"
                    className="wl_input"
                    value={cmsForm.hero.tag}
                    onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, tag: e.target.value } })}
                    placeholder="e.g. Pharmacy Service"
                  />
                </div>
                <div className="wl_form_group">
                  <label className="wl_label">Headline Main Text</label>
                  <input
                    type="text"
                    className="wl_input"
                    value={cmsForm.hero.title}
                    onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, title: e.target.value } })}
                    placeholder="e.g. PHARMACYly Supervised"
                    required
                  />
                </div>
              </div>

              <div className="wl_form_group">
                <label className="wl_label">Headline Highlighted Text (Gradient Accent)</label>
                <input
                  type="text"
                  className="wl_input"
                  value={cmsForm.hero.highlight}
                  onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, highlight: e.target.value } })}
                  placeholder="e.g. Weight Loss Program"
                />
              </div>

              <div className="wl_form_group">
                <label className="wl_label">Description Paragraph</label>
                <textarea
                  className="wl_textarea"
                  rows="3"
                  value={cmsForm.hero.desc}
                  onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, desc: e.target.value } })}
                  placeholder="Explain your medical weight-loss approach..."
                  required
                />
              </div>

              <div className="wl_form_divider" style={{ margin: '20px 0 16px' }}>Hero Action Buttons</div>

              <div className="wl_form_2col">
                <div className="wl_form_group">
                  <label className="wl_label">Primary Button Label</label>
                  <input
                    type="text"
                    className="wl_input"
                    value={cmsForm.hero.btn1Text}
                    onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, btn1Text: e.target.value } })}
                    placeholder="e.g. Book Private Consultation"
                  />
                </div>
                <div className="wl_form_group">
                  <label className="wl_label">Primary Button Link</label>
                  <input
                    type="text"
                    className="wl_input"
                    value={cmsForm.hero.btn1Url}
                    onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, btn1Url: e.target.value } })}
                    placeholder="e.g. /book-appointment?service=Weight%20Loss%20Clinic"
                  />
                </div>
              </div>

              <div className="wl_form_2col">
                <div className="wl_form_group">
                  <label className="wl_label">Secondary Button Label</label>
                  <input
                    type="text"
                    className="wl_input"
                    value={cmsForm.hero.btn2Text}
                    onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, btn2Text: e.target.value } })}
                    placeholder="e.g. Compare Treatments"
                  />
                </div>
                <div className="wl_form_group">
                  <label className="wl_label">Secondary Button Link / Anchor</label>
                  <input
                    type="text"
                    className="wl_input"
                    value={cmsForm.hero.btn2Url}
                    onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, btn2Url: e.target.value } })}
                    placeholder="e.g. #comparison"
                  />
                </div>
              </div>

              <div className="wl_save_bar">
                <button type="submit" className="wl_btn_add" disabled={isSavingCMS}>
                  <I d={ICONS.save} s={15} />
                  {isSavingCMS ? 'Saving...' : 'Save Hero Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ════════ TAB 3: SECTION HEADLINES ════════ */}
        {activeTab === 'headers' && (
          <div className="wl_section_card">
            <div className="wl_card_title_row">
              <h2 className="wl_sec_title">
                <I d={ICONS.doc} s={18} /> Section Titles &amp; Subtitles
              </h2>
            </div>
            <p className="wl_sec_sub">Manage the introductory titles and descriptions that appear above the treatments grid, comparison table, journey steps, and FAQs.</p>

            <form onSubmit={e => { e.preventDefault(); handleSaveCMS('headers', { treatmentsHeader: cmsForm.treatmentsHeader, comparisonTable: { ...cmsForm.comparisonTable }, howItWorks: { ...cmsForm.howItWorks }, faqs: { ...cmsForm.faqs } }); }}>
              
              {/* Treatments Section Header */}
              <div className="wl_dynamic_item" style={{ background: '#fff' }}>
                <div className="wl_dynamic_item_title">1. Treatments Grid Header</div>
                <div className="wl_form_2col" style={{ marginTop: 10 }}>
                  <div className="wl_form_group">
                    <label className="wl_label">Subtitle</label>
                    <input
                      type="text"
                      className="wl_input"
                      value={cmsForm.treatmentsHeader.subtitle}
                      onChange={e => setCmsForm({ ...cmsForm, treatmentsHeader: { ...cmsForm.treatmentsHeader, subtitle: e.target.value } })}
                    />
                  </div>
                  <div className="wl_form_group">
                    <label className="wl_label">Title</label>
                    <input
                      type="text"
                      className="wl_input"
                      value={cmsForm.treatmentsHeader.title}
                      onChange={e => setCmsForm({ ...cmsForm, treatmentsHeader: { ...cmsForm.treatmentsHeader, title: e.target.value } })}
                    />
                  </div>
                </div>
                <div className="wl_form_group">
                  <label className="wl_label">Description</label>
                  <textarea
                    className="wl_textarea"
                    rows="2"
                    value={cmsForm.treatmentsHeader.desc}
                    onChange={e => setCmsForm({ ...cmsForm, treatmentsHeader: { ...cmsForm.treatmentsHeader, desc: e.target.value } })}
                  />
                </div>
              </div>

              {/* Comparison Table Header */}
              <div className="wl_dynamic_item" style={{ background: '#fff' }}>
                <div className="wl_dynamic_item_title">2. Comparison Table Header</div>
                <div className="wl_form_2col" style={{ marginTop: 10 }}>
                  <div className="wl_form_group">
                    <label className="wl_label">Subtitle</label>
                    <input
                      type="text"
                      className="wl_input"
                      value={cmsForm.comparisonTable.subtitle}
                      onChange={e => setCmsForm({ ...cmsForm, comparisonTable: { ...cmsForm.comparisonTable, subtitle: e.target.value } })}
                    />
                  </div>
                  <div className="wl_form_group">
                    <label className="wl_label">Title</label>
                    <input
                      type="text"
                      className="wl_input"
                      value={cmsForm.comparisonTable.title}
                      onChange={e => setCmsForm({ ...cmsForm, comparisonTable: { ...cmsForm.comparisonTable, title: e.target.value } })}
                    />
                  </div>
                </div>
                <div className="wl_form_group">
                  <label className="wl_label">Description</label>
                  <textarea
                    className="wl_textarea"
                    rows="2"
                    value={cmsForm.comparisonTable.desc}
                    onChange={e => setCmsForm({ ...cmsForm, comparisonTable: { ...cmsForm.comparisonTable, desc: e.target.value } })}
                  />
                </div>
              </div>

              {/* How It Works Header */}
              <div className="wl_dynamic_item" style={{ background: '#fff' }}>
                <div className="wl_dynamic_item_title">3. How It Works Header</div>
                <div className="wl_form_2col" style={{ marginTop: 10 }}>
                  <div className="wl_form_group">
                    <label className="wl_label">Subtitle</label>
                    <input
                      type="text"
                      className="wl_input"
                      value={cmsForm.howItWorks.subtitle}
                      onChange={e => setCmsForm({ ...cmsForm, howItWorks: { ...cmsForm.howItWorks, subtitle: e.target.value } })}
                    />
                  </div>
                  <div className="wl_form_group">
                    <label className="wl_label">Title</label>
                    <input
                      type="text"
                      className="wl_input"
                      value={cmsForm.howItWorks.title}
                      onChange={e => setCmsForm({ ...cmsForm, howItWorks: { ...cmsForm.howItWorks, title: e.target.value } })}
                    />
                  </div>
                </div>
                <div className="wl_form_group">
                  <label className="wl_label">Description</label>
                  <textarea
                    className="wl_textarea"
                    rows="2"
                    value={cmsForm.howItWorks.desc}
                    onChange={e => setCmsForm({ ...cmsForm, howItWorks: { ...cmsForm.howItWorks, desc: e.target.value } })}
                  />
                </div>
              </div>

              {/* FAQs Header */}
              <div className="wl_dynamic_item" style={{ background: '#fff' }}>
                <div className="wl_dynamic_item_title">4. FAQs Section Header</div>
                <div className="wl_form_2col" style={{ marginTop: 10 }}>
                  <div className="wl_form_group">
                    <label className="wl_label">Subtitle</label>
                    <input
                      type="text"
                      className="wl_input"
                      value={cmsForm.faqs.subtitle}
                      onChange={e => setCmsForm({ ...cmsForm, faqs: { ...cmsForm.faqs, subtitle: e.target.value } })}
                    />
                  </div>
                  <div className="wl_form_group">
                    <label className="wl_label">Title</label>
                    <input
                      type="text"
                      className="wl_input"
                      value={cmsForm.faqs.title}
                      onChange={e => setCmsForm({ ...cmsForm, faqs: { ...cmsForm.faqs, title: e.target.value } })}
                    />
                  </div>
                </div>
                <div className="wl_form_group">
                  <label className="wl_label">Description</label>
                  <textarea
                    className="wl_textarea"
                    rows="2"
                    value={cmsForm.faqs.desc}
                    onChange={e => setCmsForm({ ...cmsForm, faqs: { ...cmsForm.faqs, desc: e.target.value } })}
                  />
                </div>
              </div>

              <div className="wl_save_bar">
                <button type="submit" className="wl_btn_add" disabled={isSavingCMS}>
                  <I d={ICONS.save} s={15} />
                  {isSavingCMS ? 'Saving...' : 'Save Section Headlines'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ════════ TAB 4: COMPARISON TABLE ════════ */}
        {activeTab === 'comparison' && (
          <div className="wl_section_card">
            <div className="wl_card_title_row">
              <h2 className="wl_sec_title">
                <I d={ICONS.activity} s={18} /> Comparison Table Manager
              </h2>
              <button
                type="button"
                className="wl_btn_add_sub"
                onClick={() => {
                  setCmsForm({
                    ...cmsForm,
                    comparisonTable: {
                      ...cmsForm.comparisonTable,
                      rows: [
                        ...(cmsForm.comparisonTable.rows || []),
                        { parameter: 'New Parameter', col1: '', col2: '', badge1: '', badge2: '' }
                      ]
                    }
                  });
                }}
              >
                <I d={ICONS.plus} s={14} /> Add Row
              </button>
            </div>
            <p className="wl_sec_sub">Configure the column headings and every parameter comparison row shown in the Mounjaro vs Wegovy table.</p>

            <form onSubmit={e => { e.preventDefault(); handleSaveCMS('comparisonTable'); }}>
              {/* Column Headings */}
              <div className="wl_form_3col" style={{ marginBottom: 20 }}>
                <div className="wl_form_group">
                  <label className="wl_label">Column 1 Header</label>
                  <input
                    type="text"
                    className="wl_input"
                    value={cmsForm.comparisonTable.col1Name || ''}
                    onChange={e => setCmsForm({ ...cmsForm, comparisonTable: { ...cmsForm.comparisonTable, col1Name: e.target.value } })}
                    placeholder="e.g. Parameter"
                  />
                </div>
                <div className="wl_form_group">
                  <label className="wl_label">Column 2 Header</label>
                  <input
                    type="text"
                    className="wl_input"
                    value={cmsForm.comparisonTable.col2Name || ''}
                    onChange={e => setCmsForm({ ...cmsForm, comparisonTable: { ...cmsForm.comparisonTable, col2Name: e.target.value } })}
                    placeholder="e.g. Mounjaro® (Tirzepatide)"
                  />
                </div>
                <div className="wl_form_group">
                  <label className="wl_label">Column 3 Header</label>
                  <input
                    type="text"
                    className="wl_input"
                    value={cmsForm.comparisonTable.col3Name || ''}
                    onChange={e => setCmsForm({ ...cmsForm, comparisonTable: { ...cmsForm.comparisonTable, col3Name: e.target.value } })}
                    placeholder="e.g. Wegovy® (Semaglutide)"
                  />
                </div>
              </div>

              {/* Rows List */}
              <div style={{ marginTop: 14 }}>
                {(cmsForm.comparisonTable.rows || []).map((row, idx) => (
                  <div className="wl_dynamic_item" key={idx}>
                    <div className="wl_dynamic_item_hdr">
                      <span className="wl_dynamic_item_title">Row {idx + 1}: {row.parameter || 'Untitled'}</span>
                      <button
                        type="button"
                        className="wl_btn_remove"
                        onClick={() => {
                          const updated = cmsForm.comparisonTable.rows.filter((_, i) => i !== idx);
                          setCmsForm({
                            ...cmsForm,
                            comparisonTable: { ...cmsForm.comparisonTable, rows: updated }
                          });
                        }}
                      >
                        <I d={ICONS.trash} s={12} /> Delete Row
                      </button>
                    </div>

                    <div className="wl_form_3col">
                      <div className="wl_form_group">
                        <label className="wl_label">Parameter Name</label>
                        <input
                          type="text"
                          className="wl_input"
                          value={row.parameter || ''}
                          onChange={e => {
                            const updated = [...cmsForm.comparisonTable.rows];
                            updated[idx].parameter = e.target.value;
                            setCmsForm({ ...cmsForm, comparisonTable: { ...cmsForm.comparisonTable, rows: updated } });
                          }}
                          placeholder="e.g. Active Ingredient"
                          required
                        />
                      </div>
                      <div className="wl_form_group">
                        <label className="wl_label">Col 2 Value (Mounjaro)</label>
                        <input
                          type="text"
                          className="wl_input"
                          value={row.col1 || ''}
                          onChange={e => {
                            const updated = [...cmsForm.comparisonTable.rows];
                            updated[idx].col1 = e.target.value;
                            setCmsForm({ ...cmsForm, comparisonTable: { ...cmsForm.comparisonTable, rows: updated } });
                          }}
                          placeholder="e.g. Tirzepatide"
                        />
                      </div>
                      <div className="wl_form_group">
                        <label className="wl_label">Col 3 Value (Wegovy)</label>
                        <input
                          type="text"
                          className="wl_input"
                          value={row.col2 || ''}
                          onChange={e => {
                            const updated = [...cmsForm.comparisonTable.rows];
                            updated[idx].col2 = e.target.value;
                            setCmsForm({ ...cmsForm, comparisonTable: { ...cmsForm.comparisonTable, rows: updated } });
                          }}
                          placeholder="e.g. Semaglutide"
                        />
                      </div>
                    </div>

                    <div className="wl_form_2col" style={{ marginTop: 8 }}>
                      <div className="wl_form_group">
                        <label className="wl_label">Col 2 Badge Style</label>
                        <select
                          className="wl_input"
                          value={row.badge1 || ''}
                          onChange={e => {
                            const updated = [...cmsForm.comparisonTable.rows];
                            updated[idx].badge1 = e.target.value;
                            setCmsForm({ ...cmsForm, comparisonTable: { ...cmsForm.comparisonTable, rows: updated } });
                          }}
                        >
                          <option value="">None (Standard text)</option>
                          <option value="accent">Green Badge (Accent)</option>
                          <option value="purple">Purple Badge</option>
                        </select>
                      </div>
                      <div className="wl_form_group">
                        <label className="wl_label">Col 3 Badge Style</label>
                        <select
                          className="wl_input"
                          value={row.badge2 || ''}
                          onChange={e => {
                            const updated = [...cmsForm.comparisonTable.rows];
                            updated[idx].badge2 = e.target.value;
                            setCmsForm({ ...cmsForm, comparisonTable: { ...cmsForm.comparisonTable, rows: updated } });
                          }}
                        >
                          <option value="">None (Standard text)</option>
                          <option value="accent">Green Badge (Accent)</option>
                          <option value="purple">Purple Badge</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="wl_save_bar">
                <button type="submit" className="wl_btn_add" disabled={isSavingCMS}>
                  <I d={ICONS.save} s={15} />
                  {isSavingCMS ? 'Saving...' : 'Save Comparison Table'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ════════ TAB 5: HOW IT WORKS (JOURNEY) ════════ */}
        {activeTab === 'journey' && (
          <div className="wl_section_card">
            <div className="wl_card_title_row">
              <h2 className="wl_sec_title">
                <I d={ICONS.bolt} s={18} /> How It Works (Journey Steps)
              </h2>
              <button
                type="button"
                className="wl_btn_add_sub"
                onClick={() => {
                  const nextNum = String((cmsForm.howItWorks.steps?.length || 0) + 1);
                  setCmsForm({
                    ...cmsForm,
                    howItWorks: {
                      ...cmsForm.howItWorks,
                      steps: [
                        ...(cmsForm.howItWorks.steps || []),
                        { stepNumber: nextNum, title: 'New Step', desc: '' }
                      ]
                    }
                  });
                }}
              >
                <I d={ICONS.plus} s={14} /> Add Step
              </button>
            </div>
            <p className="wl_sec_sub">Manage the steps patient takes to begin their medical weight loss program.</p>

            <form onSubmit={e => { e.preventDefault(); handleSaveCMS('howItWorks'); }}>
              <div style={{ marginTop: 14 }}>
                {(cmsForm.howItWorks.steps || []).map((step, idx) => (
                  <div className="wl_dynamic_item" key={idx}>
                    <div className="wl_dynamic_item_hdr">
                      <span className="wl_dynamic_item_title">Step {step.stepNumber || idx + 1}: {step.title || 'Untitled'}</span>
                      <button
                        type="button"
                        className="wl_btn_remove"
                        onClick={() => {
                          const updated = cmsForm.howItWorks.steps.filter((_, i) => i !== idx);
                          setCmsForm({
                            ...cmsForm,
                            howItWorks: { ...cmsForm.howItWorks, steps: updated }
                          });
                        }}
                      >
                        <I d={ICONS.trash} s={12} /> Delete Step
                      </button>
                    </div>

                    <div className="wl_form_2col">
                      <div className="wl_form_group" style={{ maxWidth: 120 }}>
                        <label className="wl_label">Step Number</label>
                        <input
                          type="text"
                          className="wl_input"
                          value={step.stepNumber || ''}
                          onChange={e => {
                            const updated = [...cmsForm.howItWorks.steps];
                            updated[idx].stepNumber = e.target.value;
                            setCmsForm({ ...cmsForm, howItWorks: { ...cmsForm.howItWorks, steps: updated } });
                          }}
                          required
                        />
                      </div>
                      <div className="wl_form_group">
                        <label className="wl_label">Step Title</label>
                        <input
                          type="text"
                          className="wl_input"
                          value={step.title || ''}
                          onChange={e => {
                            const updated = [...cmsForm.howItWorks.steps];
                            updated[idx].title = e.target.value;
                            setCmsForm({ ...cmsForm, howItWorks: { ...cmsForm.howItWorks, steps: updated } });
                          }}
                          placeholder="e.g. Book Appointment"
                          required
                        />
                      </div>
                    </div>

                    <div className="wl_form_group">
                      <label className="wl_label">Step Description</label>
                      <textarea
                        className="wl_textarea"
                        rows="2"
                        value={step.desc || ''}
                        onChange={e => {
                          const updated = [...cmsForm.howItWorks.steps];
                          updated[idx].desc = e.target.value;
                          setCmsForm({ ...cmsForm, howItWorks: { ...cmsForm.howItWorks, steps: updated } });
                        }}
                        placeholder="Brief summary of what the patient does..."
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="wl_save_bar">
                <button type="submit" className="wl_btn_add" disabled={isSavingCMS}>
                  <I d={ICONS.save} s={15} />
                  {isSavingCMS ? 'Saving...' : 'Save Journey Steps'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ════════ TAB 6: FAQS ════════ */}
        {activeTab === 'faqs' && (
          <div className="wl_section_card">
            <div className="wl_card_title_row">
              <h2 className="wl_sec_title">
                <I d={ICONS.info} s={18} /> Frequently Asked Questions (FAQs)
              </h2>
              <button
                type="button"
                className="wl_btn_add_sub"
                onClick={() => {
                  setCmsForm({
                    ...cmsForm,
                    faqs: {
                      ...cmsForm.faqs,
                      items: [
                        ...(cmsForm.faqs.items || []),
                        { question: 'New Question?', answer: '' }
                      ]
                    }
                  });
                }}
              >
                <I d={ICONS.plus} s={14} /> Add FAQ
              </button>
            </div>
            <p className="wl_sec_sub">Add, edit, or remove questions and answers displayed in the accordion on the Weight Loss page.</p>

            <form onSubmit={e => { e.preventDefault(); handleSaveCMS('faqs'); }}>
              <div style={{ marginTop: 14 }}>
                {(cmsForm.faqs.items || []).map((faq, idx) => (
                  <div className="wl_dynamic_item" key={idx}>
                    <div className="wl_dynamic_item_hdr">
                      <span className="wl_dynamic_item_title">FAQ {idx + 1}</span>
                      <button
                        type="button"
                        className="wl_btn_remove"
                        onClick={() => {
                          const updated = cmsForm.faqs.items.filter((_, i) => i !== idx);
                          setCmsForm({
                            ...cmsForm,
                            faqs: { ...cmsForm.faqs, items: updated }
                          });
                        }}
                      >
                        <I d={ICONS.trash} s={12} /> Delete FAQ
                      </button>
                    </div>

                    <div className="wl_form_group">
                      <label className="wl_label">Question</label>
                      <input
                        type="text"
                        className="wl_input"
                        value={faq.question || ''}
                        onChange={e => {
                          const updated = [...cmsForm.faqs.items];
                          updated[idx].question = e.target.value;
                          setCmsForm({ ...cmsForm, faqs: { ...cmsForm.faqs, items: updated } });
                        }}
                        placeholder="e.g. Do I need a GP referral?"
                        required
                      />
                    </div>

                    <div className="wl_form_group">
                      <label className="wl_label">Answer</label>
                      <textarea
                        className="wl_textarea"
                        rows="3"
                        value={faq.answer || ''}
                        onChange={e => {
                          const updated = [...cmsForm.faqs.items];
                          updated[idx].answer = e.target.value;
                          setCmsForm({ ...cmsForm, faqs: { ...cmsForm.faqs, items: updated } });
                        }}
                        placeholder="Detailed medical answer..."
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="wl_save_bar">
                <button type="submit" className="wl_btn_add" disabled={isSavingCMS}>
                  <I d={ICONS.save} s={15} />
                  {isSavingCMS ? 'Saving...' : 'Save FAQs'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ════════ TAB 7: BOTTOM CTA BANNER ════════ */}
        {activeTab === 'cta' && (
          <div className="wl_section_card">
            <div className="wl_card_title_row">
              <h2 className="wl_sec_title">
                <I d={ICONS.star} s={18} /> Bottom Call-to-Action (CTA) Banner
              </h2>
            </div>
            <p className="wl_sec_sub">Configure the full-width conversion banner at the very bottom of the Weight Loss page.</p>

            <form onSubmit={e => { e.preventDefault(); handleSaveCMS('cta'); }}>
              <div className="wl_form_2col">
                <div className="wl_form_group">
                  <label className="wl_label">Eyebrow Tag</label>
                  <input
                    type="text"
                    className="wl_input"
                    value={cmsForm.cta.eyebrow}
                    onChange={e => setCmsForm({ ...cmsForm, cta: { ...cmsForm.cta, eyebrow: e.target.value } })}
                    placeholder="e.g. Start Today"
                  />
                </div>
                <div className="wl_form_group">
                  <label className="wl_label">Banner Headline</label>
                  <input
                    type="text"
                    className="wl_input"
                    value={cmsForm.cta.title}
                    onChange={e => setCmsForm({ ...cmsForm, cta: { ...cmsForm.cta, title: e.target.value } })}
                    placeholder="e.g. Ready to Begin Your Weight Loss Journey?"
                    required
                  />
                </div>
              </div>

              <div className="wl_form_group">
                <label className="wl_label">Description</label>
                <textarea
                  className="wl_textarea"
                  rows="2"
                  value={cmsForm.cta.desc}
                  onChange={e => setCmsForm({ ...cmsForm, cta: { ...cmsForm.cta, desc: e.target.value } })}
                  placeholder="Encouraging call-to-action text..."
                  required
                />
              </div>

              <div className="wl_form_2col">
                <div className="wl_form_group">
                  <label className="wl_label">Button Label</label>
                  <input
                    type="text"
                    className="wl_input"
                    value={cmsForm.cta.btnText}
                    onChange={e => setCmsForm({ ...cmsForm, cta: { ...cmsForm.cta, btnText: e.target.value } })}
                    placeholder="e.g. Book Your Consultation Now"
                    required
                  />
                </div>
                <div className="wl_form_group">
                  <label className="wl_label">Button Link URL</label>
                  <input
                    type="text"
                    className="wl_input"
                    value={cmsForm.cta.btnUrl}
                    onChange={e => setCmsForm({ ...cmsForm, cta: { ...cmsForm.cta, btnUrl: e.target.value } })}
                    placeholder="e.g. /book-appointment?service=Weight%20Loss%20Clinic"
                    required
                  />
                </div>
              </div>

              <div className="wl_form_group">
                <label className="wl_label">Medical &amp; Age Disclaimer Note</label>
                <input
                  type="text"
                  className="wl_input"
                  value={cmsForm.cta.note}
                  onChange={e => setCmsForm({ ...cmsForm, cta: { ...cmsForm.cta, note: e.target.value } })}
                  placeholder="e.g. Subject to PHARMACY suitability assessment. Patients must be aged 18 or over."
                />
              </div>

              <div className="wl_save_bar">
                <button type="submit" className="wl_btn_add" disabled={isSavingCMS}>
                  <I d={ICONS.save} s={15} />
                  {isSavingCMS ? 'Saving...' : 'Save CTA Banner'}
                </button>
              </div>
            </form>
          </div>
        )}
          </>
        )}

      </div>

      {/* ──── Add / Edit Service Modal ──── */}
      {isModalOpen && (
        <div className="wl_modal_overlay" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="wl_modal">
            <div className="wl_modal_header">
              <div>
                <h2 className="wl_modal_title">
                  {modalMode === 'add' ? '➕ Add Weight-Loss Service' : '✏️ Edit Service'}
                </h2>
                <p className="wl_modal_sub">
                  {modalMode === 'add' ? 'Create a new weight-management service or programme' : 'Update the service details below'}
                </p>
              </div>
              <button className="wl_modal_close" onClick={() => setIsModalOpen(false)} aria-label="Close">
                <I d={ICONS.close} s={18} />
              </button>
            </div>

            <form className="wl_modal_body" onSubmit={handleSave}>
              {/* Title & Duration */}
              <div className="wl_form_grid">
                <div className="wl_form_group">
                  <label className="wl_label">Service Title <span className="wl_req">*</span></label>
                  <input
                    className="wl_input" required placeholder="e.g. Wegovy Weight Management"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value), cat: 'Weight Loss', parentCategory: 'Weight Management' })}
                  />
                </div>
                <div className="wl_form_group">
                  <label className="wl_label">Duration</label>
                  <input
                    className="wl_input" placeholder="e.g. 30 Mins"
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="wl_form_group">
                <label className="wl_label">Description <span className="wl_req">*</span></label>
                <textarea
                  className="wl_textarea" rows="3" required
                  placeholder="PHARMACY description of this weight-loss service or treatment programme…"
                  value={form.desc}
                  onChange={e => setForm({ ...form, desc: e.target.value })}
                />
              </div>

              {/* Features */}
              <div className="wl_form_group">
                <label className="wl_label">
                  Key Features <span className="wl_hint">(comma-separated)</span>
                </label>
                <textarea
                  className="wl_textarea" rows="2"
                  placeholder="Weekly injection, PHARMACYly proven, Personalised plan, NHS eligible…"
                  value={form.featuresText}
                  onChange={e => setForm({ ...form, featuresText: e.target.value })}
                />
              </div>

              {/* Divider */}
              <div className="wl_form_divider">Image &amp; Appearance</div>

              {/* Image upload */}
              <div className="wl_form_group">
                <div className="wl_img_mode_toggle">
                  <button type="button" className={`wl_mode_btn${imgUploadMode === 'url' ? ' active' : ''}`}
                    onClick={() => setImgUploadMode('url')}>
                    <I d={ICONS.link} s={13} /> URL
                  </button>
                  <button type="button" className={`wl_mode_btn${imgUploadMode === 'upload' ? ' active' : ''}`}
                    onClick={() => setImgUploadMode('upload')}>
                    <I d={ICONS.upload} s={13} /> Upload File
                  </button>
                </div>

                {imgUploadMode === 'url' ? (
                  <input
                    className="wl_input" style={{ marginTop: 8 }}
                    placeholder="https://images.unsplash.com/…"
                    value={form.img}
                    onChange={e => setForm({ ...form, img: e.target.value })}
                  />
                ) : (
                  <div
                    className={`wl_dropzone${isDragging ? ' dragging' : ''}`}
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={e => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) uploadImage(e.dataTransfer.files[0]); }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploadingImg ? (
                      <><div className="wl_spinner" /><p style={{ marginTop: 10, fontSize: '0.82rem' }}>Uploading…</p></>
                    ) : (
                      <>
                        <div className="wl_dz_icon"><I d={ICONS.upload} s={26} /></div>
                        <p>Drag &amp; drop or <span className="wl_dz_link">browse files</span></p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>PNG, JPG, WEBP — max 10 MB</p>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => { if (e.target.files[0]) uploadImage(e.target.files[0]); }} />
                  </div>
                )}

                {form.img && (
                  <div className="wl_img_preview_box">
                    <img src={getImgUrl(form.img)} alt="Preview" className="wl_img_preview" />
                    <span className="wl_preview_label">Preview</span>
                  </div>
                )}
              </div>

              {/* onHome */}
              <div className="wl_form_group">
                <label className="wl_checkbox_label">
                  <input type="checkbox" className="wl_checkbox"
                    checked={form.onHome}
                    onChange={e => setForm({ ...form, onHome: e.target.checked })} />
                  <span>Show on Homepage</span>
                </label>
              </div>

              <div className="wl_modal_footer">
                <button type="button" className="wl_btn_cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="wl_btn_save" disabled={isSaving}>
                  {isSaving ? <><div className="wl_spinner_sm" /> Saving…</> : <><I d={ICONS.check} s={15} /> {modalMode === 'add' ? 'Add Service' : 'Save Changes'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Confirm Delete Modal ── */}
      {confirmDelete && (
        <div className="wl_modal_overlay" onClick={e => e.target === e.currentTarget && setConfirmDelete(null)}>
          <div className="wl_confirm_modal">
            <div className="wl_confirm_icon">🗑️</div>
            <h3 className="wl_confirm_title">Delete Service?</h3>
            <p className="wl_confirm_msg">
              Are you sure you want to delete <strong>{confirmDelete.title}</strong>?
              This action cannot be undone.
            </p>
            <div className="wl_confirm_actions">
              <button className="wl_btn_cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="wl_btn_delete_confirm" onClick={() => handleDelete(confirmDelete._id)}>
                <I d={ICONS.trash} s={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`wl_toast ${toast.type}`}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
