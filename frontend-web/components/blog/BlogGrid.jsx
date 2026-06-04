"use client";
import React, { useEffect, useRef } from 'react';
import './BlogGrid.css';

const blogPosts = [
    {
        id: 1,
        title: "Managing Seasonal Allergies: Expert Tips",
        category: "General Health",
        date: "May 10, 2026",
        img: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?w=600&q=80",
        desc: "Learn how to effectively manage pollen and dust allergies with modern pharmaceutical solutions."
    },
    {
        id: 2,
        title: "The Importance of Travel Vaccinations",
        category: "Travel",
        date: "May 8, 2026",
        img: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&q=80",
        desc: "Stay safe on your next adventure with our comprehensive guide to essential travel vaccines."
    },
    {
        id: 3,
        title: "Understanding High Blood Pressure",
        category: "Heart Health",
        date: "May 5, 2026",
        img: "https://images.unsplash.com/photo-1505751172107-160bf2a35368?w=600&q=80",
        desc: "Expert insights into monitoring and controlling your blood pressure for a healthier heart."
    },
    {
        id: 4,
        title: "Mounjaro vs Wegovy: What You Need to Know",
        category: "Weight Loss",
        date: "May 2, 2026",
        img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
        desc: "A deep dive into the latest medical weight loss treatments available at our clinic."
    },
    {
        id: 5,
        title: "NHS Pharmacy First: A New Way to Get Care",
        category: "Pharmacy News",
        date: "April 28, 2026",
        img: "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?w=600&q=80",
        desc: "How the latest NHS initiative makes it easier for you to get treatment for minor conditions."
    },
    {
        id: 6,
        title: "The Benefits of Regular Health Checks",
        category: "Wellness",
        date: "April 25, 2026",
        img: "https://images.unsplash.com/photo-1454165833767-027ffea70250?w=600&q=80",
        desc: "Why preventive health screenings are essential for long-term health and wellbeing."
    }
];

export default function BlogGrid() {
    const gridRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('bg_visible');
                }
            });
        }, { threshold: 0.1 });

        const cards = gridRef.current.querySelectorAll('.bg_card_wrapper');
        cards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, []);

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

    return (
        <section className="bg_section">
            <div className="bg_container">
                <div className="bg_header">
                    <h2 className="bg_title">Latest Health Insights</h2>
                </div>

                <div className="bg_grid" ref={gridRef}>
                    {blogPosts.map((post, idx) => (
                        <div 
                            className="bg_card_wrapper" 
                            key={post.id}
                            style={{ '--delay': `${idx * 0.15}s` }}
                            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                            onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                        >
                            <div className="bg_card">
                                <div className="bg_img_box">
                                    <img src={post.img} alt={post.title} className="bg_img" />
                                    <span className="bg_category_tag">{post.category}</span>
                                </div>
                                <div className="bg_content">
                                    <span className="bg_date">{post.date}</span>
                                    <h3 className="bg_post_title">{post.title}</h3>
                                    <p className="bg_post_desc">{post.desc}</p>
                                    <button className="bg_read_more">
                                        Read Article
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
