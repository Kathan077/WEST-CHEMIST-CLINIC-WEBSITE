'use client';

import { API_URL } from '@/config';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../patients/dashboard.css';
import './about.css';

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
  info:    "M12 16v-4 M12 8h.01 M12 2a10 10 0 1010 10A10 10 0 0012 2z",
  save:    "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h9",
  map:     "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  help:    "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01 M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
  stats:   "M18 20V10M12 20V4M6 20v-6",
  impact:  "M22 12h-4l-3 9L9 3l-3 9H2",
  mission: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-16l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z",
  image:   "M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z M8.5 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z M21 15l-5-5L5 21",
  doc:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
};

const resolveImage = (src) => {
  if (!src) return '';
  if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  return `${API_URL}${src.startsWith('/') ? '' : '/'}${src}`;
};

const isImageSrc = (src) => {
  if (!src) return false;
  const s = src.toLowerCase();
  return s.startsWith('data:image/') || s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/') || s.includes('.') || s.startsWith('blob:');
};

export default function AboutEditorPage() {
  const [aboutItems, setAboutItems] = useState([]);
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  // Form states for adding new items
  const [showAddStat, setShowAddStat] = useState(false);
  const [newStat, setNewStat] = useState({ title: '', content: '' });

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ title: '', content: '', icon: 'mission' });

  const [showAddBranch, setShowAddBranch] = useState(false);
  const [newBranch, setNewBranch] = useState({
    title: '',
    content: '',
    icon: '📍',
    address: '',
    badge: '',
    image: '',
    stat1_num: '',
    stat1_label: '',
    stat2_num: '',
    stat2_label: '',
    stat3_num: '',
    stat3_label: '',
    action_url: '',
    action_text: ''
  });

  const [showAddFaq, setShowAddFaq] = useState(false);
  const [newFaq, setNewFaq] = useState({ title: '', content: '' });

  // Hero form state
  const [heroForm, setHeroForm] = useState({ id: '', title: '', content: '' });

  // Impact form state
  const [impactForm, setImpactForm] = useState({
    id: '',
    title: '',
    content: '',
    icon: '',
    stat1_num: '',
    stat1_label: '',
    stat1_suffix: '',
    stat2_num: '',
    stat2_label: '',
    stat2_suffix: '',
    stat3_num: '',
    stat3_label: '',
    stat3_suffix: '',
    stat4_num: '',
    stat4_label: '',
    stat4_suffix: ''
  });

  // Save loaders
  const [savingHero, setSavingHero] = useState(false);
  const [savingImpact, setSavingImpact] = useState(false);
  const [savingStatId, setSavingStatId] = useState(null);
  const [savingCardId, setSavingCardId] = useState(null);
  const [savingBranchId, setSavingBranchId] = useState(null);
  const [savingFaqId, setSavingFaqId] = useState(null);

  const [creatingStat, setCreatingStat] = useState(false);
  const [creatingCard, setCreatingCard] = useState(false);
  const [creatingBranch, setCreatingBranch] = useState(false);
  const [creatingFaq, setCreatingFaq] = useState(false);

  // Toaster Notifications
  const [toast, setToast] = useState(null);
  // Confirm Modal
  const [confirmModal, setConfirmModal] = useState(null); // { message, onConfirm }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const showConfirm = useCallback((message, onConfirm) => {
    setConfirmModal({ message, onConfirm });
  }, []);

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
      const [resAbout, resApp] = await Promise.all([
        fetch(`${API_URL}/api/about`),
        fetch(`${API_URL}/api/appointments/admin/all`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const dataAbout = await resAbout.json();
      const dataApp = await resApp.json();

      if (dataAbout.success) {
        setAboutItems(dataAbout.data || []);
        // Initialize hero state
        const heroItem = dataAbout.data.find(item => item.type === 'hero');
        if (heroItem) {
          setHeroForm({
            id: heroItem._id,
            title: heroItem.title || '',
            content: heroItem.content || ''
          });
        }
        // Initialize impact state
        const impactItem = dataAbout.data.find(item => item.type === 'impact');
        if (impactItem) {
          setImpactForm({
            id: impactItem._id,
            title: impactItem.title || '',
            content: impactItem.content || '',
            icon: impactItem.icon || '',
            stat1_num: impactItem.metadata?.stat1_num || '',
            stat1_label: impactItem.metadata?.stat1_label || '',
            stat1_suffix: impactItem.metadata?.stat1_suffix || '',
            stat2_num: impactItem.metadata?.stat2_num || '',
            stat2_label: impactItem.metadata?.stat2_label || '',
            stat2_suffix: impactItem.metadata?.stat2_suffix || '',
            stat3_num: impactItem.metadata?.stat3_num || '',
            stat3_label: impactItem.metadata?.stat3_label || '',
            stat3_suffix: impactItem.metadata?.stat3_suffix || '',
            stat4_num: impactItem.metadata?.stat4_num || '',
            stat4_label: impactItem.metadata?.stat4_label || '',
            stat4_suffix: impactItem.metadata?.stat4_suffix || ''
          });
        }
      }
      if (dataApp.success) setAppts(dataApp.data || []);
    } catch (err) {
      console.error('Failed to load About page data:', err);
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

  // Update Hero Section
  const handleHeroSave = async (e) => {
    e.preventDefault();
    setSavingHero(true);
    const token = localStorage.getItem('adminToken');

    try {
      const method = heroForm.id ? 'PUT' : 'POST';
      const endpoint = heroForm.id ? `${API_URL}/api/about/${heroForm.id}` : `${API_URL}/api/about`;
      const bodyPayload = heroForm.id 
        ? { title: heroForm.title, content: heroForm.content }
        : { type: 'hero', title: heroForm.title, content: heroForm.content };

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyPayload)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Hero section updated successfully', 'success');
        if (!heroForm.id) {
          setHeroForm(prev => ({ ...prev, id: json.data._id }));
        }
        setAboutItems(prev => {
          const exists = prev.some(i => i.type === 'hero');
          if (exists) {
            return prev.map(i => i.type === 'hero' ? json.data : i);
          } else {
            return [...prev, json.data];
          }
        });
      } else {
        showToast(json.message || 'Failed to update hero details', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving hero content', 'error');
    } finally {
      setSavingHero(false);
    }
  };

  // Update Impact Section
  const handleImpactSave = async (e) => {
    e.preventDefault();
    setSavingImpact(true);
    const token = localStorage.getItem('adminToken');

    try {
      const method = impactForm.id ? 'PUT' : 'POST';
      const endpoint = impactForm.id ? `${API_URL}/api/about/${impactForm.id}` : `${API_URL}/api/about`;
      const bodyPayload = {
        type: 'impact',
        title: impactForm.title,
        content: impactForm.content,
        icon: impactForm.icon,
        metadata: {
          stat1_num: impactForm.stat1_num,
          stat1_label: impactForm.stat1_label,
          stat1_suffix: impactForm.stat1_suffix,
          stat2_num: impactForm.stat2_num,
          stat2_label: impactForm.stat2_label,
          stat2_suffix: impactForm.stat2_suffix,
          stat3_num: impactForm.stat3_num,
          stat3_label: impactForm.stat3_label,
          stat3_suffix: impactForm.stat3_suffix,
          stat4_num: impactForm.stat4_num,
          stat4_label: impactForm.stat4_label,
          stat4_suffix: impactForm.stat4_suffix
        }
      };

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyPayload)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Impact section updated successfully', 'success');
        if (!impactForm.id) {
          setImpactForm(prev => ({ ...prev, id: json.data._id }));
        }
        setAboutItems(prev => {
          const exists = prev.some(i => i.type === 'impact');
          if (exists) {
            return prev.map(i => i.type === 'impact' ? json.data : i);
          } else {
            return [...prev, json.data];
          }
        });
      } else {
        showToast(json.message || 'Failed to update impact details', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving impact content', 'error');
    } finally {
      setSavingImpact(false);
    }
  };

  // Add Stat Item
  const handleAddStatSubmit = async (e) => {
    e.preventDefault();
    if (!newStat.title.trim() || !newStat.content.trim()) return;
    setCreatingStat(true);
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`${API_URL}/api/about`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'stat',
          title: newStat.title,
          content: newStat.content
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Stat item added successfully', 'success');
        setAboutItems(prev => [...prev, json.data]);
        setNewStat({ title: '', content: '' });
        setShowAddStat(false);
      } else {
        showToast(json.message || 'Failed to create stat item', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error adding stat', 'error');
    } finally {
      setCreatingStat(false);
    }
  };

  // Update Stat Item
  const handleUpdateStat = async (id, updatedTitle, updatedContent) => {
    setSavingStatId(id);
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`${API_URL}/api/about/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: updatedTitle,
          content: updatedContent
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Stat updated successfully', 'success');
        setAboutItems(prev => prev.map(item => item._id === id ? json.data : item));
      } else {
        showToast(json.message || 'Failed to update stat', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error saving stat', 'error');
    } finally {
      setSavingStatId(null);
    }
  };

  // Delete About Item
  const handleDeleteItem = async (id, name) => {
    showConfirm(`Delete "${name}"? This cannot be undone.`, async () => {
      const token = localStorage.getItem('adminToken');
      try {
        const res = await fetch(`${API_URL}/api/about/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        if (res.ok && json.success) {
          showToast('Item deleted successfully', 'success');
          setAboutItems(prev => prev.filter(item => item._id !== id));
        } else {
          showToast(json.message || 'Failed to delete item', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Network error deleting item', 'error');
      }
    });
  };

  // Add Mission Card
  const handleAddCardSubmit = async (e) => {
    e.preventDefault();
    if (!newCard.title.trim() || !newCard.content.trim()) return;
    setCreatingCard(true);
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`${API_URL}/api/about`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'card',
          title: newCard.title,
          content: newCard.content,
          icon: newCard.icon
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Card added successfully', 'success');
        setAboutItems(prev => [...prev, json.data]);
        setNewCard({ title: '', content: '', icon: 'mission' });
        setShowAddCard(false);
      } else {
        showToast(json.message || 'Failed to create card', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error adding card', 'error');
    } finally {
      setCreatingCard(false);
    }
  };

  // Update Mission Card
  const handleUpdateCard = async (id, updatedTitle, updatedContent, updatedIcon) => {
    setSavingCardId(id);
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`${API_URL}/api/about/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: updatedTitle,
          content: updatedContent,
          icon: updatedIcon
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Card updated successfully', 'success');
        setAboutItems(prev => prev.map(item => item._id === id ? json.data : item));
      } else {
        showToast(json.message || 'Failed to update card', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error saving card', 'error');
    } finally {
      setSavingCardId(null);
    }
  };

  // Add Branch
  const handleAddBranchSubmit = async (e) => {
    e.preventDefault();
    if (!newBranch.title.trim()) return;
    setCreatingBranch(true);
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`${API_URL}/api/about`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'branch',
          title: newBranch.title,
          content: newBranch.content,
          icon: newBranch.icon,
          metadata: {
            address: newBranch.address,
            badge: newBranch.badge,
            image: newBranch.image,
            stat1_num: newBranch.stat1_num,
            stat1_label: newBranch.stat1_label,
            stat2_num: newBranch.stat2_num,
            stat2_label: newBranch.stat2_label,
            stat3_num: newBranch.stat3_num,
            stat3_label: newBranch.stat3_label,
            action_url: newBranch.action_url,
            action_text: newBranch.action_text
          }
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Clinic location added successfully', 'success');
        setAboutItems(prev => [...prev, json.data]);
        setNewBranch({
          title: '', content: '', icon: '📍', address: '', badge: '', image: '',
          stat1_num: '', stat1_label: '', stat2_num: '', stat2_label: '', stat3_num: '', stat3_label: '',
          action_url: '', action_text: ''
        });
        setShowAddBranch(false);
      } else {
        showToast(json.message || 'Failed to create branch location', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error adding branch location', 'error');
    } finally {
      setCreatingBranch(false);
    }
  };

  // Update Branch
  const handleUpdateBranch = async (id, updatedTitle, updatedContent, updatedIcon, updatedMetadata) => {
    setSavingBranchId(id);
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`${API_URL}/api/about/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: updatedTitle,
          content: updatedContent,
          icon: updatedIcon,
          metadata: updatedMetadata
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Clinic location updated successfully', 'success');
        setAboutItems(prev => prev.map(item => item._id === id ? json.data : item));
      } else {
        showToast(json.message || 'Failed to update branch location', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error saving branch details', 'error');
    } finally {
      setSavingBranchId(null);
    }
  };

  // Add FAQ
  const handleAddFaqSubmit = async (e) => {
    e.preventDefault();
    if (!newFaq.title.trim() || !newFaq.content.trim()) return;
    setCreatingFaq(true);
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`${API_URL}/api/about`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'faq',
          title: newFaq.title, // title is the question
          content: newFaq.content // content is the answer
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('FAQ added successfully', 'success');
        setAboutItems(prev => [...prev, json.data]);
        setNewFaq({ title: '', content: '' });
        setShowAddFaq(false);
      } else {
        showToast(json.message || 'Failed to create FAQ item', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error adding FAQ', 'error');
    } finally {
      setCreatingFaq(false);
    }
  };

  // Update FAQ
  const handleUpdateFaq = async (id, updatedTitle, updatedContent) => {
    setSavingFaqId(id);
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch(`${API_URL}/api/about/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: updatedTitle,
          content: updatedContent
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('FAQ updated successfully', 'success');
        setAboutItems(prev => prev.map(item => item._id === id ? json.data : item));
      } else {
        showToast(json.message || 'Failed to update FAQ', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error saving FAQ', 'error');
    } finally {
      setSavingFaqId(null);
    }
  };

  // Get arrays of type specific items
  const stats = aboutItems.filter(item => item.type === 'stat');
  const cards = aboutItems.filter(item => item.type === 'card');
  const branches = aboutItems.filter(item => item.type === 'branch');
  const faqs = aboutItems.filter(item => item.type === 'faq');

  const pendingCount = appts.filter(a => ['pending', 'confirmed'].includes(a.status)).length;

  const nav = [
    { label: 'Dashboard',         path: '/admin/patients',                 icon: ICONS.home },
    { label: 'Appointments',      path: '/admin/appointments',             icon: ICONS.cal, badge: pendingCount || null },
    { label: 'Patients',          path: '/admin/patients?view=patients',   icon: ICONS.users },
    { label: 'Compliance',        path: '/admin/compliance',               icon: ICONS.shield },
    { label: 'Services & Content', path: '/admin/services',                icon: ICONS.edit },
    { label: 'Blog Manager',       path: '/admin/blog',                    icon: ICONS.doc },
    { label: 'About Page',        path: '/admin/about',                    icon: ICONS.info, active: true },
  ];

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

      {/* ══ MAIN CONTENT ══ */}
      <div className="dash_main">
        {/* Header */}
        <header className="dash_hdr">
          <div className="dash_hdr_left">
            <h2>About Page Content Manager ⚙️</h2>
            <p>Customize the public About Us page dynamically: banner text, floating stats, core mission, physical branches, and FAQs.</p>
          </div>
        </header>

        {loading ? (
          <div style={{ padding: '100px 0', textAlign: 'center', color: '#64748b' }}>
            <div className="spin" style={{ margin: '0 auto 16px' }} />
            Loading About page content...
          </div>
        ) : (
          <div className="abt_editor_container">
            <div className="abt_tabs_nav">
              <button className={`abt_tab_btn ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>
                <I d={ICONS.edit} s={14} /> Hero Section
              </button>
              <button className={`abt_tab_btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
                <I d={ICONS.stats} s={14} /> Floating Stats ({stats.length})
              </button>
              <button className={`abt_tab_btn ${activeTab === 'impact' ? 'active' : ''}`} onClick={() => setActiveTab('impact')}>
                <I d={ICONS.impact} s={14} /> Our Impact
              </button>
              <button className={`abt_tab_btn ${activeTab === 'cards' ? 'active' : ''}`} onClick={() => setActiveTab('cards')}>
                <I d={ICONS.mission} s={14} /> Mission & Values ({cards.length})
              </button>
              <button className={`abt_tab_btn ${activeTab === 'branches' ? 'active' : ''}`} onClick={() => setActiveTab('branches')}>
                <I d={ICONS.map} s={14} /> Clinical Network ({branches.length})
              </button>
              <button className={`abt_tab_btn ${activeTab === 'faqs' ? 'active' : ''}`} onClick={() => setActiveTab('faqs')}>
                <I d={ICONS.help} s={14} /> FAQs ({faqs.length})
              </button>
            </div>

            <div className="abt_grid" style={{ padding: '0px' }}>
              
              {/* 1. Hero Content Card Tab */}
              {activeTab === 'hero' && (
                <section className="abt_card anim_fade">
                  <h3 className="abt_title">
                    <I d={ICONS.edit} s={18} />
                    Hero Section
                  </h3>
                  <p className="abt_sub">Modify the primary banner title and description seen at the top of the About page.</p>
                  
                  <form onSubmit={handleHeroSave}>
                    <div className="abt_form_group">
                      <label className="abt_label">Banner Title</label>
                      <input
                        type="text"
                        className="abt_input"
                        placeholder="e.g. About West Chemist Clinic"
                        value={heroForm.title}
                        onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="abt_form_group">
                      <label className="abt_label">Banner Description / Content</label>
                      <textarea
                        className="abt_textarea"
                        rows="4"
                        placeholder="Provide description text..."
                        value={heroForm.content}
                        onChange={(e) => setHeroForm({ ...heroForm, content: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                      <button type="submit" className="abt_btn_save" disabled={savingHero}>
                        {savingHero ? <span className="abt_spinner" /> : <I d={ICONS.save} s={14} />}
                        {savingHero ? 'Saving Hero...' : 'Save Banner changes'}
                      </button>
                    </div>
                  </form>
                </section>
              )}

              {/* Our Impact Content Card Tab */}
              {activeTab === 'impact' && (
                <section className="abt_card anim_fade">
                  <h3 className="abt_title">
                    <I d={ICONS.impact} s={18} />
                    Our Impact in Numbers
                  </h3>
                  <p className="abt_sub">Customize the section title, description, side image, and 4 performance metrics.</p>
                  
                  <form onSubmit={handleImpactSave}>
                    <div className="abt_form_row">
                      <div className="abt_form_group">
                        <label className="abt_label">Section Title</label>
                        <input
                          type="text"
                          className="abt_input"
                          placeholder="e.g. Our Impact in Numbers"
                          value={impactForm.title}
                          onChange={(e) => setImpactForm({ ...impactForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <ImageUploader
                        label="Side Illustration Image"
                        value={impactForm.icon}
                        onChange={(val) => setImpactForm({ ...impactForm, icon: val })}
                      />
                    </div>

                    <div className="abt_form_group">
                      <label className="abt_label">Section Sub-headline / Content</label>
                      <textarea
                        className="abt_textarea"
                        rows="3"
                        placeholder="Provide sub-headline text..."
                        value={impactForm.content}
                        onChange={(e) => setImpactForm({ ...impactForm, content: e.target.value })}
                        required
                      />
                    </div>

                    <h5 style={{ fontSize: '0.82rem', color: 'var(--t2)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', paddingBottom: '4px', margin: '20px 0 12px' }}>Impact Metrics (4 Stats)</h5>
                    
                    <div className="abt_metric_grid">
                      {[
                        { n: 1, num: impactForm.stat1_num, suf: impactForm.stat1_suffix, lbl: impactForm.stat1_label,
                          setNum: v => setImpactForm({...impactForm, stat1_num: v}),
                          setSuf: v => setImpactForm({...impactForm, stat1_suffix: v}),
                          setLbl: v => setImpactForm({...impactForm, stat1_label: v}) },
                        { n: 2, num: impactForm.stat2_num, suf: impactForm.stat2_suffix, lbl: impactForm.stat2_label,
                          setNum: v => setImpactForm({...impactForm, stat2_num: v}),
                          setSuf: v => setImpactForm({...impactForm, stat2_suffix: v}),
                          setLbl: v => setImpactForm({...impactForm, stat2_label: v}) },
                        { n: 3, num: impactForm.stat3_num, suf: impactForm.stat3_suffix, lbl: impactForm.stat3_label,
                          setNum: v => setImpactForm({...impactForm, stat3_num: v}),
                          setSuf: v => setImpactForm({...impactForm, stat3_suffix: v}),
                          setLbl: v => setImpactForm({...impactForm, stat3_label: v}) },
                        { n: 4, num: impactForm.stat4_num, suf: impactForm.stat4_suffix, lbl: impactForm.stat4_label,
                          setNum: v => setImpactForm({...impactForm, stat4_num: v}),
                          setSuf: v => setImpactForm({...impactForm, stat4_suffix: v}),
                          setLbl: v => setImpactForm({...impactForm, stat4_label: v}) },
                      ].map(({ n, num, suf, lbl, setNum, setSuf, setLbl }) => (
                        <div className="abt_metric_card" key={n}>
                          {/* Live preview strip */}
                          <div className="abt_metric_preview">
                            <div className="abt_metric_preview_row">
                              <span className="abt_metric_num">{num || '—'}</span>
                              {suf && <span className="abt_metric_suffix">{suf}</span>}
                            </div>
                            <span className="abt_metric_label_preview">{lbl || 'LABEL TEXT'}</span>
                          </div>
                          {/* Editable inputs */}
                          <div className="abt_metric_inputs">
                            <h6 className="abt_metric_title">Metric {n}</h6>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '8px' }}>
                              <div>
                                <label className="abt_label" style={{ fontSize: '0.65rem' }}>Number</label>
                                <input type="text" className="abt_input" value={num} onChange={e => setNum(e.target.value)} placeholder="e.g. 15" required />
                              </div>
                              <div>
                                <label className="abt_label" style={{ fontSize: '0.65rem' }}>Suffix</label>
                                <input type="text" className="abt_input" value={suf} onChange={e => setSuf(e.target.value)} placeholder="+ or %" required />
                              </div>
                            </div>
                            <div>
                              <label className="abt_label" style={{ fontSize: '0.65rem' }}>Label Text</label>
                              <input type="text" className="abt_input" value={lbl} onChange={e => setLbl(e.target.value)} placeholder="e.g. Years of Excellence" required />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                      <button type="submit" className="abt_btn_save" disabled={savingImpact}>
                        {savingImpact ? <span className="abt_spinner" /> : <I d={ICONS.save} s={14} />}
                        {savingImpact ? 'Saving Impact...' : 'Save Impact changes'}
                      </button>
                    </div>
                  </form>
                </section>
              )}

              {/* 2. Stats Section Tab */}
              {activeTab === 'stats' && (
                <section className="abt_card anim_fade">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <h3 className="abt_title">
                      📊 Parallax Floating Stats
                    </h3>
                    <button className="abt_btn_add" onClick={() => setShowAddStat(!showAddStat)} style={{ marginTop: 0 }}>
                      <I d={ICONS.plus} s={14} />
                      {showAddStat ? 'Cancel' : 'Add New Stat'}
                    </button>
                  </div>
                  <p className="abt_sub">Manage the floating circular indicators displayed in parallax space on the hero section.</p>

                  {/* Add New Stat Form Block */}
                  {showAddStat && (
                    <form onSubmit={handleAddStatSubmit} className="abt_add_form">
                      <h4 className="abt_add_form_title">✨ Create Stat Item</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                        <div className="abt_form_group">
                          <label className="abt_label">Number / Value</label>
                          <input
                            type="text"
                            className="abt_input"
                            placeholder="e.g. 1946+ or 15+"
                            value={newStat.title}
                            onChange={(e) => setNewStat({ ...newStat, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="abt_form_group">
                          <label className="abt_label">Label / Name</label>
                          <input
                            type="text"
                            className="abt_input"
                            placeholder="e.g. Patients Helped or Specialists"
                            value={newStat.content}
                            onChange={(e) => setNewStat({ ...newStat, content: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                        <button type="submit" className="abt_btn_save" disabled={creatingStat}>
                          {creatingStat && <span className="abt_spinner" />}
                          Add Stat
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Stats list rows */}
                  {stats.length === 0 ? (
                    <div className="abt_empty_state">
                      No stats listed. Add stats to float them on the hero page.
                    </div>
                  ) : (
                    <div className="abt_row_list">
                      {stats.map(item => {
                        return (
                          <StatRow
                            key={item._id}
                            item={item}
                            onUpdate={handleUpdateStat}
                            onDelete={handleDeleteItem}
                            saving={savingStatId === item._id}
                          />
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* 3. Cards Section Tab */}
              {activeTab === 'cards' && (
                <section className="abt_card anim_fade">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <h3 className="abt_title">
                      🧭 Mission, Vision & Clinic Cards
                    </h3>
                    <button className="abt_btn_add" onClick={() => setShowAddCard(!showAddCard)} style={{ marginTop: 0 }}>
                      <I d={ICONS.plus} s={14} />
                      {showAddCard ? 'Cancel' : 'Add New Card'}
                    </button>
                  </div>
                  <p className="abt_sub">Edit or expand card blocks summarizing the clinic's directives, focus, and core principles.</p>

                  {/* Add New Card Form Block */}
                  {showAddCard && (
                    <form onSubmit={handleAddCardSubmit} className="abt_add_form">
                      <h4 className="abt_add_form_title">✨ Create Card Element</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '14px' }}>
                        <div className="abt_form_group">
                          <label className="abt_label">Card Title</label>
                          <input
                            type="text"
                            className="abt_input"
                            placeholder="e.g. Vision or Core Standards"
                            value={newCard.title}
                            onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="abt_form_group">
                          <label className="abt_label">Design Icon type</label>
                          <select
                            className="abt_select"
                            value={newCard.icon}
                            onChange={(e) => setNewCard({ ...newCard, icon: e.target.value })}
                          >
                            <option value="mission">Mission Grid</option>
                            <option value="vision">Vision Target</option>
                            <option value="values">Values Star</option>
                            <option value="other">Default Cross</option>
                          </select>
                        </div>
                      </div>
                      <div className="abt_form_group">
                        <label className="abt_label">Description content</label>
                        <textarea
                          className="abt_textarea"
                          rows="3"
                          placeholder="Enter card details..."
                          value={newCard.content}
                          onChange={(e) => setNewCard({ ...newCard, content: e.target.value })}
                          required
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <button type="submit" className="abt_btn_save" disabled={creatingCard}>
                          {creatingCard && <span className="abt_spinner" />}
                          Add Card Block
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Cards grid */}
                  {cards.length === 0 ? (
                    <div className="abt_empty_state">
                      No clinic cards defined.
                    </div>
                  ) : (
                    <div className="abt_card_list">
                      {cards.map(item => {
                        return (
                          <CardBlockItem
                            key={item._id}
                            item={item}
                            onUpdate={handleUpdateCard}
                            onDelete={handleDeleteItem}
                            saving={savingCardId === item._id}
                          />
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* 4. Branches Section Tab */}
              {activeTab === 'branches' && (
                <section className="abt_card anim_fade">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <h3 className="abt_title">
                      📍 Clinical Network & Locations
                    </h3>
                    <button className="abt_btn_add" onClick={() => setShowAddBranch(!showAddBranch)} style={{ marginTop: 0 }}>
                      <I d={ICONS.plus} s={14} />
                      {showAddBranch ? 'Cancel' : 'Add Clinic Branch'}
                    </button>
                  </div>
                  <p className="abt_sub">Add, edit, or remove physical and virtual clinic branches rendered on the public website.</p>

                  {/* Add New Branch Form Block */}
                  {showAddBranch && (
                    <form onSubmit={handleAddBranchSubmit} className="abt_add_form" style={{ maxWidth: '800px' }}>
                      <h4 className="abt_add_form_title">✨ Create Clinic Branch Location</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                        <div className="abt_form_group">
                          <label className="abt_label">Branch Name</label>
                          <input
                            type="text"
                            className="abt_input"
                            placeholder="e.g. London flagship clinic"
                            value={newBranch.title}
                            onChange={(e) => setNewBranch({ ...newBranch, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="abt_form_group">
                          <label className="abt_label">Location Badge</label>
                          <input
                            type="text"
                            className="abt_input"
                            placeholder="e.g. Flagship Branch or Fully Operational"
                            value={newBranch.badge}
                            onChange={(e) => setNewBranch({ ...newBranch, badge: e.target.value })}
                          />
                        </div>
                        <div className="abt_form_group">
                          <label className="abt_label">Street Address</label>
                          <input
                            type="text"
                            className="abt_input"
                            placeholder="e.g. 4 Kingsley Park Terrace, NN2 7HG"
                            value={newBranch.address}
                            onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                          />
                        </div>
                      </div>

                      <ImageUploader
                        label="Branch Cover Image"
                        value={newBranch.image}
                        onChange={(val) => setNewBranch({ ...newBranch, image: val })}
                      />

                      <div className="abt_form_group">
                        <label className="abt_label">Clinic Overview/Description</label>
                        <textarea
                          className="abt_textarea"
                          rows="2"
                          placeholder="Details about services provided at this clinic..."
                          value={newBranch.content}
                          onChange={(e) => setNewBranch({ ...newBranch, content: e.target.value })}
                          required
                        />
                      </div>

                      {/* Branch Key stats */}
                      <h5 style={{ fontSize: '0.82rem', color: 'var(--t2)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', paddingBottom: '4px', margin: '14px 0 8px' }}>Key Statistics & Metrics</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '14px' }}>
                        <div>
                          <label className="abt_label" style={{ fontSize: '0.7rem' }}>Stat 1 value</label>
                          <input type="text" className="abt_input" placeholder="e.g. Daily" value={newBranch.stat1_num} onChange={e => setNewBranch({ ...newBranch, stat1_num: e.target.value })} style={{ width: '100%' }} />
                          <label className="abt_label" style={{ fontSize: '0.7rem', marginTop: 4, display: 'block' }}>Stat 1 label</label>
                          <input type="text" className="abt_input" placeholder="e.g. Pharmacy" value={newBranch.stat1_label} onChange={e => setNewBranch({ ...newBranch, stat1_label: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label className="abt_label" style={{ fontSize: '0.7rem' }}>Stat 2 value</label>
                          <input type="text" className="abt_input" placeholder="e.g. 10+" value={newBranch.stat2_num} onChange={e => setNewBranch({ ...newBranch, stat2_num: e.target.value })} style={{ width: '100%' }} />
                          <label className="abt_label" style={{ fontSize: '0.7rem', marginTop: 4, display: 'block' }}>Stat 2 label</label>
                          <input type="text" className="abt_input" placeholder="e.g. Rooms" value={newBranch.stat2_label} onChange={e => setNewBranch({ ...newBranch, stat2_label: e.target.value })} style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label className="abt_label" style={{ fontSize: '0.7rem' }}>Stat 3 value</label>
                          <input type="text" className="abt_input" placeholder="e.g. 100%" value={newBranch.stat3_num} onChange={e => setNewBranch({ ...newBranch, stat3_num: e.target.value })} style={{ width: '100%' }} />
                          <label className="abt_label" style={{ fontSize: '0.7rem', marginTop: 4, display: 'block' }}>Stat 3 label</label>
                          <input type="text" className="abt_input" placeholder="e.g. Care" value={newBranch.stat3_label} onChange={e => setNewBranch({ ...newBranch, stat3_label: e.target.value })} style={{ width: '100%' }} />
                        </div>
                      </div>

                      {/* Action trigger */}
                      <h5 style={{ fontSize: '0.82rem', color: 'var(--t2)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', paddingBottom: '4px', margin: '14px 0 8px' }}>Action Trigger Button</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div className="abt_form_group">
                          <label className="abt_label">Button text</label>
                          <input
                            type="text"
                            className="abt_input"
                            placeholder="e.g. Book Consultation"
                            value={newBranch.action_text}
                            onChange={(e) => setNewBranch({ ...newBranch, action_text: e.target.value })}
                          />
                        </div>
                        <div className="abt_form_group">
                          <label className="abt_label">Button Link URL</label>
                          <input
                            type="text"
                            className="abt_input"
                            placeholder="e.g. /book-appointment"
                            value={newBranch.action_url}
                            onChange={(e) => setNewBranch({ ...newBranch, action_url: e.target.value })}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                        <button type="submit" className="abt_btn_save" disabled={creatingBranch}>
                          {creatingBranch && <span className="abt_spinner" />}
                          Add Branch Location
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Branches cards list */}
                  {branches.length === 0 ? (
                    <div className="abt_empty_state">
                      No branch locations defined yet.
                    </div>
                  ) : (
                    <div className="abt_card_list">
                      {branches.map(item => {
                        return (
                          <BranchCardItem
                            key={item._id}
                            item={item}
                            onUpdate={handleUpdateBranch}
                            onDelete={handleDeleteItem}
                            saving={savingBranchId === item._id}
                          />
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* 5. FAQs Section Tab */}
              {activeTab === 'faqs' && (
                <section className="abt_card anim_fade">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <h3 className="abt_title">
                      ❓ Frequently Asked Questions (FAQs)
                    </h3>
                    <button className="abt_btn_add" onClick={() => setShowAddFaq(!showAddFaq)} style={{ marginTop: 0 }}>
                      <I d={ICONS.plus} s={14} />
                      {showAddFaq ? 'Cancel' : 'Add New FAQ'}
                    </button>
                  </div>
                  <p className="abt_sub">Manage the collapsible FAQ answers rendered dynamically at the bottom of the About page.</p>

                  {/* Add New FAQ Form Block */}
                  {showAddFaq && (
                    <form onSubmit={handleAddFaqSubmit} className="abt_add_form">
                      <h4 className="abt_add_form_title">✨ Create FAQ Item</h4>
                      <div className="abt_form_group">
                        <label className="abt_label">Question Text</label>
                        <input
                          type="text"
                          className="abt_input"
                          placeholder="e.g. What are your opening hours?"
                          value={newFaq.title}
                          onChange={(e) => setNewFaq({ ...newFaq, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="abt_form_group">
                        <label className="abt_label">Answer / Details</label>
                        <textarea
                          className="abt_textarea"
                          rows="3"
                          placeholder="Provide the explanation/answer..."
                          value={newFaq.content}
                          onChange={(e) => setNewFaq({ ...newFaq, content: e.target.value })}
                          required
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <button type="submit" className="abt_btn_save" disabled={creatingFaq}>
                          {creatingFaq && <span className="abt_spinner" />}
                          Add FAQ
                        </button>
                      </div>
                    </form>
                  )}

                  {/* FAQs List */}
                  {faqs.length === 0 ? (
                    <div className="abt_empty_state">
                      No FAQs defined. Add questions to display them in the website FAQ section.
                    </div>
                  ) : (
                    <div className="abt_row_list">
                      {faqs.map(item => {
                        return (
                          <FaqRowItem
                            key={item._id}
                            item={item}
                            onUpdate={handleUpdateFaq}
                            onDelete={handleDeleteItem}
                            saving={savingFaqId === item._id}
                          />
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

            </div>
          </div>
        )}
      </div>

      {/* ── Custom Confirm Modal ── */}
      {confirmModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(15,10,30,0.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', padding: '32px 28px',
            maxWidth: '420px', width: '100%',
            boxShadow: '0 30px 80px rgba(0,0,0,0.18)',
            animation: 'fadeIn 0.2s ease both'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: '#fff5f5', border: '1px solid #fecaca',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0, marginBottom: '4px' }}>Confirm Delete</h4>
                <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{confirmModal.message}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmModal(null)}
                style={{
                  padding: '10px 22px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
                  background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '0.88rem',
                  cursor: 'pointer', transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.target.style.background = '#f8fafc'}
                onMouseLeave={e => e.target.style.background = '#fff'}
              >
                Cancel
              </button>
              <button
                onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
                style={{
                  padding: '10px 22px', borderRadius: '10px', border: 'none',
                  background: '#f43f5e', color: '#fff', fontWeight: 700, fontSize: '0.88rem',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(244,63,94,0.25)'
                }}
                onMouseEnter={e => e.target.style.background = '#e11d48'}
                onMouseLeave={e => e.target.style.background = '#f43f5e'}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Alert/Toast */}
      {toast && (
        <div className={`dash_toast toast_${toast.type}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {toast.type === 'success' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#008473" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}


/* Stat row inner component to manage its own editable input states */
function StatRow({ item, onUpdate, onDelete, saving }) {
  const [title, setTitle] = useState(item.title || '');
  const [content, setContent] = useState(item.content || '');

  useEffect(() => {
    setTitle(item.title || '');
    setContent(item.content || '');
  }, [item]);

  const changed = title !== (item.title || '') || content !== (item.content || '');

  return (
    <div className="abt_row_item">
      <div className="abt_form_group" style={{ marginBottom: 0 }}>
        <label className="abt_label" style={{ fontSize: '0.7rem' }}>Value / Count</label>
        <input
          type="text"
          className="abt_input"
          style={{ fontWeight: 800, color: 'var(--purple)' }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="abt_form_group" style={{ marginBottom: 0 }}>
        <label className="abt_label" style={{ fontSize: '0.7rem' }}>Label Text</label>
        <input
          type="text"
          className="abt_input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', alignSelf: 'end', height: '100%', paddingBottom: '2px' }}>
        {changed && (
          <button 
            className="abt_btn_save" 
            style={{ padding: '8px 14px', borderRadius: '8px' }}
            onClick={() => onUpdate(item._id, title, content)}
            disabled={saving}
          >
            {saving ? <span className="abt_spinner" /> : <I d={ICONS.save} s={12} />}
            {saving ? 'Saving...' : 'Update'}
          </button>
        )}
        <button 
          className="abt_btn_delete" 
          onClick={() => onDelete(item._id, `${title} - ${content}`)}
          title="Delete Stat"
        >
          <I d={ICONS.trash} s={14} />
        </button>
      </div>
    </div>
  );
}

/* Card Block element inner component managing its own inputs */
function CardBlockItem({ item, onUpdate, onDelete, saving }) {
  const [title, setTitle] = useState(item.title || '');
  const [content, setContent] = useState(item.content || '');
  const [icon, setIcon] = useState(item.icon || 'mission');

  useEffect(() => {
    setTitle(item.title || '');
    setContent(item.content || '');
    setIcon(item.icon || 'mission');
  }, [item]);

  const changed = title !== (item.title || '') || content !== (item.content || '') || icon !== (item.icon || 'mission');

  return (
    <div className="abt_card_item">
      <div>
        <div className="abt_card_hdr">
          <span className="abt_card_icon_badge">{icon} Icon</span>
          <button 
            className="abt_btn_delete" 
            style={{ width: '30px', height: '30px', borderRadius: '6px' }}
            onClick={() => onDelete(item._id, title)}
            title="Delete Card"
          >
            <I d={ICONS.trash} s={12} />
          </button>
        </div>

        <div className="abt_form_group">
          <label className="abt_label">Card Title</label>
          <input
            type="text"
            className="abt_input"
            style={{ fontWeight: 700 }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="abt_form_group">
          <label className="abt_label">Icon Design</label>
          <select
            className="abt_select"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          >
            <option value="mission">Mission Grid</option>
            <option value="vision">Vision Target</option>
            <option value="values">Values Star</option>
            <option value="other">Default Cross</option>
          </select>
        </div>

        <div className="abt_form_group" style={{ marginBottom: 0 }}>
          <label className="abt_label">Description content</label>
          <textarea
            className="abt_textarea"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      {changed && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button 
            className="abt_btn_save" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => onUpdate(item._id, title, content, icon)}
            disabled={saving}
          >
            {saving ? <span className="abt_spinner" /> : <I d={ICONS.save} s={14} />}
            {saving ? 'Updating card...' : 'Save Card Changes'}
          </button>
        </div>
      )}
    </div>
  );
}

/* BranchCardItem inner component for managing individual clinic network nodes */
function BranchCardItem({ item, onUpdate, onDelete, saving }) {
  const [title, setTitle] = useState(item.title || '');
  const [content, setContent] = useState(item.content || '');
  const [icon, setIcon] = useState(item.icon || '📍');
  
  // Extract and normalize metadata map
  const getInitialMeta = (itemObj) => {
    const meta = {};
    if (itemObj.metadata) {
      Object.keys(itemObj.metadata).forEach(key => {
        meta[key] = itemObj.metadata[key];
      });
    }
    return {
      address: meta.address || '',
      badge: meta.badge || '',
      image: meta.image || '',
      stat1_num: meta.stat1_num || '',
      stat1_label: meta.stat1_label || '',
      stat2_num: meta.stat2_num || '',
      stat2_label: meta.stat2_label || '',
      stat3_num: meta.stat3_num || '',
      stat3_label: meta.stat3_label || '',
      action_url: meta.action_url || '',
      action_text: meta.action_text || ''
    };
  };

  const [meta, setMeta] = useState(getInitialMeta(item));

  useEffect(() => {
    setTitle(item.title || '');
    setContent(item.content || '');
    setIcon(item.icon || '📍');
    setMeta(getInitialMeta(item));
  }, [item]);

  const handleMetaChange = (key, val) => {
    setMeta(prev => ({ ...prev, [key]: val }));
  };

  const isMetaChanged = () => {
    const original = getInitialMeta(item);
    return Object.keys(original).some(k => original[k] !== meta[k]);
  };

  const changed = title !== (item.title || '') || content !== (item.content || '') || icon !== (item.icon || '') || isMetaChanged();

  return (
    <div className="abt_card_item" style={{ border: '1.5px solid var(--purple-light, #e2d9f3)', background: '#fff' }}>
      <div>
        <div className="abt_card_hdr">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="abt_card_icon_badge" style={{ background: 'rgba(120, 89, 163, 0.1)', color: 'var(--purple)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {icon && (icon.startsWith('data:') || icon.startsWith('http') || icon.startsWith('/') || icon.includes('.')) ? (
                <img src={resolveImage(icon)} alt="Icon" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
              ) : (
                icon || "📍"
              )}
              Branch
            </span>
            {meta.badge && <span className="abt_card_icon_badge" style={{ background: '#fef3c7', color: '#b45309' }}>{meta.badge}</span>}
          </div>
          <button 
            className="abt_btn_delete" 
            style={{ width: '30px', height: '30px', borderRadius: '6px' }}
            onClick={() => onDelete(item._id, title)}
            title="Delete Branch"
          >
            <I d={ICONS.trash} s={12} />
          </button>
        </div>

        {meta.image && (
          <div style={{ width: '100%', height: '110px', overflow: 'hidden', borderRadius: '8px', marginBottom: '14px', border: '1px solid var(--border)' }}>
            <img src={resolveImage(meta.image)} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div className="abt_form_group">
          <label className="abt_label">Branch Name</label>
          <input type="text" className="abt_input" value={title} onChange={e => setTitle(e.target.value)} style={{ fontWeight: 700 }} />
        </div>

        <div className="abt_form_group">
          <label className="abt_label">Address</label>
          <input type="text" className="abt_input" value={meta.address} onChange={e => handleMetaChange('address', e.target.value)} />
        </div>

        <div className="abt_form_group">
          <label className="abt_label">Badge Text</label>
          <input type="text" className="abt_input" value={meta.badge} onChange={e => handleMetaChange('badge', e.target.value)} />
        </div>

        <ImageUploader
          label="Branch Cover Image"
          value={meta.image}
          onChange={(val) => handleMetaChange('image', val)}
        />

        <div className="abt_form_group">
          <label className="abt_label">Description</label>
          <textarea className="abt_textarea" rows="3" value={content} onChange={e => setContent(e.target.value)} />
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', margin: '12px 0' }}>
          <div>
            <label className="abt_label" style={{ fontSize: '0.62rem' }}>Stat 1</label>
            <input type="text" className="abt_input" value={meta.stat1_num} onChange={e => handleMetaChange('stat1_num', e.target.value)} style={{ fontSize: '0.78rem', padding: '6px 8px' }} />
            <input type="text" className="abt_input" value={meta.stat1_label} onChange={e => handleMetaChange('stat1_label', e.target.value)} style={{ fontSize: '0.72rem', padding: '4px 6px', marginTop: 3 }} />
          </div>
          <div>
            <label className="abt_label" style={{ fontSize: '0.62rem' }}>Stat 2</label>
            <input type="text" className="abt_input" value={meta.stat2_num} onChange={e => handleMetaChange('stat2_num', e.target.value)} style={{ fontSize: '0.78rem', padding: '6px 8px' }} />
            <input type="text" className="abt_input" value={meta.stat2_label} onChange={e => handleMetaChange('stat2_label', e.target.value)} style={{ fontSize: '0.72rem', padding: '4px 6px', marginTop: 3 }} />
          </div>
          <div>
            <label className="abt_label" style={{ fontSize: '0.62rem' }}>Stat 3</label>
            <input type="text" className="abt_input" value={meta.stat3_num} onChange={e => handleMetaChange('stat3_num', e.target.value)} style={{ fontSize: '0.78rem', padding: '6px 8px' }} />
            <input type="text" className="abt_input" value={meta.stat3_label} onChange={e => handleMetaChange('stat3_label', e.target.value)} style={{ fontSize: '0.72rem', padding: '4px 6px', marginTop: 3 }} />
          </div>
        </div>

        {/* Action button triggers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '8px', marginTop: '12px' }}>
          <div>
            <label className="abt_label" style={{ fontSize: '0.65rem' }}>Action Text</label>
            <input type="text" className="abt_input" value={meta.action_text} onChange={e => handleMetaChange('action_text', e.target.value)} style={{ fontSize: '0.8rem', padding: '8px 10px' }} />
          </div>
          <div>
            <label className="abt_label" style={{ fontSize: '0.65rem' }}>Action Link URL</label>
            <input type="text" className="abt_input" value={meta.action_url} onChange={e => handleMetaChange('action_url', e.target.value)} style={{ fontSize: '0.8rem', padding: '8px 10px' }} />
          </div>
        </div>

      </div>

      {changed && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
          <button 
            className="abt_btn_save" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => onUpdate(item._id, title, content, icon, meta)}
            disabled={saving}
          >
            {saving ? <span className="abt_spinner" /> : <I d={ICONS.save} s={14} />}
            {saving ? 'Saving...' : 'Save Branch Changes'}
          </button>
        </div>
      )}
    </div>
  );
}

/* FaqRowItem — Pro version with char counter + expand/collapse */
function FaqRowItem({ item, onUpdate, onDelete, saving }) {
  const [title, setTitle] = useState(item.title || '');
  const [content, setContent] = useState(item.content || '');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setTitle(item.title || '');
    setContent(item.content || '');
  }, [item]);

  const changed = title !== (item.title || '') || content !== (item.content || '');
  const ANSWER_MAX = 500;

  return (
    <div className="abt_row_item" style={{ gridTemplateColumns: '1fr', gap: '12px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="abt_card_icon_badge" style={{ background: 'rgba(0, 132, 115, 0.08)', color: 'var(--teal)' }}>FAQ</span>
          {changed && <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#f59e0b', background: '#fef3c7', padding: '2px 8px', borderRadius: '6px' }}>● Unsaved</span>}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setExpanded(p => !p)}
            style={{ padding: '5px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', background: '#fff', fontSize: '0.76rem', fontWeight: 700, color: 'var(--t2)', cursor: 'pointer' }}
          >
            {expanded ? '▲ Hide Answer' : '▼ Edit Answer'}
          </button>
          <button className="abt_btn_delete" style={{ width: '30px', height: '30px', borderRadius: '6px' }} onClick={() => onDelete(item._id, title)} title="Delete FAQ">
            <I d={ICONS.trash} s={12} />
          </button>
        </div>
      </div>

      <div className="abt_form_group" style={{ marginBottom: 0 }}>
        <label className="abt_label">Question</label>
        <input type="text" className="abt_input" style={{ fontWeight: 700 }} value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      {expanded && (
        <div className="abt_form_group" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label className="abt_label" style={{ margin: 0 }}>Answer / Details</label>
            <span style={{ fontSize: '0.68rem', color: content.length > ANSWER_MAX * 0.9 ? '#f43f5e' : 'var(--t3)', fontWeight: 600 }}>
              {content.length}/{ANSWER_MAX}
            </span>
          </div>
          <textarea className="abt_textarea" rows="4" value={content} onChange={e => setContent(e.target.value)} maxLength={ANSWER_MAX} />
        </div>
      )}

      {changed && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="abt_btn_save" style={{ padding: '10px 20px' }} onClick={() => onUpdate(item._id, title, content)} disabled={saving}>
            {saving ? <span className="abt_spinner" /> : <I d={ICONS.save} s={12} />}
            {saving ? 'Saving...' : 'Update FAQ'}
          </button>
        </div>
      )}
    </div>
  );
}

/* Base64 & URL Image Uploader — Pro Version with URL+File tabs */
function ImageUploader({ label, value, onChange }) {
  const fileInputRef = useRef(null);
  const [tab, setTab] = useState(value && !value.startsWith('data:') ? 'url' : 'file');
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Max 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUrlApply = () => {
    if (urlInput.trim()) onChange(urlInput.trim());
  };

  const clearImage = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const tabStyle = (active) => ({
    padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
    fontSize: '0.78rem', fontWeight: 700,
    background: active ? 'var(--purple)' : 'transparent',
    color: active ? '#fff' : 'var(--t3)',
    transition: 'all 0.2s ease'
  });

  return (
    <div className="abt_upload_container">
      <label className="abt_label">{label}</label>
      <div className="abt_upload_flex">
        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '10px', padding: '4px', marginBottom: '12px' }}>
          <button type="button" style={tabStyle(tab === 'file')} onClick={() => setTab('file')}>📁 Upload File</button>
          <button type="button" style={tabStyle(tab === 'url')} onClick={() => setTab('url')}>🔗 Image URL</button>
        </div>

        {/* Current preview */}
        {isImageSrc(value) && (
          <div className="abt_upload_preview_wrapper" style={{ marginBottom: '12px' }}>
            <img src={resolveImage(value)} alt="Preview" className="abt_upload_preview" />
            <button type="button" className="abt_upload_remove_btn" onClick={clearImage} title="Remove">✕</button>
          </div>
        )}

        {/* File tab */}
        {tab === 'file' && (
          <div className="abt_upload_box" onClick={() => fileInputRef.current?.click()}>
            <I d={ICONS.image} s={24} />
            <span className="abt_upload_btn">{value ? 'Replace Image' : 'Upload Local Image'}</span>
            <span className="abt_upload_info">PNG, JPG, WEBP — max 5MB</span>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
          </div>
        )}

        {/* URL tab */}
        {tab === 'url' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="url"
              className="abt_input"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleUrlApply())}
              style={{ flex: 1, margin: 0 }}
            />
            <button
              type="button"
              className="abt_btn_save"
              style={{ padding: '10px 16px', whiteSpace: 'nowrap', flexShrink: 0 }}
              onClick={handleUrlApply}
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
