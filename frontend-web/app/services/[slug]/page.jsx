"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import './ServiceDetail.css';
import { API_URL, getImageUrl } from '@/config';

// Comprehensive data mapper for all services
const serviceData = {
    "blood-testing": {
        title: "Private Blood Testing",
        cat: "Diagnostic & Screening",
        img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=1200&q=80",
        desc: "Our advanced private blood testing service offers comprehensive, clinician-led diagnostic screenings with rapid, confidential reporting. From full blood counts and kidney function profiles to hormone panels and metabolic tracking, we provide the deep biological insights needed to optimize your health.",
        duration: "15-20 Mins",
        features: ["GPhC Registered Pharmacist Oversight", "ISO-Accredited Laboratory Analysis", "Comprehensive Health Marker Panels", "Confidential Digital Results Report", "Post-Test Clinical Guidance"]
    },
    "earwax-removal": {
        title: "Earwax Removal (Microsuction)",
        cat: "Clinical Ear Care",
        img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=1200&q=80",
        desc: "Regain auditory clarity with our state-of-the-art microsuction earwax removal service. Widely recognized as the safest and most effective method, microsuction uses gentle suction under high-definition visualization to clear blockages without water or mess. Ideal for resolving discomfort, hearing loss, and tinnitus caused by impacted cerumen.",
        duration: "30 Mins",
        features: ["High-Definition Video Otoscopy", "Gentle, Water-Free Microsuction", "Performed by Accredited Clinicians", "Immediate Pressure & Tinnitus Relief", "Comprehensive Ear Health Check"]
    },
    "discharge-medicines-service": {
        title: "Discharge Medicines Service (DMS)",
        cat: "NHS Clinical Integration",
        img: "https://plus.unsplash.com/premium_photo-1661633534346-601931818296?w=1200&q=80",
        desc: "A specialized NHS clinical service designed to support patients transitioning from hospital care back to the community. Our pharmacists perform a rigorous medication reconciliation to resolve discrepancies, educate you on new therapeutic regimens, and coordinate directly with your GP to prevent adverse drug events and reduce readmission rates.",
        duration: "20 Mins",
        features: ["Comprehensive Medication Reconciliation", "Post-Hospital Transition Support", "Discrepancy & Side-Effect Identification", "Direct GP & Care Team Liaison", "One-on-One Patient Education"]
    },
    "new-medicine-service": {
        title: "New Medicine Service (NMS)",
        cat: "NHS Advanced Care",
        img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=1200&q=80",
        desc: "Get the most out of your newly prescribed therapy for chronic conditions. This structured NHS service provides expert clinical consultation over several weeks for conditions like asthma, COPD, type 2 diabetes, hypertension, and anticoagulation therapy, helping you manage side effects, master administration techniques, and build confidence.",
        duration: "15 Mins",
        features: ["Structured Pharmacist-Led Consultations", "Targeted Side-Effect Management", "Device Technique & Inhaler Training", "Improved Medication Adherence", "Direct Integration with NHS Care Pathways"]
    },
    "travel-clinic": {
        title: "Specialist Travel Clinic",
        cat: "Travel Health & Vaccinations",
        img: "https://images.unsplash.com/photo-1500835595300-478db374780d?w=1200&q=80",
        desc: "Embark on international travel with complete peace of mind. Our specialist travel clinic provides destination-specific risk assessments, individualized vaccination protocols, malaria prophylaxis, and certified health advice tailored to your medical history and itinerary.",
        duration: "30 Mins",
        features: ["Pre-Travel Destination Risk Assessment", "Comprehensive Vaccine Portfolio", "Malaria Prophylaxis Prescriptions", "Certified Yellow Fever Vaccination Centre", "Tailored Health & Hygiene Advice"]
    },
    "cryotherapy": {
        title: "Cryotherapy Treatment",
        cat: "Clinical Dermatology",
        img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
        desc: "Remove benign skin lesions safely and effectively with our advanced cryotherapy service. Utilizing clinical-grade liquid nitrogen or nitrous oxide, we precisely freeze target tissues (such as warts, verrucae, skin tags, and solar keratoses), initiating a natural shedding process that preserves surrounding healthy skin.",
        duration: "15 Mins",
        features: ["Precise Cryo-Pen Technology", "Effective for Warts, Verrucae & Tags", "Dermatological Lesion Assessment", "Minimal Discomfort & Scarring Risk", "Post-Treatment Care Protocol"]
    },
    "microneedling": {
        title: "Medical-Grade Microneedling",
        cat: "Clinical Aesthetics",
        img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=80",
        desc: "Revitalize your skin's texture and tone with our premium medical-grade microneedling service. Utilizing sterile, automated micro-needling technology, this treatment stimulates the body's natural collagen and elastin synthesis. Highly effective for reducing acne scarring, fine lines, hyperpigmentation, and enlarged pores.",
        duration: "45 Mins",
        features: ["Sterile Automated Microneedling Pens", "Collagen Induction Therapy", "Customized Active Serum Infusions", "Topical Anaesthesia for Comfort", "Post-Treatment Skin Recovery Kit"]
    },
    "strep-a-test-&-treat": {
        title: "Strep A Test & Treat",
        cat: "Acute Care Diagnostics",
        img: "https://plus.unsplash.com/premium_photo-1664303017917-71feb142f30c?w=1200&q=80",
        desc: "Determine the cause of severe throat infections rapidly with our point-of-care Strep A diagnostics. We conduct a rapid antigen swab test to detect Group A Streptococcus in minutes. If positive, our qualified prescribing pharmacists can issue appropriate antibiotic therapy immediately, saving you a visit to the GP.",
        duration: "10 Mins",
        features: ["Rapid Antigen Throat Swab Test", "Results in Less Than 10 Minutes", "Clinical Sore Throat Scoring (FeverPAIN)", "Immediate Prescribing & Dispensing", "Professional Self-Care Guidance"]
    },
    "dispensing-medicines": {
        title: "Prescription Dispensing Service",
        cat: "Essential Clinical Care",
        img: "https://plus.unsplash.com/premium_photo-1663040149075-8178a9c4038a?w=1200&q=80",
        desc: "Enjoy reliable, accurate, and rapid dispensing of your NHS and private prescriptions. Every prescription undergoes a thorough clinical check by our registered pharmacists to ensure safety, identify potential drug interactions, and provide you with clear guidance on dosage and administration.",
        duration: "Variable",
        features: ["Accurate Electronic NHS Prescription Service (EPS)", "Thorough Pharmacist Safety Reviews", "Private Prescription Fulfillment", "Compliance & Dosette Box Preparation", "Home Delivery & Repeat Reminders"]
    },
    "blood-pressure": {
        title: "Clinical Blood Pressure Screening",
        cat: "Cardiovascular NHS Care",
        img: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1200&q=80",
        desc: "Identify and monitor cardiovascular risks with our professional blood pressure screening service. High blood pressure (hypertension) often has no symptoms but is a major cause of stroke and heart disease. We provide accurate measurements, risk explanation, and direct referral pathways if intervention is required.",
        duration: "10 Mins",
        features: ["ISO-Validated Sphygmomanometers", "Immediate, Clear Results Interpretation", "Personalized Heart Health & Lifestyle Advice", "Direct GP Referrals for Elevated Readings", "Ambulatory Blood Pressure Monitoring (ABPM)"]
    },
    "urinary-tract-infection-service": {
        title: "UTI Treatment (Pharmacy First)",
        cat: "NHS Pharmacy First",
        img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=1200&q=80",
        desc: "Access prompt assessment and effective treatment for uncomplicated urinary tract infections (UTIs). Under the NHS Pharmacy First scheme, women aged 16-64 experiencing UTI symptoms can receive a private clinical consultation and, if indicated, a course of prescription antibiotics directly from our pharmacist.",
        duration: "15 Mins",
        features: ["Private, Confidential Consultation", "Rapid Symptomatic Assessment", "Prescription Antibiotics (if appropriate)", "NHS Pharmacy First Fully Funded", "Urinary Health Education"]
    },
    "shingles-service": {
        title: "Shingles Treatment Service",
        cat: "NHS Pharmacy First",
        img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=1200&q=80",
        desc: "Prompt clinical intervention for shingles (herpes zoster). Under the NHS Pharmacy First service, patients aged 18 and over presenting with shingles symptoms can be assessed immediately. If appropriate, antiviral medication can be prescribed to reduce the severity, duration, and risk of post-herpetic neuralgia.",
        duration: "15 Mins",
        features: ["Rapid Antiviral Prescribing", "Pain Management & Relief Advice", "Prevention of Neuralgic Complications", "NHS Pharmacy First Fully Funded", "Ongoing Care & Follow-Up Support"]
    },
    "sinusitis-service": {
        title: "Sinusitis Treatment Service",
        cat: "NHS Pharmacy First",
        img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=1200&q=80",
        desc: "Professional assessment and relief from acute sinusitis symptoms. For individuals aged 12 and over, our prescribing clinical pharmacists can evaluate nasal congestion, facial pain, and pressure to determine the appropriate treatment, which may include nasal sprays, pain relief, or antibiotics if clinically indicated.",
        duration: "15 Mins",
        features: ["Comprehensive Nasal & Sinus Evaluation", "Prescription Antibiotics & Sprays", "Symptom Management Solutions", "NHS Pharmacy First Fully Funded", "Guidance on Complication Signs"]
    },
    "sore-throat-service": {
        title: "Sore Throat Treatment Service",
        cat: "NHS Pharmacy First",
        img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&q=80",
        desc: "Fast relief and clinical diagnostic evaluation for acute sore throats. Using the FeverPAIN or Centor clinical scoring criteria, we assess children and adults aged 5 and over. Our clinical pharmacists can advise on pain management or prescribe antibiotics if a bacterial infection is highly likely.",
        duration: "10 Mins",
        features: ["FeverPAIN Clinical Swab & Scoring", "Targeted Symptom Relief Advice", "Antibiotic Prescribing for Bacterial Cases", "NHS Pharmacy First Fully Funded", "Prevention of Unnecessary Antibiotic Use"]
    },
    "otitis-media-service": {
        title: "Acute Ear Infection (Otitis Media)",
        cat: "NHS Pharmacy First",
        img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=1200&q=80",
        desc: "Clinical otoscopic examination and treatment for acute middle ear infections in children aged 1 to 17. Our trained pharmacists evaluate ear pain, fever, and fluid build-up to provide clinical management, pain relief options, and prescription antibiotics when necessary under NHS Pharmacy First.",
        duration: "20 Mins",
        features: ["Accredited Otoscopic Ear Examination", "Pediatric-Focused Clinical Care", "Antibiotic Treatment (when indicated)", "NHS Pharmacy First Fully Funded", "Safety-Netting & Red-Flag Guidance"]
    },
    "flu-vaccination": {
        title: "Influenza Vaccination Service",
        cat: "Immunization Care",
        img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80",
        desc: "Protect yourself, your family, and your workforce against seasonal influenza. We offer both NHS-funded vaccines for eligible vulnerable groups and a rapid private vaccination service. Safeguard your winter health and prevent viral transmission with our professional vaccination service.",
        duration: "10 Mins",
        features: ["Certified Clinical Immunizers", "Latest Seasonal Quadrivalent Vaccines", "NHS and Private Options Available", "Corporate Flu Vaccination Programs", "Safe, Hygienic Clinic Environment"]
    },
    "heart-check": {
        title: "Cardiovascular Health Check",
        cat: "Private Health Screening",
        img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=1200&q=80",
        desc: "Gain a complete understanding of your cardiovascular health with our multi-marker screening. This premium assessment includes a lipid panel (total cholesterol, HDL, LDL, triglycerides), blood glucose test, blood pressure evaluation, and body composition analysis to calculate your Q-Risk score and optimize heart longevity.",
        duration: "40 Mins",
        features: ["Point-of-Care Lipid & Glucose Panel", "Cardiovascular Q-Risk Assessment", "Comprehensive Clinical Report", "Expert Cardiovascular Lifestyle Coaching", "Physician Referral Support"]
    },
    "aesthetics": {
        title: "Advanced Medical Aesthetics",
        cat: "Non-Surgical Rejuvenation",
        img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=80",
        desc: "Enhance your natural features with our bespoke medical aesthetic treatments. Performed exclusively by qualified, registered clinical professionals in a sterile environment, we offer customized treatment plans utilizing premium dermal fillers, skin boosters, and anti-aging injections.",
        duration: "30-60 Mins",
        features: ["Clinically Qualified Aesthetic Practitioners", "Premium, Approved Product Range", "Sterile, Medical-Grade Environment", "Bespoke Facial Rejuvenation Plans", "Comprehensive Post-Treatment Support"]
    },
    "travel-vaccinations": {
        title: "Comprehensive Travel Vaccinations",
        cat: "Travel Immunization",
        img: "https://images.unsplash.com/photo-1500835595300-478db374780d?w=1200&q=80",
        desc: "Protect yourself against global vaccine-preventable diseases. Our travel health experts review your vaccination history and destination requirements to administer necessary vaccines, including Hepatitis, Typhoid, Tetanus, Rabies, Meningitis, and Yellow Fever, ensuring your immunization records are up to date.",
        duration: "20-40 Mins",
        features: ["All Major Travel Vaccines In Stock", "Certified Yellow Fever Centre", "Official Vaccine Passport Documentation", "Same-Day Clinic Appointments", "Travel Health Risk Consulting"]
    },
    "dtp-vaccine": {
        title: "Diphtheria, Tetanus & Polio Vaccine",
        cat: "Travel & Routine Immunization",
        img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80",
        desc: "Ensure complete protection against three highly serious bacterial and viral infections. This single combined injection booster is recommended every 10 years or prior to traveling to countries with limited public sanitation and healthcare infrastructure.",
        duration: "15 Mins",
        features: ["3-in-1 Combined Booster Formulation", "Provides Up to 10 Years of Immunity", "Fast & Virtually Painless Administration", "Included in Official Travel Records", "Clinical Eligibility Screening"]
    },
    "typhoid-injection": {
        title: "Typhoid Injection Vaccine",
        cat: "Travel Immunization",
        img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=1200&q=80",
        desc: "A single-dose injectable vaccine providing critical protection against Salmonella enterica serovar Typhi. Highly recommended for travelers visiting regions with poor sanitation, including parts of South Asia, Africa, and Central and South America.",
        duration: "15 Mins",
        features: ["Single Injection for Easy Setup", "Provides 3 Years of Active Protection", "Rapid Antibody Response Formulation", "Highly Recommended for High-Risk Regions", "Pharmacist Administered"]
    },
    "typhoid-oral": {
        title: "Typhoid Oral Vaccine",
        cat: "Travel Immunization",
        img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=1200&q=80",
        desc: "An alternative, needle-free typhoid vaccine consisting of a course of oral capsules. This live attenuated vaccine stimulates mucosal immunity in the gut, offering excellent protection against typhoid fever for travelers who prefer oral administration.",
        duration: "10 Mins",
        features: ["No-Needle Oral Capsule Course", "Stimulates Localized Gut Immunity", "Protects for Up to 3 Years", "Convenient Self-Administration Schedule", "Full Clinical Guidance Provided"]
    },
    "hepatitis-a-typhoid-combined": {
        title: "Hepatitis A & Typhoid Combined",
        cat: "Travel Immunization",
        img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=1200&q=80",
        desc: "Streamline your pre-travel preparations with this highly efficient dual-action vaccine. Protecting against both Hepatitis A and Typhoid in a single injection, it is the ideal choice for travelers heading to tropical destinations on short notice.",
        duration: "20 Mins",
        features: ["Dual Disease Protection in One Shot", "Reduces Clinic Visits & Injections", "Rapid Protection Set-Up", "Long-Term Hepatitis A Booster Path", "Certified Medical Preparation"]
    },
    "hepatitis-a-vaccine": {
        title: "Hepatitis A Vaccine",
        cat: "Travel Immunization",
        img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&q=80",
        desc: "Prevent Hepatitis A, a highly contagious viral liver infection transmitted via contaminated food, water, or contact. A single dose provides robust short-term protection, while a subsequent booster dose 6 to 12 months later grants lifetime immunity.",
        duration: "15 Mins",
        features: ["Highly Effective Injected Immunization", "2-Dose Schedule for Lifetime Protection", "Essential for High-Risk Travel Zones", "Minimal Post-Vaccine Reactivity", "Comprehensive Vaccine Counseling"]
    },
    "hepatitis-b-vaccine": {
        title: "Hepatitis B Vaccine",
        cat: "Travel & Occupational Immunization",
        img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=1200&q=80",
        desc: "Immunize against Hepatitis B, a blood-borne viral infection that causes chronic liver disease and liver cancer. Recommended for healthcare workers, individuals handling medical waste, long-term travelers, and those undergoing medical procedures abroad.",
        duration: "15 Mins",
        features: ["3-Dose Standard Immunization Course", "Provides Lifelong Immunity Profile", "Essential for Medical & Travel Careers", "Pre-Vaccination Immunity Status Checks", "Certified Pharmacist Administration"]
    },
    "twinrix-vaccine": {
        title: "Twinrix (Hepatitis A & B Combined)",
        cat: "Travel Immunization",
        img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=80",
        desc: "Achieve complete protection against both Hepatitis A and Hepatitis B. This combined vaccine protocol is highly efficient, utilizing a 3-dose schedule to build comprehensive, long-lasting immunity against both viral pathogens.",
        duration: "20 Mins",
        features: ["Combined Hep A and Hep B Protection", "Efficient 3-Dose Schedule", "Accelerated Dosing Available for Travel", "Reduces Total Required Injections", "Ideal for Medical and Frequent Travelers"]
    },
    "cholera-vaccine": {
        title: "Cholera Vaccine (Oral Dukoral)",
        cat: "Travel Immunization",
        img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=1200&q=80",
        desc: "An oral, drinkable vaccine designed to prevent cholera, a severe diarrheal disease transmitted via contaminated water. The vaccine also provides partial cross-protection against traveler's diarrhea caused by Enterotoxigenic E. coli (ETEC).",
        duration: "10 Mins",
        features: ["Easy-to-Take Oral Suspension", "Dual Action: Cholera & ETEC Defense", "2-Dose Protocol for Adults", "Provides Up to 2 Years of Protection", "Ideal for Aid Workers and Backpackers"]
    },
    "rabies-vaccine": {
        title: "Rabies Pre-Exposure Prophylaxis",
        cat: "Travel Immunization",
        img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80",
        desc: "Build protective antibody levels against Rabies prior to travel. Essential for travelers visiting countries where rabies is endemic, especially those participating in outdoor activities, working with animals, or traveling to remote regions far from medical care.",
        duration: "20 Mins",
        features: ["3-Dose Pre-Exposure Vaccination Course", "Crucial for Remote & Wildlife Travel", "Simplifies Post-Bite Medical Care", "WHO-Recommended Immunization Protocol", "Professional Clinical Administration"]
    },
    "meningitis-acwy": {
        title: "Meningitis ACWY Vaccine",
        cat: "Travel & Hajj/Umrah Certification",
        img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=1200&q=80",
        desc: "Protects against four strains of meningococcal bacteria (A, C, W, and Y) which cause life-threatening meningitis and septicemia. This vaccine is a mandatory entry requirement for pilgrims traveling to Saudi Arabia for Hajj or Umrah, and a certificate of vaccination is issued.",
        duration: "20 Mins",
        features: ["Official Hajj & Umrah Certificate Issued", "Protects Against 4 Deadly Meningococcal Strains", "Mandatory for Pilgrims & Overseas Students", "Provides 5 Years of Active Protection", "Pharmacist Administered"]
    },
    "meningitis-menveo": {
        title: "Meningitis Menveo Vaccine",
        cat: "Travel Immunization",
        img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=1200&q=80",
        desc: "An advanced meningococcal ACWY conjugate vaccine, Menveo is formulated to trigger a highly robust immune response in adolescents and adults. Highly recommended for students entering university, high-risk healthcare workers, and international travelers.",
        duration: "20 Mins",
        features: ["High-Potency Conjugate Formulation", "Approved for Pilgrimage & Visa Records", "Comprehensive Meningococcal Strain Coverage", "Fast-Acting Immune Activation", "Official Certificate Provided"]
    },
    "japanese-encephalitis": {
        title: "Japanese Encephalitis Vaccine",
        cat: "Travel Immunization",
        img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=1200&q=80",
        desc: "Protect yourself against Japanese Encephalitis, a serious viral infection of the brain spread by infected mosquitoes in rural and agricultural regions of Asia and the Western Pacific. This 2-dose vaccine is essential for long-term travelers and outdoor adventurers.",
        duration: "20 Mins",
        features: ["2-Dose Immunization Course", "Essential for Rural & Outdoor Asian Travel", "Highly Effective Viral Brain Shield", "Detailed Mosquito Avoidance Counseling", "Clinical Health Assessment"]
    },
    "tick-borne-encephalitis": {
        title: "Tick-Borne Encephalitis Vaccine",
        cat: "Travel Immunization",
        img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&q=80",
        desc: "Provides critical defense against Tick-Borne Encephalitis (TBE), a viral infection of the central nervous system transmitted by ticks in forested and rural areas of Central, Eastern, and Northern Europe, as well as Northern Asia.",
        duration: "20 Mins",
        features: ["Crucial for Hiking & Forest Activities", "Course of 2 to 3 Injections", "Provides Multi-Year Central Nervous System Shielding", "Tick Avoidance Clinical Guidance", "Certified Clinical Delivery"]
    },
    "chickenpox-vaccine": {
        title: "Chickenpox (Varicella) Vaccine",
        cat: "Routine Immunization",
        img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=1200&q=80",
        desc: "Prevent varicella-zoster infection (chickenpox) in children and adults. Chickenpox can lead to severe complications, secondary bacterial skin infections, and increases the lifetime risk of shingles. Two doses provide long-term, highly effective immunity.",
        duration: "15 Mins",
        features: ["2-Dose Immunization Schedule", "Provides Long-Term Active Immunity", "Protects Adults & Vulnerable Children", "Reduces Risk of Shingles Later in Life", "Pre-Vaccine Suitability Consultation"]
    },
    "chikungunya-vaccine": {
        title: "Chikungunya Vaccine",
        cat: "Travel Immunization",
        img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80",
        desc: "Safeguard against the Chikungunya virus, a mosquito-borne illness that causes severe, debilitating joint pain and fever. This advanced, recently approved vaccine is recommended for travelers visiting active transmission areas in tropical and subtropical regions.",
        duration: "15 Mins",
        features: ["Advanced Mosquito-Borne Disease Shield", "Single-Dose Injection Protocol", "Rapid Antibody Development", "Comprehensive Tropical Disease Consultation", "Administered by Travel Clinic Specialists"]
    },
    "hpv-vaccine": {
        title: "Human Papillomavirus (HPV) Vaccine",
        cat: "Specialist Immunization",
        img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=1200&q=80",
        desc: "Utilizing the premium Gardasil 9 vaccine, we provide comprehensive protection against nine strains of HPV. This vaccination is highly effective in preventing HPV-associated cancers, including cervical, throat, and penile cancers, as well as genital warts.",
        duration: "20 Mins",
        features: ["Gardasil 9 Premium Protection", "Substantially Lowers Cancer Risks", "Multi-Dose Schedule for Full Protection", "Gender-Neutral Clinical Care", "Accredited Pharmacist Administration"]
    },
    "wegovy": {
        title: "Wegovy Weight Management",
        cat: "Weight Loss",
        img: "/images/wegovy_pen.png",
        desc: "Wegovy® (semaglutide) is an MHRA-approved weekly injection for effective, clinical weight management. Designed to mimic the GLP-1 hormone, it regulates your appetite, reduces cravings, and delays stomach emptying. Our program combines this highly effective medication with continuous clinician support to ensure safe, sustainable weight loss.",
        duration: "30 Mins",
        features: ["Once-Weekly Injectable Medication", "Clinically Proven GLP-1 Hormone Analog", "Appetite Regulation & Craving Reduction", "Comprehensive Clinical Consultation Required", "Tailored Support & Titration Plan"]
    },
    "mounjaro": {
        title: "Mounjaro Weight Management",
        cat: "Weight Loss",
        img: "/images/mounjaro_pen.png",
        desc: "Mounjaro® (tirzepatide) represents the latest innovation in metabolic science. Acting as a dual GIP and GLP-1 receptor agonist, it offers advanced efficacy in weight reduction. Under strict clinical supervision, our program provides personalized dosage schedules and tracking to maximize weight loss outcomes.",
        duration: "45 Mins",
        features: ["Innovative Dual Receptor Agonist (GIP & GLP-1)", "Advanced Weight Reduction Efficacy", "Personalized Clinical Titration Schedules", "Direct Professional Prescribing & Dispensing", "Continuous Progress Monitoring & Guidance"]
    },
    "weight-loss-management": {
        title: "Weight Loss Management Service",
        cat: "Weight Loss",
        img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=80",
        desc: "Comprehensive clinical and lifestyle guidance, including weight monitoring, side-effect management, and supportive care for your journey.",
        duration: "30 Mins",
        features: ["Personalised lifestyle guidance", "Regular progress reviews", "Clinician-backed support", "Continuous health tracking"]
    }
};

export default function ServiceDetail() {
    const params = useParams();
    const slug = params.slug;

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            try {
                // 1. Try to fetch the service by exact slug first
                const res = await fetch(`${API_URL}/api/services/${slug}`);
                const json = await res.json();
                if (res.ok && json.success && json.data) {
                    setService(json.data);
                } else {
                    // 2. Fetch all services and look for a normalized slug or title-slugify match
                    const allRes = await fetch(`${API_URL}/api/services`);
                    const allJson = await allRes.json();
                    let matchedService = null;
                    
                    if (allRes.ok && allJson.success && Array.isArray(allJson.data)) {
                        const targetNorm = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
                        // Check if normalized slugs match
                        matchedService = allJson.data.find(s => s.slug && s.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === targetNorm);
                        
                        if (!matchedService) {
                            // Helper to slugify service title
                            const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                            matchedService = allJson.data.find(s => s.title && slugify(s.title) === slug);
                        }
                    }
                    
                    if (matchedService) {
                        setService(matchedService);
                    } else {
                        // Fallback to local hardcoded data
                        setService(serviceData[slug] || null);
                    }
                }
            } catch (err) {
                console.error("Error fetching service: ", err);
                // Fallback to local hardcoded data
                setService(serviceData[slug] || null);
            } finally {
                setLoading(false);
            }
        };
        if (slug) {
            fetchService();
        }
    }, [slug]);

    if (loading) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', fontFamily: 'inherit' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4B2D71', marginBottom: '12px' }}>Loading service...</div>
                    <p>Fetching clinical details and credentials...</p>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)', fontFamily: 'inherit' }}>
                <div style={{ textAlign: 'center', padding: '24px', maxWidth: '400px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--t1)', marginBottom: '12px' }}>Service Not Found</div>
                    <p style={{ marginBottom: '24px' }}>The requested clinical service does not exist or has been moved.</p>
                    <Link href="/" style={{ background: '#4B2D71', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>
                        Return to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="sd_page">
            {/* Cinematic Hero */}
            <header className="sd_hero">
                <img src={getImageUrl(service.img)} alt={service.title} className="sd_hero_bg" />
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
                                    <p>Delivered by GPHC registered pharmacists with years of specialized clinical experience.</p>
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
                                    <h3 className="sd_card_service_title">{service.title}</h3>
                                </div>
                                <div className="sd_card_meta">
                                    <div className="sd_meta_item">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                        <span>Consultation: {service.duration}</span>
                                    </div>
                                </div>
                                <Link href={`/book-appointment?service=${encodeURIComponent(service.title)}`} className="sd_book_btn">
                                    Book Your Appointment
                                </Link>
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
