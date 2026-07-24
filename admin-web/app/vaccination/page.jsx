'use client';

import { API_URL } from '@/config';
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

const VACC_CATEGORIES = [
  { name: 'Vaccination Services',           color: '#4B2D71', dot: '#7c3aed' },
];
export default function AdminVaccinationPage() {
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

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getImgUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/uploads')) return `${API_URL}${img}`;
    return img;
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
        fetch(`${API_URL}/api/services`),
        fetch(`${API_URL}/api/appointments/admin/all`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const dataSrv = await resSrv.json();
      const dataApp = await resApp.json();
      if (dataSrv.success) {
        const dbServices = dataSrv.data || [];
        const vaccServices = dbServices.filter(s => (s.parentCategory || '').toLowerCase() === 'vaccination services');
        setServices(vaccServices);
      }
      if (dataApp.success) setAppts(dataApp.data || []);
    } catch (err) { console.error(err); showToast('Error loading data', 'error'); }
    finally { setLoading(false); }
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
    try {
      const res  = await fetch(`${API_URL}/api/services/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Deleted successfully');
        fetchData();
      }
      else showToast(json.message || 'Delete failed', 'error');
    } catch { showToast('Network error', 'error'); }
  };

  const pendingCount = appts.filter(a => ['pending', 'confirmed'].includes(a.status)).length;

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
              Manage all vaccinations displayed on the <strong>/vaccination</strong> public page.
              Add, edit, or remove any vaccine service below.
            </p>
          </div>
        </header>

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
              <span className="vacc_empty_icon">💉</span>
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
      </div>

      {/* ══ MODAL ══ */}
      {isModalOpen && (
        <div className="vacc_modal_overlay" onClick={() => setIsModalOpen(false)}>
          <div className="vacc_modal" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="vacc_modal_header">
              <div>
                <div className="vacc_modal_title">
                  {modalMode === 'add' ? '💉 Add Vaccination Service' : '✏️ Edit Vaccination Service'}
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
                      className="vacc_input"
                      placeholder="e.g. Yellow Fever Vaccination"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value, cat: 'Vaccination Care', parentCategory: form.parentCategory || 'Vaccination Services' })}
                      required
                    />
                  </div>
                  <div className="vacc_form_group">
                    <label className="vacc_form_label">Duration</label>
                    <input
                      type="text"
                      className="vacc_input"
                      placeholder="e.g. 20 Mins"
                      value={form.duration}
                      onChange={e => setForm({ ...form, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="vacc_form_group full">
                  <label className="vacc_form_label">Parent Category <span>*</span></label>
                  <select
                    className="vacc_select"
                    value={form.parentCategory}
                    onChange={e => setForm({ ...form, parentCategory: e.target.value, cat: 'Vaccination Care' })}
                    required
                  >
                    <option value="Vaccination Services">Vaccination Services</option>
                  </select>
                </div>

                <div className="vacc_form_group">
                  <label className="vacc_form_label">Description <span>*</span></label>
                  <textarea
                    className="vacc_textarea"
                    rows="3"
                    placeholder="Brief clinical description of this vaccination..."
                    value={form.desc}
                    onChange={e => setForm({ ...form, desc: e.target.value })}
                    required
                  />
                </div>

                <div className="vacc_form_group">
                  <label className="vacc_form_label">Key Features <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.75rem' }}>(comma separated)</span></label>
                  <textarea
                    className="vacc_textarea"
                    rows="2"
                    placeholder="Single dose injection, Official certificate issued, Expert travel advice..."
                    value={form.featuresText}
                    onChange={e => setForm({ ...form, featuresText: e.target.value })}
                  />
                </div>

                <div className="vacc_form_divider">Image & Appearance</div>

                {/* Image upload mode toggle */}
                <div className="vacc_form_group">
                  <label className="vacc_form_label">Service Image</label>
                  <div className="vacc_img_toggle">
                    <button
                      type="button"
                      className={`vacc_img_toggle_btn${imgUploadMode === 'url' ? ' active' : ''}`}
                      onClick={() => setImgUploadMode('url')}
                    >
                      🔗 URL
                    </button>
                    <button
                      type="button"
                      className={`vacc_img_toggle_btn${imgUploadMode === 'upload' ? ' active' : ''}`}
                      onClick={() => setImgUploadMode('upload')}
                    >
                      📁 Upload File
                    </button>
                  </div>

                  {imgUploadMode === 'url' ? (
                    <input
                      type="text"
                      className="vacc_input"
                      placeholder="https://images.unsplash.com/..."
                      value={form.img}
                      onChange={e => setForm({ ...form, img: e.target.value })}
                    />
                  ) : (
                    <div
                      className={`vacc_dropzone${isDragging ? ' dragging' : ''}`}
                      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={e => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) uploadImage(e.dataTransfer.files[0]); }}
                    >
                      {isUploadingImg ? (
                        <div className="vacc_spinner" />
                      ) : (
                        <>
                          <div className="vacc_dropzone_icon">📁</div>
                          <p>Drag & drop an image, or <label htmlFor="vacc_img_file">browse files</label></p>
                          <p style={{ fontSize: '0.75rem', color: '#b4aac8' }}>PNG, JPG, WEBP up to 10MB</p>
                          <input id="vacc_img_file" type="file" accept="image/*" style={{ display: 'none' }}
                            onChange={e => { if (e.target.files[0]) uploadImage(e.target.files[0]); }} />
                        </>
                      )}
                    </div>
                  )}

                  {/* Image Preview */}
                  {form.img && (
                    <div className="vacc_img_preview">
                      <img src={getImgUrl(form.img)} alt="Preview" />
                      <span className="vacc_img_preview_badge">Preview</span>
                    </div>
                  )}
                </div>

                {/* Visibility */}
                <div className="vacc_form_group">
                  <label className="vacc_form_label">Visibility</label>
                  <label className="vacc_checkbox_row">
                    <input
                      type="checkbox"
                      className="vacc_checkbox"
                      id="vacc_onHome"
                      checked={form.onHome}
                      onChange={e => setForm({ ...form, onHome: e.target.checked })}
                    />
                    <span className="vacc_checkbox_label">Show on homepage</span>
                    <span className="vacc_checkbox_hint">Featured</span>
                  </label>
                </div>

              </div>

              {/* Footer */}
              <div className="vacc_modal_footer">
                <button type="button" className="vacc_modal_btn_cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="vacc_modal_btn_save">
                  {modalMode === 'add' ? '💉 Add Vaccination' : '✅ Save Changes'}
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
