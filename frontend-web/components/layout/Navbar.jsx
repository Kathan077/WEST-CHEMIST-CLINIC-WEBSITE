"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { API_URL } from '../../config';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownForceClose, setDropdownForceClose] = useState(false);
    
    // Accordion toggles for mobile view
    const [mobileDropdowns, setMobileDropdowns] = useState({
        services: false,
        weightLoss: false,
        vaccination: false
    });

    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        const fetchNavData = async () => {
            try {
                const [catRes, srvRes] = await Promise.all([
                    fetch(`${API_URL}/api/categories`),
                    fetch(`${API_URL}/api/services`)
                ]);
                const catJson = await catRes.json();
                const srvJson = await srvRes.json();
                
                if (catJson.success && catJson.data) {
                    setCategories(catJson.data);
                }
                if (srvJson.success && srvJson.data) {
                    setServices(srvJson.data);
                }
            } catch (err) {
                console.error("Error loading dynamic navbar items:", err);
            }
        };
        fetchNavData();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLinkClick = () => {
        setIsOpen(false);
        setDropdownForceClose(true);
        // Reset mobile accordions when navigating
        setMobileDropdowns({
            services: false,
            weightLoss: false,
            vaccination: false
        });
        setActiveCategory(null);
        // Reset force close after a short delay so it can open again on next hover
        setTimeout(() => setDropdownForceClose(false), 500);
    };

    const toggleMobileDropdownDirect = (key) => {
        setMobileDropdowns(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };



    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                {/* Logo */}
                <div className="logo_container">
                    <Link href="/" onClick={handleLinkClick}>
                        <Image 
                            src="/images/ddfd45c4-3070-498a-9e4e-68f1fb48ad3e.png" 
                            alt="West Chemist Clinic Logo" 
                            width={200} 
                            height={60} 
                            className="logo_img"
                            priority
                        />
                    </Link>
                </div>

                <div className={`nav_links ${isOpen ? 'active' : ''}`}>
                    {/* Mobile Drawer Header */}
                    <div className="drawer_header">
                        <img src="/images/ddfd45c4-3070-498a-9e4e-68f1fb48ad3e.png" alt="West Chemist Clinic" className="drawer_logo" />
                        <div className="close_drawer" onClick={() => setIsOpen(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                    </div>

                    <Link href="/" className="nav_link" onClick={handleLinkClick}>Home</Link>
                    <Link href="/about" className="nav_link" onClick={handleLinkClick}>About Us</Link>
                    
                    <div className={`nav_dropdown_container ${dropdownForceClose ? 'force_close' : ''} ${mobileDropdowns.services ? 'mobile_open' : ''}`}>
                        <Link href="/services" className="nav_link" onClick={handleLinkClick}>
                            Services
                            <span className="dropdown_icon_wrapper" onClick={(e) => {
                                if (window.innerWidth <= 1024) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleMobileDropdownDirect('services');
                                }
                            }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`dropdown_icon ${mobileDropdowns.services ? 'rotated' : ''}`}>
                                    <path d="m6 9 6 6 6-6"/>
                                </svg>
                            </span>
                        </Link>
                        <div className="nav_dropdown">
                            <div className="dropdown_inner">
                                {categories.length > 0 && services.length > 0 ? (
                                    categories.map(cat => {
                                        const catServices = services.filter(s => s.parentCategory === cat.name);
                                        if (catServices.length === 0) return null;
                                        const isExpanded = activeCategory === cat.name;
                                        return (
                                            <div className={`dropdown_group ${isExpanded ? 'expanded' : ''}`} key={cat._id}>
                                                <div 
                                                    className="group_title_toggle" 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setActiveCategory(isExpanded ? null : cat.name);
                                                    }}
                                                >
                                                    <span className="group_title">{cat.name}</span>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="category_chevron">
                                                        <path d="m6 9 6 6 6-6"/>
                                                    </svg>
                                                </div>
                                                <div className="group_services_grid">
                                                    {catServices.map(s => (
                                                        <Link
                                                            key={s._id}
                                                            href={`/services/${s.slug || s.title.toLowerCase().replace(/\s+/g, '-')}`}
                                                            className="dropdown_item"
                                                            onClick={handleLinkClick}
                                                        >
                                                            {s.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <>
                                        <div className={`dropdown_group ${activeCategory === 'NHS Services (Pharmacy First)' ? 'expanded' : ''}`}>
                                            <div 
                                                className="group_title_toggle" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setActiveCategory(activeCategory === 'NHS Services (Pharmacy First)' ? null : 'NHS Services (Pharmacy First)');
                                                }}
                                            >
                                                <span className="group_title">NHS Services (Pharmacy First)</span>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="category_chevron">
                                                    <path d="m6 9 6 6 6-6"/>
                                                </svg>
                                            </div>
                                            <div className="group_services_grid">
                                                <Link href="/services/blood-pressure" className="dropdown_item" onClick={handleLinkClick}>Blood Pressure</Link>
                                                <Link href="/services/otitis-media-service" className="dropdown_item" onClick={handleLinkClick}>Otitis Media</Link>
                                                <Link href="/services/impetigo-service" className="dropdown_item" onClick={handleLinkClick}>Impetigo</Link>
                                                <Link href="/services/urinary-tract-infection-service" className="dropdown_item" onClick={handleLinkClick}>UTI Treatment</Link>
                                                <Link href="/services/infected-bites-service" className="dropdown_item" onClick={handleLinkClick}>Infected Bites</Link>
                                                <Link href="/services/shingles-service" className="dropdown_item" onClick={handleLinkClick}>Shingles</Link>
                                                <Link href="/services/sore-throat-service" className="dropdown_item" onClick={handleLinkClick}>Sore Throat</Link>
                                                <Link href="/services/sinusitis-service" className="dropdown_item" onClick={handleLinkClick}>Sinusitis</Link>
                                                <Link href="/services/flu-vaccination" className="dropdown_item" onClick={handleLinkClick}>Flu Vaccination</Link>
                                            </div>
                                        </div>
                                        <div className={`dropdown_group ${activeCategory === 'Private Services' ? 'expanded' : ''}`}>
                                            <div 
                                                className="group_title_toggle" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setActiveCategory(activeCategory === 'Private Services' ? null : 'Private Services');
                                                }}
                                            >
                                                <span className="group_title">Private Services</span>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="category_chevron">
                                                    <path d="m6 9 6 6 6-6"/>
                                                </svg>
                                            </div>
                                            <div className="group_services_grid">
                                                <Link href="/services/earwax-removal" className="dropdown_item" onClick={handleLinkClick}>Ear Wax Removal</Link>
                                                <Link href="/services/heart-check" className="dropdown_item" onClick={handleLinkClick}>Heart Check</Link>
                                                <Link href="/services/strep-a-test-&-treat" className="dropdown_item" onClick={handleLinkClick}>Strep A Testing</Link>
                                                <Link href="/services/cryotherapy" className="dropdown_item" onClick={handleLinkClick}>Cryotherapy</Link>
                                                <Link href="/services/aesthetics" className="dropdown_item" onClick={handleLinkClick}>Aesthetics</Link>
                                                <Link href="/services/blood-testing" className="dropdown_item" onClick={handleLinkClick}>Blood Testing</Link>
                                            </div>
                                        </div>
                                        <div className={`dropdown_group ${activeCategory === 'Travel Clinic' ? 'expanded' : ''}`}>
                                            <div 
                                                className="group_title_toggle" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setActiveCategory(activeCategory === 'Travel Clinic' ? null : 'Travel Clinic');
                                                }}
                                            >
                                                <span className="group_title">Travel Clinic</span>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="category_chevron">
                                                    <path d="m6 9 6 6 6-6"/>
                                                </svg>
                                            </div>
                                            <div className="group_services_grid">
                                                <Link href="/services/dtp-vaccine" className="dropdown_item" onClick={handleLinkClick}>Diphtheria / Tetanus / Polio</Link>
                                                <Link href="/services/typhoid-injection" className="dropdown_item" onClick={handleLinkClick}>Typhoid (Injection)</Link>
                                                <Link href="/services/typhoid-oral" className="dropdown_item" onClick={handleLinkClick}>Typhoid (Oral)</Link>
                                                <Link href="/services/hepatitis-a-typhoid-combined" className="dropdown_item" onClick={handleLinkClick}>Hep A & Typhoid Combined</Link>
                                                <Link href="/services/hepatitis-a-vaccine" className="dropdown_item" onClick={handleLinkClick}>Hepatitis A</Link>
                                                <Link href="/services/hepatitis-b-vaccine" className="dropdown_item" onClick={handleLinkClick}>Hepatitis B</Link>
                                                <Link href="/services/twinrix-vaccine" className="dropdown_item" onClick={handleLinkClick}>Twinrix (Hep A & B)</Link>
                                                <Link href="/services/cholera-vaccine" className="dropdown_item" onClick={handleLinkClick}>Cholera</Link>
                                                <Link href="/services/rabies-vaccine" className="dropdown_item" onClick={handleLinkClick}>Rabies</Link>
                                                <Link href="/services/meningitis-acwy" className="dropdown_item" onClick={handleLinkClick}>Meningitis ACWY</Link>
                                                <Link href="/services/meningitis-menveo" className="dropdown_item" onClick={handleLinkClick}>Meningitis Menveo</Link>
                                                <Link href="/services/japanese-encephalitis" className="dropdown_item" onClick={handleLinkClick}>Japanese Encephalitis</Link>
                                                <Link href="/services/tick-borne-encephalitis" className="dropdown_item" onClick={handleLinkClick}>Tick-Borne Encephalitis</Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`nav_dropdown_container ${dropdownForceClose ? 'force_close' : ''} ${mobileDropdowns.weightLoss ? 'mobile_open' : ''}`}>
                        <Link href="/weight-loss" className="nav_link" onClick={handleLinkClick}>
                            Weight Loss Service
                            <span className="dropdown_icon_wrapper" onClick={(e) => {
                                if (window.innerWidth <= 1024) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleMobileDropdownDirect('weightLoss');
                                }
                            }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`dropdown_icon ${mobileDropdowns.weightLoss ? 'rotated' : ''}`}>
                                    <path d="m6 9 6 6 6-6"/>
                                </svg>
                            </span>
                        </Link>
                        <div className="nav_dropdown wl_dropdown">
                            <div className="dropdown_inner">
                                <div className="dropdown_group">
                                    <Link href="/services/wegovy" className="dropdown_item wl_item" onClick={handleLinkClick}>
                                        Wegovy Injections
                                    </Link>
                                    <Link href="/services/mounjaro" className="dropdown_item wl_item" onClick={handleLinkClick}>
                                        Mounjaro Injections
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`nav_dropdown_container ${dropdownForceClose ? 'force_close' : ''} ${mobileDropdowns.vaccination ? 'mobile_open' : ''}`}>
                        <Link href="/vaccination" className="nav_link" onClick={handleLinkClick}>
                            Vaccination
                            <span className="dropdown_icon_wrapper" onClick={(e) => {
                                if (window.innerWidth <= 1024) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleMobileDropdownDirect('vaccination');
                                }
                            }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`dropdown_icon ${mobileDropdowns.vaccination ? 'rotated' : ''}`}>
                                    <path d="m6 9 6 6 6-6"/>
                                </svg>
                            </span>
                        </Link>
                        <div className="nav_dropdown vacc_dropdown">
                            <div className="dropdown_inner">
                                <div className="dropdown_group">
                                    <span className="group_title">Travel & Specialist</span>
                                    <Link href="/services/japanese-encephalitis" className="dropdown_item" onClick={handleLinkClick}>Japanese Encephalitis</Link>
                                    <Link href="/services/typhoid-injection" className="dropdown_item" onClick={handleLinkClick}>Typhoid</Link>
                                    <Link href="/services/rabies-vaccine" className="dropdown_item" onClick={handleLinkClick}>Rabies</Link>
                                    <Link href="/services/hepatitis-b-vaccine" className="dropdown_item" onClick={handleLinkClick}>Hepatitis</Link>
                                    <Link href="/services/chikungunya-vaccine" className="dropdown_item" onClick={handleLinkClick}>Chikungunya</Link>
                                </div>
                                <div className="dropdown_group">
                                    <span className="group_title">Routine & Essential</span>
                                    <Link href="/services/meningitis-acwy" className="dropdown_item" onClick={handleLinkClick}>Meningitis</Link>
                                    <Link href="/services/hpv-vaccine" className="dropdown_item" onClick={handleLinkClick}>HPV</Link>
                                    <Link href="/services/shingles-service" className="dropdown_item" onClick={handleLinkClick}>Shingles</Link>
                                    <Link href="/services/chickenpox-vaccine" className="dropdown_item" onClick={handleLinkClick}>Chickenpox</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href="/blog" className="nav_link" onClick={handleLinkClick}>Blog</Link>
                    <Link href="/contact" className="nav_link" onClick={handleLinkClick}>
                        Contact Us
                    </Link>
                    
                    {/* Mobile CTAs inside menu */}
                    <div className="mobile_cta_container">
                        <Link href="/track-booking" className="cta_button secondary mobile_cta" onClick={handleLinkClick}>
                            Track Booking
                        </Link>
                        <Link href="/book-appointment" className="cta_button mobile_cta" onClick={handleLinkClick}>
                            Book Now
                        </Link>
                    </div>
                </div>

                <div className="nav_actions">
                    
                    <Link href="/track-booking" className="cta_button secondary desktop_cta" onClick={handleLinkClick}>
                        Track Booking
                    </Link>
                    <Link href="/book-appointment" className="cta_button desktop_cta" onClick={handleLinkClick}>
                        Book Now
                    </Link>
                    
                    <div className={`menu_toggle ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
