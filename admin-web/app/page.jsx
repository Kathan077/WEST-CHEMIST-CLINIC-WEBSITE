'use client';

import { API_URL } from '@/config';

import React, { useState, useEffect } from 'react';
import './login.css';

export default function AdminLoginPage() {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // If already logged in, redirect to admin dashboard (e.g. patients compliance tracker)
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            window.location.href = '/admin/patients';
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usernameOrEmail, password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Success: store admin auth token and metadata
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.admin));

                // Redirect to patients compliance dashboard
                window.location.href = '/admin/patients';
            } else {
                setErrorMsg(data.message || 'The username or password is incorrect');
            }
        } catch (err) {
            console.error('Login error:', err);
            setErrorMsg('Network error. Make sure the backend server is running on port 5000.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login_container">
            {/* Left Panel */}
            <div className="left_panel">
                <div className="left_content">
                    <h1 className="left_hello">
                        HELLO<span> ADMIN!</span>
                    </h1>
                    <p className="left_subtitle">
                        Please enter your administrative details to continue
                    </p>
                </div>
                <div className="doctor_wrapper">
                    <img
                        src="/admin/images/admin_login_doctor.png"
                        alt="Doctor Illustration"
                        className="doctor_img"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
            </div>

            {/* Right Panel: login form */}
            <div className="right_panel">
                <div className="form_container">
                    <div className="logo_section">
                        <div className="logo_icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </div>
                        <span className="logo_text"><span>WEST</span> CHEMIST</span>
                    </div>

                    <form onSubmit={handleLogin}>
                        {/* Username/Email Input */}
                        <div className="input_group">
                            <label className="input_label">Username or E-mail</label>
                            <div className="input_wrapper">
                                <input
                                    type="text"
                                    className={`input_field ${errorMsg ? 'error' : ''}`}
                                    placeholder="Enter username or email"
                                    value={usernameOrEmail}
                                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Input with eye toggle */}
                        <div className="input_group">
                            <label className="input_label">Password</label>
                            <div className="input_wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`input_field ${errorMsg ? 'error' : ''}`}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password_toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? 'Hide Password' : 'Show Password'}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Red error message displayed under fields exactly as shown in screenshot */}
                            {errorMsg && (
                                <div className="error_msg">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                    {errorMsg}
                                </div>
                            )}
                        </div>

                        {/* Pill Login Button */}
                        <button
                            type="submit"
                            className="login_button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Authenticating...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </form>


                </div>
            </div>

            {/* Doctor illustration — positioned at the junction of both panels */}

        </div>
    );
}
