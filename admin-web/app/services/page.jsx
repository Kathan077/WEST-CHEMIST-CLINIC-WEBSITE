'use client';

import { API_URL } from '@/config';
import React, { useState, useEffect } from 'react';
import '../patients/dashboard.css';
import './services.css';
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
  globe:   "M12 2a10 10 0 1010 10A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
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
  const [contentForm, setContentForm] = useState({ title: '', content: '', key: '', section: '', phone: '', email: '', address: '', mon_fri: '', sat: '', sun: '', instagram_url: '' });
  const [toolsList, setToolsList] = useState([]);

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

  // Drag & Drop Image Upload states for Services Modal
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImg, setIsUploadingImg] = useState(false);
  const [imgUploadMode, setImgUploadMode] = useState('upload'); // 'upload' | 'url'

  const getImgUrl = (img) => {
    if (!img) return '/images/services/dispensing_medicines.jpg';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    if (img.startsWith('/uploads')) return `${API_URL}${img}`;
    return img;
  };

  const uploadServiceImageFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP, SVG, GIF)', 'error');
      return;
    }

    setIsUploadingImg(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_URL}/api/services/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setServiceForm(prev => ({ ...prev, img: data.url }));
        showToast('Service image uploaded successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to upload image', 'error');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      showToast('Network error uploading service image', 'error');
    } finally {
      setIsUploadingImg(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadServiceImageFile(e.dataTransfer.files[0]);
    }
  };

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

  const isWeightLoss = (s) => {
    const slug = (s.slug || '').toLowerCase();
    const cat = (s.cat || '').toLowerCase();
    const parentCat = (s.parentCategory || '').toLowerCase();
    const title = (s.title || '').toLowerCase();
    return (
      parentCat.includes('weight') ||
      cat.includes('weight') ||
      slug === 'wegovy' ||
      slug === 'mounjaro' ||
      title.includes('weight') ||
      title.includes('wegovy') ||
      title.includes('mounjaro')
    );
  };

  const isVaccination = (s) => {
    if (isWeightLoss(s)) return false;
    
    const slug = (s.slug || '').toLowerCase();
    const cat = (s.cat || '').toLowerCase();
    const parentCat = (s.parentCategory || '').toLowerCase();
    const title = (s.title || '').toLowerCase();
    
    if (slug === 'travel-clinic' || title === 'travel clinic' || slug === 'travel-clinic-service') return false;
    
    return (
      parentCat === 'vaccination services' ||
      parentCat.includes('vacc') ||
      cat.includes('vacc') ||
      cat.includes('immuniz') ||
      title.includes('vaccin') ||
      title.includes('immunis') ||
      title.includes('immuniz') ||
      title.includes('flu') ||
      title.includes('covid') ||
      title.includes('meningitis') ||
      title.includes('shingles') ||
      title.includes('chickenpox') ||
      title.includes('hpv') ||
      title.includes('rabies') ||
      title.includes('hepatitis') ||
      title.includes('typhoid') ||
      title.includes('yellow fever') ||
      title.includes('dengue') ||
      title.includes('chikungunya') ||
      title.includes('encephalitis') ||
      title.includes('dtp') ||
      title.includes('mmr') ||
      title.includes('cholera') ||
      title.includes('japanese') ||
      slug.includes('yellow-fever') ||
      slug.includes('chickenpox') ||
      slug.includes('shingles') ||
      slug.includes('hpv') ||
      slug.includes('rabies') ||
      slug.includes('hepatitis') ||
      slug.includes('typhoid') ||
      slug.includes('japanese') ||
      slug.includes('encephalitis') ||
      slug.includes('flu') ||
      slug.includes('covid') ||
      slug.includes('travel-vacc')
    );
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

      if (dataSrv.success) {
        const filteredSrvs = (dataSrv.data || []).filter(s => !isVaccination(s) && !isWeightLoss(s));
        setServices(filteredSrvs);
      }
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
        address: item.metadata?.get ? item.metadata.get('address') : (item.metadata?.address || ''),
        mon_fri: item.metadata?.get ? item.metadata.get('mon_fri') : (item.metadata?.mon_fri || ''),
        sat: item.metadata?.get ? item.metadata.get('sat') : (item.metadata?.sat || ''),
        sun: item.metadata?.get ? item.metadata.get('sun') : (item.metadata?.sun || ''),
        instagram_url: item.metadata?.get ? item.metadata.get('instagram_url') : (item.metadata?.instagram_url || '')
      });

      if (key === 'health-tools-list') {
        try {
          const parsed = JSON.parse(item.content || '[]');
          setToolsList(parsed);
        } catch (err) {
          console.error("Error parsing health tools JSON:", err);
          setToolsList([]);
        }
      }
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
    if (contentForm.mon_fri) metadata.mon_fri = contentForm.mon_fri;
    if (contentForm.sat) metadata.sat = contentForm.sat;
    if (contentForm.sun) metadata.sun = contentForm.sun;
    if (contentForm.instagram_url) metadata.instagram_url = contentForm.instagram_url;

    let finalContent = contentForm.content;
    if (selectedContentKey === 'clinic-hours') {
      finalContent = `Mon - Fri: ${contentForm.mon_fri || ''}\nSaturday: ${contentForm.sat || ''}\nSunday: ${contentForm.sun || ''}`;
    } else if (selectedContentKey === 'health-tools-list') {
      finalContent = JSON.stringify(toolsList);
    }

    try {
      const res = await fetch(`${API_URL}/api/contents/${item.key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: contentForm.title,
          content: finalContent,
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
      <Sidebar activePage="services" />

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
                        {srv.img && <img src={getImgUrl(srv.img)} alt={srv.title} className="srv_card_img" />}
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
              {contents.filter(c => !['clinic-hours', 'health-tools-header', 'health-tools-list', 'social-feed-header'].includes(c.key)).map(c => (
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

                  {selectedContentKey !== 'clinic-hours' && selectedContentKey !== 'health-tools-list' && (
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
                  )}

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

                  {/* Render metadata fields specifically for clinic hours key */}
                  {selectedContentKey === 'clinic-hours' && (
                    <div className="srv_form_grid" style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <div className="srv_form_group">
                        <label className="srv_label">Monday - Friday Hours</label>
                        <input
                          type="text"
                          className="srv_input"
                          value={contentForm.mon_fri || ''}
                          onChange={(e) => setContentForm({ ...contentForm, mon_fri: e.target.value })}
                          placeholder="e.g. 8:30 AM - 6:30 PM"
                        />
                      </div>
                      <div className="srv_form_group">
                        <label className="srv_label">Saturday Hours</label>
                        <input
                          type="text"
                          className="srv_input"
                          value={contentForm.sat || ''}
                          onChange={(e) => setContentForm({ ...contentForm, sat: e.target.value })}
                          placeholder="e.g. 9:00 AM - 2:00 PM"
                        />
                      </div>
                      <div className="srv_form_group">
                        <label className="srv_label">Sunday Hours</label>
                        <input
                          type="text"
                          className="srv_input"
                          value={contentForm.sun || ''}
                          onChange={(e) => setContentForm({ ...contentForm, sun: e.target.value })}
                          placeholder="e.g. 9:00 AM - 12:00 PM"
                        />
                      </div>
                    </div>
                  )}

                  {/* Render metadata fields specifically for social feed key */}
                  {selectedContentKey === 'social-feed-header' && (
                    <div className="srv_form_grid" style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <div className="srv_form_group full">
                        <label className="srv_label">Instagram Profile Link URL</label>
                        <input
                          type="text"
                          className="srv_input"
                          value={contentForm.instagram_url || ''}
                          onChange={(e) => setContentForm({ ...contentForm, instagram_url: e.target.value })}
                          placeholder="e.g. https://instagram.com/westchemistclinic"
                        />
                      </div>
                    </div>
                  )}

                  {/* Render dynamic health tools list editor */}
                  {selectedContentKey === 'health-tools-list' && (
                    <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <label className="srv_label" style={{ fontSize: '1rem', fontWeight: 800 }}>Manage Wellbeing Tools</label>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {toolsList.map((tool, idx) => (
                          <div 
                            key={idx} 
                            style={{ 
                              background: '#f8fafc', 
                              border: '1px solid #e2e8f0', 
                              borderRadius: '12px', 
                              padding: '16px', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              gap: '12px',
                              position: 'relative'
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => setToolsList(toolsList.filter((_, i) => i !== idx))}
                              style={{ 
                                position: 'absolute', 
                                top: '12px', 
                                right: '12px', 
                                background: 'rgba(239, 68, 68, 0.08)', 
                                border: 'none', 
                                color: '#ef4444', 
                                padding: '4px 8px', 
                                borderRadius: '6px', 
                                fontSize: '.75rem', 
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              Remove
                            </button>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                              <div className="srv_form_group">
                                <label className="srv_label">Tool Name</label>
                                <input
                                  type="text"
                                  className="srv_input"
                                  value={tool.title || ''}
                                  onChange={(e) => {
                                    const updated = [...toolsList];
                                    updated[idx].title = e.target.value;
                                    setToolsList(updated);
                                  }}
                                  placeholder="e.g. BMI Calculator"
                                  required
                                />
                              </div>

                              <div className="srv_form_group">
                                <label className="srv_label">Tool Icon Category</label>
                                <select
                                  className="srv_input"
                                  value={tool.icon || 'activity'}
                                  onChange={(e) => {
                                    const updated = [...toolsList];
                                    updated[idx].icon = e.target.value;
                                    setToolsList(updated);
                                  }}
                                  style={{ padding: '8px 12px' }}
                                >
                                  <option value="calculator">Calculator 🧮</option>
                                  <option value="droplet">Droplet 🩸</option>
                                  <option value="heart">Heart ❤️</option>
                                  <option value="search">Search 🔍</option>
                                  <option value="activity">Pulse Activity 📈</option>
                                  <option value="thermometer">Thermometer 🌡️</option>
                                  <option value="shield">Shield 🛡️</option>
                                  <option value="clipboard">Clipboard 📋</option>
                                </select>
                              </div>
                            </div>

                            <div className="srv_form_group full" style={{ margin: 0 }}>
                              <label className="srv_label">Brief Description</label>
                              <input
                                type="text"
                                className="srv_input"
                                value={tool.desc || ''}
                                onChange={(e) => {
                                  const updated = [...toolsList];
                                  updated[idx].desc = e.target.value;
                                  setToolsList(updated);
                                }}
                                placeholder="e.g. Check your Body Mass Index in seconds."
                                required
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setToolsList([...toolsList, { title: '', icon: 'activity', desc: '' }])}
                        style={{
                          background: 'transparent',
                          border: '1.5px dashed var(--purple)',
                          color: 'var(--purple)',
                          padding: '10px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          fontSize: '.85rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                          marginTop: '8px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.target.style.background = 'rgba(75, 45, 113, 0.05)' }}
                        onMouseLeave={(e) => { e.target.style.background = 'transparent' }}
                      >
                        ➕ Add New Interactive Tool
                      </button>
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

                <div className="srv_form_group full">
                  <label className="srv_label">Category Group</label>
                  <select
                    className="srv_select"
                    value={serviceForm.parentCategory}
                    onChange={(e) => setServiceForm({ ...serviceForm, parentCategory: e.target.value, cat: e.target.value })}
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

                <div className="srv_form_group full">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="srv_label">Service Banner Image</label>
                    <div className="srv_img_toggle_bar">
                      <button
                        type="button"
                        className={`srv_img_toggle_btn ${imgUploadMode === 'upload' ? 'active' : ''}`}
                        onClick={() => setImgUploadMode('upload')}
                      >
                        📁 Drag & Drop File
                      </button>
                      <button
                        type="button"
                        className={`srv_img_toggle_btn ${imgUploadMode === 'url' ? 'active' : ''}`}
                        onClick={() => setImgUploadMode('url')}
                      >
                        🔗 Image URL
                      </button>
                    </div>
                  </div>

                  {imgUploadMode === 'upload' ? (
                    <div className="srv_dropzone_container">
                      {serviceForm.img ? (
                        <div className="srv_preview_box">
                          <img src={getImgUrl(serviceForm.img)} alt="Service Banner Preview" className="srv_preview_img" />
                          <div className="srv_preview_overlay">
                            <button
                              type="button"
                              className="srv_remove_img_btn"
                              onClick={() => {
                                const fileInput = document.getElementById('srvFileInput');
                                if (fileInput) fileInput.click();
                              }}
                            >
                              🔄 Change Image
                            </button>
                            <button
                              type="button"
                              className="srv_remove_img_btn"
                              style={{ background: '#ef4444' }}
                              onClick={() => setServiceForm({ ...serviceForm, img: '' })}
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`srv_dropzone_area ${isDragging ? 'dragging' : ''}`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => {
                            const fileInput = document.getElementById('srvFileInput');
                            if (fileInput) fileInput.click();
                          }}
                        >
                          {isUploadingImg ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px' }}>
                              <div className="adm_spinner" style={{ width: 28, height: 28 }} />
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#206b5e' }}>Uploading image to server...</span>
                            </div>
                          ) : (
                            <>
                              <div className="srv_dropzone_icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="17 8 12 3 7 8" />
                                  <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                              </div>
                              <div className="srv_dropzone_text">
                                Drag & Drop image file here, or <span>Browse</span>
                              </div>
                              <div className="srv_dropzone_subtext">
                                Supports JPG, PNG, WEBP, SVG or GIF (Max 10MB)
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      <input
                        type="file"
                        id="srvFileInput"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            uploadServiceImageFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="srv_input"
                      placeholder="e.g. /images/services/dispensing_medicines.jpg or https://..."
                      value={serviceForm.img}
                      onChange={(e) => setServiceForm({ ...serviceForm, img: e.target.value })}
                    />
                  )}
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
