"use client";
import React, { useEffect, useRef } from 'react';
import { API_URL, getImageUrl } from '@/config';
import './BlogGrid.css';

export default function BlogGrid({ posts = [], loading = false, onReadClick }) {
    const gridRef = useRef(null);

    // Intersection observer for animation
    useEffect(() => {
        if (loading || posts.length === 0) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('bg_visible');
                }
            });
        }, { threshold: 0.1 });

        const cards = gridRef.current?.querySelectorAll('.bg_card_wrapper') || [];
        cards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, [loading, posts]);

    const handleMouseMove = (e, card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * -10;

        card.style.setProperty('--rx', `${rotateX}deg`);
        card.style.setProperty('--ry', `${rotateY}deg`);
    };

    const handleMouseLeave = (card) => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
    };

    const getFullImgUrl = (img) => {
        if (!img || img === 'https://images.unsplash.com/photo-1559839734-2b71f1536783?w=800&q=80') {
            return 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80';
        }
        return getImageUrl(img);
    };

    return (
        <section className="bg_section">
            <div className="bg_container">
                <div className="bg_header">
                    <h2 className="bg_title">Latest Health Insights</h2>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '60px 0', color: 'var(--primary)' }}>
                        <div className="bg_spinner"></div>
                        <p style={{ fontWeight: 600 }}>Loading latest articles...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 30px', textAlign: 'center', background: '#fff', borderRadius: '32px', border: '1px solid rgba(75, 45, 113, 0.08)', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.01)', maxWidth: '640px', margin: '0 auto', gap: '16px' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(75, 45, 113, 0.06)', display: 'flex', alignItems: 'center', justifycontent: 'center', color: 'var(--primary)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--foreground)', margin: 0 }}>Articles Coming Soon</h3>
                        <p style={{ fontSize: '0.94rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                            Our registered PHARMACY team is currently preparing medically verified guides, wellness updates, and pharmaceutical advice for you. Stay tuned!
                        </p>
                        <button className="bh_cta_btn" style={{ padding: '12px 30px', fontSize: '.9rem', marginTop: '8px' }} onClick={() => window.location.href = '/book-appointment'}>
                            Book Consultation
                        </button>
                    </div>
                ) : (
                    <div className="bg_grid" ref={gridRef}>
                        {posts.map((post, idx) => {
                            const postImg = post.images && post.images.length > 0 ? post.images[0] : (post.img || '');
                            const displayDate = new Date(post.date || post.createdAt).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            });
                            const rawDesc = post.description?.replace(/<[^>]*>/g, '') || post.desc || '';
                            const plainTextDesc = rawDesc.length > 150 ? `${rawDesc.substring(0, 147)}...` : rawDesc;

                            return (
                                <div 
                                    className="bg_card_wrapper" 
                                    key={post._id || post.id}
                                    style={{ '--delay': `${idx * 0.15}s` }}
                                    onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                                    onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                                >
                                    <div className="bg_card">
                                        <div className="bg_img_box">
                                            <img 
                                                src={getFullImgUrl(postImg)} 
                                                alt={post.title} 
                                                className="bg_img" 
                                                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80'}
                                            />
                                            <span className="bg_category_tag">{post.subject || post.category}</span>
                                        </div>
                                        <div className="bg_content">
                                            <span className="bg_date">{displayDate}</span>
                                            <h3 className="bg_post_title">{post.title}</h3>
                                            <p className="bg_post_desc">{plainTextDesc}</p>
                                            <button className="bg_read_more" onClick={() => onReadClick(post)}>
                                                Read Article
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

