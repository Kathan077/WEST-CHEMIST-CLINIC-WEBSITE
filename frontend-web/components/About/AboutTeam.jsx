"use client";

import React, { useEffect, useRef } from 'react';
import './AboutTeam.css';

const teamMembers = [
    {
        id: 1,
        name: "Sarah Jenkins, MPharm",
        role: "Superintendent Pharmacist",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=90",
    },
    {
        id: 2,
        name: "James Carter, MPharm",
        role: "Lead Travel Health Pharmacist",
        image: "https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefcca?w=600&q=90",
    },
    {
        id: 3,
        name: "Daniel Lee, BSc",
        role: "Senior Pharmacy Technician",
        image: "https://images.unsplash.com/photo-1594824436998-d89d4fb57134?w=600&q=90",
    }
];

export default function AboutTeam() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                entries[0].target.classList.add('med_animate');
                observer.disconnect();
            }
        }, { threshold: 0.2 });

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer?.disconnect();
    }, []);

    return (
        <section className="med_team_bg" ref={sectionRef}>
            <div className="med_team_header">
                <span className="med_team_badge">Our Team</span>
                <h2>Meet Our Pharmacy Team</h2>
                <p>Behind every service is a qualified team of pharmacists and healthcare staff dedicated to your health and well-being.</p>
            </div>

            <div className="med_team_container">
                {teamMembers.map((member) => (
                    <div key={member.id} className="med_team_card">
                        <div className="med_t_img_box">
                            <img src={member.image} alt={member.name} />
                        </div>
                        <div className="med_t_info">
                            <h3>{member.name}</h3>
                            <span className="med_t_role">{member.role}</span>
                            <div className="med_t_socials">
                                {/* SVG social icons placeholder */}
                                <a href="#">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                                </a>
                                <a href="#">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                                </a>
                                <a href="#">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="med_team_action">
                <button className="med_btn_primary">See All Pharmacy Staff</button>
            </div>
        </section>
    );
}
