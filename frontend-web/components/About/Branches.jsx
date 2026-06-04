"use client";
import { useEffect, useRef } from 'react';
import './AboutBranches.css';

const Branches = () => {
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
                <div className="br_section_header reveal_on_scroll">
                    <span className="br_eyebrow">Our Clinical Network</span>
                    <h2 className="br_main_title">Expert Care Across<br />Multiple Locations.</h2>
                    <p className="br_header_lead">
                        Both our clinical hubs are fully operational, delivering state-of-the-art healthcare dedicated to your comfort, precision, and privacy.
                    </p>
                </div>

                <div className="br_unified_grid">
                    {/* --- BRANCH 1: FLAGSHIP --- */}
                    <div className="br_pro_card reveal_on_scroll">
                        <div className="br_pro_visual">
                            <img 
                                src="/brain/a9794728-9bd2-4101-a344-91ef761459ce/clinic_branch_flagship_1777976049702.png" 
                                alt="Northampton Flagship Clinic" 
                                className="br_pro_image" 
                            />
                            <div className="br_pro_overlay" />
                            <div className="br_badge">Flagship Branch</div>
                        </div>
                        <div className="br_pro_content">
                            <div className="br_pro_head">
                                <div className="br_pro_icon">📍</div>
                                <div>
                                    <h3 className="br_pro_name">Northampton Clinic</h3>
                                    <p className="br_pro_address">4 Kingsley Park Terrace, NN2 7HG</p>
                                </div>
                            </div>
                            <p className="br_pro_desc">
                                Our primary healthcare hub offering comprehensive clinical services, prescriptions, and expert advice in a state-of-the-art facility.
                            </p>
                            <div className="br_pro_stats">
                                <div className="br_pro_stat">
                                    <span className="br_pro_stat_num">Daily</span>
                                    <span className="br_pro_stat_label">Pharmacy</span>
                                </div>
                                <div className="br_pro_stat">
                                    <span className="br_pro_stat_num">10+</span>
                                    <span className="br_pro_stat_label">Consult Rooms</span>
                                </div>
                                <div className="br_pro_stat">
                                    <span className="br_pro_stat_num">100%</span>
                                    <span className="br_pro_stat_label">Quality Care</span>
                                </div>
                            </div>
                            <div className="br_pro_actions">
                                <a 
                                    href="https://maps.google.com/?q=4+Kingsley+Park+Terrace,+Northampton+NN2+7HG,+United+Kingdom" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="br_btn_primary br_btn_full"
                                >
                                    View Clinic & Directions
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* --- BRANCH 2: ONLINE CLINIC --- */}
                    <div className="br_pro_card reveal_on_scroll" style={{ transitionDelay: '0.2s' }}>
                        <div className="br_pro_visual">
                            <img 
                                src="/brain/a9794728-9bd2-4101-a344-91ef761459ce/clinic_branch_secondary_1777976804540.png" 
                                alt="UK Online Virtual Clinic" 
                                className="br_pro_image" 
                            />
                            <div className="br_pro_overlay" />
                            <div className="br_badge accent_badge">Fully Operational</div>
                        </div>
                        <div className="br_pro_content">
                            <div className="br_pro_head">
                                <div className="br_pro_icon">💻</div>
                                <div>
                                    <h3 className="br_pro_name">UK Online Virtual Clinic</h3>
                                    <p className="br_pro_address">Accessible Nationwide</p>
                                </div>
                            </div>
                            <p className="br_pro_desc">
                                Consult with our licensed pharmacists and health experts securely via private, high-definition video calls from home.
                            </p>
                            <div className="br_pro_stats">
                                <div className="br_pro_stat">
                                    <span className="br_pro_stat_num">7 Days</span>
                                    <span className="br_pro_stat_label">Availability</span>
                                </div>
                                <div className="br_pro_stat">
                                    <span className="br_pro_stat_num">Zero</span>
                                    <span className="br_pro_stat_label">Travel Needed</span>
                                </div>
                                <div className="br_pro_stat">
                                    <span className="br_pro_stat_num">Secure</span>
                                    <span className="br_pro_stat_label">Consultations</span>
                                </div>
                            </div>
                            <div className="br_pro_actions">
                                <a href="/book-appointment" className="br_btn_secondary br_btn_full">
                                    Book Online Consultation
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Branches;
