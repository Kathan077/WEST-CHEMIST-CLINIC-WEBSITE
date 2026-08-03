"use client";

import React, { useEffect, useState, useRef } from 'react';
import { API_URL } from '@/config';
import './AboutImpact.css';

const resolveImage = (src) => {
    if (!src) return '';
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
        return src;
    }
    return `${API_URL}${src.startsWith('/') ? '' : '/'}${src}`;
};

export default function AboutImpact() {
    const sectionRef = useRef(null);
    const [counts, setCounts] = useState({ years: 0, docs: 0, satisfaction: 0, clients: 0 });
    const [hasIntersected, setHasIntersected] = useState(false);
    const [impactData, setImpactData] = useState({
        title: 'Our Impact in Numbers',
        content: 'At West Chemist, we go beyond dispensing medicines to provide dedicated community healthcare.',
        icon: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=90',
        stat1_num: '15',
        stat1_label: 'Years of Excellence',
        stat1_suffix: '+',
        stat2_num: '10',
        stat2_label: 'Qualified Pharmacists & Staff',
        stat2_suffix: '+',
        stat3_num: '99',
        stat3_label: 'Patient Satisfaction',
        stat3_suffix: '%',
        stat4_num: '2000',
        stat4_label: 'Happy Clients',
        stat4_suffix: '+'
    });

    useEffect(() => {
        // Fetch dynamic content from backend
        fetch(`${API_URL}/api/about`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    const item = data.data.find(i => i.type === 'impact');
                    if (item) {
                        setImpactData({
                            title: item.title || 'Our Impact in Numbers',
                            content: item.content || 'At West Chemist, we go beyond dispensing medicines to provide dedicated community healthcare.',
                            icon: item.icon || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=90',
                            stat1_num: item.metadata?.stat1_num || '15',
                            stat1_label: item.metadata?.stat1_label || 'Years of Excellence',
                            stat1_suffix: item.metadata?.stat1_suffix || '+',
                            stat2_num: item.metadata?.stat2_num || '10',
                            stat2_label: item.metadata?.stat2_label || 'Qualified Pharmacists & Staff',
                            stat2_suffix: item.metadata?.stat2_suffix || '+',
                            stat3_num: item.metadata?.stat3_num || '99',
                            stat3_label: item.metadata?.stat3_label || 'Patient Satisfaction',
                            stat3_suffix: item.metadata?.stat3_suffix || '%',
                            stat4_num: item.metadata?.stat4_num || '2000',
                            stat4_label: item.metadata?.stat4_label || 'Happy Clients',
                            stat4_suffix: item.metadata?.stat4_suffix || '+'
                        });
                    }
                }
            })
            .catch(err => console.error('Error fetching about impact data:', err));
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                entries[0].target.classList.add('med_animate');
                setHasIntersected(true);
                observer.disconnect();
            }
        }, { threshold: 0.3 });

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!hasIntersected) return;

        let timer;
        const duration = 2000;
        const steps = 50;
        const stepTime = duration / steps;

        let currentStep = 0;
        const target1 = parseInt(impactData.stat1_num) || 0;
        const target2 = parseInt(impactData.stat2_num) || 0;
        const target3 = parseInt(impactData.stat3_num) || 0;
        const target4 = parseInt(impactData.stat4_num) || 0;

        timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easing = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCounts({
                years: Math.floor(target1 * easing),
                docs: Math.floor(target2 * easing),
                satisfaction: Math.floor(target3 * easing),
                clients: Math.floor(target4 * easing),
            });

            if (currentStep >= steps) clearInterval(timer);
        }, stepTime);

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [hasIntersected, impactData.stat1_num, impactData.stat2_num, impactData.stat3_num, impactData.stat4_num]);

    return (
        <section className="med_impact_bg" ref={sectionRef}>
            <div className="med_impact_container">

                <div className="med_impact_img_col">
                    <img
                        src={resolveImage(impactData.icon)}
                        alt="Team"
                    />
                </div>

                <div className="med_impact_text_col">
                    <h2>{impactData.title}</h2>
                    <p>{impactData.content}</p>

                    <div className="med_impact_grid">
                        <div className="med_stat_box">
                            <h3>{counts.years}<span className="med_plus">{impactData.stat1_suffix}</span></h3>
                            <span>{impactData.stat1_label}</span>
                        </div>
                        <div className="med_stat_box">
                            <h3>{counts.docs}<span className="med_plus">{impactData.stat2_suffix}</span></h3>
                            <span>{impactData.stat2_label}</span>
                        </div>
                        <div className="med_stat_box">
                            <h3>{counts.satisfaction}<span className="med_plus">{impactData.stat3_suffix}</span></h3>
                            <span>{impactData.stat3_label}</span>
                        </div>
                        <div className="med_stat_box">
                            <h3>{counts.clients}<span className="med_plus">{impactData.stat4_suffix}</span></h3>
                            <span>{impactData.stat4_label}</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}