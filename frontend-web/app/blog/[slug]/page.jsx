"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import './BlogDetail.css';
import { API_URL } from '@/config';

// Fallback data mapper for the seeded blogs
const fallbackBlogs = {
    "essential-travel-vaccinations": {
        title: "5 Essential Travel Vaccinations for Your Next Adventure",
        subject: "Travel Health",
        description: `<p>Planning an international trip is an exciting venture, but amidst booking flights and packing bags, health preparations are often overlooked. Travel vaccinations are crucial to protecting yourself from serious infectious diseases that may not exist in your home country but are common in other parts of the world.</p>
<h3>Why are travel vaccines important?</h3>
<p>When you travel abroad, you may be exposed to pathogens your body has never encountered before. Vaccines stimulate your immune system to produce antibodies, providing immunity without causing the disease itself. Without these updates, you risk contracting preventable illnesses like Hepatitis A, Typhoid, or Yellow Fever.</p>
<h3>Top 5 travel vaccinations to consider:</h3>
<ul>
  <li><strong>Hepatitis A:</strong> Transmitted through contaminated food and water. Essential for travel to most developing countries.</li>
  <li><strong>Typhoid:</strong> A bacterial infection also spread via contaminated food and water, highly recommended for parts of Asia, Africa, and South America.</li>
  <li><strong>Yellow Fever:</strong> A mosquito-borne viral disease. Some countries in Africa and South America require proof of vaccination (an ICVP certificate) for entry.</li>
  <li><strong>Tetanus, Diphtheria, and Polio (DTP):</strong> Often given as a combined booster. Ensure your routine childhood immunizations are up-to-date.</li>
  <li><strong>Rabies:</strong> A fatal viral infection transmitted via animal bites. Recommended for long-term travelers, outdoor explorers, and those visiting remote areas.</li>
</ul>
<h3>When should you get vaccinated?</h3>
<p>Most vaccines require <strong>4 to 6 weeks</strong> to become fully effective. Some require multiple doses spaced weeks apart. Therefore, it is highly recommended to consult our qualified pharmacists at West Chemist at least a month before your departure date.</p>`,
        images: ["https://images.unsplash.com/photo-1500835595300-478db374780d?w=1200&q=80"],
        date: new Date()
    },
    "understanding-hypertension-guide": {
        title: "Understanding Hypertension: Symptoms, Prevention, and Management",
        subject: "General Health",
        description: `<p>Hypertension, commonly known as high blood pressure, is often called the "silent killer" because it rarely presents obvious symptoms until it has caused significant damage to the cardiovascular system. Regular monitoring and proactive lifestyle choices are key to preventing life-threatening events like strokes and heart attacks.</p>
<h3>What do the numbers mean?</h3>
<p>Blood pressure is measured in millimeters of mercury (mmHg) and written as two numbers:</p>
<ul>
  <li><strong>Systolic pressure (the top number):</strong> The pressure in your arteries when your heart beats.</li>
  <li><strong>Diastolic pressure (the bottom number):</strong> The pressure in your arteries when your heart rests between beats.</li>
</ul>
<p>A reading of 120/80 mmHg is considered normal. Readings consistently at or above 140/90 mmHg indicate hypertension.</p>
<h3>Key risk factors</h3>
<p>While age and genetics play a role, lifestyle factors are primary drivers. These include high salt consumption, lack of physical activity, excessive alcohol intake, smoking, and chronic stress.</p>
<h3>How to manage and prevent high blood pressure</h3>
<p>Fortunately, hypertension is highly manageable. Here are clinical recommendations:</p>
<ol>
  <li><strong>Adopt a DASH diet:</strong> Focus on whole grains, fruits, vegetables, and low-fat dairy while minimizing sodium intake.</li>
  <li><strong>Exercise regularly:</strong> Aim for at least 150 minutes of moderate-intensity aerobic exercise per week.</li>
  <li><strong>Monitor at home:</strong> Keep track of your blood pressure using a validated home monitor or visit West Chemist for a professional screening.</li>
</ol>
<p>If lifestyle modifications are insufficient, our prescribing pharmacists can guide you on appropriate antihypertensive medications to keep your cardiovascular health on track.</p>`,
        images: ["https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1200&q=80"],
        date: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    "science-of-medical-weight-loss-wegovy": {
        title: "The Science of Medical Weight Loss: Is Wegovy Right for You?",
        subject: "Weight Loss",
        description: `<p>Achieving sustainable weight loss can be an uphill battle, especially when addressing obesity as a complex, biological condition rather than a simple failure of willpower. Over recent years, medical weight loss programs utilizing Wegovy (semaglutide) have emerged as highly effective, clinically-proven solutions.</p>
<h3>How does Wegovy work?</h3>
<p>Wegovy® is an FDA and MHRA-approved weekly self-injectable medication. It mimics a naturally occurring hormone in the body called GLP-1 (glucagon-like peptide-1). GLP-1 plays a key role in appetite regulation by:</p>
<ul>
  <li>Slowing stomach emptying, which helps you feel full for longer.</li>
  <li>Signaling the brain's satiety centers to reduce overall hunger and food cravings.</li>
  <li>Improving insulin response to regulate blood sugar levels.</li>
</ul>
<h3>Clinical efficacy</h3>
<p>Clinical trials have shown that when combined with a reduced-calorie diet and increased physical activity, participants lost an average of 15% of their body weight over a 68-week period. This significant weight reduction can dramatically lower risks for type 2 diabetes, high blood pressure, and joint pain.</p>
<h3>Are you a candidate?</h3>
<p>Wegovy is typically recommended for adults with a Body Mass Index (BMI) of 30 or higher (obese), or 27 or higher (overweight) with at least one weight-related medical condition such as hypertension or high cholesterol. Visit our weight management service at West Chemist for a comprehensive assessment to discuss a tailored treatment plan.</p>`,
        images: ["https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=80"],
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    "ear-microsuction-vs-syringing": {
        title: "Ear Microsuction vs. Syringing: Why Microsuction is the Safer Choice",
        subject: "Clinical ear care",
        description: `<p>Earwax (cerumen) is a natural substance that protects the ear canal. However, when it builds up and becomes impacted, it can cause hearing loss, discomfort, dizziness, and tinnitus. If you have a blockage, it's essential to clear it using a safe, clinical method rather than resorting to cotton buds.</p>
<h3>What is traditional ear syringing?</h3>
<p>Traditional ear syringing involves pumping water into the ear canal to flush out the wax. While it was standard practice for decades, it carries risks, including ear infections, eardrum perforation, and pushing the wax deeper if not done carefully.</p>
<h3>Why microsuction is the gold standard</h3>
<p>Microsuction is a modern, water-free alternative. During the procedure, our clinician uses a high-definition microscope or video otoscope to look directly inside your ear. A gentle, clinical-grade suction device is then used to carefully lift and extract the wax.</p>
<h3>Benefits of microsuction:</h3>
<ol>
  <li><strong>Water-free:</strong> Reduces the risk of ear infection and is suitable for individuals with previous eardrum perforations.</li>
  <li><strong>High precision:</strong> The clinician maintains a direct line of sight throughout, ensuring safety.</li>
  <li><strong>Immediate relief:</strong> Blockages are resolved quickly, restoring normal hearing and relieving ear pressure instantly.</li>
</ol>
<p>At West Chemist, our accredited pharmacists perform gentle microsuction earwax removal in our dedicated consultation rooms. Book your consultation today to regain clear hearing.</p>`,
        images: ["https://images.unsplash.com/photo-1559839734-2b71f1536783?w=1200&q=80"],
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    "winter-wellness-immune-boost-tips": {
        title: "Winter Wellness: How to Boost Your Immune System for the Cold Season",
        subject: "Wellness",
        description: `<p>As the winter months roll in, our bodies face increased exposure to seasonal viruses like the common cold and influenza. While no single supplement can guarantee immunity, a holistic approach to wellness can support your body's natural defense systems and keep you feeling healthy all season long.</p>
<h3>1. Focus on key vitamins and minerals</h3>
<p>Maintaining balanced nutrition is vital. Ensure your diet contains sufficient quantities of:</p>
<ul>
  <li><strong>Vitamin D:</strong> Since sunlight exposure is limited during winter, the NHS recommends taking a daily 10mcg Vitamin D supplement to support bones, muscles, and immune health.</li>
  <li><strong>Vitamin C:</strong> A powerful antioxidant found in citrus fruits, bell peppers, and leafy greens that supports cellular function.</li>
  <li><strong>Zinc:</strong> Crucial for immune cell development and wound healing, found in seeds, nuts, and legumes.</li>
</ul>
<h3>2. Stay hydrated and active</h3>
<p>It is easy to forget to drink water when it is cold, but hydration is essential for lymphatic circulation. Additionally, moderate physical activity improves circulation, allowing immune cells to move more efficiently throughout the body.</p>
<h3>3. Prioritize quality sleep</h3>
<p>During sleep, your body releases cytokines, which are proteins that help target infection and inflammation. A consistent 7 to 8 hours of sleep per night is foundational to physical wellness.</p>
<h3>4. Protect yourself with vaccinations</h3>
<p>The most effective shield against seasonal viruses is vaccination. Getting your annual flu vaccine dramatically reduces your risk of catching and spreading the virus. Drop by West Chemist to receive your quick and convenient flu shot.</p>`,
        images: ["https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80"],
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    }
};

export default function BlogDetail() {
    const params = useParams();
    const slug = params.slug;

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImgIdx, setActiveImgIdx] = useState(0);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`${API_URL}/api/blogs/${slug}`);
                const json = await res.json();
                if (res.ok && json.success && json.data) {
                    setPost(json.data);
                } else {
                    setPost(fallbackBlogs[slug] || null);
                }
            } catch (err) {
                console.error("Error fetching blog post: ", err);
                setPost(fallbackBlogs[slug] || null);
            } finally {
                setLoading(false);
            }
        };
        if (slug) {
            fetchBlog();
        }
    }, [slug]);

    const getFullImgUrl = (img) => {
        if (!img) return 'https://images.unsplash.com/photo-1505751172107-160bf2a35368?w=1200&q=80';
        if (img.startsWith('http://') || img.startsWith('https://')) return img;
        const normalizedImg = img.startsWith('/') ? img : `/${img}`;
        const normalizedApi = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
        return `${normalizedApi}${normalizedImg}`;
    };

    const adjustContentImages = (html) => {
        if (!html) return '';
        return html.replace(/src=["']\/([^"']+)["']/g, (match, path) => {
            if (path.startsWith('http://') || path.startsWith('https://')) return match;
            const normalizedApi = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
            return `src="${normalizedApi}/${path}"`;
        });
    };

    const linkify = (text) => {
        if (!text) return '';
        const urlPattern = /(?<!(?:href|src)=["']|url\()(https?:\/\/[^\s<"'`>\)]+)/g;
        return text.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #4b2d71); text-decoration: underline; font-weight: 600;">$1</a>');
    };

    if (loading) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', fontFamily: 'inherit' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4B2D71', marginBottom: '12px' }}>Loading article...</div>
                    <p>Fetching clinical information...</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', fontFamily: 'inherit' }}>
                <div style={{ textAlign: 'center', padding: '24px', maxWidth: '400px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--t1)', marginBottom: '12px' }}>Article Not Found</div>
                    <p style={{ marginBottom: '24px' }}>The requested health article does not exist or has been removed.</p>
                    <Link href="/blog" style={{ background: '#4B2D71', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>
                        Return to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const postImg = post.images && post.images.length > 0 ? post.images[activeImgIdx] : '';
    const displayDate = new Date(post.date || post.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="bd_page">
            {/* Cinematic Hero */}
            <header className="bd_hero">
                {postImg && <img src={getFullImgUrl(postImg)} alt={post.title} className="bd_hero_bg" />}
                <div className="bd_hero_overlay" />
                <div className="bd_hero_content">
                    <span className="bd_eyebrow">{post.subject}</span>
                    <h1 className="bd_title">{post.title}</h1>
                    <div className="bd_meta">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffffff' }}>
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            {displayDate}
                        </span>
                    </div>
                </div>
            </header>

            {/* Content Section */}
            <section className="bd_main">
                <div className="bd_container">
                    <div className="bd_grid">
                        <div className="bd_content_col">
                            <Link href="/blog" className="bd_back_btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                                Back to All Articles
                            </Link>

                            {/* Images Gallery */}
                            {post.images && post.images.length > 0 && (
                                <div className="bd_images_area">
                                    <div className="bd_main_img_box">
                                        <img 
                                            src={getFullImgUrl(post.images[activeImgIdx])} 
                                            alt={post.title} 
                                            className="bd_main_img" 
                                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1505751172107-160bf2a35368?w=1200&q=80'}
                                        />
                                    </div>
                                    {post.images.length > 1 && (
                                        <div className="bd_thumbs_strip">
                                            {post.images.map((img, idx) => (
                                                <div 
                                                    className={`bd_thumb_box${idx === activeImgIdx ? ' active' : ''}`}
                                                    key={idx}
                                                    onClick={() => setActiveImgIdx(idx)}
                                                >
                                                    <img 
                                                        src={getFullImgUrl(img)} 
                                                        alt={`thumbnail ${idx}`} 
                                                        className="bd_thumb_img"
                                                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1505751172107-160bf2a35368?w=600&q=80'}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Article Body */}
                            <article 
                                className="bd_body" 
                                dangerouslySetInnerHTML={{ __html: linkify(adjustContentImages(post.description || post.desc)) }}
                            />
                        </div>

                        <aside className="bd_sidebar">
                            <div className="bd_booking_card">
                                <div className="bd_card_header">
                                    <span className="bd_price_label">Premium Pharmacy Care</span>
                                    <h3 className="bd_card_service_title">West Chemist</h3>
                                </div>
                                <div className="bd_card_meta">
                                    <div className="bd_meta_item">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                                        <span>NHS & Private Services Available</span>
                                    </div>
                                </div>
                                <Link href="/book-appointment" className="bd_book_btn">
                                    Book Your Appointment
                                </Link>
                                <div className="bd_card_footer">
                                    <div className="bd_trust_badge">
                                        <span>Verified Professional Service</span>
                                    </div>
                                    <p className="bd_card_hint">Fast availability • No GP referral needed</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
}
