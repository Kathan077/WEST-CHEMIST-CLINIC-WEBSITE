'use client';

import { API_URL } from '@/config';
import React, { useState, useEffect } from 'react';
import '../patients/dashboard.css';
import './services.css';

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
  trash:   "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
};

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [contents, setContents] = useState([]);
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Tabs: 'services' | 'categories' | 'contents'
  const [activeTab, setActiveTab] = useState('services');

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  // Category management inputs
  const [newCatName, setNewCatName] = useState('');
  const [isCatSubmitting, setIsCatSubmitting] = useState(false);

  // Selected Content Item for editing
  const [selectedContentKey, setSelectedContentKey] = useState('');
  const [contentForm, setContentForm] = useState({ title: '', content: '', key: '', section: '', phone: '', email: '', address: '' });

  // Modals & Forms for Services
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceModalMode, setServiceModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    cat: '',
    parentCategory: 'Private Services',
    duration: '15 mins',
    desc: '',
    featuresText: '',
    img: '/images/services/dispensing_medicines.jpg',
    color: 'emerald',
    onHome: true
  });

  // Toaster Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.replace('/admin');
  };

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.replace('/admin');
      return;
    }

    try {
      const [resSrv, resCnt, resApp, resCats] = await Promise.all([
        fetch(`${API_URL}/api/services`),
        fetch(`${API_URL}/api/contents`),
        fetch(`${API_URL}/api/appointments/admin/all`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/categories`)
      ]);

      const dataSrv = await resSrv.json();
      const dataCnt = await resCnt.json();
      const dataApp = await resApp.json();
      const dataCats = await resCats.json();

      if (dataSrv.success) setServices(dataSrv.data || []);
      if (dataCats.success) setCategories(dataCats.data || []);
      if (dataCnt.success) {
        setContents(dataCnt.data || []);
        if (dataCnt.data && dataCnt.data.length > 0) {
          selectContentItem(dataCnt.data[0].key, dataCnt.data);
        }
      }
      if (dataApp.success) setAppts(dataApp.data || []);
    } catch (err) {
      console.error('Failed to load dashboard services data:', err);
      showToast('Network error loading database records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    if (user) setAdminUser(JSON.parse(user));
    fetchData();
  }, []);

  const selectContentItem = (key, customList = null) => {
    const list = customList || contents;
    const item = list.find(c => c.key === key);
    if (item) {
      setSelectedContentKey(key);
      setContentForm({
        title: item.title || '',
        content: item.content || '',
        key: item.key || '',
        section: item.section || '',
        phone: item.metadata?.get ? item.metadata.get('phone') : (item.metadata?.phone || ''),
        email: item.metadata?.get ? item.metadata.get('email') : (item.metadata?.email || ''),
        address: item.metadata?.get ? item.metadata.get('address') : (item.metadata?.address || '')
      });
    }
  };

  const handleContentSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const item = contents.find(c => c.key === selectedContentKey);
    if (!item) return;

    // Build metadata object if contact keys exist
    const metadata = {};
    if (contentForm.phone) metadata.phone = contentForm.phone;
    if (contentForm.email) metadata.email = contentForm.email;
    if (contentForm.address) metadata.address = contentForm.address;

    try {
      const res = await fetch(`${API_URL}/api/contents/${item.key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: contentForm.title,
          content: contentForm.content,
          metadata: metadata
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Page content updated successfully', 'success');
        // update local list
        setContents(prev => prev.map(c => c.key === selectedContentKey ? json.data : c));
      } else {
        showToast(json.message || 'Failed to update page content', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error sending update request', 'error');
    }
  };

  // Service CRUD operations
  const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const openAddServiceModal = () => {
    setServiceModalMode('add');
    setServiceForm({
      title: '',
      cat: '',
      parentCategory: categories.length > 0 ? categories[0].name : 'Private Services',
      duration: '15 mins',
      desc: '',
      featuresText: '',
      img: '/images/services/dispensing_medicines.jpg',
      color: 'emerald',
      onHome: true
    });
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (srv) => {
    setServiceModalMode('edit');
    setSelectedServiceId(srv._id);
    setServiceForm({
      title: srv.title || '',
      cat: srv.cat || '',
      parentCategory: srv.parentCategory || (categories.length > 0 ? categories[0].name : 'Private Services'),
      duration: srv.duration || '15 mins',
      desc: srv.desc || '',
      featuresText: srv.features ? srv.features.join(', ') : '',
      img: srv.img || '/images/services/dispensing_medicines.jpg',
      color: srv.color || 'emerald',
      onHome: srv.onHome !== undefined ? srv.onHome : true
    });
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    // Parse features comma separated list
    const featuresList = serviceForm.featuresText
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const payload = {
      title: serviceForm.title,
      slug: slugify(serviceForm.title),
      cat: serviceForm.cat || serviceForm.parentCategory,
      parentCategory: serviceForm.parentCategory,
      duration: serviceForm.duration,
      desc: serviceForm.desc,
      features: featuresList,
      img: serviceForm.img,
      color: serviceForm.color,
      onHome: serviceForm.onHome
    };

    try {
      if (serviceModalMode === 'add') {
        const res = await fetch(`${API_URL}/api/services`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const json = await res.json();
        if (res.ok && json.success) {
          showToast('Service created successfully', 'success');
          setServices(prev => [...prev, json.data]);
          setIsServiceModalOpen(false);
        } else {
          showToast(json.message || 'Failed to create service', 'error');
        }
      } else {
        const res = await fetch(`${API_URL}/api/services/${selectedServiceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const json = await res.json();
        if (res.ok && json.success) {
          showToast('Service updated successfully', 'success');
          setServices(prev => prev.map(s => s._id === selectedServiceId ? json.data : s));
          setIsServiceModalOpen(false);
        } else {
          showToast(json.message || 'Failed to update service', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Error processing request', 'error');
    }
  };

  const handleDeleteService = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" service?`)) return;
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`${API_URL}/api/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Service deleted successfully', 'success');
        setServices(prev => prev.filter(s => s._id !== id));
      } else {
        showToast(json.message || 'Failed to delete service', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting service', 'error');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const token = localStorage.getItem('adminToken');
    setIsCatSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCatName.trim() })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Category created successfully', 'success');
        setCategories(prev => [...prev, json.data]);
        setNewCatName('');
      } else {
        showToast(json.message || 'Failed to create category', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error creating category', 'error');
    } finally {
      setIsCatSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    const usageCount = services.filter(s => s.parentCategory === name).length;
    if (usageCount > 0) {
      showToast(`Cannot delete category. It is currently in use by ${usageCount} service(s).`, 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete category group "${name}"?`)) return;
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Category deleted successfully', 'success');
        setCategories(prev => prev.filter(c => c._id !== id));
      } else {
        showToast(json.message || 'Failed to delete category', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error deleting category', 'error');
    }
  };

  // Stats / Badges
  const pendingCount = appts.filter(a => ['pending', 'confirmed'].includes(a.status)).length;

  const nav = [
    { label: 'Dashboard',         path: '/admin/patients',                 icon: ICONS.home },
    { label: 'Appointments',      path: '/admin/appointments',             icon: ICONS.cal, badge: pendingCount || null },
    { label: 'Patients',          path: '/admin/patients?view=patients',   icon: ICONS.users },
    { label: 'Compliance',        path: '/admin/compliance',               icon: ICONS.shield },
    { label: 'Services & Content', path: '/admin/services',                icon: ICONS.edit, active: true },
  ];

  // Filtering local list
  const filteredServices = services.filter(srv => {
    const matchSearch = srv.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        srv.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        srv.cat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        srv.parentCategory?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = catFilter === 'all' || srv.parentCategory === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="dash">
      {/* ══ SIDEBAR ══ */}
      <aside className="dash_sb">
        {!isMobile && (
          <div className="sb_logo">
            <div className="sb_logo_mark">W</div>
            <div className="sb_logo_name">
              West Chemist
              <small>Admin Portal</small>
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {!isMobile && <div className="sb_section"><div className="sb_section_label">General</div></div>}
          <div style={{ padding: '0 14px' }}>
            {nav.map(n => (
              <a key={n.label} href={n.path} className={`sb_link${n.active ? ' active' : ''}`}>
                <I d={n.icon} />
                <span>{n.label}</span>
                {n.badge ? <span className="sb_badge">{n.badge}</span> : null}
              </a>
            ))}
          </div>

          {!isMobile && <div className="sb_section" style={{ marginTop: 8 }}><div className="sb_section_label">Settings</div></div>}
          <div style={{ padding: '0 14px' }}>
            <a className="sb_link" href="#" onClick={e => { e.preventDefault(); logout(); }}>
              <I d={ICONS.logout} /><span>Log Out</span>
            </a>
          </div>
        </div>

        {!isMobile && (
          <div className="sb_foot">
            <div className="sb_user">
              <div className="sb_av">{(adminUser?.username || 'A')[0].toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sb_uname">{adminUser?.username || 'Admin'}</div>
                <div className="sb_urole">Administrator</div>
              </div>
              <button className="sb_logout" onClick={logout} title="Sign Out"><I d={ICONS.logout} s={14} /></button>
            </div>
          </div>
        )}
      </aside>

      {/* ══ MAIN ══ */}
      <div className="dash_main">
        {/* Header */}
        <header className="dash_hdr">
          <div className="dash_hdr_left">
            <h2>Services & Content Hub ⚙️</h2>
            <p>Modify clinic clinical offerings and update dynamic portal subpage contents.</p>
          </div>
        </header>

        {/* Tabs */}
        <div className="tabs_container">
          <button 
            className={`tab_btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Clinical Services ({services.length})
          </button>
          <button 
            className={`tab_btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Category Groups ({categories.length})
          </button>
          <button 
            className={`tab_btn ${activeTab === 'contents' ? 'active' : ''}`}
            onClick={() => setActiveTab('contents')}
          >
            Page & Site Content ({contents.length})
          </button>
        </div>

        {/* Tab 1: Clinical Services Management */}
        {activeTab === 'services' && (
          <>
            <div className="srv_toolbar">
              <div className="srv_search_filters" style={{ maxWidth: '400px' }}>
                <input
                  type="text"
                  placeholder="Search service title, description..."
                  className="srv_search_input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button className="srv_add_btn" onClick={openAddServiceModal}>
                <I d={ICONS.plus} s={16} />
                Add New Service
              </button>
            </div>

            {/* Category filter tabs */}
            <div className="srv_cat_tabs">
              <button
                className={`srv_cat_tab ${catFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCatFilter('all')}
              >
                <span>All Services</span>
                <span className="srv_cat_count">{services.length}</span>
              </button>
              {categories.map(tab => (
                <button
                  key={tab._id}
                  className={`srv_cat_tab ${catFilter === tab.name ? 'active' : ''}`}
                  onClick={() => setCatFilter(tab.name)}
                >
                  <span>{tab.label || tab.name}</span>
                  <span className="srv_cat_count">
                    {services.filter(s => s.parentCategory === tab.name).length}
                  </span>
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                <div className="adm_spinner" style={{ margin: '0 auto 16px' }} />
                Loading clinic services...
              </div>
            ) : filteredServices.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                <h3>No Clinical Services Found</h3>
                <p>Try clearing your search or add a new service to start.</p>
              </div>
            ) : (
              <div className="srv_grid">
                {filteredServices.map(srv => {
                  const gradient = srv.color === 'blue' 
                    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                    : srv.color === 'teal' || srv.color === 'emerald'
                    ? 'linear-gradient(135deg, #10b981, #047857)'
                    : srv.color === 'indigo'
                    ? 'linear-gradient(135deg, #6366f1, #4338ca)'
                    : srv.color === 'purple'
                    ? 'linear-gradient(135deg, #a855f7, #6b21a8)'
                    : 'linear-gradient(135deg, #206b5e, #113c34)';

                  return (
                    <div key={srv._id} className="srv_card">
                      <div className="srv_card_banner" style={{ background: gradient }}>
                        {srv.img && <img src={srv.img} alt={srv.title} className="srv_card_img" />}
                        <div className="srv_card_banner_content">
                          <span className="srv_card_cat">{srv.cat}</span>
                          <h4 className="srv_card_title">{srv.title}</h4>
                        </div>
                      </div>
                      
                      <div className="srv_card_body">
                        <p className="srv_card_desc">{srv.desc || 'No description provided.'}</p>
                        
                        <div className="srv_card_details">
                          <span>⏱ {srv.duration || '15 mins'}</span>
                          {srv.onHome && <span className="srv_home_badge">Show on Home</span>}
                        </div>
                      </div>

                      <div className="srv_card_actions">
                        <button className="srv_action_btn edit" onClick={() => openEditServiceModal(srv)}>
                          <I d={ICONS.edit} s={14} />
                          Edit
                        </button>
                        <button className="srv_action_btn delete" onClick={() => handleDeleteService(srv._id, srv.title)}>
                          <I d={ICONS.trash} s={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Tab 2: Categories / Parent Services Management */}
        {activeTab === 'categories' && (
          <div className="cat_layout">
            <div className="cat_list_card">
              <div className="cnt_form_title">Service Parent Groups / Categories</div>
              <div className="cnt_form_sub" style={{ marginBottom: 16 }}>
                View and manage parent categories. Services under each category are dynamically grouped.
              </div>

              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                  Loading categories...
                </div>
              ) : categories.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                  No categories defined. Use the form to create one.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="cat_table">
                    <thead>
                      <tr>
                        <th>Category Group Name</th>
                        <th>URL Slug</th>
                        <th>Associated Services</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(cat => {
                        const count = services.filter(s => s.parentCategory === cat.name).length;
                        return (
                          <tr key={cat._id}>
                            <td className="cat_name_cell">{cat.name}</td>
                            <td><code className="cat_slug_code">{cat.slug}</code></td>
                            <td>
                              <span className={`cat_badge ${count > 0 ? 'active' : 'empty'}`}>
                                {count} Services
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button 
                                className="cat_action_btn delete"
                                onClick={() => handleDeleteCategory(cat._id, cat.name)}
                                title="Delete category group"
                              >
                                <I d={ICONS.trash} s={14} />
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="cat_form_card">
              <div className="cnt_form_title" style={{ fontSize: '1.05rem' }}>Create New Category Group</div>
              <div className="cnt_form_sub" style={{ marginBottom: 16 }}>
                Add a new parent category for your clinical offerings.
              </div>

              <form onSubmit={handleAddCategory}>
                <div className="srv_form_group">
                  <label className="srv_label">Category Group Name</label>
                  <input
                    type="text"
                    className="srv_input"
                    placeholder="e.g. Ear Care & Audiology"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button 
                    type="submit" 
                    className="srv_btn_save"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}
                    disabled={isCatSubmitting}
                  >
                    {isCatSubmitting ? (
                      <>
                        <div className="adm_spinner" style={{ width: 14, height: 14, borderWidth: 2, borderColor: '#fff', borderTopColor: 'transparent' }} />
                        Creating...
                      </>
                    ) : (
                      <>
                        <I d={ICONS.plus} s={14} />
                        Add Category Group
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 3: Page & Site Content Editor */}
        {activeTab === 'contents' && (
          <div className="cnt_layout">
            <div className="cnt_sidebar">
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '4px 14px' }}>Pages / Sections</div>
              {contents.map(c => (
                <button
                  key={c.key}
                  className={`cnt_sidebar_btn ${selectedContentKey === c.key ? 'active' : ''}`}
                  onClick={() => selectContentItem(c.key)}
                >
                  {c.section || c.key.replace(/_/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase())}
                </button>
              ))}
            </div>

            <div className="cnt_form_panel">
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  Loading content...
                </div>
              ) : selectedContentKey ? (
                <form onSubmit={handleContentSave}>
                  <div className="cnt_form_title">Edit: {contentForm.section || selectedContentKey.replace(/_/g, ' ')}</div>
                  <div className="cnt_form_sub">Modify text content live on patient webpages.</div>

                  <div className="srv_form_group">
                    <label className="srv_label">Title / Heading</label>
                    <input
                      type="text"
                      className="srv_input"
                      value={contentForm.title}
                      onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="srv_form_group">
                    <label className="srv_label">Main Body Text Content</label>
                    <textarea
                      className="srv_textarea"
                      rows="8"
                      value={contentForm.content}
                      onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
                      required
                    />
                  </div>

                  {/* Render metadata fields specifically for contact details key */}
                  {selectedContentKey === 'contact_details' && (
                    <div className="srv_form_grid" style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <div className="srv_form_group">
                        <label className="srv_label">Contact Phone</label>
                        <input
                          type="text"
                          className="srv_input"
                          value={contentForm.phone}
                          onChange={(e) => setContentForm({ ...contentForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="srv_form_group">
                        <label className="srv_label">Contact Email</label>
                        <input
                          type="text"
                          className="srv_input"
                          value={contentForm.email}
                          onChange={(e) => setContentForm({ ...contentForm, email: e.target.value })}
                        />
                      </div>
                      <div className="srv_form_group full">
                        <label className="srv_label">Clinic Address</label>
                        <input
                          type="text"
                          className="srv_input"
                          value={contentForm.address}
                          onChange={(e) => setContentForm({ ...contentForm, address: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button type="submit" className="srv_btn_save">
                      Save Site Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  Select a section from the left menu to start editing.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Service Add/Edit Modal */}
      {isServiceModalOpen && (
        <div className="srv_modal_overlay" onClick={(e) => e.target === e.currentTarget && setIsServiceModalOpen(false)}>
          <div className="srv_modal">
            <div className="srv_modal_header">
              <span className="srv_modal_title">
                {serviceModalMode === 'add' ? '✨ Add New Service' : '⚙️ Edit Service Details'}
              </span>
              <button className="srv_modal_close" onClick={() => setIsServiceModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleServiceSubmit}>
              <div className="srv_modal_body">
                <div className="srv_form_group">
                  <label className="srv_label">Service Title</label>
                  <input
                    type="text"
                    className="srv_input"
                    placeholder="e.g. Strep A Test & Treat"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="srv_form_grid">
                  <div className="srv_form_group">
                    <label className="srv_label">Category Group</label>
                    <select
                      className="srv_select"
                      value={serviceForm.parentCategory}
                      onChange={(e) => setServiceForm({ ...serviceForm, parentCategory: e.target.value })}
                      required
                    >
                      {categories.map(c => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                      {categories.length === 0 && (
                        <>
                          <option value="NHS Services (Pharmacy First)">NHS Services (Pharmacy First)</option>
                          <option value="Private Services">Private Services</option>
                          <option value="Travel Clinic">Travel Clinic</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="srv_form_group">
                    <label className="srv_label">Specific Sub-Category</label>
                    <input
                      type="text"
                      className="srv_input"
                      placeholder="e.g. Clinical Ear Care"
                      value={serviceForm.cat}
                      onChange={(e) => setServiceForm({ ...serviceForm, cat: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="srv_form_group">
                  <label className="srv_label">Duration / Slot Size</label>
                  <input
                    type="text"
                    className="srv_input"
                    placeholder="e.g. 15 mins"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    required
                  />
                </div>

                <div className="srv_form_group">
                  <label className="srv_label">Short Description</label>
                  <textarea
                    className="srv_textarea"
                    placeholder="Brief description showing on clinical tiles..."
                    value={serviceForm.desc}
                    onChange={(e) => setServiceForm({ ...serviceForm, desc: e.target.value })}
                    required
                  />
                </div>

                <div className="srv_form_group">
                  <label className="srv_label">Key Features / Bullet Points (comma-separated)</label>
                  <input
                    type="text"
                    className="srv_input"
                    placeholder="e.g. Instant Results, Qualified pharmacist, Includes advice"
                    value={serviceForm.featuresText}
                    onChange={(e) => setServiceForm({ ...serviceForm, featuresText: e.target.value })}
                  />
                </div>

                <div className="srv_form_grid">
                  <div className="srv_form_group">
                    <label className="srv_label">Banner Accent Color</label>
                    <select
                      className="srv_select"
                      value={serviceForm.color}
                      onChange={(e) => setServiceForm({ ...serviceForm, color: e.target.value })}
                      required
                    >
                      <option value="emerald">Emerald Green</option>
                      <option value="blue">Royal Blue</option>
                      <option value="indigo">Deep Indigo</option>
                      <option value="purple">Modern Purple</option>
                      <option value="pine">Dark Pine</option>
                    </select>
                  </div>

                  <div className="srv_form_group">
                    <label className="srv_label">Image Path / URL</label>
                    <input
                      type="text"
                      className="srv_input"
                      placeholder="/images/services/name.jpg"
                      value={serviceForm.img}
                      onChange={(e) => setServiceForm({ ...serviceForm, img: e.target.value })}
                    />
                  </div>
                </div>

                <div className="srv_form_group checkbox">
                  <input
                    type="checkbox"
                    id="srvOnHome"
                    checked={serviceForm.onHome}
                    onChange={(e) => setServiceForm({ ...serviceForm, onHome: e.target.checked })}
                  />
                  <label htmlFor="srvOnHome" className="srv_label" style={{ cursor: 'pointer', marginBottom: 0 }}>
                    Promote on Home Page (Display in Services List grid)
                  </label>
                </div>
              </div>

              <div className="srv_modal_footer">
                <button type="button" className="srv_btn_cancel" onClick={() => setIsServiceModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="srv_btn_save">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`cnt_toast ${toast.type}`}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
