"use client";
import React, { useEffect, useRef, useState } from 'react';
import { API_URL } from '@/config';
import './AboutBranches.css';

const resolveImage = (src) => {
    if (!src) return '';
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
        return src;
    }
    return `${API_URL}${src.startsWith('/') ? '' : '/'}${src}`;
};

const DEFAULT_BRANCHES = [
    {
        _id: 'default-flagship',
        title: "Northampton Branch",
        content: "Our primary healthcare hub offering comprehensive PHARMACY services, prescriptions, and expert advice in a state-of-the-art facility.",
        icon: "",
        metadata: {
            address: "4 Kingsley Park Terrace, NN2 7HG",
            image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
            badge: "Flagship Branch",
            stat1_num: "Daily",
            stat1_label: "Pharmacy",
            stat2_num: "10+",
            stat2_label: "Consult Rooms",
            stat3_num: "100%",
            stat3_label: "Quality Care",
            action_url: "https://maps.google.com/?q=4+Kingsley+Park+Terrace,+Northampton+NN2+7HG,+United+Kingdom",
            action_text: "View Branch & Directions"
        }
    },
    {
        _id: 'default-virtual',
        title: "East London Consultation Hub",
        content: "Our dedicated consultation hub offering in-person health assessments, travel vaccinations, and private consultations in East London.",
        icon: "",
        metadata: {
            address: "East London, UK",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
            badge: "Consultation Hub",
            stat1_num: "7 Days",
            stat1_label: "Availability",
            stat2_num: "Zero",
            stat2_label: "Travel Needed",
            stat3_num: "Secure",
            stat3_label: "Consultations",
            action_url: "/book-appointment",
            action_text: "Book Pharmacy Consultation"
        }
    }
];

const Branches = () => {
    const sectionRef = useRef(null);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Fetch branch data from backend API
        fetch(`${API_URL}/api/about`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    const branchItems = data.data.filter(item => item.type === 'branch');
                    if (branchItems.length > 0) {
                        // Normalize metadata just in case Mongoose Map structure is different
                        const formattedBranches = branchItems.map(item => {
                            const meta = {};
                            if (item.metadata) {
                                // If it is a Map, it might be an object, or we can iterate
                                Object.keys(item.metadata).forEach(key => {
                                    meta[key] = item.metadata[key];
                                });
                            }
                            return {
                                ...item,
                                metadata: {
                                    address: meta.address || '',
                                    image: typeof meta.image === 'undefined'
                                        ? (item.title?.toLowerCase().includes('virtual') || item.title?.toLowerCase().includes('online')
                                            ? 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
                                            : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800')
                                        : meta.image,
                                    badge: meta.badge || '',
                                    stat1_num: meta.stat1_num || '',
                                    stat1_label: meta.stat1_label || '',
                                    stat2_num: meta.stat2_num || '',
                                    stat2_label: meta.stat2_label || '',
                                    stat3_num: meta.stat3_num || '',
                                    stat3_label: meta.stat3_label || '',
                                    action_url: meta.action_url || '',
                                    action_text: meta.action_text || 'Learn More'
                                }
                            };
                        });
                        setBranches(formattedBranches);
                    } else {
                        setBranches(DEFAULT_BRANCHES);
                    }
                } else {
                    setBranches(DEFAULT_BRANCHES);
                }
            })
            .catch(err => {
                console.error('Error fetching about branches:', err);
                setBranches(DEFAULT_BRANCHES);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!sectionRef.current) return;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal_active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const revealElements = sectionRef.current.querySelectorAll('.reveal_on_scroll');
        revealElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [branches]);

    return (
        <section className="br_section" ref={sectionRef}>
            <div className="br_container">
                <div className="br_section_header reveal_on_scroll">
                    <span className="br_eyebrow">Our Pharmacy Locations</span>
                    <h2 className="br_main_title">Expert Care Across<br />Multiple Locations.</h2>
                    <p className="br_header_lead">
                        Both our pharmacy hubs are fully operational, delivering state-of-the-art healthcare dedicated to your comfort, precision, and privacy.
                    </p>
                </div>

                <div className="br_unified_grid">
                    <style dangerouslySetInnerHTML={{__html: `
                        .skeleton_card {
                            opacity: 0.7;
                            animation: pulse-skeletons 1.5s infinite ease-in-out;
                            background: var(--bg-card, #ffffff);
                            border: 1px solid var(--border-light, #f1eefb);
                            border-radius: 16px;
                            overflow: hidden;
                        }
                        .skeleton_visual {
                            background: #e2e8f0;
                            height: 240px;
                        }
                        .skeleton_content_box {
                            padding: 24px;
                        }
                        .skeleton_line {
                            background: #e2e8f0;
                            border-radius: 4px;
                            margin-bottom: 12px;
                        }
                        .skeleton_title {
                            height: 24px;
                            width: 60%;
                        }
                        .skeleton_text {
                            height: 14px;
                            width: 90%;
                        }
                        .skeleton_text_short {
                            height: 14px;
                            width: 40%;
                        }
                        .skeleton_stats {
                            display: flex;
                            gap: 12px;
                            margin: 20px 0;
                        }
                        .skeleton_stat {
                            background: #e2e8f0;
                            height: 50px;
                            flex: 1;
                            border-radius: 6px;
                        }
                        .skeleton_btn {
                            background: #e2e8f0;
                            height: 44px;
                            border-radius: 8px;
                        }
                        @keyframes pulse-skeletons {
                            0% { opacity: 0.6; }
                            50% { opacity: 0.9; }
                            100% { opacity: 0.6; }
                        }
                    `}} />
                    {loading ? (
                        [1, 2].map((n) => (
                            <div key={n} className="br_pro_card skeleton_card">
                                <div className="br_pro_visual skeleton_visual" />
                                <div className="skeleton_content_box">
                                    <div className="skeleton_line skeleton_title" />
                                    <div className="skeleton_line skeleton_text" />
                                    <div className="skeleton_line skeleton_text_short" />
                                    <div className="skeleton_stats">
                                        <div className="skeleton_stat" />
                                        <div className="skeleton_stat" />
                                        <div className="skeleton_stat" />
                                    </div>
                                    <div className="skeleton_btn" />
                                </div>
                            </div>
                        ))
                    ) : (
                        branches.map((branch, idx) => (
                            <div 
                                key={branch._id} 
                                className="br_pro_card reveal_on_scroll"
                                style={{ transitionDelay: `${idx * 0.2}s` }}
                            >
                                {branch.metadata?.image && (
                                    <div className="br_pro_visual">
                                        <img 
                                            src={resolveImage(branch.metadata.image)} 
                                            alt={branch.title} 
                                            className="br_pro_image" 
                                        />
                                        <div className="br_pro_overlay" />
                                        {branch.metadata?.badge && (
                                            <div className={`br_badge ${idx % 2 !== 0 ? 'accent_badge' : ''}`}>
                                                {branch.metadata.badge}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="br_pro_content">
                                    {!branch.metadata?.image && branch.metadata?.badge && (
                                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '14px' }}>
                                            <span className={`br_badge ${idx % 2 !== 0 ? 'accent_badge' : ''}`} style={{ position: 'static', display: 'inline-block' }}>
                                                {branch.metadata.badge}
                                            </span>
                                        </div>
                                    )}
                                    <div className="br_pro_head">
                                        <div className="br_pro_icon">
                                            {branch.icon && (branch.icon.startsWith('data:') || branch.icon.startsWith('http') || branch.icon.startsWith('/') || branch.icon.includes('.')) ? (
                                                <img src={resolveImage(branch.icon)} alt="Icon" />
                                            ) : (
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                                    <circle cx="12" cy="10" r="3"/>
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="br_pro_name">{branch.title}</h3>
                                            {branch.metadata?.address && (
                                                <p className="br_pro_address">{branch.metadata.address}</p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="br_pro_desc">
                                        {branch.content}
                                    </p>
                                    <div className="br_pro_stats">
                                        {branch.metadata?.stat1_num && (
                                            <div className="br_pro_stat">
                                                <span className="br_pro_stat_num">{branch.metadata.stat1_num}</span>
                                                <span className="br_pro_stat_label">{branch.metadata.stat1_label}</span>
                                            </div>
                                        )}
                                        {branch.metadata?.stat2_num && (
                                            <div className="br_pro_stat">
                                                <span className="br_pro_stat_num">{branch.metadata.stat2_num}</span>
                                                <span className="br_pro_stat_label">{branch.metadata.stat2_label}</span>
                                            </div>
                                        )}
                                        {branch.metadata?.stat3_num && (
                                            <div className="br_pro_stat">
                                                <span className="br_pro_stat_num">{branch.metadata.stat3_num}</span>
                                                <span className="br_pro_stat_label">{branch.metadata.stat3_label}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="br_pro_actions">
                                        <a 
                                            href={branch.metadata?.action_url || "#"} 
                                            target={branch.metadata?.action_url?.startsWith('http') ? "_blank" : "_self"}
                                            rel="noopener noreferrer" 
                                            className={idx % 2 !== 0 ? "br_btn_secondary br_btn_full" : "br_btn_primary br_btn_full"}
                                        >
                                            {branch.metadata?.action_text || "Learn More"}
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </section>
    );
};

export default Branches;

