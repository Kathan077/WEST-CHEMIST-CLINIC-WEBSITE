"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { API_URL } from '@/config';
import './Footer.css';

export default function Footer() {
    const [hours, setHours] = useState({
        mon_fri: '8.30am-6.30pm',
        sat: '9am - 2.00pm',
        sun: '9am-12pm'
    });

    useEffect(() => {
        const fetchHours = async () => {
            try {
                const res = await fetch(`${API_URL}/api/contents/clinic-hours`);
                const data = await res.json();
                if (data.success && data.data && data.data.metadata) {
                    setHours({
                        mon_fri: data.data.metadata.mon_fri || '8.30am-6.30pm',
                        sat: data.data.metadata.sat || '9am - 2.00pm',
                        sun: data.data.metadata.sun || '9am-12pm'
                    });
                }
            } catch (err) {
                console.error("Error fetching opening hours:", err);
            }
        };
        fetchHours();
    }, []);

    return (
        <footer className="footer_sec">
            {/* Soft clinical wave/gradient boundary */}
            <div className="footer_top_border"></div>

            <div className="footer_container">
                <div className="footer_grid">

                    {/* COL 1: About & Logo */}
                    <div className="f_col">
                        <Link href="/" className="f_logo">
                            <img src="/images/ddfd45c4-3070-498a-9e4e-68f1fb48ad3e.png" alt="West Chemist" />
                        </Link>
                        <p className="f_desc">
                            Your trusted local pharmacy and healthcare provider in Northampton, United Kingdom.
                            Delivering clinical excellence, expert advice, and genuine care.
                        </p>

                        {/* Trust Badges */}
                        <div className="f_trust_badges">
                            <div className="trust_badge">✔ Quality Care Pharmacy</div>
                            <div className="trust_badge">✔ Certified Immunisers</div>
                        </div>
                    </div>

                    {/* COL 2: Quick Links */}
                    <div className="f_col">
                        <h3 className="f_col_title">Important Links</h3>
                        <ul className="f_links">
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/services">Full Services List</Link></li>
                            <li><Link href="/services/wegovy">Weight Loss Program</Link></li>
                            <li><Link href="/book-appointment">Book an Appointment</Link></li>
                        </ul>
                    </div>

                    {/* COL 3: Contact & Location */}
                    <div className="f_col">
                        <h3 className="f_col_title">Contact Us</h3>
                        <ul className="f_contact_info">
                            <li>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                <a href="tel:01604713297" style={{ transition: 'color 0.2s ease' }} className="f_link_item">(01604) 713297</a>
                            </li>
                            <li>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                <a href="mailto:info@westchemist.co.uk" style={{ transition: 'color 0.2s ease' }} className="f_link_item">info@westchemist.co.uk</a>
                            </li>
                            <li className="location_li">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                <a
                                    href="https://maps.google.com/?q=4+Kingsley+Park+Terrace,+Northampton+NN2+7HG,+United+Kingdom"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ transition: 'color 0.2s ease' }}
                                    className="f_link_item"
                                >
                                    West Chemist<br />4 Kingsley Park Terrace<br />Northampton, NN2 7HG
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* COL 4: Opening Hours */}
                    <div className="f_col">
                        <h3 className="f_col_title">Opening Hours</h3>
                        <div className="f_hours">
                            <div className="hour_row">
                                <span className="day">Mon - Fri</span>
                                <span className="time">{hours.mon_fri}</span>
                            </div>
                            <div className="hour_row">
                                <span className="day">Saturday</span>
                                <span className="time">{hours.sat}</span>
                            </div>
                            <div className="hour_row">
                                <span className="day">Sunday</span>
                                <span className="time">{hours.sun}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="footer_bottom">
                <div className="f_bottom_container">
                    <p className="copyright">
                        &copy; {new Date().getFullYear()} West Chemist. All rights reserved.
                    </p>
                    <div className="f_legal_links">
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
