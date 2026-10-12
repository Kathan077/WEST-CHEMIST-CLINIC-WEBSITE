"use client";
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';
import './BlogHero.css';

export default function BlogHero({ featuredPost, heroCMS, onReadClick }) {
    const heroRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('bh_active');
                }
            });
        }, { threshold: 0.1 });

        if (heroRef.current) observer.observe(heroRef.current);
        return () => observer.disconnect();
    }, []);

    const getFullImgUrl = (img) => {
        if (!img) return '';
        if (img.startsWith('http://') || img.startsWith('https://')) return img;
        const normalizedImg = img.startsWith('/') ? img : `/${img}`;
        const normalizedApi = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        return `${normalizedApi}${normalizedImg}`;
    };

    // Determine values based on whether heroCMS is custom or featuredPost is present
    const isCustom = heroCMS && heroCMS.mode === 'custom';
    const isFeatured = !!featuredPost || isCustom;

    let badgeText = "PHARMACY BLOG";
    let titleText = <>Digital <span className="bh_highlight">Health</span> & Medical <span className="bh_highlight">Innovation</span></>;
    let descText = "Insights from the intersection of pharmaceutical expertise and modern wellness. Stay ahead with PHARMACY advice that matters for your daily life.";
    let imgUrl = "https://tse3.mm.bing.net/th/id/OIP.BQEZ1jkolGpcXEArQspFzwAAAA?r=0&w=435&h=270&rs=1&pid=ImgDetMain&o=7&rm=3";
    let displayDate = null;
    let btnText = "Read Featured Article";
    let btnLink = "";
    let verificationTitle = "Medically Verified";
    let verificationSubtitle = "By Pharmaceutical Team";

    if (isCustom) {
        badgeText = heroCMS.tag || "LATEST HEALTH ADVICE";
        titleText = heroCMS.title || "Expert Health Guidance & Pharmacy Insights";
        descText = heroCMS.description || "";
        imgUrl = getFullImgUrl(heroCMS.image);
        displayDate = heroCMS.date || null;
        btnText = heroCMS.btnText || "Read Featured Article";
        btnLink = heroCMS.btnLink || "";
        verificationTitle = heroCMS.verificationTitle || "Medically Verified";
        verificationSubtitle = heroCMS.verificationSubtitle || "By Pharmaceutical Team";
    } else if (featuredPost) {
        badgeText = featuredPost.subject || " ";
        titleText = featuredPost.title;
        const rawDesc = featuredPost.description?.replace(/<[^>]*>/g, '') || "";
        descText = rawDesc.length > 185 ? `${rawDesc.substring(0, 185)}...` : rawDesc;
        const postImg = featuredPost.images && featuredPost.images.length > 0 ? featuredPost.images[0] : null;
        imgUrl = postImg ? getFullImgUrl(postImg) : getFullImgUrl(heroCMS?.image);
        displayDate = new Date(featuredPost.date || featuredPost.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        btnText = "Read Featured Article";
        btnLink = `/blog/${featuredPost.slug}`;
        verificationTitle = featuredPost.verificationTitle || "Medically Verified";
        verificationSubtitle = featuredPost.verificationSubtitle || "By Pharmaceutical Team";
    }

    const handleCtaClick = () => {
        if (btnLink) {
            if (btnLink.startsWith('http://') || btnLink.startsWith('https://')) {
                window.location.href = btnLink;
            } else {
                router.push(btnLink);
            }
        } else if (onReadClick && featuredPost) {
            onReadClick();
        } else {
            const grid = document.querySelector('.bg_grid');
            if (grid) grid.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="bh_section" ref={heroRef}>
            {/* Ambient Background Elements */}
            <div className="bh_ambient">
                <div className="bh_light_orb orb_1" />
                <div className="bh_light_orb orb_2" />
                <div className="bh_pattern_overlay" />
            </div>

            <div className="bh_container">
                <div className="bh_main_grid">
                    {/* Left: Content Side */}
                    <div className="bh_content_side" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                       
                        <h1 className="bh_main_title" style={{ fontSize: isFeatured ? 'clamp(2.2rem, 4vw, 3.8rem)' : undefined }}>
                            {titleText}
                        </h1>
                        
                        <p className="bh_main_desc">
                            {descText}
                        </p>

                        {isFeatured ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start', width: '100%' }}>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                    {badgeText && badgeText.trim() !== '' && (
                                        <span style={{ fontSize: '.84rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', background: 'rgba(75, 45, 113, 0.08)', padding: '4px 12px', borderRadius: 100 }}>
                                            {badgeText}
                                        </span>
                                    )}
                                    {displayDate && (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '.84rem', color: '#64748b', fontWeight: 600 }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary, #4b2d71)' }}>
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                            {displayDate}
                                        </span>
                                    )}
                                </div>
                                <button className="bh_cta_btn" onClick={handleCtaClick}>
                                    {btnText}
                                </button>
                            </div>
                        ) : (
                            <button className="bh_cta_btn" onClick={() => {
                                const grid = document.querySelector('.bg_grid');
                                if (grid) grid.scrollIntoView({ behavior: 'smooth' });
                            }}>
                                Explore Health Topics
                            </button>
                        )}
                    </div>

                    {/* Right: Visual Side */}
                    <div className="bh_visual_side">
                        <div className="bh_image_canvas">
                            <div className="bh_img_frame">
                                <img 
                                    src={imgUrl} 
                                    alt="Health Innovation" 
                                    className="bh_hero_img" 
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                        if (!e.target.dataset.fallbackStep) {
                                            e.target.dataset.fallbackStep = '1';
                                            e.target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80';
                                        } else if (e.target.dataset.fallbackStep === '1') {
                                            e.target.dataset.fallbackStep = '2';
                                            e.target.src = '/images/about-pharmacist.jpg';
                                        }
                                    }}
                                />
                                <div className="bh_glass_overlay" />
                            </div>
                            
                            {/* Pro Space Floating Card */}
                            <div className="bh_floating_stat">
                                <div className="bh_stat_icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                </div>
                                <div className="bh_stat_text">
                                    <strong>{verificationTitle}</strong>
                                    <span>{verificationSubtitle}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

