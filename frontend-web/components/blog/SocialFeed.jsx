"use client";
import React, { useState, useEffect } from 'react';
import { API_URL } from '@/config';
import './SocialFeed.css';

/* Fallback placeholder images shown when admin hasn't set custom ones */
const FALLBACK_POSTS = [
    "https://images.unsplash.com/photo-1511174511562-5f7f18b854f2?w=400&q=80",
    "https://images.unsplash.com/photo-1505751172107-160bf2a35368?w=400&q=80",
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
    "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=400&q=80",
    "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&q=80",
];

export default function SocialFeed() {
    const [socialData, setSocialData] = useState({
        title: "Health Tips on Social",
        subtitle: "Follow us @westchemistclinic for daily medical insights.",
        instagram_url: "https://instagram.com/westchemistclinic"
    });
    const [posts, setPosts] = useState(FALLBACK_POSTS);

    useEffect(() => {
        const fetchSocialHeader = async () => {
            try {
                const res = await fetch(`${API_URL}/api/contents/social-feed-header`);
                const data = await res.json();
                if (data.success && data.data) {
                    setSocialData({
                        title: data.data.title || "Health Tips on Social",
                        subtitle: data.data.content || "Follow us @westchemistclinic for daily medical insights.",
                        instagram_url: data.data.metadata?.instagram_url || "https://instagram.com/westchemistclinic"
                    });

                    // Load admin-set social post images dynamically
                    const adminImgs = [];
                    let i = 0;
                    while (true) {
                        const url = data.data.metadata?.[`social_img_${i}`];
                        if (url === undefined) break;
                        if (url.trim()) {
                            adminImgs.push(url.trim());
                        }
                        i++;
                    }
                    if (adminImgs.length > 0) {
                        setPosts(adminImgs);
                    } else {
                        setPosts(FALLBACK_POSTS);
                    }
                }
            } catch (err) {
                console.error("Error loading social feed header:", err);
            }
        };
        fetchSocialHeader();
    }, []);

    return (
        <section className="sf_section">
            <div className="sf_container">
                <div className="sf_header">
                    <div className="sf_info">
                        <h2 className="sf_title">{socialData.title}</h2>
                        <p className="sf_subtitle">{socialData.subtitle}</p>
                    </div>
                    <a 
                        href={socialData.instagram_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="sf_follow_btn"
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                    >
                        Follow on Instagram
                    </a>
                </div>
                <div className="sf_grid">
                    {posts.map((src, idx) => (
                        <div className="sf_item" key={idx}>
                            <img src={src} alt={`Social post ${idx + 1}`} className="sf_img" />
                            <div className="sf_overlay">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
