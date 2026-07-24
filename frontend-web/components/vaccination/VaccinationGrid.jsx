"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { API_URL, getImageUrl } from '@/config';
import './VaccinationGrid.css';

const vaccineCatalog = [
    {
        title: "Meningitis",
        slug: "travel-meningitis",
        desc: "General meningococcal defense boosting your immune response before international study or travel.",
        img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=600&q=80",
        cat: "Travel Immunization"
    },
    {
        title: "Meningitis B Vaccination",
        slug: "nhs-meningitis-b",
        desc: "Highly effective protection against Meningococcal Group B bacteria, recommended for children and young adults.",
        img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=600&q=80",
        cat: "NHS & Private Vaccination"
    },
    {
        title: "Chickenpox",
        slug: "chickenpox-vaccine",
        desc: "Varicella vaccine providing long-term active immunity against chickenpox and reducing shingles risk later in life.",
        img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
        cat: "Routine Immunization"
    },
    {
        title: "Chikungunya Vaccine",
        slug: "travel-chikungunya",
        desc: "Advanced single-dose protection against the mosquito-borne Chikungunya virus in tropical regions.",
        img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
        cat: "Travel Immunization"
    },
    {
        title: "Shingles",
        slug: "nhs-shingles",
        desc: "Protect yourself against shingles and post-herpetic neuralgia with our professional shingles vaccination.",
        img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
        cat: "NHS & Private Services"
    },
    {
        title: "HPV",
        slug: "hpv-vaccine",
        desc: "Gardasil 9 vaccine protecting against nine high-risk strains of HPV-associated cancers and genital warts.",
        img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=600&q=80",
        cat: "Specialist Immunization"
    },
    {
        title: "Rabies",
        slug: "travel-rabies",
        desc: "Essential pre-exposure rabies vaccine protocol for travel to remote, high-risk or animal-dense areas.",
        img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
        cat: "Travel Immunization"
    },
    {
        title: "Hepatitis",
        slug: "travel-hepatitis-b",
        desc: "High-potency protection against Hepatitis B virus, recommended for travel, healthcare workers, and high-risk groups.",
        img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
        cat: "Travel & Routine Care"
    },
    {
        title: "Typhoid",
        slug: "travel-typhoid",
        desc: "Critical protection against typhoid fever, highly recommended for travel to South Asia, Africa, and South America.",
        img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
        cat: "Travel Immunization"
    },
    {
        title: "Japanese Encephalitis",
        slug: "travel-japanese-encephalitis",
        desc: "Secure protection against Japanese Encephalitis virus spread by infected mosquitoes in rural Asia.",
        img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
        cat: "Travel Immunization"
    }
];

const isVaccination = (s) => {
    const slug = (s.slug || '').toLowerCase();
    const title = (s.title || '').toLowerCase();

    // 1. Meningitis
    if (slug === 'travel-meningitis' || slug === 'meningitis-vaccine' || (title.includes('meningitis') && !title.includes('b') && !title.includes('acwy'))) return true;
    // 2. Meningitis B Vaccination
    if (slug === 'nhs-meningitis-b' || slug === 'meningitis-b-vaccination' || title.includes('meningitis b')) return true;
    // 3. Chickenpox
    if (slug === 'chickenpox-vaccine' || title.includes('chickenpox')) return true;
    // 4. Chikungunya Vaccine
    if (slug === 'travel-chikungunya' || title.includes('chikungunya')) return true;
    // 5. Shingles
    if (slug === 'nhs-shingles' || title.includes('shingles')) return true;
    // 6. HPV
    if (slug === 'hpv-vaccine' || title.includes('hpv')) return true;
    // 7. Rabies
    if (slug === 'travel-rabies' || title.includes('rabies')) return true;
    // 8. Hepatitis
    if (slug === 'travel-hepatitis-b' || title.includes('hepatitis')) return true;
    // 9. Typhoid
    if (slug === 'travel-typhoid' || title.includes('typhoid')) return true;
    // 10. Japanese Encephalitis
    if (slug === 'travel-japanese-encephalitis' || title.includes('japanese encephalitis')) return true;

    return false;
};

const VaccinationGrid = () => {
    const gridRef = useRef(null);
    const [vaccines, setVaccines] = useState(vaccineCatalog);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVaccines = async () => {
            try {
                const res = await fetch(`${API_URL}/api/services`);
                const json = await res.json();
                if (res.ok && json.success && Array.isArray(json.data)) {
                    // Filter vaccinations from database
                    const dbVaccines = json.data.filter(s => isVaccination(s));
                    if (dbVaccines.length > 0) {
                        setVaccines(dbVaccines);
                    } else {
                        // Map the catalog and override with database values if found
                        const merged = vaccineCatalog.map(catItem => {
                            const dbMatch = json.data.find(s => s.slug === catItem.slug);
                            if (dbMatch) {
                                return {
                                    ...catItem,
                                    _id: dbMatch._id,
                                    title: dbMatch.title || catItem.title,
                                    desc: dbMatch.desc || catItem.desc,
                                    img: dbMatch.img || catItem.img,
                                    cat: dbMatch.cat || catItem.cat
                                };
                            }
                            return catItem;
                        });
                        setVaccines(merged);
                    }
                }
            } catch (err) {
                console.error("Error fetching vaccines:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVaccines();
    }, []);

    useEffect(() => {
        if (!gridRef.current || loading) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('pro_reveal_active');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        const elements = gridRef.current.querySelectorAll('.pro_grid_card');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [loading, vaccines]);

    if (loading) {
        return (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--t3)' }}>
                <h3>Loading vaccinations...</h3>
            </div>
        );
    }

    return (
        <section id="vacc_grid" className="vacc_grid_pro_section" ref={gridRef}>
            <div className="vacc_grid_pro_bg"></div>
            
            <div className="vacc_grid_pro_container">
                <div className="vacc_grid_pro_header">
                    <span className="vacc_section_badge">Our Protocols</span>
                    <h2>Premium Vaccinations</h2>
                    <p>Discover our comprehensive suite of advanced clinical immunizations.</p>
                </div>

                <div className="vacc_grid_pro_wrapper">
                    {vaccines.map((item, index) => (
                        <div 
                            className="pro_grid_card" 
                            key={item._id || index}
                            style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
                        >
                            <div className="pro_card_visual">
                                <div className="pro_card_tag">{item.cat || 'Vaccination'}</div>
                                <img src={getImageUrl(item.img)} alt={item.title} className="pro_card_img" loading="lazy" />
                                <div className="pro_card_gradient_overlay"></div>
                            </div>
                            
                            <div className="pro_card_content">
                                <h3>{item.title}</h3>
                                <p className="pro_card_desc">{item.desc}</p>
                                
                                <div className="pro_card_actions">
                                    <Link href={`/services/${item.slug}`} className="pro_btn_outline">
                                        More Info
                                    </Link>
                                    <Link href={`/book-appointment?service=${encodeURIComponent(item.title)}`} className="pro_btn_solid">
                                        Book Now
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VaccinationGrid;
