"use client";
import React from 'react';
import './Newsletter.css';

export default function Newsletter() {
    return (
        <section className="nl_section">
            <div className="nl_container">
                <div className="nl_glass_card">
                    <div className="nl_content">
                        <div className="nl_icon_box">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"/><path d="m22 7-10.8 7L2 7"/>
                            </svg>
                        </div>
                        <h2 className="nl_title">Subscribe to Health Insights</h2>
                        <p className="nl_subtitle">Get professional medical advice and clinic updates delivered to your inbox every month.</p>
                        
                        <form className="nl_form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Enter your email address" required className="nl_input" />
                            <button type="submit" className="nl_btn">
                                <span>Subscribe Now</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
                            </button>
                        </form>
                        
                        <p className="nl_privacy">We respect your privacy. Unsubscribe at any time.</p>
                    </div>

                    <div className="nl_decor">
                        <div className="nl_circle nl_c1" />
                        <div className="nl_circle nl_c2" />
                    </div>
                </div>
            </div>
        </section>
    );
}
