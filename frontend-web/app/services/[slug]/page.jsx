"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import './ServiceDetail.css';

// Comprehensive data mapper for all services
const serviceData = {
    "blood-testing": {
        title: "Blood Testing",
        cat: "Diagnostic",
        img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=1200&q=80",
        desc: "Our private blood testing service provides comprehensive health insights with rapid results. We offer a wide range of tests including full blood count, diabetes screening, and hormone profiles.",
        price: "From £49",
        duration: "15-20 Mins",
        features: ["Certified Clinicians", "Rapid Result Turnaround", "Confidential Reporting", "GP Consultation Included"]
    },
    "earwax-removal": {
        title: "Earwax Removal",
        cat: "Clinical",
        img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=1200&q=80",
        desc: "Experience relief with our safe and effective microsuction earwax removal service. Our specialist practitioners use the latest technology to clear your ears gently and professionally.",
        price: "£60 (Both Ears)",
        duration: "30 Mins",
        features: ["Microsuction Technology", "Specialist Practitioners", "Immediate Relief", "Pre-Treatment Consultation"]
    },
    "discharge-medicines-service": {
        title: "Discharge Medicines Service",
        cat: "Advanced NHS",
        img: "https://plus.unsplash.com/premium_photo-1661633534346-601931818296?w=1200&q=80",
        desc: "Specialised support to help you manage your new medications after hospital discharge. We ensure a smooth transition and reduce the risk of readmission.",
        price: "NHS Funded",
        duration: "20 Mins",
        features: ["Medication Reconciliation", "Usage Education", "Safe Transitions", "GP Liaison"]
    },
    "new-medicine-service": {
        title: "New Medicine Service",
        cat: "Advanced NHS",
        img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=1200&q=80",
        desc: "Support for patients starting new medications for long-term conditions. We help you understand your prescription and manage any potential side effects.",
        price: "NHS Funded",
        duration: "15 Mins",
        features: ["Clinical Support", "Side-effect Management", "Technique Training", "Follow-up Reviews"]
    },
    "travel-clinic": {
        title: "Travel Clinic",
        cat: "Specialist",
        img: "https://images.unsplash.com/photo-1500835595300-478db374780d?w=1200&q=80",
        desc: "Comprehensive travel health consultations including vaccinations, malaria prevention, and expert advice for your destination.",
        price: "Consultation £20",
        duration: "30 Mins",
        features: ["Destination Specific Advice", "Full Core Vaccination Range", "Malaria Prophylaxis", "Certified Yellow Fever Center"]
    },
    "cryotherapy": {
        title: "Cryotherapy",
        cat: "Clinical",
        img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
        desc: "Safe and effective freezing treatment for skin lesions, warts, and verrucae using medical-grade liquid nitrogen technology.",
        price: "From £50",
        duration: "15 Mins",
        features: ["Precise Application", "Minimal Discomfort", "Scar Mitigation", "Clinic Grade Tech"]
    },
    "microneedling": {
        title: "Microneedling",
        cat: "Aesthetic",
        img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=80",
        desc: "Advanced skin rejuvenation treatment that stimulates collagen production to treat acne scars, fine lines, and skin texture.",
        price: "£150 / Session",
        duration: "45 Mins",
        features: ["Collagen Induction", "Medical Sterile Pens", "Topical Numbing", "Post-Care Included"]
    },
    "strep-a-test-&-treat": {
        title: "Strep A Test & Treat",
        cat: "Diagnostic",
        img: "https://plus.unsplash.com/premium_photo-1664303017917-71feb142f30c?w=1200&q=80",
        desc: "Rapid point-of-care testing for Group A Streptococcus with immediate antibiotic prescription if required.",
        price: "£25 (Test)",
        duration: "10 Mins",
        features: ["Rapid Results", "Clinical Assessment", "Immediate Treatment", "No Appointment Needed"]
    },
    "dispensing-medicines": {
        title: "Dispensing Medicines",
        cat: "Essential Care",
        img: "https://plus.unsplash.com/premium_photo-1663040149075-8178a9c4038a?w=1200&q=80",
        desc: "Safe and accurate dispensing of all NHS and private prescriptions with expert pharmacist review.",
        price: "Prescription Cost",
        duration: "Variable",
        features: ["Clinical Review", "Electronic Transfer", "Delivery Options", "Compliance Checks"]
    },
    "blood-pressure": {
        title: "Blood Pressure Check",
        cat: "NHS Service",
        img: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1200&q=80",
        desc: "Free blood pressure checks for eligible patients. Monitoring your blood pressure is a vital step in preventing strokes and heart disease.",
        price: "Free NHS",
        duration: "10 Mins",
        features: ["Immediate Results", "Healthy Heart Advice", "GP Referral if needed", "High-Grade Monitors"]
    },
    "urinary-tract-infection-service": {
        title: "UTI Treatment (Pharmacy First)",
        cat: "NHS Clinical",
        img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=1200&q=80",
        desc: "Rapid consultation and treatment for uncomplicated Urinary Tract Infections (UTIs) in women aged 16-64 without needing a GP appointment.",
        price: "NHS Funded",
        duration: "15 Mins",
        features: ["Private Consultation", "Immediate Prescription", "Self-Care Advice", "Rapid Relief"]
    },
    "shingles-service": {
        title: "Shingles Treatment",
        cat: "NHS Clinical",
        img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=1200&q=80",
        desc: "Expert assessment and treatment for Shingles. Early intervention is key to managing symptoms and preventing complications.",
        price: "NHS Funded",
        duration: "15 Mins",
        features: ["Clinical Diagnosis", "Antiviral Treatment", "Pain Management Advice", "Follow-up Support"]
    },
    "sinusitis-service": {
        title: "Sinusitis Service",
        cat: "NHS Clinical",
        img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=1200&q=80",
        desc: "Professional consultation for acute sinusitis symptoms. Get the right treatment, including antibiotics if clinically appropriate.",
        price: "NHS Funded",
        duration: "15 Mins",
        features: ["Respiratory Assessment", "Effective Treatment", "Congestion Advice", "Rapid Booking"]
    },
    "sore-throat-service": {
        title: "Sore Throat Service",
        cat: "NHS Clinical",
        img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&q=80",
        desc: "Clinical assessment of sore throat symptoms to determine if antibiotics are required or if self-care is appropriate.",
        price: "NHS Funded",
        duration: "10 Mins",
        features: ["FeverPAIN Assessment", "Throat Examination", "Immediate Guidance", "Clinical Precision"]
    },
    "otitis-media-service": {
        title: "Ear Infection (Otitis Media)",
        cat: "NHS Clinical",
        img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=1200&q=80",
        desc: "Specialist consultation for children with acute ear infections. We provide expert care and treatment without the wait.",
        price: "NHS Funded",
        duration: "20 Mins",
        features: ["Expert Assessment", "Antibiotic Treatment", "Pain Relief Advice", "Pediatric Focused"]
    },
    "flu-vaccination": {
        title: "Flu Vaccination",
        cat: "NHS & Private",
        img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80",
        desc: "Annual flu protection for individuals and families. Free NHS vaccines available for eligible groups.",
        price: "NHS / £15 Private",
        duration: "10 Mins",
        features: ["Certified Vaccinators", "Rapid Appointment", "Winter Immunity", "Safe Environment"]
    },
    "heart-check": {
        title: "Heart Health Check",
        cat: "Private Diagnostic",
        img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=1200&q=80",
        desc: "A comprehensive assessment of your cardiovascular health, including ECG, blood pressure, and cholesterol screening.",
        price: "£85",
        duration: "40 Mins",
        features: ["Full Lipid Profile", "ECG Monitoring", "Pulse Accuracy", "Expert Lifestyle Advice"]
    },
    "aesthetics": {
        title: "Aesthetics Clinic",
        cat: "Aesthetic",
        img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=80",
        desc: "Experience premium facial rejuvenation and aesthetic treatments delivered by qualified clinical professionals.",
        price: "Consultation Free",
        duration: "30-60 Mins",
        features: ["Dermal Fillers", "Skin Revitalization", "Expert Consultation", "Sterile Environment"]
    },
    "travel-vaccinations": {
        title: "Travel Vaccinations",
        cat: "Specialist Clinic",
        img: "https://images.unsplash.com/photo-1500835595300-478db374780d?w=1200&q=80",
        desc: "Protect yourself globally with our comprehensive range of travel vaccinations. From Typhoid to Yellow Fever, we provide expert clinical protection for your journey.",
        price: "Consultation £20",
        duration: "20-40 Mins",
        features: ["Certified Yellow Fever Center", "Full Vaccine Stock", "Destination Health Maps", "Certificate Issuance"]
    },
    "dtp-vaccine": {
        title: "Diphtheria / Tetanus / Polio",
        cat: "Travel Vaccine",
        img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80",
        desc: "Essential 3-in-1 protection against Diphtheria, Tetanus, and Polio. Recommended for most international travelers to regions with varying healthcare standards.",
        price: "£45",
        duration: "15 Mins",
        features: ["3-in-1 Combined Protection", "10-Year Immunity", "Quick Single Dose", "Travel Record Inclusion"]
    },
    "typhoid-injection": {
        title: "Typhoid (Injection)",
        cat: "Travel Vaccine",
        img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=1200&q=80",
        desc: "Injected protection against Salmonella Typhi, critical for travel to regions with limited sanitation and hygiene infrastructure.",
        price: "£35",
        duration: "15 Mins",
        features: ["Effective Single Injection", "3-Year Protection", "Rapid Immunity Setup", "Professional Administration"]
    },
    "typhoid-oral": {
        title: "Typhoid (Oral)",
        cat: "Travel Vaccine",
        img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=1200&q=80",
        desc: "Oral course of Typhoid vaccination. A great alternative for those who prefer not to have injections while gaining full protection.",
        price: "£40",
        duration: "10 Mins",
        features: ["No-Needle Alternative", "Course of 3 Capsules", "Temperature Controlled", "Easy Self-Administration"]
    },
    "hepatitis-a-typhoid-combined": {
        title: "Hep A & Typhoid Combined",
        cat: "Travel Vaccine",
        img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=1200&q=80",
        desc: "Efficient dual-protection vaccine covering both Hepatitis A and Typhoid in one single administration.",
        price: "£90",
        duration: "20 Mins",
        features: ["Dual Infection Coverage", "Single Injection Efficiency", "Reduced Clinic Visits", "High Immunity Response"]
    },
    "hepatitis-a-vaccine": {
        title: "Hepatitis A",
        cat: "Travel Vaccine",
        img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&q=80",
        desc: "Protects against Hepatitis A, a liver infection commonly spread through contaminated food and water in many travel destinations.",
        price: "£55",
        duration: "15 Mins",
        features: ["Long-term Liver Protection", "2-Dose Program for Life", "High Success Rate", "Travel Essentials"]
    },
    "hepatitis-b-vaccine": {
        title: "Hepatitis B",
        cat: "Travel Vaccine",
        img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=1200&q=80",
        desc: "Critical protection against Hepatitis B, recommended for long-stay travelers or those potentially exposed to blood/body fluid contact.",
        price: "£45",
        duration: "15 Mins",
        features: ["3-Dose Standard Course", "Lifetime Immunity Potency", "Professional Shielding", "Clinical Assessment Included"]
    },
    "twinrix-vaccine": {
        title: "Twinrix (Hep A & B Combined)",
        cat: "Travel Vaccine",
        img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=80",
        desc: "Maximum efficiency vaccine providing simultaneous protection against both Hepatitis A and Hepatitis B infections.",
        price: "£80",
        duration: "20 Mins",
        features: ["Total Hepatitis Shield", "Accelerated Dosing Available", "Comprehensive Testing", "Cost Effective Combination"]
    },
    "cholera-vaccine": {
        title: "Cholera (Dukoral)",
        cat: "Travel Vaccine",
        img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=1200&q=80",
        desc: "Oral drinkable vaccine protecting against Cholera and ETEC (Traveler's Diarrhea) in high-risk environments.",
        price: "£30 / Dose",
        duration: "10 Mins",
        features: ["Drinkable Fluid Suspension", "Protects Against Diarrhea", "2-Dose Protocol", "Immunity for 2 Years"]
    },
    "rabies-vaccine": {
        title: "Rabies Pre-Exposure",
        cat: "Travel Vaccine",
        img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80",
        desc: "Vital preventative protection against Rabies, highly recommended for travel to remote areas with limited access to emergency healthcare.",
        price: "£70 / Dose",
        duration: "20 Mins",
        features: ["3-Dose Pre-Travel Course", "Life Saving Prevention", "WHO Approved Dosing", "International Safety Standard"]
    },
    "meningitis-acwy": {
        title: "Meningitis ACWY",
        cat: "Travel Vaccine",
        img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=1200&q=80",
        desc: "Mandatory for Hajj and Umrah pilgrims, and recommended for travel to the 'Meningitis Belt' in sub-Saharan Africa.",
        price: "£60",
        duration: "20 Mins",
        features: ["Certificate Included", "Hajj/Umrah Approved", "Quadrilateral Shielding", "5-Year Protection"]
    },
    "meningitis-menveo": {
        title: "Meningitis Menveo",
        cat: "Travel Vaccine",
        img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=1200&q=80",
        desc: "Specialized Meningitis ACWY protection specifically formulated for pilgrims and high-risk student travelers.",
        price: "£65",
        duration: "20 Mins",
        features: ["Premium Vaccine Grade", "Visa Documentation Ready", "Advanced Immunity Profile", "GPhC Administered"]
    },
    "japanese-encephalitis": {
        title: "Japanese Encephalitis",
        cat: "Travel Vaccine",
        img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=1200&q=80",
        desc: "Protects against mosquito-borne brain inflammation common in rural parts of Asia and the Pacific Islands.",
        price: "£95",
        duration: "20 Mins",
        features: ["2-Dose Immunization", "Essential for Rural Asia", "Safe and Effective", "Detailed Health Advice"]
    },
    "tick-borne-encephalitis": {
        title: "Tick-Borne Encephalitis",
        cat: "Travel Vaccine",
        img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&q=80",
        desc: "Ensures protection for outdoor travelers visiting forested areas in Eastern and Central Europe where disease-carrying ticks are prevalent.",
        price: "£85",
        duration: "20 Mins",
        features: ["Outdoor Adventure Safety", "Course of 2-3 Doses", "European Regional Shield", "Clinical Expertise"]
    },
    "chickenpox-vaccine": {
        title: "Chickenpox Vaccine",
        cat: "Routine Vaccine",
        img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=1200&q=80",
        desc: "Comprehensive immunity against the varicella-zoster virus, preventing painful Chickenpox infections for adults and children.",
        price: "£65",
        duration: "15 Mins",
        features: ["2-Dose Course", "Lifetime Protection", "Prevents Shingles Risk", "Safe for Children"]
    },
    "chikungunya-vaccine": {
        title: "Chikungunya Vaccine",
        cat: "Travel Vaccine",
        img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80",
        desc: "Advanced protection against the mosquito-borne Chikungunya virus, critical for travel to affected tropical and subtropical regions.",
        price: "£90",
        duration: "15 Mins",
        features: ["Single Dose", "Mosquito Disease Defense", "Rapid Immunity", "Specialist Administration"]
    },
    "hpv-vaccine": {
        title: "HPV Vaccine",
        cat: "Specialist Vaccine",
        img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=1200&q=80",
        desc: "Next-generation Gardasil 9 protection against Human Papillomavirus, significantly reducing the risk of cervical and other associated cancers.",
        price: "£160 / Dose",
        duration: "20 Mins",
        features: ["Gardasil 9 Premium", "Gender Neutral Protection", "Course of 2-3 Doses", "Cancer Prevention"]
    },
    // --- Pro Level Weight Loss Services ---
    "wegovy": {
        title: "Wegovy Injections",
        cat: "Medical Weight Loss",
        img: "/brain/a9794728-9bd2-4101-a344-91ef761459ce/glp1_pen_premium_1777977535256.png",
        desc: "Wegovy® (semaglutide) is an FDA/MHRA-approved weekly injection trusted globally for effective, clinical weight management. Designed to regulate your appetite and digestion, our program couples this highly effective medication with continuous doctor-led support to ensure safe and sustainable fat loss. Experience premium metabolic care delivered exclusively at our flagship clinics.",
        price: "Consultation Required",
        duration: "30 Mins",
        features: [
            "Once-Weekly Injection Protocol",
            "Appetite & Craving Regulation",
            "Ongoing Doctor-Led Titration",
            "Full Clinical Monitoring Program",
            "Comprehensive Metabolic Reset"
        ]
    },
    "mounjaro": {
        title: "Mounjaro Injections",
        cat: "Advanced Medical Weight Loss",
        img: "/brain/a9794728-9bd2-4101-a344-91ef761459ce/mounjaro_pen_premium_1777977877135.png",
        desc: "Mounjaro® (tirzepatide) represents the absolute pinnacle of modern metabolic science. As a dual-acting GIP and GLP-1 receptor agonist, it offers unprecedented, industry-leading efficacy in weight reduction. Under our strict, premium clinical supervision, patients receive custom titration schedules to maximize results while minimizing side effects. Your God-level physical transformation begins here.",
        price: "Consultation Required",
        duration: "45 Mins",
        features: [
            "Next-Gen Dual Hormone Therapy",
            "Market-Leading Weight Reduction",
            "Advanced Clinical Titration Schedule",
            "VIP Direct-to-Patient Pharmacy Care",
            "Comprehensive Biological Reset"
        ]
    }
};

export default function ServiceDetail() {
    const params = useParams();
    const slug = params.slug;
    const service = serviceData[slug] || {
        title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        cat: "Clinical",
        img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=1200&q=80",
        desc: "Comprehensive pharmaceutical care and consultation provided by our expert medical team.",
        price: "Consultation Required",
        duration: "15-30 Mins",
        features: ["GPhC Certified Staff", "Private Consulting Room", "Professional Advice", "Same-Day Availability"]
    };

    return (
        <div className="sd_page">
            {/* Cinematic Hero */}
            <header className="sd_hero">
                <img src={service.img} alt={service.title} className="sd_hero_bg" />
                <div className="sd_hero_overlay" />
                <div className="sd_hero_content">
                    <span className="sd_eyebrow">{service.cat} Service</span>
                    <h1 className="sd_title">{service.title}</h1>
                </div>
            </header>

            {/* Content Section */}
            <section className="sd_main">
                <div className="sd_container">
                    <div className="sd_grid">
                        <div className="sd_content_col">
                            <div className="sd_info_block">
                                <h2 className="sd_sec_title">About This Service</h2>
                                <p className="sd_desc">{service.desc}</p>
                            </div>
                            
                            <div className="sd_benefits_grid">
                                <div className="sd_benefit_card">
                                    <div className="sd_benefit_icon">✦</div>
                                    <h3>Clinical Excellence</h3>
                                    <p>Delivered by GPhC registered pharmacists with years of specialized clinical experience.</p>
                                </div>
                                <div className="sd_benefit_card">
                                    <div className="sd_benefit_icon">✦</div>
                                    <h3>Patient Centric</h3>
                                    <p>Our focus is entirely on your comfort, confidentiality, and long-term health outcomes.</p>
                                </div>
                            </div>

                            <div className="sd_features_list">
                                <h3 className="sd_list_title">Key Service Highlights</h3>
                                <div className="sd_features">
                                    {service.features.map((f, i) => (
                                        <div className="sd_feature_item" key={i}>
                                            <div className="sd_feature_dot" />
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <aside className="sd_sidebar">
                            <div className="sd_booking_card">
                                <div className="sd_card_header">
                                    <span className="sd_price_label">Premium Clinical Care</span>
                                    <h3 className="sd_card_price">{service.price}</h3>
                                </div>
                                <div className="sd_card_meta">
                                    <div className="sd_meta_item">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        <span>Consultation: {service.duration}</span>
                                    </div>
                                </div>
                                <button className="sd_book_btn">Book Your Appointment</button>
                                <div className="sd_card_footer">
                                    <div className="sd_trust_badge">
                                        <span>Verified Professional Service</span>
                                    </div>
                                    <p className="sd_card_hint">Fast availability • No GP referral needed</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
}
