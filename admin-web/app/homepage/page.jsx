'use client';

import { API_URL } from '@/config';
import React, { useState, useEffect } from 'react';
import '../patients/dashboard.css';
import '../services/services.css';

/* ── SVG Icons ── */
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
  trash:   "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2",
  doc:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  info:    "M12 16v-4 M12 8h.01 M12 2a10 10 0 1010 10A10 10 0 0012 2z",
  globe:   "M12 2a10 10 0 1010 10A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
};

export default function HomepageCMSPage() {
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Tabs: 'hero' | 'about' | 'services' | 'how' | 'testimonials' | 'ctas' | 'seo'
  const [activeTab, setActiveTab] = useState('hero');

  // Full Homepage Configuration State
  const [cmsData, setCmsData] = useState({
    heroSlides: [],
    heroStats: [],
    aboutSection: { title: '', subtitle: '', desc: '', image: '', yearsExperience: '', experienceLabel: '', features: [], ctaText: '', ctaUrl: '' },
    servicesSection: { title: '', subtitle: '', desc: '' },
    howItWorks: { title: '', subtitle: '', desc: '', steps: [] },
    testimonials: { title: '', subtitle: '', desc: '', reviews: [] },
    appointmentCta: { title: '', subtitle: '', desc: '', image: '', ctaText: '', ctaUrl: '' },
    footerCta: { title: '', ctaText: '', ctaUrl: '' },
    seoSettings: { metaTitle: '', metaDescription: '', metaKeywords: '', canonicalUrl: '', ogTitle: '', ogDescription: '', ogImage: '' }
  });

  // Custom Modal dialogs
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 800);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.replace('/admin');
  };

  const fetchCmsData = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.replace('/admin');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/homepage`);
      const resJson = await res.json();
      if (resJson.success && resJson.data) {
        setCmsData(resJson.data);
      } else {
        triggerAlert('Failed to load Homepage CMS payload.');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Failed to establish connection to database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (user) setAdminUser(JSON.parse(user));
    fetchCmsData();
  }, []);

  // Save changes to backend
  const handlePublish = async () => {
    setPublishing(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/homepage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(cmsData)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Homepage contents successfully published live!');
        setCmsData(data.data);
      } else {
        triggerAlert(data.message || 'Failed to save changes.');
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Error saving homepage configurations.');
    } finally {
      setPublishing(false);
    }
  };

  // Re-seed default configurations
  const handleReSeed = async () => {
    const approved = await triggerConfirm('Are you sure you want to reset all homepage contents back to clinical defaults? Any unsaved custom headings, button names, and images will be overwritten.');
    if (!approved) return;

    setLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/homepage/seed`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Homepage CMS re-seeded successfully.');
        setCmsData(data.data);
      } else {
        triggerAlert('Seeding failed: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      triggerAlert('Error running seed script.');
    } finally {
      setLoading(false);
    }
  };

  // Helper helpers to modify nested arrays/objects safely
  const updateSlide = (idx, field, value) => {
    setCmsData(prev => {
      const slides = [...prev.heroSlides];
      slides[idx] = { ...slides[idx], [field]: value };
      return { ...prev, heroSlides: slides };
    });
  };

  const addSlide = () => {
    setCmsData(prev => ({
      ...prev,
      heroSlides: [...prev.heroSlides, {
        badge: '✦ New Healthcare Feature',
        words1: ['Your', 'Heading'],
        words2: ['Text', 'Here'],
        desc: 'New slide description details.',
        cta: 'Book Now',
        ctaUrl: '/book-appointment',
        secondaryCta: 'Our Services',
        secondaryCtaUrl: '/services',
        image: '/images/0a198cad-eabf-40b6-81dc-45dbd61ed432.png',
        fallback: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=90',
        overlay: ['rgba(15,4,40,0.70)', 'rgba(15,4,40,0.20)']
      }]
    }));
  };

  const deleteSlide = (idx) => {
    if (cmsData.heroSlides.length <= 1) {
      triggerAlert('You must keep at least one hero slide active.');
      return;
    }
    setCmsData(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((_, i) => i !== idx)
    }));
  };

  const updateStat = (idx, field, value) => {
    setCmsData(prev => {
      const stats = [...prev.heroStats];
      stats[idx] = { ...stats[idx], [field]: value };
      return { ...prev, heroStats: stats };
    });
  };

  const updateAbout = (field, value) => {
    setCmsData(prev => ({
      ...prev,
      aboutSection: { ...prev.aboutSection, [field]: value }
    }));
  };

  const updateAboutFeature = (idx, field, value) => {
    setCmsData(prev => {
      const features = [...prev.aboutSection.features];
      features[idx] = { ...features[idx], [field]: value };
      return { ...prev, aboutSection: { ...prev.aboutSection, features } };
    });
  };

  const updateServices = (field, value) => {
    setCmsData(prev => ({
      ...prev,
      servicesSection: { ...prev.servicesSection, [field]: value }
    }));
  };

  const updateHow = (field, value) => {
    setCmsData(prev => ({
      ...prev,
      howItWorks: { ...prev.howItWorks, [field]: value }
    }));
  };

  const updateHowStep = (idx, field, value) => {
    setCmsData(prev => {
      const steps = [...prev.howItWorks.steps];
      steps[idx] = { ...steps[idx], [field]: value };
      return { ...prev, howItWorks: { ...prev.howItWorks, steps } };
    });
  };

  const updateTestimonial = (field, value) => {
    setCmsData(prev => ({
      ...prev,
      testimonials: { ...prev.testimonials, [field]: value }
    }));
  };

  const updateReview = (idx, field, value) => {
    setCmsData(prev => {
      const reviews = [...prev.testimonials.reviews];
      reviews[idx] = { ...reviews[idx], [field]: value };
      return { ...prev, testimonials: { ...prev.testimonials, reviews } };
    });
  };

  const deleteReview = (idx) => {
    setCmsData(prev => ({
      ...prev,
      testimonials: { ...prev.testimonials, reviews: prev.testimonials.reviews.filter((_, i) => i !== idx) }
    }));
  };

  const addReview = () => {
    setCmsData(prev => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        reviews: [...prev.testimonials.reviews, { name: 'New Patient', role: 'Local Resident', text: 'Excellent service.', rating: 5, avatar: '/images/reviews/sarah.jpg' }]
      }
    }));
  };

  const updateAppointmentCta = (field, value) => {
    setCmsData(prev => ({
      ...prev,
      appointmentCta: { ...prev.appointmentCta, [field]: value }
    }));
  };

  const updateFooterCta = (field, value) => {
    setCmsData(prev => ({
      ...prev,
      footerCta: { ...prev.footerCta, [field]: value }
    }));
  };

  const updateSeo = (field, value) => {
    setCmsData(prev => ({
      ...prev,
      seoSettings: { ...prev.seoSettings, [field]: value }
    }));
  };

  const nav = [
    {label:'Dashboard',    path:'/admin/patients',                   icon:ICONS.home},
    {label:'Appointments', path:'/admin/appointments',               icon:ICONS.cal},
    {label:'Patients',     path:'/admin/patients?view=patients',     icon:ICONS.users},
    {label:'Schedule Manager', path:'/admin/schedule',               icon:ICONS.cal},
    {label:'Compliance',   path:'/admin/compliance',                 icon:ICONS.shield},
    {label:'Services & Content', path:'/admin/services',             icon:ICONS.edit},
    {label:'Homepage CMS', path:'/admin/homepage',                   icon:ICONS.globe, active: true},
    {label:'Blog Manager', path:'/admin/blog',                       icon:ICONS.doc},
    {label:'About Page',   path:'/admin/about',                      icon:ICONS.info},
  ];

  return (
    <div className="dash">
      {/* Sidebar navigation */}
      <div className="dash_sb">
        <div className="sb_logo">
          <div className="sb_logo_mark">W</div>
          <div className="sb_logo_name">West Chemist <small>Superintendent Admin</small></div>
        </div>
        <div style={{padding:'0 14px', flexGrow: 1}}>
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
        <div className="sb_foot">
          <div className="sb_user" style={{justifyContent:'space-between'}}>
            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
              <div className="sb_av">{adminUser ? adminUser.username.substring(0,2).toUpperCase() : 'AD'}</div>
              <div className="sb_uname">{adminUser ? adminUser.username : 'Admin'}</div>
            </div>
            <button onClick={logout} style={{background:'none', border:'none', color:'var(--t3)', cursor:'pointer', padding:'4px'}} title="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={ICONS.logout}/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="dash_main">
        <header className="dash_hdr" style={{ paddingLeft: '36px', paddingRight: '36px' }}>
          <div className="dash_hdr_left">
            <h2>Homepage CMS Manager</h2>
            <p>Edit every text, slider, badge, image, and SEO field on the clinic home page dynamically.</p>
          </div>
          <div className="dash_hdr_right" style={{ gap: '12px' }}>
            <button className="bk_btn_secondary btn_reset" onClick={handleReSeed} disabled={loading || publishing} style={{ width: 'auto', padding: '10px 18px' }}>
              Reset to Defaults
            </button>
            <button className="srv_add_btn" onClick={handlePublish} disabled={loading || publishing} style={{ width: 'auto', background: 'var(--purple-grad)' }}>
              {publishing ? 'Publishing...' : 'Publish Live Changes'}
            </button>
          </div>
        </header>

        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>
            <div className="adm_spinner" style={{ margin: '0 auto 16px' }} />
            <span>Loading Homepage configurations...</span>
          </div>
        ) : (
          <div className="cnt_layout" style={{ paddingLeft: '36px', paddingRight: '36px', boxSizing: 'border-box' }}>
            {/* Tabs Sidebar */}
            <div className="cnt_sidebar">
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '4px 14px' }}>Sections</div>
              <button className={`cnt_sidebar_btn ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>Hero Slider & Stats</button>
              <button className={`cnt_sidebar_btn ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About Section</button>
              <button className={`cnt_sidebar_btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Services Intro</button>
              <button className={`cnt_sidebar_btn ${activeTab === 'how' ? 'active' : ''}`} onClick={() => setActiveTab('how')}>How It Works</button>
              <button className={`cnt_sidebar_btn ${activeTab === 'testimonials' ? 'active' : ''}`} onClick={() => setActiveTab('testimonials')}>Patient Testimonials</button>
              <button className={`cnt_sidebar_btn ${activeTab === 'ctas' ? 'active' : ''}`} onClick={() => setActiveTab('ctas')}>CTAs & Promotions</button>
              <button className={`cnt_sidebar_btn ${activeTab === 'seo' ? 'active' : ''}`} onClick={() => setActiveTab('seo')}>SEO Metadata</button>
            </div>

            {/* Tab Forms */}
            <div className="cnt_form_panel">
              
              {/* TAB 1: Hero Slider */}
              {activeTab === 'hero' && (
                <div>
                  <div className="cnt_form_title">Hero Slider Slides & Statistics</div>
                  <div className="cnt_form_sub">Update background images, title word groupings, and slider CTAs.</div>
                  
                  {cmsData.heroSlides.map((slide, sIdx) => (
                    <div key={sIdx} style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <strong style={{ color: 'var(--purple)' }}>Slide #{sIdx + 1} Configuration</strong>
                        <button className="action_link_btn cancel" onClick={() => deleteSlide(sIdx)} style={{ width: 'auto', padding: '4px 10px', fontSize: '0.78rem' }}>
                          <I d={ICONS.trash} s={12} /> Delete Slide
                        </button>
                      </div>

                      <div className="srv_form_grid">
                        <div className="srv_form_group">
                          <label className="srv_label">Top Badge Label</label>
                          <input type="text" className="srv_input" value={slide.badge} onChange={e => updateSlide(sIdx, 'badge', e.target.value)} />
                        </div>
                        <div className="srv_form_group">
                          <label className="srv_label">Slide Image Link</label>
                          <input type="text" className="srv_input" value={slide.image} onChange={e => updateSlide(sIdx, 'image', e.target.value)} />
                        </div>
                        <div className="srv_form_group">
                          <label className="srv_label">Primary Heading Rows (Words Row 1 - Comma-Separated)</label>
                          <input type="text" className="srv_input" value={slide.words1.join(', ')} onChange={e => updateSlide(sIdx, 'words1', e.target.value.split(',').map(w => w.trim()))} />
                        </div>
                        <div className="srv_form_group">
                          <label className="srv_label">Primary Heading Accent Rows (Words Row 2 - Comma-Separated)</label>
                          <input type="text" className="srv_input" value={slide.words2.join(', ')} onChange={e => updateSlide(sIdx, 'words2', e.target.value.split(',').map(w => w.trim()))} />
                        </div>
                        <div className="srv_form_group full">
                          <label className="srv_label">Description Paragraph</label>
                          <textarea className="srv_textarea" rows={3} value={slide.desc} onChange={e => updateSlide(sIdx, 'desc', e.target.value)} />
                        </div>
                        <div className="srv_form_grid full">
                          <div className="srv_form_group">
                            <label className="srv_label">CTA Button Label</label>
                            <input type="text" className="srv_input" value={slide.cta} onChange={e => updateSlide(sIdx, 'cta', e.target.value)} />
                          </div>
                          <div className="srv_form_group">
                            <label className="srv_label">CTA Button Link</label>
                            <input type="text" className="srv_input" value={slide.ctaUrl} onChange={e => updateSlide(sIdx, 'ctaUrl', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button className="srv_add_btn" onClick={addSlide} style={{ marginBottom: '28px' }}>
                    <I d={ICONS.plus} s={14} /> Add New Hero Slide
                  </button>

                  <div className="cnt_form_title" style={{ marginTop: '20px', borderTop: '1px dashed #e2e8f0', paddingTop: '20px' }}>Hero Counters Stats</div>
                  <div className="srv_form_grid" style={{ marginTop: '12px' }}>
                    {cmsData.heroStats.map((stat, stIdx) => (
                      <div key={stIdx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div className="srv_form_group">
                          <label className="srv_label">Counter #{stIdx+1} Number</label>
                          <input type="text" className="srv_input" value={stat.number} onChange={e => updateStat(stIdx, 'number', e.target.value)} />
                        </div>
                        <div className="srv_form_group">
                          <label className="srv_label">Counter #{stIdx+1} Label</label>
                          <input type="text" className="srv_input" value={stat.label} onChange={e => updateStat(stIdx, 'label', e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: About Section */}
              {activeTab === 'about' && (
                <div>
                  <div className="cnt_form_title">About Section Info</div>
                  <div className="cnt_form_sub">Modify history, statistics, features, and main graphics.</div>

                  <div className="srv_form_grid">
                    <div className="srv_form_group">
                      <label className="srv_label">Section Title</label>
                      <input type="text" className="srv_input" value={cmsData.aboutSection.title} onChange={e => updateAbout('title', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Section Subtitle</label>
                      <input type="text" className="srv_input" value={cmsData.aboutSection.subtitle} onChange={e => updateAbout('subtitle', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Description Content</label>
                      <textarea className="srv_textarea" rows={4} value={cmsData.aboutSection.desc} onChange={e => updateAbout('desc', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Feature Banner Image</label>
                      <input type="text" className="srv_input" value={cmsData.aboutSection.image} onChange={e => updateAbout('image', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Experience Counter (e.g. 15+)</label>
                      <input type="text" className="srv_input" value={cmsData.aboutSection.yearsExperience} onChange={e => updateAbout('yearsExperience', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Experience Badge Description Label</label>
                      <input type="text" className="srv_input" value={cmsData.aboutSection.experienceLabel} onChange={e => updateAbout('experienceLabel', e.target.value)} />
                    </div>
                  </div>

                  <div className="cnt_form_title" style={{ marginTop: '20px', borderTop: '1px dashed #e2e8f0', paddingTop: '20px' }}>Features Checkmarks</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
                    {cmsData.aboutSection.features.map((feat, fIdx) => (
                      <div key={fIdx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--purple)', display: 'block', marginBottom: '8px' }}>Feature #{fIdx+1} Details</strong>
                        <div className="srv_form_grid">
                          <div className="srv_form_group">
                            <label className="srv_label">Feature Icon (award / shield / clock)</label>
                            <input type="text" className="srv_input" value={feat.icon} onChange={e => updateAboutFeature(fIdx, 'icon', e.target.value)} />
                          </div>
                          <div className="srv_form_group">
                            <label className="srv_label">Feature Title</label>
                            <input type="text" className="srv_input" value={feat.title} onChange={e => updateAboutFeature(fIdx, 'title', e.target.value)} />
                          </div>
                          <div className="srv_form_group full">
                            <label className="srv_label">Feature Description Text</label>
                            <input type="text" className="srv_input" value={feat.desc} onChange={e => updateAboutFeature(fIdx, 'desc', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Services Intro */}
              {activeTab === 'services' && (
                <div>
                  <div className="cnt_form_title">Services Section Header Info</div>
                  <div className="cnt_form_sub">Modify header text. The services themselves are managed in the Clinical Services tab.</div>

                  <div className="srv_form_grid">
                    <div className="srv_form_group">
                      <label className="srv_label">Section Title</label>
                      <input type="text" className="srv_input" value={cmsData.servicesSection.title} onChange={e => updateServices('title', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Section Subtitle</label>
                      <input type="text" className="srv_input" value={cmsData.servicesSection.subtitle} onChange={e => updateServices('subtitle', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Section Description Paragraph</label>
                      <textarea className="srv_textarea" rows={4} value={cmsData.servicesSection.desc} onChange={e => updateServices('desc', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: How It Works */}
              {activeTab === 'how' && (
                <div>
                  <div className="cnt_form_title">How It Works / Steps Section</div>
                  <div className="cnt_form_sub">Modify step titles, numbers, description lines, and icons.</div>

                  <div className="srv_form_grid">
                    <div className="srv_form_group">
                      <label className="srv_label">Section Title</label>
                      <input type="text" className="srv_input" value={cmsData.howItWorks.title} onChange={e => updateHow('title', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Section Subtitle</label>
                      <input type="text" className="srv_input" value={cmsData.howItWorks.subtitle} onChange={e => updateHow('subtitle', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Section Description Paragraph</label>
                      <textarea className="srv_textarea" rows={3} value={cmsData.howItWorks.desc} onChange={e => updateHow('desc', e.target.value)} />
                    </div>
                  </div>

                  <div className="cnt_form_title" style={{ marginTop: '20px', borderTop: '1px dashed #e2e8f0', paddingTop: '20px' }}>Step Cards configuration</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
                    {cmsData.howItWorks.steps.map((step, stIdx) => (
                      <div key={stIdx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--purple)', display: 'block', marginBottom: '8px' }}>Step #{stIdx+1} Details</strong>
                        <div className="srv_form_grid">
                          <div className="srv_form_group">
                            <label className="srv_label">Step Number (e.g. 01)</label>
                            <input type="text" className="srv_input" value={step.stepNumber} onChange={e => updateHowStep(stIdx, 'stepNumber', e.target.value)} />
                          </div>
                          <div className="srv_form_group">
                            <label className="srv_label">Step Icon (search / cal / home)</label>
                            <input type="text" className="srv_input" value={step.icon} onChange={e => updateHowStep(stIdx, 'icon', e.target.value)} />
                          </div>
                          <div className="srv_form_group full">
                            <label className="srv_label">Step Title</label>
                            <input type="text" className="srv_input" value={step.title} onChange={e => updateHowStep(stIdx, 'title', e.target.value)} />
                          </div>
                          <div className="srv_form_group full">
                            <label className="srv_label">Step Description</label>
                            <input type="text" className="srv_input" value={step.desc} onChange={e => updateHowStep(stIdx, 'desc', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Patient Testimonials */}
              {activeTab === 'testimonials' && (
                <div>
                  <div className="cnt_form_title">Patient Testimonials & Reviews</div>
                  <div className="cnt_form_sub">Modify headers, edit names, ratings, text, or append new reviews.</div>

                  <div className="srv_form_grid">
                    <div className="srv_form_group">
                      <label className="srv_label">Section Title</label>
                      <input type="text" className="srv_input" value={cmsData.testimonials.title} onChange={e => updateTestimonial('title', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Section Subtitle</label>
                      <input type="text" className="srv_input" value={cmsData.testimonials.subtitle} onChange={e => updateTestimonial('subtitle', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Section Description Paragraph</label>
                      <textarea className="srv_textarea" rows={3} value={cmsData.testimonials.desc} onChange={e => updateTestimonial('desc', e.target.value)} />
                    </div>
                  </div>

                  <div className="cnt_form_title" style={{ marginTop: '20px', borderTop: '1px dashed #e2e8f0', paddingTop: '20px' }}>Active Reviews</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
                    {cmsData.testimonials.reviews.map((rev, rIdx) => (
                      <div key={rIdx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyBetween: 'space-between', marginBottom: '8px' }}>
                          <strong style={{ fontSize: '0.8rem', color: 'var(--purple)' }}>Review #{rIdx+1} Details</strong>
                          <button className="action_link_btn cancel" onClick={() => deleteReview(rIdx)} style={{ width: 'auto', padding: '2px 8px', fontSize: '0.75rem', marginLeft: 'auto' }}>
                            <I d={ICONS.trash} s={12} /> Delete Review
                          </button>
                        </div>
                        <div className="srv_form_grid">
                          <div className="srv_form_group">
                            <label className="srv_label">Patient Name</label>
                            <input type="text" className="srv_input" value={rev.name} onChange={e => updateReview(rIdx, 'name', e.target.value)} />
                          </div>
                          <div className="srv_form_group">
                            <label className="srv_label">Patient Role/Location</label>
                            <input type="text" className="srv_input" value={rev.role} onChange={e => updateReview(rIdx, 'role', e.target.value)} />
                          </div>
                          <div className="srv_form_group">
                            <label className="srv_label">Patient Rating Stars (1-5)</label>
                            <input type="number" className="srv_input" min={1} max={5} value={rev.rating} onChange={e => updateReview(rIdx, 'rating', parseInt(e.target.value, 10))} />
                          </div>
                          <div className="srv_form_group">
                            <label className="srv_label">Patient Photo Link</label>
                            <input type="text" className="srv_input" value={rev.avatar} onChange={e => updateReview(rIdx, 'avatar', e.target.value)} />
                          </div>
                          <div className="srv_form_group full">
                            <label className="srv_label">Patient Testimonial Text</label>
                            <textarea className="srv_textarea" rows={3} value={rev.text} onChange={e => updateReview(rIdx, 'text', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="srv_add_btn" onClick={addReview} style={{ marginTop: '16px' }}>
                    <I d={ICONS.plus} s={14} /> Add New Patient Review
                  </button>
                </div>
              )}

              {/* TAB 6: CTAs */}
              {activeTab === 'ctas' && (
                <div>
                  <div className="cnt_form_title">Guided Weight Loss CTA</div>
                  <div className="cnt_form_sub">Edit promotional card, button links, description, and graphics.</div>

                  <div className="srv_form_grid">
                    <div className="srv_form_group">
                      <label className="srv_label">Promo Card Title</label>
                      <input type="text" className="srv_input" value={cmsData.appointmentCta.title} onChange={e => updateAppointmentCta('title', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Promo Card Subtitle</label>
                      <input type="text" className="srv_input" value={cmsData.appointmentCta.subtitle} onChange={e => updateAppointmentCta('subtitle', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Promo Card Image Link</label>
                      <input type="text" className="srv_input" value={cmsData.appointmentCta.image} onChange={e => updateAppointmentCta('image', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">CTA Button Label</label>
                      <input type="text" className="srv_input" value={cmsData.appointmentCta.ctaText} onChange={e => updateAppointmentCta('ctaText', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">CTA Button Link</label>
                      <input type="text" className="srv_input" value={cmsData.appointmentCta.ctaUrl} onChange={e => updateAppointmentCta('ctaUrl', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Promo Description Content</label>
                      <textarea className="srv_textarea" rows={4} value={cmsData.appointmentCta.desc} onChange={e => updateAppointmentCta('desc', e.target.value)} />
                    </div>
                  </div>

                  <div className="cnt_form_title" style={{ marginTop: '20px', borderTop: '1px dashed #e2e8f0', paddingTop: '20px' }}>Footer Mega CTA</div>
                  <div className="srv_form_grid" style={{ marginTop: '12px' }}>
                    <div className="srv_form_group full">
                      <label className="srv_label">Footer CTA Title Heading</label>
                      <input type="text" className="srv_input" value={cmsData.footerCta.title} onChange={e => updateFooterCta('title', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Footer Button Label</label>
                      <input type="text" className="srv_input" value={cmsData.footerCta.ctaText} onChange={e => updateFooterCta('ctaText', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Footer Button Link</label>
                      <input type="text" className="srv_input" value={cmsData.footerCta.ctaUrl} onChange={e => updateFooterCta('ctaUrl', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: SEO Settings */}
              {activeTab === 'seo' && (
                <div>
                  <div className="cnt_form_title">Homepage SEO & Open Graph Tags</div>
                  <div className="cnt_form_sub">Modify search engine headers, canonical listings, and social sharing links.</div>

                  <div className="srv_form_grid">
                    <div className="srv_form_group full">
                      <label className="srv_label">Meta HTML Title Tag</label>
                      <input type="text" className="srv_input" value={cmsData.seoSettings.metaTitle} onChange={e => updateSeo('metaTitle', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Meta HTML Description Tag</label>
                      <textarea className="srv_textarea" rows={3} value={cmsData.seoSettings.metaDescription} onChange={e => updateSeo('metaDescription', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Meta Keywords (Comma-Separated)</label>
                      <input type="text" className="srv_input" value={cmsData.seoSettings.metaKeywords} onChange={e => updateSeo('metaKeywords', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Canonical HTML Link</label>
                      <input type="text" className="srv_input" value={cmsData.seoSettings.canonicalUrl} onChange={e => updateSeo('canonicalUrl', e.target.value)} />
                    </div>
                    <div className="srv_form_group">
                      <label className="srv_label">Open Graph (OG) Link Preview Title</label>
                      <input type="text" className="srv_input" value={cmsData.seoSettings.ogTitle} onChange={e => updateSeo('ogTitle', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Open Graph Description</label>
                      <input type="text" className="srv_input" value={cmsData.seoSettings.ogDescription} onChange={e => updateSeo('ogDescription', e.target.value)} />
                    </div>
                    <div className="srv_form_group full">
                      <label className="srv_label">Open Graph Share Preview Image URL</label>
                      <input type="text" className="srv_input" value={cmsData.seoSettings.ogImage} onChange={e => updateSeo('ogImage', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* ══ TOASTER NOTIFICATION ══ */}
      {toast && (
        <div className={`cnt_toast ${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* ══ CUSTOM POPUP MODAL ══ */}
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
