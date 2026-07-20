'use client';

import { API_URL } from '@/config';
import React, { useState, useEffect } from 'react';
import '../login.css';

export default function AdminSignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // If already logged in, redirect to admin dashboard
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            window.location.href = '/admin/patients';
        }
    }, []);

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        // Client-side validations
        if (!username.trim() || !email.trim() || !password || !confirmPassword) {
            setErrorMsg('Please fill in all required fields');
            return;
        }

        if (username.trim().length < 3) {
            setErrorMsg('Username must be at least 3 characters long');
            return;
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email.trim())) {
            setErrorMsg('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            setErrorMsg('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/admin/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password: password
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setSuccessMsg('Account created successfully! Redirecting...');
                // Store auth token and user object
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.admin));

                setTimeout(() => {
                    window.location.href = '/admin/patients';
                }, 1200);
            } else {
                setErrorMsg(data.message || 'Registration failed. Please check your details.');
            }
        } catch (err) {
            console.error('Signup error:', err);
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
                        CREATE<span> ADMIN</span>
                    </h1>
                    <p className="left_subtitle">
                        Register a new administrator account to manage clinic operations
                    </p>
                </div>
            </div>


            {/* Right Panel: signup form */}
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

                    {/* Mode Navigation Tabs */}
                    <div className="auth_tabs">
                        <a href="/admin" className="auth_tab">Log In</a>
                        <button type="button" className="auth_tab active">Sign Up</button>
                    </div>

                    {successMsg && (
                        <div className="success_msg">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            {successMsg}
                        </div>
                    )}

                    <form onSubmit={handleSignup}>
                        {/* Username Input */}
                        <div className="input_group">
                            <label className="input_label">Username</label>
                            <div className="input_wrapper">
                                <input
                                    type="text"
                                    className={`input_field ${errorMsg && !username.trim() ? 'error' : ''}`}
                                    placeholder="e.g. admin_john"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (errorMsg) setErrorMsg('');
                                    }}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="input_group">
                            <label className="input_label">Email Address</label>
                            <div className="input_wrapper">
                                <input
                                    type="email"
                                    className={`input_field ${errorMsg && (!email.trim() || errorMsg.toLowerCase().includes('email')) ? 'error' : ''}`}
                                    placeholder="admin@westchemist.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errorMsg) setErrorMsg('');
                                    }}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="input_group">
                            <label className="input_label">Password</label>
                            <div className="input_wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`input_field ${errorMsg && errorMsg.toLowerCase().includes('password') ? 'error' : ''}`}
                                    placeholder="At least 6 characters"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errorMsg) setErrorMsg('');
                                    }}
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
                        </div>

                        {/* Confirm Password Input */}
                        <div className="input_group">
                            <label className="input_label">Confirm Password</label>
                            <div className="input_wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className={`input_field ${errorMsg && errorMsg.toLowerCase().includes('match') ? 'error' : ''}`}
                                    placeholder="Re-enter password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (errorMsg) setErrorMsg('');
                                    }}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password_toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                                >
                                    {showConfirmPassword ? (
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

                            {/* Error Message */}
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="login_button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Admin Account'
                            )}
                        </button>
                    </form>

                    {/* Navigation back to login */}
                    <div className="signup_container">
                        Already have an admin account?
                        <a href="/admin" className="signup_link">Log In</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
