"use client";

import React, { useEffect, useState } from 'react';
import { API_URL } from '@/config';
import './AboutValues.css';

const DEFAULT_CORE_VALUES = {
    title: 'Our Core Values',
    val1_title: 'Patient First',
    val1_desc: 'Every decision is made with your health and wellbeing in mind.',
    val1_icon: 'heart',
    val2_title: 'Compassion',
    val2_desc: 'We treat every patient with kindness, respect, and understanding.',
    val2_icon: 'shield',
    val3_title: 'Pharmaceutical Excellence',
    val3_desc: 'Safe, evidence-based care delivered by qualified professionals.',
    val3_icon: 'star',
    val4_title: 'Trust & Integrity',
    val4_desc: 'Honest advice and ethical healthcare you can rely on.',
    val4_icon: 'check'
};

const renderValueIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
        case 'shield':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
            );
        case 'star':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
            );
        case 'check':
        case 'check-circle':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="m9 12 2 2 4-4"/>
                </svg>
            );
        case 'award':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                </svg>
            );
        case 'users':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
            );
        case 'heart':
        default:
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            );
    }
};

export default function AboutWhy({ initialValues }) {
    const [values, setValues] = useState(() => {
        if (!initialValues) return DEFAULT_CORE_VALUES;
        const meta = initialValues.metadata || {};
        return {
            title: initialValues.title || DEFAULT_CORE_VALUES.title,
            val1_title: meta.val1_title || DEFAULT_CORE_VALUES.val1_title,
            val1_desc: meta.val1_desc || DEFAULT_CORE_VALUES.val1_desc,
            val1_icon: meta.val1_icon || DEFAULT_CORE_VALUES.val1_icon,
            val2_title: meta.val2_title || DEFAULT_CORE_VALUES.val2_title,
            val2_desc: meta.val2_desc || DEFAULT_CORE_VALUES.val2_desc,
            val2_icon: meta.val2_icon || DEFAULT_CORE_VALUES.val2_icon,
            val3_title: meta.val3_title || DEFAULT_CORE_VALUES.val3_title,
            val3_desc: meta.val3_desc || DEFAULT_CORE_VALUES.val3_desc,
            val3_icon: meta.val3_icon || DEFAULT_CORE_VALUES.val3_icon,
            val4_title: meta.val4_title || DEFAULT_CORE_VALUES.val4_title,
            val4_desc: meta.val4_desc || DEFAULT_CORE_VALUES.val4_desc,
            val4_icon: meta.val4_icon || DEFAULT_CORE_VALUES.val4_icon
        };
    });

    useEffect(() => {
        fetch(`${API_URL}/api/about`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    const item = data.data.find(i => i.type === 'core_values');
                    if (item) {
                        const meta = item.metadata || {};
                        setValues({
                            title: item.title || DEFAULT_CORE_VALUES.title,
                            val1_title: meta.val1_title || DEFAULT_CORE_VALUES.val1_title,
                            val1_desc: meta.val1_desc || DEFAULT_CORE_VALUES.val1_desc,
                            val1_icon: meta.val1_icon || DEFAULT_CORE_VALUES.val1_icon,
                            val2_title: meta.val2_title || DEFAULT_CORE_VALUES.val2_title,
                            val2_desc: meta.val2_desc || DEFAULT_CORE_VALUES.val2_desc,
                            val2_icon: meta.val2_icon || DEFAULT_CORE_VALUES.val2_icon,
                            val3_title: meta.val3_title || DEFAULT_CORE_VALUES.val3_title,
                            val3_desc: meta.val3_desc || DEFAULT_CORE_VALUES.val3_desc,
                            val3_icon: meta.val3_icon || DEFAULT_CORE_VALUES.val3_icon,
                            val4_title: meta.val4_title || DEFAULT_CORE_VALUES.val4_title,
                            val4_desc: meta.val4_desc || DEFAULT_CORE_VALUES.val4_desc,
                            val4_icon: meta.val4_icon || DEFAULT_CORE_VALUES.val4_icon
                        });
                    }
                }
            })
            .catch(err => console.error('Error fetching core values:', err));
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('med_animate');
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.med_why_item, .med_why_center, .med_connecting_line').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [values]);

    return (
        <section className="med_why_bg">
            <div className="med_why_header">
                <h2>{values.title}</h2>
                <div className="med_divider_dots">
                    <span></span><span></span><span></span>
                </div>
            </div>

            <div className="med_why_container">

                {/* SVG Connecting Lines */}
                <svg className="med_connection_svg" width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
                    <path className="med_connecting_line med_cl_tl" d="M500,250 L250,90" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 6"/>
                    <path className="med_connecting_line med_cl_tr" d="M500,250 L750,90" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 6"/>
                    <path className="med_connecting_line med_cl_bl" d="M500,250 L250,410" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 6"/>
                    <path className="med_connecting_line med_cl_br" d="M500,250 L750,410" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 6"/>
                </svg>

                <div className="med_why_center">
                    <div className="med_pulse_ring"></div>
                    <div className="med_pulse_ring ring2"></div>
                    <div className="med_center_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 16 16">
                            <path d="M1.475 9C2.702 10.84 4.779 12.871 8 15c3.221-2.129 5.298-4.16 6.525-6H12a.5.5 0 0 1-.464-.314l-1.457-3.642-1.598 5.593a.5.5 0 0 1-.945.049L5.889 6.568l-1.473 2.21A.5.5 0 0 1 4 9z"/>
                            <path d="M.88 8C-2.427 1.68 4.41-2 7.823 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C11.59-2 18.426 1.68 15.12 8h-2.783l-1.874-4.686a.5.5 0 0 0-.945.049L7.921 8.956 6.464 5.314a.5.5 0 0 0-.88-.091L3.732 8z"/>
                        </svg>
                    </div>
                </div>

                <div className="med_why_item med_w_top_left">
                    <div className="med_why_icon">
                        {renderValueIcon(values.val1_icon)}
                    </div>
                    <div className="med_why_text">
                        <h4>{values.val1_title}</h4>
                        <p className="med_why_desc">{values.val1_desc}</p>
                    </div>
                </div>

                <div className="med_why_item med_w_top_right">
                    <div className="med_why_icon">
                        {renderValueIcon(values.val2_icon)}
                    </div>
                    <div className="med_why_text">
                        <h4>{values.val2_title}</h4>
                        <p className="med_why_desc">{values.val2_desc}</p>
                    </div>
                </div>

                <div className="med_why_item med_w_bot_left">
                    <div className="med_why_icon">
                        {renderValueIcon(values.val3_icon)}
                    </div>
                    <div className="med_why_text">
                        <h4>{values.val3_title}</h4>
                        <p className="med_why_desc">{values.val3_desc}</p>
                    </div>
                </div>

                <div className="med_why_item med_w_bot_right">
                    <div className="med_why_icon">
                        {renderValueIcon(values.val4_icon)}
                    </div>
                    <div className="med_why_text">
                        <h4>{values.val4_title}</h4>
                        <p className="med_why_desc">{values.val4_desc}</p>
                    </div>
                </div>

            </div>
        </section>
    );
}