"use client";
import React, { useState, useEffect, useRef } from 'react';
import { API_URL } from '@/config';
import './TravelClinic.css';

const vaccines = [
    "Chikungunya",
    "Cholera",
    "Dengue Fever",
    "DTP (Diphtheria/Tetanus/Polio)",
    "MMR",
    "Hepatitis A",
    "Hepatitis B",
    "Japanese Encephalitis",
    "Meningitis ACWY",
    "Meningitis B",
    "Rabies",
    "Tick-Borne Encephalitis",
    "Typhoid",
    "Yellow Fever",
    "Malaria Tablets"
];

export default function TravelClinic() {
    const listRef = useRef(null);
    const [dynamicVaccines, setDynamicVaccines] = useState([]);

    useEffect(() => {
        const fetchVaccines = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                const json = await res.json();
                if (res.ok && json.success && json.data.length > 0) {
                    const travelSrvs = json.data.filter(s => s.parentCategory === 'Travel Clinic');
                    if (travelSrvs.length > 0) {
                        const filtered = travelSrvs
                            .map(s => s.title)
                            .filter(title => {
                                const t = title.toLowerCase();
                                return t !== 'travel clinic' && t !== 'comprehensive travel vaccinations' && t !== 'travel clinic service';
                            });
                        setDynamicVaccines(filtered);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch Travel Clinic vaccines dynamically: ", err);
            }
        };
        fetchVaccines();
    }, []);

    const activeVaccines = dynamicVaccines.length > 0 ? dynamicVaccines : vaccines;

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('tc_visible');
                }
            });
        }, { threshold: 0.1 });

        const items = listRef.current?.querySelectorAll('.tc_vax_item');
        if (items) {
            items.forEach(item => observer.observe(item));
        }

        return () => observer.disconnect();
    }, [activeVaccines]);

    return (
        <section className="tc_section">
            <div className="tc_container">
                <div className="tc_grid">
                    {/* Left: Content */}
                    <div className="tc_content">
                        <span className="tc_eyebrow">Health Abroad</span>
                        <h2 className="tc_title">Travel Clinic</h2>
                        <p className="tc_text">
                            Protect your journey with our comprehensive travel vaccination services. 
                            Our experts provide personalised advice and essential immunisations 
                            for global destinations.
                        </p>
                        <button className="tc_btn" onClick={() => window.location.href = '/book-appointment?service=Travel%20Clinic'}>
                            Start Now
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                    </div>

                    {/* Right: Vaccination List */}
                    <div className="tc_list_box">
                        <h3 className="tc_list_title">Available Vaccinations</h3>
                        <div className="tc_vax_grid" ref={listRef}>
                            {activeVaccines.map((v, idx) => (
                                <div className="tc_vax_item" key={idx} style={{ '--delay': `${idx * 0.05}s` }}>
                                    <div className="tc_check">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    </div>
                                    <span className="tc_vax_name">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Artistic Background Elements */}
            <div className="tc_bg_shape tc_s1" />
            <div className="tc_bg_shape tc_s2" />
        </section>
    );
}
