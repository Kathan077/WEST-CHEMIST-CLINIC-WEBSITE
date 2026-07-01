const Service = require('../models/Service');
const PageContent = require('../models/PageContent');
const Category = require('../models/Category');
const Blog = require('../models/Blog');

const defaultServices = [
  {
    slug: "blood-testing",
    title: "Blood Testing",
    cat: "Diagnostic & Screening",
    img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=600&q=80",
    desc: "Our advanced private blood testing service offers comprehensive, clinician-led diagnostic screenings with rapid, confidential reporting. From full blood counts and kidney function profiles to hormone panels and metabolic tracking, we provide the deep biological insights needed to optimize your health.",
    duration: "15-20 Mins",
    features: [
      "GPhC Registered Pharmacist Oversight",
      "ISO-Accredited Laboratory Analysis",
      "Comprehensive Health Marker Panels",
      "Confidential Digital Results Report",
      "Post-Test Clinical Guidance"
    ],
    color: "#4B2D71",
    onHome: true
  },
  {
    slug: "earwax-removal",
    title: "Earwax Removal",
    cat: "Clinical Ear Care",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
    desc: "Regain auditory clarity with our state-of-the-art microsuction earwax removal service. Widely recognized as the safest and most effective method, microsuction uses gentle suction under high-definition visualization to clear blockages without water or mess. Ideal for resolving discomfort, hearing loss, and tinnitus caused by impacted cerumen.",
    duration: "30 Mins",
    features: [
      "High-Definition Video Otoscopy",
      "Gentle, Water-Free Microsuction",
      "Performed by Accredited Clinicians",
      "Immediate Pressure & Tinnitus Relief",
      "Comprehensive Ear Health Check"
    ],
    color: "#008473",
    onHome: true
  },
  {
    slug: "travel-clinic",
    title: "Travel Clinic",
    cat: "Travel Health & Vaccinations",
    img: "https://images.unsplash.com/photo-1500835595300-478db374780d?w=600&q=80",
    desc: "Embark on international travel with complete peace of mind. Our specialist travel clinic provides destination-specific risk assessments, individualized vaccination protocols, malaria prophylaxis, and certified health advice tailored to your medical history and itinerary.",
    duration: "30 Mins",
    features: [
      "Pre-Travel Destination Risk Assessment",
      "Comprehensive Vaccine Portfolio",
      "Malaria Prophylaxis Prescriptions",
      "Certified Yellow Fever Vaccination Centre",
      "Tailored Health & Hygiene Advice"
    ],
    color: "#FF6B35",
    onHome: true
  },
  {
    slug: "cryotherapy",
    title: "Cryotherapy",
    cat: "Clinical Dermatology",
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
    desc: "Remove benign skin lesions safely and effectively with our advanced cryotherapy service. Utilizing clinical-grade liquid nitrogen or nitrous oxide, we precisely freeze target tissues (such as warts, verrucae, skin tags, and solar keratoses), initiating a natural shedding process that preserves surrounding healthy skin.",
    duration: "15 Mins",
    features: [
      "Precise Cryo-Pen Technology",
      "Effective for Warts, Verrucae & Tags",
      "Dermatological Lesion Assessment",
      "Minimal Discomfort & Scarring Risk",
      "Post-Treatment Care Protocol"
    ],
    color: "#2D5A27",
    onHome: true
  },
  {
    slug: "microneedling",
    title: "Microneedling",
    cat: "Clinical Aesthetics",
    img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80",
    desc: "Revitalize your skin's texture and tone with our premium medical-grade microneedling service. Utilizing sterile, automated micro-needling technology, this treatment stimulates the body's natural collagen and elastin synthesis. Highly effective for reducing acne scarring, fine lines, hyperpigmentation, and enlarged pores.",
    duration: "45 Mins",
    features: [
      "Sterile Automated Microneedling Pens",
      "Collagen Induction Therapy",
      "Customized Active Serum Infusions",
      "Topical Anaesthesia for Comfort",
      "Post-Treatment Skin Recovery Kit"
    ],
    color: "#4B2D71",
    onHome: true
  },
  {
    slug: "strep-a-test-&-treat",
    title: "Strep A Test & Treat",
    cat: "Acute Care Diagnostics",
    img: "https://plus.unsplash.com/premium_photo-1664303017917-71feb142f30c?w=600&q=80",
    desc: "Determine the cause of severe throat infections rapidly with our point-of-care Strep A diagnostics. We conduct a rapid antigen swab test to detect Group A Streptococcus in minutes. If positive, our qualified prescribing pharmacists can issue appropriate antibiotic therapy immediately, saving you a visit to the GP.",
    duration: "10 Mins",
    features: [
      "Rapid Antigen Throat Swab Test",
      "Results in Less Than 10 Minutes",
      "Clinical Sore Throat Scoring (FeverPAIN)",
      "Immediate Prescribing & Dispensing",
      "Professional Self-Care Guidance"
    ],
    color: "#008473",
    onHome: true
  },
  {
    slug: "discharge-medicines-service",
    title: "Discharge Medicines Service (DMS)",
    cat: "NHS Clinical Integration",
    img: "https://plus.unsplash.com/premium_photo-1661633534346-601931818296?w=600&q=80",
    desc: "A specialized NHS clinical service designed to support patients transitioning from hospital care back to the community. Our pharmacists perform a rigorous medication reconciliation to resolve discrepancies, educate you on new therapeutic regimens, and coordinate directly with your GP to prevent adverse drug events and reduce readmission rates.",
    duration: "20 Mins",
    features: [
      "Comprehensive Medication Reconciliation",
      "Post-Hospital Transition Support",
      "Discrepancy & Side-Effect Identification",
      "Direct GP & Care Team Liaison",
      "One-on-One Patient Education"
    ]
  },
  {
    slug: "new-medicine-service",
    title: "New Medicine Service (NMS)",
    cat: "NHS Advanced Care",
    img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=600&q=80",
    desc: "Get the most out of your newly prescribed therapy for chronic conditions. This structured NHS service provides expert clinical consultation over several weeks for conditions like asthma, COPD, type 2 diabetes, hypertension, and anticoagulation therapy, helping you manage side effects, master administration techniques, and build confidence.",
    duration: "15 Mins",
    features: [
      "Structured Pharmacist-Led Consultations",
      "Targeted Side-Effect Management",
      "Device Technique & Inhaler Training",
      "Improved Medication Adherence",
      "Direct Integration with NHS Care Pathways"
    ]
  },
  {
    slug: "dispensing-medicines",
    title: "Prescription Dispensing Service",
    cat: "Essential Clinical Care",
    img: "https://plus.unsplash.com/premium_photo-1663040149075-8178a9c4038a?w=600&q=80",
    desc: "Enjoy reliable, accurate, and rapid dispensing of your NHS and private prescriptions. Every prescription undergoes a thorough clinical check by our registered pharmacists to ensure safety, identify potential drug interactions, and provide you with clear guidance on dosage and administration.",
    duration: "Variable",
    features: [
      "Accurate Electronic NHS Prescription Service (EPS)",
      "Thorough Pharmacist Safety Reviews",
      "Private Prescription Fulfillment",
      "Compliance & Dosette Box Preparation",
      "Home Delivery & Repeat Reminders"
    ]
  },
  {
    slug: "blood-pressure",
    title: "Clinical Blood Pressure Screening",
    cat: "Cardiovascular NHS Care",
    img: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&q=80",
    desc: "Identify and monitor cardiovascular risks with our professional blood pressure screening service. High blood pressure (hypertension) often has no symptoms but is a major cause of stroke and heart disease. We provide accurate measurements, risk explanation, and direct referral pathways if intervention is required.",
    duration: "10 Mins",
    features: [
      "ISO-Validated Sphygmomanometers",
      "Immediate, Clear Results Interpretation",
      "Personalized Heart Health & Lifestyle Advice",
      "Direct GP Referrals for Elevated Readings",
      "Ambulatory Blood Pressure Monitoring (ABPM)"
    ]
  },
  {
    slug: "urinary-tract-infection-service",
    title: "UTI Treatment (Pharmacy First)",
    cat: "NHS Pharmacy First",
    img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=600&q=80",
    desc: "Access prompt assessment and effective treatment for uncomplicated urinary tract infections (UTIs). Under the NHS Pharmacy First scheme, women aged 16-64 experiencing UTI symptoms can receive a private clinical consultation and, if indicated, a course of prescription antibiotics directly from our pharmacist.",
    duration: "15 Mins",
    features: [
      "Private, Confidential Consultation",
      "Rapid Symptomatic Assessment",
      "Prescription Antibiotics (if appropriate)",
      "NHS Pharmacy First Fully Funded",
      "Urinary Health Education"
    ]
  },
  {
    slug: "shingles-service",
    title: "Shingles Treatment Service",
    cat: "NHS Pharmacy First",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "Prompt clinical intervention for shingles (herpes zoster). Under the NHS Pharmacy First service, patients aged 18 and over presenting with shingles symptoms can be assessed immediately. If appropriate, antiviral medication can be prescribed to reduce the severity, duration, and risk of post-herpetic neuralgia.",
    duration: "15 Mins",
    features: [
      "Rapid Antiviral Prescribing",
      "Pain Management & Relief Advice",
      "Prevention of Neuralgic Complications",
      "NHS Pharmacy First Fully Funded",
      "Ongoing Care & Follow-Up Support"
    ]
  },
  {
    slug: "sinusitis-service",
    title: "Sinusitis Treatment Service",
    cat: "NHS Pharmacy First",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
    desc: "Professional assessment and relief from acute sinusitis symptoms. For individuals aged 12 and over, our prescribing clinical pharmacists can evaluate nasal congestion, facial pain, and pressure to determine the appropriate treatment, which may include nasal sprays, pain relief, or antibiotics if clinically indicated.",
    duration: "15 Mins",
    features: [
      "Comprehensive Nasal & Sinus Evaluation",
      "Prescription Antibiotics & Sprays",
      "Symptom Management Solutions",
      "NHS Pharmacy First Fully Funded",
      "Guidance on Complication Signs"
    ]
  },
  {
    slug: "sore-throat-service",
    title: "Sore Throat Treatment Service",
    cat: "NHS Pharmacy First",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80",
    desc: "Fast relief and clinical diagnostic evaluation for acute sore throats. Using the FeverPAIN or Centor clinical scoring criteria, we assess children and adults aged 5 and over. Our clinical pharmacists can advise on pain management or prescribe antibiotics if a bacterial infection is highly likely.",
    duration: "10 Mins",
    features: [
      "FeverPAIN Clinical Swab & Scoring",
      "Targeted Symptom Relief Advice",
      "Antibiotic Prescribing for Bacterial Cases",
      "NHS Pharmacy First Fully Funded",
      "Prevention of Unnecessary Antibiotic Use"
    ]
  },
  {
    slug: "otitis-media-service",
    title: "Acute Ear Infection (Otitis Media)",
    cat: "NHS Pharmacy First",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
    desc: "Clinical otoscopic examination and treatment for acute middle ear infections in children aged 1 to 17. Our trained pharmacists evaluate ear pain, fever, and fluid build-up to provide clinical management, pain relief options, and prescription antibiotics when necessary under NHS Pharmacy First.",
    duration: "20 Mins",
    features: [
      "Accredited Otoscopic Ear Examination",
      "Pediatric-Focused Clinical Care",
      "Antibiotic Treatment (when indicated)",
      "NHS Pharmacy First Fully Funded",
      "Safety-Netting & Red-Flag Guidance"
    ]
  },
  {
    slug: "flu-vaccination",
    title: "Influenza Vaccination Service",
    cat: "Immunization Care",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Protect yourself, your family, and your workforce against seasonal influenza. We offer both NHS-funded vaccines for eligible vulnerable groups and a rapid private vaccination service. Safeguard your winter health and prevent viral transmission with our professional vaccination service.",
    duration: "10 Mins",
    features: [
      "Certified Clinical Immunizers",
      "Latest Seasonal Quadrivalent Vaccines",
      "NHS and Private Options Available",
      "Corporate Flu Vaccination Programs",
      "Safe, Hygienic Clinic Environment"
    ]
  },
  {
    slug: "heart-check",
    title: "Cardiovascular Health Check",
    cat: "Private Health Screening",
    img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=600&q=80",
    desc: "Gain a complete understanding of your cardiovascular health with our multi-marker screening. This premium assessment includes a lipid panel (total cholesterol, HDL, LDL, triglycerides), blood glucose test, blood pressure evaluation, and body composition analysis to calculate your Q-Risk score and optimize heart longevity.",
    duration: "40 Mins",
    features: [
      "Point-of-Care Lipid & Glucose Panel",
      "Cardiovascular Q-Risk Assessment",
      "Comprehensive Clinical Report",
      "Expert Cardiovascular Lifestyle Coaching",
      "Physician Referral Support"
    ]
  },
  {
    slug: "aesthetics",
    title: "Advanced Medical Aesthetics",
    cat: "Non-Surgical Rejuvenation",
    img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80",
    desc: "Enhance your natural features with our bespoke medical aesthetic treatments. Performed exclusively by qualified, registered clinical professionals in a sterile environment, we offer customized treatment plans utilizing premium dermal fillers, skin boosters, and anti-aging injections.",
    duration: "30-60 Mins",
    features: [
      "Clinically Qualified Aesthetic Practitioners",
      "Premium, Approved Product Range",
      "Sterile, Medical-Grade Environment",
      "Bespoke Facial Rejuvenation Plans",
      "Comprehensive Post-Treatment Support"
    ]
  },
  {
    slug: "travel-vaccinations",
    title: "Comprehensive Travel Vaccinations",
    cat: "Travel Immunization",
    img: "https://images.unsplash.com/photo-1500835595300-478db374780d?w=600&q=80",
    desc: "Protect yourself against global vaccine-preventable diseases. Our travel health experts review your vaccination history and destination requirements to administer necessary vaccines, including Hepatitis, Typhoid, Tetanus, Rabies, Meningitis, and Yellow Fever, ensuring your immunization records are up to date.",
    duration: "20-40 Mins",
    features: [
      "All Major Travel Vaccines In Stock",
      "Certified Yellow Fever Centre",
      "Official Vaccine Passport Documentation",
      "Same-Day Clinic Appointments",
      "Travel Health Risk Consulting"
    ]
  },
  {
    slug: "wegovy",
    title: "Wegovy Weight Management",
    cat: "Medical Weight Loss",
    img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80",
    desc: "Wegovy® (semaglutide) is an MHRA-approved weekly injection for effective, clinical weight management. Designed to mimic the GLP-1 hormone, it regulates your appetite, reduces cravings, and delays stomach emptying. Our program combines this highly effective medication with continuous clinician support to ensure safe, sustainable weight loss.",
    duration: "30 Mins",
    features: [
      "Once-Weekly Injectable Medication",
      "Clinically Proven GLP-1 Hormone Analog",
      "Appetite Regulation & Craving Reduction",
      "Comprehensive Clinical Consultation Required",
      "Tailored Support & Titration Plan"
    ]
  },
  {
    slug: "dtp-vaccine",
    title: "Diphtheria, Tetanus & Polio Vaccine",
    cat: "Travel & Routine Immunization",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Ensure complete protection against three highly serious bacterial and viral infections. This single combined injection booster is recommended every 10 years or prior to traveling to countries with limited public sanitation and healthcare infrastructure.",
    duration: "15 Mins",
    features: [
      "3-in-1 Combined Booster Formulation",
      "Provides Up to 10 Years of Immunity",
      "Fast & Virtually Painless Administration",
      "Included in Official Travel Records",
      "Clinical Eligibility Screening"
    ]
  },
  {
    slug: "typhoid-injection",
    title: "Typhoid Injection Vaccine",
    cat: "Travel Immunization",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "A single-dose injectable vaccine providing critical protection against Salmonella enterica serovar Typhi. Highly recommended for travelers visiting regions with poor sanitation, including parts of South Asia, Africa, and Central and South America.",
    duration: "15 Mins",
    features: [
      "Single Injection for Easy Setup",
      "Provides 3 Years of Active Protection",
      "Rapid Antibody Response Formulation",
      "Highly Recommended for High-Risk Regions",
      "Pharmacist Administered"
    ]
  },
  {
    slug: "typhoid-oral",
    title: "Typhoid Oral Vaccine",
    cat: "Travel Immunization",
    img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=600&q=80",
    desc: "An alternative, needle-free typhoid vaccine consisting of a course of oral capsules. This live attenuated vaccine stimulates mucosal immunity in the gut, offering excellent protection against typhoid fever for travelers who prefer oral administration.",
    duration: "10 Mins",
    features: [
      "No-Needle Oral Capsule Course",
      "Stimulates Localized Gut Immunity",
      "Protects for Up to 3 Years",
      "Convenient Self-Administration Schedule",
      "Full Clinical Guidance Provided"
    ]
  },
  {
    slug: "hepatitis-a-typhoid-combined",
    title: "Hepatitis A & Typhoid Combined",
    cat: "Travel Immunization",
    img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=600&q=80",
    desc: "Streamline your pre-travel preparations with this highly efficient dual-action vaccine. Protecting against both Hepatitis A and Typhoid in a single injection, it is the ideal choice for travelers heading to tropical destinations on short notice.",
    duration: "20 Mins",
    features: [
      "Dual Disease Protection in One Shot",
      "Reduces Clinic Visits & Injections",
      "Rapid Protection Set-Up",
      "Long-Term Hepatitis A Booster Path",
      "Certified Medical Preparation"
    ]
  },
  {
    slug: "hepatitis-a-vaccine",
    title: "Hepatitis A Vaccine",
    cat: "Travel Immunization",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80",
    desc: "Prevent Hepatitis A, a highly contagious viral liver infection transmitted via contaminated food, water, or contact. A single dose provides robust short-term protection, while a subsequent booster dose 6 to 12 months later grants lifetime immunity.",
    duration: "15 Mins",
    features: [
      "Highly Effective Injected Immunization",
      "2-Dose Schedule for Lifetime Protection",
      "Essential for High-Risk Travel Zones",
      "Minimal Post-Vaccine Reactivity",
      "Comprehensive Vaccine Counseling"
    ]
  },
  {
    slug: "hepatitis-b-vaccine",
    title: "Hepatitis B Vaccine",
    cat: "Travel & Occupational Immunization",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
    desc: "Immunize against Hepatitis B, a blood-borne viral infection that causes chronic liver disease and liver cancer. Recommended for healthcare workers, individuals handling medical waste, long-term travelers, and those undergoing medical procedures abroad.",
    duration: "15 Mins",
    features: [
      "3-Dose Standard Immunization Course",
      "Provides Lifelong Immunity Profile",
      "Essential for Medical & Travel Careers",
      "Pre-Vaccination Immunity Status Checks",
      "Certified Pharmacist Administration"
    ]
  },
  {
    slug: "twinrix-vaccine",
    title: "Twinrix (Hepatitis A & B Combined)",
    cat: "Travel Immunization",
    img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80",
    desc: "Achieve complete protection against both Hepatitis A and Hepatitis B. This combined vaccine protocol is highly efficient, utilizing a 3-dose schedule to build comprehensive, long-lasting immunity against both viral pathogens.",
    duration: "20 Mins",
    features: [
      "Combined Hep A and Hep B Protection",
      "Efficient 3-Dose Schedule",
      "Accelerated Dosing Available for Travel",
      "Reduces Total Required Injections",
      "Ideal for Medical and Frequent Travelers"
    ]
  },
  {
    slug: "cholera-vaccine",
    title: "Cholera Vaccine (Oral Dukoral)",
    cat: "Travel Immunization",
    img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=600&q=80",
    desc: "An oral, drinkable vaccine designed to prevent cholera, a severe diarrheal disease transmitted via contaminated water. The vaccine also provides partial cross-protection against traveler's diarrhea caused by Enterotoxigenic E. coli (ETEC).",
    duration: "10 Mins",
    features: [
      "Easy-to-Take Oral Suspension",
      "Dual Action: Cholera & ETEC Defense",
      "2-Dose Protocol for Adults",
      "Provides Up to 2 Years of Protection",
      "Ideal for Aid Workers and Backpackers"
    ]
  },
  {
    slug: "rabies-vaccine",
    title: "Rabies Pre-Exposure Prophylaxis",
    cat: "Travel Immunization",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Build protective antibody levels against Rabies prior to travel. Essential for travelers visiting countries where rabies is endemic, especially those participating in outdoor activities, working with animals, or traveling to remote regions far from medical care.",
    duration: "20 Mins",
    features: [
      "3-Dose Pre-Exposure Vaccination Course",
      "Crucial for Remote & Wildlife Travel",
      "Simplifies Post-Bite Medical Care",
      "WHO-Recommended Immunization Protocol",
      "Professional Clinical Administration"
    ]
  },
  {
    slug: "meningitis-acwy",
    title: "Meningitis ACWY Vaccine",
    cat: "Travel & Hajj/Umrah Certification",
    img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=600&q=80",
    desc: "Protects against four strains of meningococcal bacteria (A, C, W, and Y) which cause life-threatening meningitis and septicemia. This vaccine is a mandatory entry requirement for pilgrims traveling to Saudi Arabia for Hajj or Umrah, and a certificate of vaccination is issued.",
    duration: "20 Mins",
    features: [
      "Official Hajj & Umrah Certificate Issued",
      "Protects Against 4 Deadly Meningococcal Strains",
      "Mandatory for Pilgrims & Overseas Students",
      "Provides 5 Years of Active Protection",
      "Pharmacist Administered"
    ]
  },
  {
    slug: "meningitis-menveo",
    title: "Meningitis Menveo Vaccine",
    cat: "Travel Immunization",
    img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=600&q=80",
    desc: "An advanced meningococcal ACWY conjugate vaccine, Menveo is formulated to trigger a highly robust immune response in adolescents and adults. Highly recommended for students entering university, high-risk healthcare workers, and international travelers.",
    duration: "20 Mins",
    features: [
      "High-Potency Conjugate Formulation",
      "Approved for Pilgrimage & Visa Records",
      "Comprehensive Meningococcal Strain Coverage",
      "Fast-Acting Immune Activation",
      "Official Certificate Provided"
    ]
  },
  {
    slug: "japanese-encephalitis",
    title: "Japanese Encephalitis Vaccine",
    cat: "Travel Immunization",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "Protect yourself against Japanese Encephalitis, a serious viral infection of the brain spread by infected mosquitoes in rural and agricultural regions of Asia and the Western Pacific. This 2-dose vaccine is essential for long-term travelers and outdoor adventurers.",
    duration: "20 Mins",
    features: [
      "2-Dose Immunization Course",
      "Essential for Rural & Outdoor Asian Travel",
      "Highly Effective Viral Brain Shield",
      "Detailed Mosquito Avoidance Counseling",
      "Clinical Health Assessment"
    ]
  },
  {
    slug: "tick-borne-encephalitis",
    title: "Tick-Borne Encephalitis Vaccine",
    cat: "Travel Immunization",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80",
    desc: "Provides critical defense against Tick-Borne Encephalitis (TBE), a viral infection of the central nervous system transmitted by ticks in forested and rural areas of Central, Eastern, and Northern Europe, as well as Northern Asia.",
    duration: "20 Mins",
    features: [
      "Crucial for Hiking & Forest Activities",
      "Course of 2 to 3 Injections",
      "Provides Multi-Year Central Nervous System Shielding",
      "Tick Avoidance Clinical Guidance",
      "Certified Clinical Delivery"
    ]
  },
  {
    slug: "chickenpox-vaccine",
    title: "Chickenpox (Varicella) Vaccine",
    cat: "Routine Immunization",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "Prevent varicella-zoster infection (chickenpox) in children and adults. Chickenpox can lead to severe complications, secondary bacterial skin infections, and increases the lifetime risk of shingles. Two doses provide long-term, highly effective immunity.",
    duration: "15 Mins",
    features: [
      "2-Dose Immunization Schedule",
      "Provides Long-Term Active Immunity",
      "Protects Adults & Vulnerable Children",
      "Reduces Risk of Shingles Later in Life",
      "Pre-Vaccine Suitability Consultation"
    ]
  },
  {
    slug: "chikungunya-vaccine",
    title: "Chikungunya Vaccine",
    cat: "Travel Immunization",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Safeguard against the Chikungunya virus, a mosquito-borne illness that causes severe, debilitating joint pain and fever. This advanced, recently approved vaccine is recommended for travelers visiting active transmission areas in tropical and subtropical regions.",
    duration: "15 Mins",
    features: [
      "Advanced Mosquito-Borne Disease Shield",
      "Single-Dose Injection Protocol",
      "Rapid Antibody Development",
      "Comprehensive Tropical Disease Consultation",
      "Administered by Travel Clinic Specialists"
    ]
  },
  {
    slug: "hpv-vaccine",
    title: "Human Papillomavirus (HPV) Vaccine",
    cat: "Specialist Immunization",
    img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=600&q=80",
    desc: "Utilizing the premium Gardasil 9 vaccine, we provide comprehensive protection against nine strains of HPV. This vaccination is highly effective in preventing HPV-associated cancers, including cervical, throat, and penile cancers, as well as genital warts.",
    duration: "20 Mins",
    features: [
      "Gardasil 9 Premium Protection",
      "Substantially Lowers Cancer Risks",
      "Multi-Dose Schedule for Full Protection",
      "Gender-Neutral Clinical Care",
      "Accredited Pharmacist Administration"
    ]
  }
];

const defaultPages = [
  {
    key: "about-us",
    title: "About West Chemist Clinic",
    content: "West Chemist Clinic is a leading private healthcare provider offering a comprehensive suite of clinical treatments, diagnostics, vaccinations, and weight management services. Run by GPhC registered clinical pharmacists, we combine clinical excellence with patient-centered care to deliver top-tier clinical solutions directly in your community. Our state-of-the-art facilities offer a welcoming environment with private consulting rooms and same-day availability.",
    section: "about"
  },
  {
    key: "contact-info",
    title: "Contact Information & Opening Hours",
    content: "Address: 123 West Chemist Street, Northampton, NN1 1EX. Phone: +44 1234 567890. Email: support@westchemist.com. Opening Hours: Monday - Friday: 08:30 AM - 06:00 PM, Saturday: 09:00 AM - 04:00 PM, Sunday: Closed.",
    section: "contact"
  },
  {
    key: "terms-conditions",
    title: "Terms and Conditions of Service",
    content: "All medical assessments and clinical services provided by West Chemist Clinic are subject to professional verification. Patients must present valid identification for verification audits. Booking cancellations or reschedule requests can be made up to 24 hours prior to the scheduled slot.",
    section: "terms"
  },
  {
    key: "privacy-policy",
    title: "GDPR Compliance & Privacy Policy",
    content: "At West Chemist Clinic, your health data security is our top priority. We operate in strict compliance with the General Data Protection Regulation (GDPR) and GPhC identity verification guidelines. All uploaded documents undergo encrypted anti-tamper scans and are permanently deleted or safely archived in accordance with legal requirements.",
    section: "privacy"
  }
];

const seedServicesAndPages = async () => {
  try {
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const defaultCategories = [
        { name: "NHS Services (Pharmacy First)", slug: "nhs-services-pharmacy-first" },
        { name: "Private Services", slug: "private-services" },
        { name: "Travel Clinic", slug: "travel-clinic" }
      ];
      await Category.insertMany(defaultCategories);
      console.log(`💎 [Database Seeding] Successfully seeded default categories.`);
    }

    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany(defaultServices);
      console.log(`💎 [Database Seeding] Successfully seeded ${defaultServices.length} default services.`);
    } else {
      // Check for any missing services and insert them
      for (const srv of defaultServices) {
        const exists = await Service.findOne({ slug: srv.slug });
        if (!exists) {
          await Service.create(srv);
          console.log(`💎 [Database Migration] Seeded missing default service: ${srv.title}`);
        }
      }
    }

    // Restore original specific categories in `cat` and set `parentCategory`
    const allDbServices = await Service.find();
    for (const srv of allDbServices) {
      const template = defaultServices.find(ds => ds.slug === srv.slug || ds.title === srv.title);
      if (template) {
        let parent = "Private Services";
        if (["NHS Clinical Integration", "NHS Advanced Care", "Cardiovascular NHS Care", "NHS Pharmacy First", "Immunization Care", "NHS Services"].includes(template.cat)) {
          parent = "NHS Services (Pharmacy First)";
        } else if (["Travel Health & Vaccinations", "Travel Immunization", "Travel Vaccines", "Travel & Routine Immunization", "Travel & Hajj/Umrah Certification", "Travel & Occupational Immunization"].includes(template.cat)) {
          parent = "Travel Clinic";
        }
        srv.cat = template.cat;
        srv.parentCategory = parent;
        await srv.save();
      } else {
        if (!srv.parentCategory) {
          // Default custom/user added services
          if (["NHS Services (Pharmacy First)", "Private Services", "Travel Clinic"].includes(srv.cat)) {
            srv.parentCategory = srv.cat;
          } else {
            srv.parentCategory = "Private Services";
          }
        }
        await srv.save();
      }
    }
    console.log("💎 [Database Migration] Restored detailed categories and populated parentCategory.");

    const pageCount = await PageContent.countDocuments();
    if (pageCount === 0) {
      await PageContent.insertMany(defaultPages);
      console.log(`💎 [Database Seeding] Successfully seeded ${defaultPages.length} default page contents.`);
    }

    // Ensure clinic-hours document exists
    let clinicHours = await PageContent.findOne({ key: 'clinic-hours' });
    if (!clinicHours) {
      await PageContent.create({
        key: 'clinic-hours',
        title: 'Clinic Opening Hours',
        content: 'Mon - Fri: 8:30 AM - 6:30 PM\nSaturday: 9:00 AM - 2:00 PM\nSunday: 9:00 AM - 12:00 PM',
        section: 'general',
        metadata: {
          mon_fri: '8:30 AM - 6:30 PM',
          sat: '9:00 AM - 2:00 PM',
          sun: '9:00 AM - 12:00 PM'
        }
      });
      console.log("💎 [Database Migration] Created default 'clinic-hours' page content.");
    }

    // Ensure health-tools-header exists
    let toolsHeader = await PageContent.findOne({ key: 'health-tools-header' });
    if (!toolsHeader) {
      await PageContent.create({
        key: 'health-tools-header',
        title: 'Interactive Health Tools',
        content: 'Free tools to help you monitor and understand your wellbeing.',
        section: 'blog'
      });
      console.log("💎 [Database Migration] Created default 'health-tools-header' page content.");
    }

    // Ensure health-tools-list exists
    let toolsList = await PageContent.findOne({ key: 'health-tools-list' });
    if (!toolsList) {
      await PageContent.create({
        key: 'health-tools-list',
        title: 'Interactive Health Tools List',
        content: JSON.stringify([
          { title: "BMI Calculator", icon: "calculator", desc: "Check your Body Mass Index in seconds." },
          { title: "Diabetes Risk", icon: "droplet", desc: "Take a simple test to assess your risk factor." },
          { title: "Heart Age", icon: "heart", desc: "Evaluate your cardiovascular health profile." },
          { title: "Symptom Checker", icon: "search", desc: "Get instant guidance on common symptoms." }
        ]),
        section: 'blog'
      });
      console.log("💎 [Database Migration] Created default 'health-tools-list' page content.");
    }

    // Ensure social-feed-header exists
    let socialHeader = await PageContent.findOne({ key: 'social-feed-header' });
    if (!socialHeader) {
      await PageContent.create({
        key: 'social-feed-header',
        title: 'Health Tips on Social',
        content: 'Follow us @westchemistclinic for daily medical insights.',
        section: 'blog',
        metadata: {
          instagram_url: 'https://instagram.com/westchemistclinic'
        }
      });
      console.log("💎 [Database Migration] Created default 'social-feed-header' page content.");
    }

    // Seed default blogs if not already present
    const defaultBlogs = [
      {
        title: "5 Essential Travel Vaccinations for Your Next Adventure",
        subject: "Travel Health",
        slug: "essential-travel-vaccinations",
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
<p>Most vaccines require <strong>4 to 6 weeks</strong> to become fully effective. Some require multiple doses spaced weeks apart. Therefore, it is highly recommended to consult our travel clinic specialists at West Chemist Clinic at least a month before your departure date.</p>`,
        images: ["https://images.unsplash.com/photo-1500835595300-478db374780d?w=800&q=80"],
        date: new Date()
      },
      {
        title: "Understanding Hypertension: Symptoms, Prevention, and Management",
        subject: "General Health",
        slug: "understanding-hypertension-guide",
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
  <li><strong>Monitor at home:</strong> Keep track of your blood pressure using a validated home monitor or visit West Chemist Clinic for a professional screening.</li>
</ol>
<p>If lifestyle modifications are insufficient, our prescribing pharmacists can guide you on appropriate antihypertensive medications to keep your cardiovascular health on track.</p>`,
        images: ["https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=80"],
        date: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        title: "The Science of Medical Weight Loss: Is Wegovy Right for You?",
        subject: "Weight Loss",
        slug: "science-of-medical-weight-loss-wegovy",
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
<p>Wegovy is typically recommended for adults with a Body Mass Index (BMI) of 30 or higher (obese), or 27 or higher (overweight) with at least one weight-related medical condition such as hypertension or high cholesterol. Visit our weight management clinic at West Chemist Clinic for a comprehensive assessment to discuss a tailored treatment plan.</p>`,
        images: ["https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80"],
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        title: "Ear Microsuction vs. Syringing: Why Microsuction is the Safer Choice",
        subject: "Clinical ear care",
        slug: "ear-microsuction-vs-syringing",
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
<p>At West Chemist Clinic, our accredited pharmacists perform gentle microsuction earwax removal in our dedicated clinical rooms. Book your consultation today to regain clear hearing.</p>`,
        images: ["https://images.unsplash.com/photo-1559839734-2b71f1536783?w=800&q=80"],
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        title: "Winter Wellness: How to Boost Your Immune System for the Cold Season",
        subject: "Wellness",
        slug: "winter-wellness-immune-boost-tips",
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
<p>The most effective shield against seasonal viruses is vaccination. Getting your annual flu vaccine dramatically reduces your risk of catching and spreading the virus. Drop by West Chemist Clinic to receive your quick and convenient flu shot.</p>`,
        images: ["https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80"],
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      }
    ];

    // Ensure subjects exist in Categories as well and seed blogs individually if not exists
    for (const blog of defaultBlogs) {
      const exists = await Blog.findOne({ slug: blog.slug });
      if (!exists) {
        const catSlug = blog.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const catExists = await Category.findOne({ name: blog.subject });
        if (!catExists) {
          await Category.create({ name: blog.subject, slug: catSlug });
          console.log("💎 [Database Migration] Seeded missing blog category: " + blog.subject);
        }
        await Blog.create(blog);
        console.log("💎 [Database Seeding] Successfully seeded default blog: " + blog.title);
      }
    }
  } catch (error) {
    console.error("⚠️ [Database Seeding] Failed to seed/migrate data: " + error.message);
  }
};

module.exports = seedServicesAndPages;
