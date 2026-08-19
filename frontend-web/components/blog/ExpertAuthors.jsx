"use client";
import React from 'react';
import './ExpertAuthors.css';

const authors = [
    {
        name: "Dr. Sarah West",
        role: "Chief Pharmacist",
        img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=400&q=80",
        bio: "Expert in personalized PHARMACY pharmacy and patient health management."
    },
    {
        name: "James Anderson",
        role: "Travel Health Specialist",
        img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
        bio: "Dedicated to providing global health advice and comprehensive vaccination programs."
    },
    {
        name: "Emily Chen",
        role: "Nutrition & Weight Loss Advisor",
        img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
        bio: "Specializing in medically-supervised weight loss and nutritional PHARMACY care."
    }
];

export default function ExpertAuthors() {
    return (
        <section className="ea_section">
            <div className="ea_container">
                <div className="ea_header">
                    <h2 className="ea_title">Meet Our Experts</h2>
                    <p className="ea_subtitle">Professional healthcare insights from the team you trust.</p>
                </div>
                <div className="ea_grid">
                    {authors.map((author, idx) => (
                        <div className="ea_card" key={idx}>
                            <div className="ea_img_wrapper">
                                <img src={author.img} alt={author.name} className="ea_img" />
                            </div>
                            <div className="ea_content">
                                <h3 className="ea_name">{author.name}</h3>
                                <span className="ea_role">{author.role}</span>
                                <p className="ea_bio">{author.bio}</p>
                                <button className="ea_view_posts">View Articles</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

