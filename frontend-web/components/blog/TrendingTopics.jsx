"use client";
import React from 'react';
import './TrendingTopics.css';

const tags = [
    { name: "Weight Loss", count: 12, color: "#4B2D71" },
    { name: "Mental Health", count: 8, color: "#008473" },
    { name: "Vaccinations", count: 15, color: "#7C3AED" },
    { name: "Skincare", count: 6, color: "#DB2777" },
    { name: "Pharmacy News", count: 9, color: "#059669" },
    { name: "Travel Clinic", count: 11, color: "#2563EB" },
    { name: "Allergy Care", count: 7, color: "#D97706" }
];

export default function TrendingTopics() {
    return (
        <section className="tt_section">
            <div className="tt_container">
                <div className="tt_header">
                    <h2 className="tt_title">Trending Topics</h2>
                    <p className="tt_subtitle">Explore what our community is reading right now.</p>
                </div>
                <div className="tt_grid">
                    {tags.map((tag, idx) => (
                        <div className="tt_tag_card" key={idx} style={{ '--t-color': tag.color }}>
                            <div className="tt_tag_inner">
                                <span className="tt_name">{tag.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
