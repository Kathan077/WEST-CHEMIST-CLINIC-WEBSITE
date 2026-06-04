"use client";
import React from 'react';
import './SocialFeed.css';

const socialPosts = [
    { type: "image", src: "https://images.unsplash.com/photo-1511174511562-5f7f18b854f2?w=400&q=80" },
    { type: "image", src: "https://images.unsplash.com/photo-1505751172107-160bf2a35368?w=400&q=80" },
    { type: "image", src: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80" },
    { type: "image", src: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=400&q=80" },
    { type: "image", src: "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&q=80" },
   
];

export default function SocialFeed() {
    return (
        <section className="sf_section">
            <div className="sf_container">
                <div className="sf_header">
                    <div className="sf_info">
                        <h2 className="sf_title">Health Tips on Social</h2>
                        <p className="sf_subtitle">Follow us @westchemistclinic for daily medical insights.</p>
                    </div>
                    <button className="sf_follow_btn">Follow on Instagram</button>
                </div>
                <div className="sf_grid">
                    {socialPosts.map((post, idx) => (
                        <div className="sf_item" key={idx}>
                            <img src={post.src} alt={`Social post ${idx}`} className="sf_img" />
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
