'use client';

import { API_URL, getImageUrl } from '@/config';
import React, { useState, useEffect } from 'react';
import '../patients/dashboard.css';
import './vaccination.css';
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
  logout:  "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  plus:    "M12 5v14M5 12h14",
  trash:   "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  doc:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  info:    "M12 16v-4 M12 8h.01 M12 2a10 10 0 1010 10A10 10 0 0012 2z",
  globe:   "M12 2a10 10 0 1010 10A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z",
  clock:   "M12 2a10 10 0 1010 10A10 10 0 0012 2z M12 6v6l4 2",
  search:  "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  needle:  "M14.5 9.5 L9.5 14.5 M7 7 L4 4 M17 17 L20 20 M5 19 L19 5",
};

const slugify = (text) =>
  (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const VACCINE_SLUGS = [
  'vaccine-meningitis',
  'nhs-meningitis-b',
  'chickenpox-vaccine',
  'vaccine-chikungunya',
  'nhs-shingles',
  'hpv-vaccine',
  'vaccine-rabies',
  'vaccine-hepatitis-b',
  'vaccine-typhoid',
  'vaccine-japanese-encephalitis'
];

const VACC_CATEGORIES = [
  { name: 'Vaccination Services',           color: '#4B2D71', dot: '#7c3aed' },
];

export default function AdminVaccinationPage() {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [appts, setAppts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode]     = useState('add');
  const [selectedId, setSelectedId]   = useState(null);
  const [isDragging, setIsDragging]   = useState(false);
  const [isUploadingImg, setIsUploadingImg] = useState(false);
  const [imgUploadMode, setImgUploadMode]   = useState('url');

  const [form, setForm] = useState({
    title: '', cat: 'Vaccination Care',
    parentCategory: 'Vaccination Services',
    duration: '15 Mins', desc: '', featuresText: '',
    img: 'https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80',
    color: '#4B2D71', onHome: false
  });

  /* ─ Vaccination CMS State ─ */
  const [isSavingCMS, setIsSavingCMS] = useState(false);
  const [cmsForm, setCmsForm] = useState({
    hero: {
      pillBadge: 'Travel & Routine Pharmacy Services',
      titlePrefix: 'Pharmacy ',
      titleHighlight: 'Vaccination Services',
      leadText: 'Protect your health at home and abroad. West Chemist offers professional, pharmacist-administered travel vaccines, routine immunisations, and seasonal wellness support in a modern, trusted environment.',
      primaryBtnText: 'Book Consultation',
      primaryBtnLink: '/book-appointment',
      secondaryBtnText: 'Explore Vaccines',
      card1Badge: 'World Health Approved',
      card1Title: 'Travel Health Service',
      card1Desc: 'Yellow Fever, Rabies, Hep A & B, Meningitis ACWY. Certified travel immunisation with official certificates.',
      card2Badge: 'NHS & Private',
      card2Title: 'Seasonal Wellness',
      card2Desc: 'Flu and COVID-19 vaccination program to protect your family and workplace during winter seasons.',
      card3Badge: 'Schedule Support',
      card3Title: 'Routine Immunisations',
      card3Desc: 'Shingles, Chickenpox, HPV, and Pneumonia. Keep your PHARMACY vaccine record up to date under pharmacist care.'
    },
    gridHeader: {
      badge: 'Our Protocols',
      title: 'Premium Vaccinations',
      desc: 'Discover our comprehensive suite of advanced PHARMACY immunizations.'
    },
    process: {
      eyebrow: 'Pharmacy Protocol',
      title: 'Seamless Immunity.',
      lead: "Getting protected shouldn't be complicated. Our 3-step streamlined PHARMACY process ensures you get the right vaccines, fast.",
      steps: [
        {
          number: '01',
          title: 'PHARMACY Consultation',
          description: 'Review your travel itinerary, medical history, and risk factors with our qualified pharmacists to determine the exact vaccines you need.'
        },
        {
          number: '02',
          title: 'Secure Administration',
          description: 'Receive your vaccinations in our sterile, private PHARMACY rooms. We use advanced, painless techniques to ensure maximum comfort.'
        },
        {
          number: '03',
          title: 'Certification & Aftercare',
          description: 'Get immediate official documentation, including Yellow Fever certificates, along with professional advice on managing any minor side effects.'
        }
      ]
    },
    faqs: {
      eyebrow: 'PHARMACY Knowledge',
      title: 'Vaccination FAQ.',
      lead: 'Clear answers to your most pressing questions regarding travel immunity and routine PHARMACY protection.',
      items: [
        {
          question: 'When should I book my travel vaccinations?',
          answer: 'We strongly recommend booking your consultation at least 6-8 weeks before your departure. Some vaccines require multiple doses spread across several weeks to build full immunity.'
        },
        {
          question: 'Are your vaccines authentic and approved?',
          answer: 'Absolutely. All our vaccines are strictly sourced from licensed UK medical wholesalers, fully MHRA approved, and administered by highly trained, registered pharmacy professionals.'
        },
        {
          question: 'Do I need a prescription from my GP first?',
          answer: 'No. Our pharmacy operates a fully comprehensive service. Our qualified pharmacists are authorized to pharmacy assess your needs and prescribe the necessary vaccines directly during your consultation.'
        },
        {
          question: 'How does the travel consultation work?',
          answer: 'During your consultation, our qualified pharmacist will review your medical history, immunization records, and travel itinerary to create a personalized travel health plan tailored to your destination.'
        }
      ]
    }
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getImgUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80';
    return getImageUrl(img) || 'https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80';
  };

  const uploadImage = async (file) => {
    if (!file || !file.type.startsWith('image/')) { showToast('Select a valid image file', 'error'); return; }
    setIsUploadingImg(true);
    const fd = new FormData(); fd.append('image', file);
    try {
      const res  = await fetch(`${API_URL}/api/services/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.success) { setForm(p => ({ ...p, img: data.url })); showToast('Image uploaded!'); }
      else showToast('Upload failed', 'error');
    } catch { showToast('Network error', 'error'); }
    finally { setIsUploadingImg(false); }
  };

  const logout = () => {
    localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser');
    window.location.replace('/admin');
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    if (!token) { window.location.replace('/admin'); return; }
    try {
      const [resSrv, resApp] = await Promise.all([
        fetch(`${API_URL}/api/services?t=${Date.now()}`, { cache: 'no-store' }),
        fetch(`${API_URL}/api/appointments/admin/all?t=${Date.now()}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
      ]);
      const dataSrv = await resSrv.json();
      const dataApp = await resApp.json();
      if (dataSrv.success) {
        const dbServices = dataSrv.data || [];
        const vaccServices = dbServices.filter(s => 
          (s.parentCategory || '').toLowerCase() === 'vaccination services' ||
          VACCINE_SLUGS.includes(s.slug)
        );
        setServices(vaccServices);
      }
      if (dataApp.success) setAppts(dataApp.data || []);
      await fetchCMS();
    } catch (err) { console.error(err); showToast('Error loading data', 'error'); }
    finally { setLoading(false); }
  };

  const fetchCMS = async () => {
    try {
      const res = await fetch(`${API_URL}/api/vaccination-cms?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.data) {
        setCmsForm(prev => ({
          hero: { ...prev.hero, ...(data.data.hero || {}) },
          gridHeader: { ...prev.gridHeader, ...(data.data.gridHeader || {}) },
          process: {
            ...prev.process,
            ...(data.data.process || {}),
            steps: Array.isArray(data.data.process?.steps) && data.data.process.steps.length > 0
              ? data.data.process.steps
              : prev.process.steps
          },
          faqs: {
            ...prev.faqs,
            ...(data.data.faqs || {}),
            items: Array.isArray(data.data.faqs?.items) && data.data.faqs.items.length > 0
              ? data.data.faqs.items
              : prev.faqs.items
          }
        }));
      }
    } catch (e) {
      console.error('Error fetching Vaccination CMS:', e);
    }
  };

  const handleSaveCMS = async (sectionKey, customPayload) => {
    setIsSavingCMS(true);
    const token = localStorage.getItem('adminToken');
    try {
      const payload = customPayload || { [sectionKey]: cmsForm[sectionKey] };
      const res = await fetch(`${API_URL}/api/vaccination-cms`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Section saved live to public site!');
        if (data.data) {
          setCmsForm(prev => ({
            hero: { ...prev.hero, ...(data.data.hero || {}) },
            gridHeader: { ...prev.gridHeader, ...(data.data.gridHeader || {}) },
            process: {
              ...prev.process,
              ...(data.data.process || {}),
              steps: Array.isArray(data.data.process?.steps) && data.data.process.steps.length > 0
                ? data.data.process.steps
                : prev.process.steps
            },
            faqs: {
              ...prev.faqs,
              ...(data.data.faqs || {}),
              items: Array.isArray(data.data.faqs?.items) && data.data.faqs.items.length > 0
                ? data.data.faqs.items
                : prev.faqs.items
            }
          }));
        }
      } else {
        showToast(data.message || 'Failed to save section', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error saving section', 'error');
    } finally {
      setIsSavingCMS(false);
    }
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 600);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const u = localStorage.getItem('adminUser');
    if (u) setAdminUser(JSON.parse(u));
    fetchData();
  }, []);

  const resetForm = () => setForm({
    title: '', cat: 'Vaccination Care', parentCategory: 'Vaccination Services',
    duration: '15 Mins', desc: '', featuresText: '',
    img: 'https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80',
    color: '#4B2D71', onHome: false
  });

  const openAdd = () => { setModalMode('add'); setSelectedId(null); resetForm(); setIsModalOpen(true); };

  const openEdit = (srv) => {
    setModalMode('edit');
    setSelectedId(srv._id);
    setForm({
      title: srv.title || '', cat: srv.cat || 'Vaccination Care',
      parentCategory: srv.parentCategory || 'Vaccination Services',
      duration: srv.duration || '15 Mins', desc: srv.desc || '',
      featuresText: Array.isArray(srv.features) ? srv.features.join(', ') : (srv.features || ''),
      img: srv.img || 'https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80',
      color: srv.color || '#4B2D71', onHome: srv.onHome !== undefined ? srv.onHome : false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const featuresList = form.featuresText.split(',').map(f => f.trim()).filter(Boolean);
    const payload = {
      title: form.title, slug: slugify(form.title),
      cat: form.cat, parentCategory: form.parentCategory,
      duration: form.duration, desc: form.desc,
      features: featuresList, img: form.img, color: form.color, onHome: form.onHome
    };
    try {
      const url    = modalMode === 'add' ? `${API_URL}/api/services` : `${API_URL}/api/services/${selectedId}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
      const json   = await res.json();
      if (res.ok && json.success) {
        showToast(modalMode === 'add' ? 'Vaccination added!' : 'Vaccination updated!');
        fetchData();
        setIsModalOpen(false);
      } else { showToast(json.message || 'Failed', 'error'); }
    } catch { showToast('Error processing request', 'error'); }
  };

  const handleDelete = async (id, title) => {
    if (!id) {
      showToast('Cannot delete service (missing ID).', 'error');
      return;
    }
    if (!window.confirm(`Delete "${title}"?`)) return;
    const token = localStorage.getItem('adminToken');
    setServices(prev => prev.filter(s => s._id !== id && s.slug !== id));
    try {
      const res  = await fetch(`${API_URL}/api/services/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Deleted successfully');
        fetchData();
      }
      else {
        showToast(json.message || 'Delete failed', 'error');
        fetchData();
      }
    } catch { 
      showToast('Network error', 'error');
      fetchData();
    }
  };

  const filtered = services.filter(s =>
    s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.cat?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dash vacc_page">

      {/* ══ SIDEBAR ══ */}
      <Sidebar activePage="vaccination" />

      {/* ══ MAIN ══ */}
      <div className="dash_main">

        {/* Header */}
        <header className="dash_hdr">
          <div className="dash_hdr_left">
            <h2>Vaccination Manager</h2>
            <p>
              Manage all vaccinations displayed on the <strong>/vaccination</strong> public page and customize page sections.
            </p>
          </div>
        </header>

        {/* Tabs Container */}
        <div className="vacc_tabs_container">
          <button
            type="button"
            className={`vacc_tab_btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Vaccine Services ({services.length})
          </button>
          <button
            type="button"
            className={`vacc_tab_btn ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            Hero &amp; Feature Cards
          </button>
          <button
            type="button"
            className={`vacc_tab_btn ${activeTab === 'gridHeader' ? 'active' : ''}`}
            onClick={() => setActiveTab('gridHeader')}
          >
            Protocols Grid Header
          </button>
          <button
            type="button"
            className={`vacc_tab_btn ${activeTab === 'process' ? 'active' : ''}`}
            onClick={() => setActiveTab('process')}
          >
            3-Step Process ({cmsForm.process?.steps?.length || 0})
          </button>
          <button
            type="button"
            className={`vacc_tab_btn ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => setActiveTab('faqs')}
          >
            Vaccination FAQs ({cmsForm.faqs?.items?.length || 0})
          </button>
        </div>

        {/* TAB 1: Vaccine Services (Untouched & Dedicated) */}
        {activeTab === 'services' && (
          <>
            {/* Toolbar */}
            <div className="vacc_toolbar">
              <div className="vacc_search_wrap">
                <I d={ICONS.search} s={16} />
                <input
                  type="text"
                  className="vacc_search_input"
                  placeholder="Search by vaccine name, description..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="vacc_add_btn" onClick={openAdd}>
                <I d={ICONS.plus} s={16} />
                Add Vaccination Service
              </button>
            </div>

            {/* Stats */}
            <div className="vacc_stats_row">
              <div className="vacc_stat_card total" style={{ minWidth: '280px' }}>
                <div className="vacc_stat_eyebrow">Total Vaccinations</div>
                <div className="vacc_stat_num">{services.length}</div>
                <div className="vacc_stat_label">All Vaccines Live on Website</div>
              </div>
            </div>

            {/* Cards */}
            <div className="vacc_content">
              {loading ? (
                <div className="vacc_loading">
                  <div className="vacc_spinner" />
                  Loading vaccination services...
                </div>
              ) : filtered.length === 0 ? (
                <div className="vacc_empty">
                  <h3>No Vaccination Services Found</h3>
                  <p>Click "Add Vaccination Service" to add your first vaccine.</p>
                </div>
              ) : (
                VACC_CATEGORIES.map(catDef => {
                  const catServices = filtered;
                  if (catServices.length === 0) return null;
                  return (
                    <div key={catDef.name} className="vacc_cat_section">
                      <div className="vacc_cat_header">
                        <div className="vacc_cat_stripe" style={{ background: catDef.color }} />
                        <h3 className="vacc_cat_name">{catDef.name}</h3>
                        <span className="vacc_cat_count">{catServices.length} vaccines</span>
                      </div>

                      <div className="vacc_card_grid">
                        {catServices.map(srv => {
                          const cardColor = srv.color && srv.color.startsWith('#') ? srv.color : catDef.color;
                          return (
                            <div key={srv._id || srv.slug} className="vacc_card">
                              {/* Banner */}
                              <div
                                className="vacc_card_banner"
                                style={{ background: `linear-gradient(135deg, ${cardColor} 0%, #0f0520 100%)` }}
                              >
                                {srv.img && (
                                  <img src={getImgUrl(srv.img)} alt={srv.title} />
                                )}
                                <div className="vacc_card_banner_overlay" />
                                <div
                                  className="vacc_card_accent_dot"
                                  style={{ '--dot-color': catDef.dot }}
                                />
                                <div className="vacc_card_banner_content">
                                  <span className="vacc_card_cat_tag">{srv.cat}</span>
                                  <h4 className="vacc_card_title_text">{srv.title}</h4>
                                </div>
                              </div>

                              {/* Body */}
                              <div className="vacc_card_body">
                                <p className="vacc_card_desc">{srv.desc}</p>
                                <div className="vacc_card_meta">
                                  {srv.duration && (
                                    <span className="vacc_meta_pill">
                                      <I d={ICONS.clock} s={11} />
                                      {srv.duration}
                                    </span>
                                  )}
                                  {srv.slug && (
                                    <span className="vacc_slug_pill">{srv.slug}</span>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="vacc_card_actions">
                                <button className="vacc_btn_edit" onClick={() => openEdit(srv)}>
                                  <I d={ICONS.edit} s={13} /> Edit
                                </button>
                                <button className="vacc_btn_delete" onClick={() => handleDelete(srv._id, srv.title)}>
                                  <I d={ICONS.trash} s={13} /> Delete
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* TAB 2: Hero & Feature Cards */}
        {activeTab === 'hero' && (
          <div className="vcms_card_wrap">
            <div className="vcms_card">
              <div className="vcms_header">
                <h3 className="vcms_title">Hero Banner &amp; Informational Cards</h3>
                <p className="vcms_sub">Customize the introductory text, action buttons, and the 3 informational cards at the top of /vaccination.</p>
              </div>

              <form onSubmit={e => { e.preventDefault(); handleSaveCMS('hero'); }}>
                <div className="vcms_grid_2" style={{ marginBottom: 18 }}>
                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Pill / Badge Tag</label>
                    <input
                      type="text"
                      className="vacc_form_input"
                      value={cmsForm.hero.pillBadge}
                      onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, pillBadge: e.target.value } })}
                      placeholder="e.g. Travel & Routine Pharmacy Services"
                      required
                    />
                  </div>
                  <div className="vcms_grid_2">
                    <div className="vacc_form_group">
                      <label className="vacc_form_label">Title Prefix</label>
                      <input
                        type="text"
                        className="vacc_form_input"
                        value={cmsForm.hero.titlePrefix}
                        onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, titlePrefix: e.target.value } })}
                        placeholder="e.g. Pharmacy "
                      />
                    </div>
                    <div className="vacc_form_group">
                      <label className="vacc_form_label">Highlighted Text (Gradient)</label>
                      <input
                        type="text"
                        className="vacc_form_input"
                        value={cmsForm.hero.titleHighlight}
                        onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, titleHighlight: e.target.value } })}
                        placeholder="e.g. Vaccination Services"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="vacc_form_group" style={{ marginBottom: 18 }}>
                  <label className="vacc_form_label">Lead Introduction Paragraph</label>
                  <textarea
                    className="vacc_form_textarea"
                    rows="3"
                    value={cmsForm.hero.leadText}
                    onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, leadText: e.target.value } })}
                    placeholder="Enter hero lead description..."
                    required
                  />
                </div>

                <div className="vcms_grid_3" style={{ marginBottom: 24 }}>
                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Primary Button Text</label>
                    <input
                      type="text"
                      className="vacc_form_input"
                      value={cmsForm.hero.primaryBtnText}
                      onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, primaryBtnText: e.target.value } })}
                      placeholder="e.g. Book Consultation"
                      required
                    />
                  </div>
                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Primary Button Link</label>
                    <input
                      type="text"
                      className="vacc_form_input"
                      value={cmsForm.hero.primaryBtnLink}
                      onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, primaryBtnLink: e.target.value } })}
                      placeholder="e.g. /book-appointment"
                      required
                    />
                  </div>
                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Secondary Button Text</label>
                    <input
                      type="text"
                      className="vacc_form_input"
                      value={cmsForm.hero.secondaryBtnText}
                      onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, secondaryBtnText: e.target.value } })}
                      placeholder="e.g. Explore Vaccines"
                      required
                    />
                  </div>
                </div>

                <div className="vcms_header" style={{ marginTop: 24, marginBottom: 18 }}>
                  <h4 style={{ margin: 0, color: 'var(--vacc-purple)', fontSize: '1.05rem', fontWeight: 800 }}>
                    3 Informational Feature Cards
                  </h4>
                </div>

                <div className="vcms_grid_3">
                  {/* Card 1 */}
                  <div className="vcms_subcard">
                    <div className="vcms_subcard_title">Card 1: Travel Health</div>
                    <div className="vacc_form_group" style={{ marginBottom: 12 }}>
                      <label className="vacc_form_label">Badge Tag</label>
                      <input
                        type="text"
                        className="vacc_form_input"
                        value={cmsForm.hero.card1Badge}
                        onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, card1Badge: e.target.value } })}
                        placeholder="e.g. World Health Approved"
                      />
                    </div>
                    <div className="vacc_form_group" style={{ marginBottom: 12 }}>
                      <label className="vacc_form_label">Card Title</label>
                      <input
                        type="text"
                        className="vacc_form_input"
                        value={cmsForm.hero.card1Title}
                        onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, card1Title: e.target.value } })}
                        placeholder="e.g. Travel Health Service"
                      />
                    </div>
                    <div className="vacc_form_group">
                      <label className="vacc_form_label">Description</label>
                      <textarea
                        className="vacc_form_textarea"
                        rows="3"
                        value={cmsForm.hero.card1Desc}
                        onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, card1Desc: e.target.value } })}
                      />
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="vcms_subcard">
                    <div className="vcms_subcard_title">Card 2: Seasonal Wellness</div>
                    <div className="vacc_form_group" style={{ marginBottom: 12 }}>
                      <label className="vacc_form_label">Badge Tag</label>
                      <input
                        type="text"
                        className="vacc_form_input"
                        value={cmsForm.hero.card2Badge}
                        onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, card2Badge: e.target.value } })}
                        placeholder="e.g. NHS & Private"
                      />
                    </div>
                    <div className="vacc_form_group" style={{ marginBottom: 12 }}>
                      <label className="vacc_form_label">Card Title</label>
                      <input
                        type="text"
                        className="vacc_form_input"
                        value={cmsForm.hero.card2Title}
                        onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, card2Title: e.target.value } })}
                        placeholder="e.g. Seasonal Wellness"
                      />
                    </div>
                    <div className="vacc_form_group">
                      <label className="vacc_form_label">Description</label>
                      <textarea
                        className="vacc_form_textarea"
                        rows="3"
                        value={cmsForm.hero.card2Desc}
                        onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, card2Desc: e.target.value } })}
                      />
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="vcms_subcard">
                    <div className="vcms_subcard_title">Card 3: Routine Immunisations</div>
                    <div className="vacc_form_group" style={{ marginBottom: 12 }}>
                      <label className="vacc_form_label">Badge Tag</label>
                      <input
                        type="text"
                        className="vacc_form_input"
                        value={cmsForm.hero.card3Badge}
                        onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, card3Badge: e.target.value } })}
                        placeholder="e.g. Schedule Support"
                      />
                    </div>
                    <div className="vacc_form_group" style={{ marginBottom: 12 }}>
                      <label className="vacc_form_label">Card Title</label>
                      <input
                        type="text"
                        className="vacc_form_input"
                        value={cmsForm.hero.card3Title}
                        onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, card3Title: e.target.value } })}
                        placeholder="e.g. Routine Immunisations"
                      />
                    </div>
                    <div className="vacc_form_group">
                      <label className="vacc_form_label">Description</label>
                      <textarea
                        className="vacc_form_textarea"
                        rows="3"
                        value={cmsForm.hero.card3Desc}
                        onChange={e => setCmsForm({ ...cmsForm, hero: { ...cmsForm.hero, card3Desc: e.target.value } })}
                      />
                    </div>
                  </div>
                </div>

                <div className="vcms_save_bar">
                  <button type="submit" className="vcms_btn_save" disabled={isSavingCMS}>
                    {isSavingCMS ? 'Saving...' : '💾 Save Hero Section'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: Protocols Grid Header */}
        {activeTab === 'gridHeader' && (
          <div className="vcms_card_wrap">
            <div className="vcms_card">
              <div className="vcms_header">
                <h3 className="vcms_title">Protocols Grid Section Headline</h3>
                <p className="vcms_sub">Customize the headline and badge displayed directly above the 12 vaccination cards.</p>
              </div>

              <form onSubmit={e => { e.preventDefault(); handleSaveCMS('gridHeader'); }}>
                <div className="vcms_grid_2" style={{ marginBottom: 18 }}>
                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Section Badge</label>
                    <input
                      type="text"
                      className="vacc_form_input"
                      value={cmsForm.gridHeader.badge}
                      onChange={e => setCmsForm({ ...cmsForm, gridHeader: { ...cmsForm.gridHeader, badge: e.target.value } })}
                      placeholder="e.g. Our Protocols"
                      required
                    />
                  </div>
                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Section Main Title</label>
                    <input
                      type="text"
                      className="vacc_form_input"
                      value={cmsForm.gridHeader.title}
                      onChange={e => setCmsForm({ ...cmsForm, gridHeader: { ...cmsForm.gridHeader, title: e.target.value } })}
                      placeholder="e.g. Premium Vaccinations"
                      required
                    />
                  </div>
                </div>

                <div className="vacc_form_group" style={{ marginBottom: 18 }}>
                  <label className="vacc_form_label">Section Subtitle / Description</label>
                  <textarea
                    className="vacc_form_textarea"
                    rows="3"
                    value={cmsForm.gridHeader.desc}
                    onChange={e => setCmsForm({ ...cmsForm, gridHeader: { ...cmsForm.gridHeader, desc: e.target.value } })}
                    placeholder="Enter subtitle for vaccine cards grid..."
                    required
                  />
                </div>

                <div className="vcms_save_bar">
                  <button type="submit" className="vcms_btn_save" disabled={isSavingCMS}>
                    {isSavingCMS ? 'Saving...' : '💾 Save Grid Headline'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: 3-Step Process */}
        {activeTab === 'process' && (
          <div className="vcms_card_wrap">
            <div className="vcms_card">
              <div className="vcms_header">
                <h3 className="vcms_title">3-Step Process Timeline</h3>
                <p className="vcms_sub">Customize the "Seamless Immunity" process steps displayed on the vaccination page.</p>
              </div>

              <form onSubmit={e => { e.preventDefault(); handleSaveCMS('process'); }}>
                <div className="vcms_grid_2" style={{ marginBottom: 18 }}>
                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Eyebrow Tag</label>
                    <input
                      type="text"
                      className="vacc_form_input"
                      value={cmsForm.process.eyebrow}
                      onChange={e => setCmsForm({ ...cmsForm, process: { ...cmsForm.process, eyebrow: e.target.value } })}
                      placeholder="e.g. Pharmacy Protocol"
                      required
                    />
                  </div>
                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Section Title</label>
                    <input
                      type="text"
                      className="vacc_form_input"
                      value={cmsForm.process.title}
                      onChange={e => setCmsForm({ ...cmsForm, process: { ...cmsForm.process, title: e.target.value } })}
                      placeholder="e.g. Seamless Immunity."
                      required
                    />
                  </div>
                </div>

                <div className="vacc_form_group" style={{ marginBottom: 24 }}>
                  <label className="vacc_form_label">Lead Description</label>
                  <textarea
                    className="vacc_form_textarea"
                    rows="2"
                    value={cmsForm.process.lead}
                    onChange={e => setCmsForm({ ...cmsForm, process: { ...cmsForm.process, lead: e.target.value } })}
                    placeholder="Enter process lead description..."
                    required
                  />
                </div>

                <div className="vcms_header" style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, color: 'var(--vacc-purple)', fontSize: '1.05rem', fontWeight: 800 }}>
                    Process Steps ({cmsForm.process.steps?.length || 0})
                  </h4>
                  <button
                    type="button"
                    className="vcms_btn_add"
                    onClick={() => {
                      const nextNum = String((cmsForm.process.steps?.length || 0) + 1).padStart(2, '0');
                      setCmsForm({
                        ...cmsForm,
                        process: {
                          ...cmsForm.process,
                          steps: [
                            ...(cmsForm.process.steps || []),
                            { number: nextNum, title: 'New Step', description: 'Step description details.' }
                          ]
                        }
                      });
                    }}
                  >
                    ➕ Add Process Step
                  </button>
                </div>

                {(cmsForm.process.steps || []).map((step, idx) => (
                  <div key={idx} className="vcms_subcard">
                    <div className="vcms_subcard_title">
                      <span>Step {idx + 1} ({step.number || `0${idx + 1}`})</span>
                      {cmsForm.process.steps.length > 1 && (
                        <button
                          type="button"
                          className="vcms_btn_remove"
                          onClick={() => {
                            const newSteps = cmsForm.process.steps.filter((_, i) => i !== idx);
                            setCmsForm({
                              ...cmsForm,
                              process: { ...cmsForm.process, steps: newSteps }
                            });
                          }}
                        >
                          ✕ Remove Step
                        </button>
                      )}
                    </div>
                    <div className="vcms_grid_2" style={{ marginBottom: 12 }}>
                      <div className="vacc_form_group">
                        <label className="vacc_form_label">Step Number Badge</label>
                        <input
                          type="text"
                          className="vacc_form_input"
                          value={step.number}
                          onChange={e => {
                            const newSteps = [...cmsForm.process.steps];
                            newSteps[idx].number = e.target.value;
                            setCmsForm({ ...cmsForm, process: { ...cmsForm.process, steps: newSteps } });
                          }}
                          placeholder="e.g. 01"
                        />
                      </div>
                      <div className="vacc_form_group">
                        <label className="vacc_form_label">Step Title</label>
                        <input
                          type="text"
                          className="vacc_form_input"
                          value={step.title}
                          onChange={e => {
                            const newSteps = [...cmsForm.process.steps];
                            newSteps[idx].title = e.target.value;
                            setCmsForm({ ...cmsForm, process: { ...cmsForm.process, steps: newSteps } });
                          }}
                          placeholder="e.g. PHARMACY Consultation"
                          required
                        />
                      </div>
                    </div>
                    <div className="vacc_form_group">
                      <label className="vacc_form_label">Step Description</label>
                      <textarea
                        className="vacc_form_textarea"
                        rows="2"
                        value={step.description}
                        onChange={e => {
                          const newSteps = [...cmsForm.process.steps];
                          newSteps[idx].description = e.target.value;
                          setCmsForm({ ...cmsForm, process: { ...cmsForm.process, steps: newSteps } });
                        }}
                        placeholder="Enter step details..."
                        required
                      />
                    </div>
                  </div>
                ))}

                <div className="vcms_save_bar">
                  <button type="submit" className="vcms_btn_save" disabled={isSavingCMS}>
                    {isSavingCMS ? 'Saving...' : '💾 Save Process Steps'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: Vaccination FAQs */}
        {activeTab === 'faqs' && (
          <div className="vcms_card_wrap">
            <div className="vcms_card">
              <div className="vcms_header">
                <h3 className="vcms_title">Vaccination FAQs Accordion</h3>
                <p className="vcms_sub">Manage the frequently asked questions displayed at the bottom of /vaccination.</p>
              </div>

              <form onSubmit={e => { e.preventDefault(); handleSaveCMS('faqs'); }}>
                <div className="vcms_grid_2" style={{ marginBottom: 18 }}>
                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Eyebrow Tag</label>
                    <input
                      type="text"
                      className="vacc_form_input"
                      value={cmsForm.faqs.eyebrow}
                      onChange={e => setCmsForm({ ...cmsForm, faqs: { ...cmsForm.faqs, eyebrow: e.target.value } })}
                      placeholder="e.g. PHARMACY Knowledge"
                      required
                    />
                  </div>
                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Section Title</label>
                    <input
                      type="text"
                      className="vacc_form_input"
                      value={cmsForm.faqs.title}
                      onChange={e => setCmsForm({ ...cmsForm, faqs: { ...cmsForm.faqs, title: e.target.value } })}
                      placeholder="e.g. Vaccination FAQ."
                      required
                    />
                  </div>
                </div>

                <div className="vacc_form_group" style={{ marginBottom: 24 }}>
                  <label className="vacc_form_label">Lead Description</label>
                  <textarea
                    className="vacc_form_textarea"
                    rows="2"
                    value={cmsForm.faqs.lead}
                    onChange={e => setCmsForm({ ...cmsForm, faqs: { ...cmsForm.faqs, lead: e.target.value } })}
                    placeholder="Enter FAQ description..."
                    required
                  />
                </div>

                <div className="vcms_header" style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, color: 'var(--vacc-purple)', fontSize: '1.05rem', fontWeight: 800 }}>
                    FAQ Q&amp;A Items ({cmsForm.faqs.items?.length || 0})
                  </h4>
                  <button
                    type="button"
                    className="vcms_btn_add"
                    onClick={() => {
                      setCmsForm({
                        ...cmsForm,
                        faqs: {
                          ...cmsForm.faqs,
                          items: [
                            ...(cmsForm.faqs.items || []),
                            { question: 'New Question?', answer: 'Answer details here.' }
                          ]
                        }
                      });
                    }}
                  >
                    ➕ Add New FAQ
                  </button>
                </div>

                {(cmsForm.faqs.items || []).map((item, idx) => (
                  <div key={idx} className="vcms_subcard">
                    <div className="vcms_subcard_title">
                      <span>FAQ Question {idx + 1}</span>
                      {cmsForm.faqs.items.length > 1 && (
                        <button
                          type="button"
                          className="vcms_btn_remove"
                          onClick={() => {
                            const newItems = cmsForm.faqs.items.filter((_, i) => i !== idx);
                            setCmsForm({
                              ...cmsForm,
                              faqs: { ...cmsForm.faqs, items: newItems }
                            });
                          }}
                        >
                          ✕ Remove FAQ
                        </button>
                      )}
                    </div>
                    <div className="vacc_form_group" style={{ marginBottom: 12 }}>
                      <label className="vacc_form_label">Question</label>
                      <input
                        type="text"
                        className="vacc_form_input"
                        value={item.question}
                        onChange={e => {
                          const newItems = [...cmsForm.faqs.items];
                          newItems[idx].question = e.target.value;
                          setCmsForm({ ...cmsForm, faqs: { ...cmsForm.faqs, items: newItems } });
                        }}
                        placeholder="e.g. When should I book my travel vaccinations?"
                        required
                      />
                    </div>
                    <div className="vacc_form_group">
                      <label className="vacc_form_label">Answer</label>
                      <textarea
                        className="vacc_form_textarea"
                        rows="3"
                        value={item.answer}
                        onChange={e => {
                          const newItems = [...cmsForm.faqs.items];
                          newItems[idx].answer = e.target.value;
                          setCmsForm({ ...cmsForm, faqs: { ...cmsForm.faqs, items: newItems } });
                        }}
                        placeholder="Enter comprehensive answer..."
                        required
                      />
                    </div>
                  </div>
                ))}

                <div className="vcms_save_bar">
                  <button type="submit" className="vcms_btn_save" disabled={isSavingCMS}>
                    {isSavingCMS ? 'Saving...' : '💾 Save Vaccination FAQs'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* ══ MODAL (For Vaccine Services) ══ */}
      {isModalOpen && (
        <div className="vacc_modal_overlay" onClick={() => setIsModalOpen(false)}>
          <div className="vacc_modal" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="vacc_modal_header">
              <div>
                <div className="vacc_modal_title">
                  {modalMode === 'add' ? 'Add Vaccination Service' : 'Edit Vaccination Service'}
                </div>
                <p className="vacc_modal_sub">
                  This service will appear on the public /vaccination page.
                </p>
              </div>
              <button className="vacc_modal_close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div className="vacc_modal_body">

                <div className="vacc_form_divider">Basic Info</div>

                <div className="vacc_form_grid">
                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Vaccine Name <span>*</span></label>
                    <input
                      type="text"
                      className="vacc_form_input"
                      placeholder="e.g. Yellow Fever Vaccination"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Category Badge</label>
                    <input
                      type="text"
                      className="vacc_form_input"
                      placeholder="e.g. Travel Health, Seasonal..."
                      value={form.cat}
                      onChange={e => setForm({ ...form, cat: e.target.value })}
                    />
                  </div>
                </div>

                <div className="vacc_form_grid">
                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Parent Category</label>
                    <input
                      type="text"
                      className="vacc_form_input"
                      value={form.parentCategory}
                      onChange={e => setForm({ ...form, parentCategory: e.target.value })}
                    />
                  </div>

                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Duration</label>
                    <input
                      type="text"
                      className="vacc_form_input"
                      placeholder="e.g. 15 Mins"
                      value={form.duration}
                      onChange={e => setForm({ ...form, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="vacc_form_group">
                  <label className="vacc_form_label">Short Description</label>
                  <textarea
                    className="vacc_form_textarea"
                    rows="2"
                    placeholder="Brief description shown on the card..."
                    value={form.desc}
                    onChange={e => setForm({ ...form, desc: e.target.value })}
                  />
                </div>

                <div className="vacc_form_group">
                  <label className="vacc_form_label">Key Features / Tags (comma separated)</label>
                  <input
                    type="text"
                    className="vacc_form_input"
                    placeholder="e.g. Official Certificate, Single Dose, Walk-in Available"
                    value={form.featuresText}
                    onChange={e => setForm({ ...form, featuresText: e.target.value })}
                  />
                </div>

                <div className="vacc_form_divider">Media &amp; Appearance</div>

                {/* Image Upload Mode Toggle */}
                <div className="vacc_form_group">
                  <label className="vacc_form_label">Service Image</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <button
                      type="button"
                      className={`vacc_tab_btn ${imgUploadMode === 'url' ? 'active' : ''}`}
                      style={{ padding: '4px 12px', fontSize: '0.8rem', borderRadius: '6px' }}
                      onClick={() => setImgUploadMode('url')}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      className={`vacc_tab_btn ${imgUploadMode === 'upload' ? 'active' : ''}`}
                      style={{ padding: '4px 12px', fontSize: '0.8rem', borderRadius: '6px' }}
                      onClick={() => setImgUploadMode('upload')}
                    >
                      Upload File
                    </button>
                  </div>

                  {imgUploadMode === 'url' ? (
                    <input
                      type="text"
                      className="vacc_form_input"
                      placeholder="https://images.unsplash.com/... or /images/..."
                      value={form.img}
                      onChange={e => setForm({ ...form, img: e.target.value })}
                    />
                  ) : (
                    <div
                      style={{
                        border: `2px dashed ${isDragging ? 'var(--vacc-purple)' : '#cbd5e1'}`,
                        borderRadius: '10px',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: isDragging ? 'rgba(75, 45, 113, 0.05)' : '#fafafa'
                      }}
                      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={e => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files[0];
                        if (file) uploadImage(file);
                      }}
                      onClick={() => document.getElementById('vacc_file_input')?.click()}
                    >
                      <input
                        type="file"
                        id="vacc_file_input"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) uploadImage(file);
                        }}
                      />
                      {isUploadingImg ? (
                        <p style={{ margin: 0, color: 'var(--vacc-purple)', fontWeight: 600 }}>Uploading image...</p>
                      ) : (
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
                          📁 Drag &amp; drop an image here, or <strong style={{ color: 'var(--vacc-purple)' }}>browse</strong>
                        </p>
                      )}
                    </div>
                  )}

                  {form.img && (
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={getImgUrl(form.img)}
                        alt="Preview"
                        style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: '#64748b', wordBreak: 'break-all' }}>{form.img}</span>
                    </div>
                  )}
                </div>

                <div className="vacc_form_grid">
                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Card Accent Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={form.color}
                        onChange={e => setForm({ ...form, color: e.target.value })}
                        style={{ width: '40px', height: '36px', padding: 2, border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        className="vacc_form_input"
                        value={form.color}
                        onChange={e => setForm({ ...form, color: e.target.value })}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="vacc_form_group checkbox" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <input
                    type="checkbox"
                    id="vacc_onHome"
                    checked={form.onHome}
                    onChange={e => setForm({ ...form, onHome: e.target.checked })}
                  />
                  <label htmlFor="vacc_onHome" className="vacc_form_label" style={{ margin: 0, cursor: 'pointer' }}>
                    Show in homepage Services List preview
                  </label>
                </div>

              </div>

              {/* Footer */}
              <div className="vacc_modal_footer">
                <button type="button" className="vacc_modal_btn_cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="vacc_modal_btn_save">
                  {modalMode === 'add' ? 'Add Vaccination' : 'Save Changes'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`adm_toast ${toast.type === 'error' ? 'error' : 'success'}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}

    </div>
  );
}
