import React, { useEffect, useRef } from 'react';
import './AboutBranches.css';

const AboutBranches = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal_active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const revealElements = sectionRef.current.querySelectorAll('.reveal_on_scroll');
        revealElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="br_section" ref={sectionRef}>
            <div className="br_container">
                <div className="br_layout">
                    <div className="br_visual_block reveal_on_scroll">
                        <div className="br_image_wrapper">
                            <img 
                                src="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1200&q=80" 
                                alt="West Chemist Flagship Clinic" 
                                className="br_image" 
                            />
                            <div className="br_image_overlay" />
                            <div className="br_badge">Flagship Branch</div>
                        </div>
                    </div>

                    <div className="br_info_block reveal_on_scroll">
                        <span className="br_eyebrow">Our Clinical Presence</span>
                        <h2 className="br_title">Expert Care, <br />Near You.</h2>
                        <p className="br_lead">
                            Experience healthcare at our state-of-the-art facility in Northampton. Designed for comfort, precision, and privacy.
                        </p>

                        <div className="br_address_card">
                            <div className="br_address_icon">📍</div>
                            <div className="br_address_content">
                                <h3>Northampton Clinic</h3>
                                <p>4 Kingsley Park Terrace, Northampton NN2 7HG</p>
                            </div>
                        </div>

                        <div className="br_stats_grid">
                            <div className="br_stat_item">
                                <span className="br_stat_num">10+</span>
                                <span className="br_stat_label">Private Rooms</span>
                            </div>
                            <div className="br_stat_item">
                                <span className="br_stat_num">Daily</span>
                                <span className="br_stat_label">Pharmacy Support</span>
                            </div>
                            <div className="br_stat_item">
                                <span className="br_stat_num">100%</span>
                                <span className="br_stat_label">Quality Standard</span>
                            </div>
                        </div>

                        <div className="br_actions">
                            <a href="https://www.google.com/maps/dir/?api=1&destination=NN2+7HG" target="_blank" rel="noopener noreferrer" className="br_btn_primary">
                                Locate Branch
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutBranches;
