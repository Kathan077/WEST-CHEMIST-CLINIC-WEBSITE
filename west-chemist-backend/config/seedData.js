const Service = require('../models/Service');
const PageContent = require('../models/PageContent');
const Category = require('../models/Category');
const Blog = require('../models/Blog');

const defaultServices = [
  // --- Private Services ---
  {
    slug: "period-delay",
    title: "Period Delay Service",
    cat: "Hormonal Health",
    parentCategory: "Private Services",
    img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80",
    desc: "Plan your period safely for holidays, weddings, sports events, or other important occasions. Our pharmacist provides a confidential consultation to assess whether period delay medication is suitable for you.",
    duration: "15 Mins",
    features: [
      "Confidential Clinical Consultation",
      "Period Delay Medication Assessment",
      "Convenient & Safe Cycle Planning",
      "Qualified Pharmacist Expert Guidance",
      "Same-Day Collection Options"
    ],
    color: "#4B2D71",
    onHome: true
  },
  {
    slug: "weight-loss",
    title: "Weight Loss Management Service",
    cat: "Weight Management",
    parentCategory: "Private Services",
    img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80",
    desc: "Receive professional support to help you achieve your weight loss goals. We provide personalized advice, lifestyle guidance, and treatment options tailored to your individual needs.",
    duration: "30 Mins",
    features: [
      "Clinical Weight Loss Consultation",
      "Personalised Advice & Lifestyle Guidance",
      "MHRA-Approved Treatment Options",
      "Ongoing Weight & BMI Progress Tracking",
      "Sustainable Healthy Management Plan"
    ],
    color: "#008473",
    onHome: true
  },
  {
    slug: "ear-wax-removal",
    title: "Ear Wax Removal Service",
    cat: "Clinical Ear Care",
    parentCategory: "Private Services",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
    desc: "Blocked ears can affect hearing and cause discomfort. Our safe and effective ear wax removal service helps restore hearing while reducing pain and irritation.",
    duration: "30 Mins",
    features: [
      "Professional Otoscopic Examination",
      "Gentle Microsuction Ear Care Technology",
      "Immediate Pressure & Discomfort Relief",
      "Accredited Clinical Care Delivery",
      "Complete Ear Canal Assessment"
    ],
    color: "#FF6B35",
    onHome: true
  },
  {
    slug: "cryotherapy",
    title: "Cryotherapy Service",
    cat: "Clinical Dermatology",
    parentCategory: "Private Services",
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
    desc: "Cryotherapy is a quick and effective treatment for removing common skin lesions such as warts, verrucas, skin tags, and other benign skin conditions with minimal discomfort.",
    duration: "15 Mins",
    features: [
      "Advanced Cryo-Pen Treatment",
      "Safe Removal of Warts, Verrucas & Tags",
      "Pre-Treatment Skin Lesion Assessment",
      "Minimal Discomfort & Scarring Risk",
      "Post-Treatment Recovery Plan"
    ],
    color: "#2D5A27",
    onHome: true
  },
  {
    slug: "travel-clinic-service",
    title: "Travel Clinic",
    cat: "Travel Health",
    parentCategory: "Private Services",
    img: "https://images.unsplash.com/photo-1500835595300-478db374780d?w=600&q=80",
    desc: "Stay protected before you travel. We offer expert travel health advice, destination-specific vaccinations, malaria prevention, and travel medications to help keep you safe abroad.",
    duration: "30 Mins",
    features: [
      "Pre-Travel Destination Risk Assessment",
      "Comprehensive Vaccine Portfolio",
      "Malaria Prophylaxis Prescriptions",
      "Certified Travel Health Advice",
      "Same-Day Travel Medications Supply"
    ],
    color: "#7859a3",
    onHome: true
  },

  // --- NHS Services ---
  {
    slug: "ear-ache-treatment",
    title: "Ear Ache Treatment (Ages 1–17)",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
    desc: "Professional assessment and treatment for children and young people with ear pain. Our pharmacists provide advice and, where appropriate, NHS treatment without needing a GP appointment.",
    duration: "15 Mins",
    features: [
      "Otoscopic Middle Ear Examination",
      "Pediatric-Focused Clinical Care Protocol",
      "NHS Treatment or Antibiotics (if indicated)",
      "Fully Funded NHS Pharmacy First Service",
      "No GP Appointment Required"
    ]
  },
  {
    slug: "impetigo-treatment",
    title: "Impetigo Treatment",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "Fast assessment and treatment for impetigo, a common contagious skin infection. Early treatment helps reduce symptoms and prevent the infection from spreading.",
    duration: "15 Mins",
    features: [
      "Clinical Skin Diagnosis Assessment",
      "Prescription Antibiotic Creams or Oral Therapy",
      "Contagion & Spread Prevention Guidance",
      "Fully Funded NHS Pharmacy First Service",
      "Walk-In or Pre-Book Appointments"
    ]
  },
  {
    slug: "infected-insect-bite-treatment",
    title: "Infected Insect Bite Treatment",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=600&q=80",
    desc: "If an insect bite becomes red, swollen, painful, or infected, our pharmacists can assess your symptoms and provide suitable NHS treatment when appropriate.",
    duration: "15 Mins",
    features: [
      "Bite Site Clinical Examination",
      "Infection Severity Assessment",
      "NHS Antibiotics or Topical Treatments",
      "Fully Funded NHS Pharmacy First",
      "Red-Flag & Complication Guidance"
    ]
  },
  {
    slug: "shingles-treatment",
    title: "Shingles Treatment",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "Early assessment and treatment can help reduce the severity and duration of shingles. Visit us promptly if you notice a painful rash or blisters.",
    duration: "15 Mins",
    features: [
      "Rapid Rash & Blister Assessment",
      "Prompt Antiviral Prescribing",
      "Pain Management Solutions",
      "Fully Funded NHS Pharmacy First",
      "Neurology Complication Prevention Guidance"
    ]
  },
  {
    slug: "sinusitis-treatment",
    title: "Sinusitis Treatment",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
    desc: "Get relief from blocked nose, facial pain, headaches, and sinus pressure with expert advice and NHS treatment where clinically appropriate.",
    duration: "15 Mins",
    features: [
      "Comprehensive Nasal & Sinus Assessment",
      "Targeted Congestion Relief Solutions",
      "Prescription Steroid Sprays or Antibiotics",
      "Fully Funded NHS Pharmacy First",
      "Complication Awareness Education"
    ]
  },
  {
    slug: "sore-throat-treatment",
    title: "Sore Throat Treatment",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80",
    desc: "Our pharmacy can assess sore throat symptoms, provide advice, and offer NHS treatment for eligible patients without the need for a GP appointment.",
    duration: "15 Mins",
    features: [
      "FeverPAIN Sore Throat Assessment",
      "Rapid Point-of-Care Diagnostics",
      "NHS Treatment/Antibiotics (if indicated)",
      "Fully Funded NHS Pharmacy First",
      "Symptom Management Counseling"
    ]
  },
  {
    slug: "uti-treatment",
    title: "Urinary Tract Infection (UTI) Treatment",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=600&q=80",
    desc: "Confidential assessment and treatment for uncomplicated urinary tract infections in eligible patients, helping you get fast relief from symptoms.",
    duration: "15 Mins",
    features: [
      "Confidential Symptom Evaluation",
      "Targeted Prescription Antibiotics (if appropriate)",
      "Rapid Pain & Burning Sensation Relief",
      "Fully Funded NHS Pharmacy First (Women aged 16-64)",
      "Urinary Tract Health Education"
    ]
  },
  {
    slug: "blood-pressure-testing",
    title: "Blood Pressure Testing",
    cat: "Cardiovascular NHS Care",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&q=80",
    desc: "A quick and painless blood pressure check to help monitor your heart health and identify high blood pressure before it causes serious problems.",
    duration: "10 Mins",
    features: [
      "Accurate Clinician Measurements",
      "Hypertension & Cardiovascular Risk Check",
      "Lifestyle & Diet Recommendations",
      "Direct GP Referrals for High Readings",
      "Ambulatory Blood Pressure Monitoring (ABPM) Advice"
    ]
  },
  {
    slug: "contraception-service",
    title: "Contraception & Emergency Contraception",
    cat: "Sexual Health NHS Care",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=600&q=80",
    desc: "Confidential advice on contraception options, emergency contraception, and ongoing reproductive health support from our experienced pharmacy team.",
    duration: "15 Mins",
    features: [
      "Confidential Sexual Health Consultations",
      "Emergency Contraceptive Supply (Morning After Pill)",
      "Ongoing Oral Contraceptive Advice",
      "Safe Sex & STD Prevention Guidance",
      "Discreet & Professional Environment"
    ]
  },
  {
    slug: "seasonal-flu-vaccination",
    title: "Seasonal Flu Vaccination (NHS & Private)",
    cat: "Immunization Care",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Protect yourself and your family against seasonal flu with our safe, convenient, and professionally administered flu vaccination service.",
    duration: "10 Mins",
    features: [
      "Certified Immunizing Pharmacists",
      "Latest Quadrivalent Flu Vaccines",
      "NHS-Funded for Eligible Groups",
      "Private Walk-in/Pre-booked Options",
      "Safe & Hygienic Clinic Rooms"
    ]
  },
  {
    slug: "covid-vaccination",
    title: "COVID-19 Vaccination (NHS & Private)",
    cat: "Immunization Care",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Stay protected against COVID-19 with the latest recommended vaccines, administered by trained healthcare professionals.",
    duration: "10 Mins",
    features: [
      "Latest Approved Variant Boosters",
      "NHS-Funded for Eligible Cohorts",
      "Private Vaccinations Available",
      "Certified Healthcare Administrators",
      "Digital Vaccination Logs update"
    ]
  },
  {
    slug: "meningitis-b-vaccination",
    title: "Meningitis B Vaccination (NHS & Private)",
    cat: "Immunization Care",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=600&q=80",
    desc: "Help protect yourself or your child against Meningitis B with a safe and effective vaccination delivered by our qualified pharmacy team.",
    duration: "15 Mins",
    features: [
      "Meningococcal Group B Defense",
      "Child & Adult Dosing Protocols",
      "NHS and Private Dosing Options",
      "Fully Qualified Clinical Delivery",
      "Pre-Vaccination Health Checks"
    ]
  },

  // --- Travel Clinic Vaccinations ---
  {
    slug: "chikungunya-vaccine",
    title: "Chikungunya Vaccine",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Protection against mosquito-borne Chikungunya virus for travellers visiting affected regions.",
    duration: "15 Mins",
    features: [
      "Chikungunya Protection",
      "Mosquito Avoidance Advice",
      "Single-Dose Vaccination Protocol",
      "Pre-Travel Assessment Included",
      "Pharmacist Administered"
    ]
  },
  {
    slug: "cholera-vaccine",
    title: "Cholera Vaccine",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=600&q=80",
    desc: "Recommended for travellers visiting areas where cholera is present, providing protection against severe diarrhoeal disease.",
    duration: "10 Mins",
    features: [
      "Dukoral Oral Suspension Course",
      "Gut Mucosal Immunity Stimulation",
      "Highly Recommended for Aid Workers",
      "Protects against Severe Diarrhoea",
      "Full Dose-Plan Explanation"
    ]
  },
  {
    slug: "dengue-fever-vaccine",
    title: "Dengue Fever Vaccine",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=600&q=80",
    desc: "Vaccination for eligible travellers at risk of dengue infection in endemic countries.",
    duration: "15 Mins",
    features: [
      "Dengue Virus Protection",
      "Multi-Dose Immunization Course",
      "Recommended for Tropical Regions",
      "Clinician Suitability Assessment",
      "Certified Vaccine Passport Entry"
    ]
  },
  {
    slug: "dtp-vaccine",
    title: "DTP Vaccine",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Protects against Diphtheria, Tetanus, and Polio, essential for many international destinations.",
    duration: "15 Mins",
    features: [
      "3-in-1 Combined Booster Formulation",
      "Provides Up to 10 Years of Immunity",
      "Essential for International Travel",
      "Same-Day Admin Availability",
      "Official Certification Provided"
    ]
  },
  {
    slug: "mmr-vaccine",
    title: "MMR Vaccine",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "Provides protection against Measles, Mumps, and Rubella for travellers who require immunisation.",
    duration: "15 Mins",
    features: [
      "Measles, Mumps & Rubella Combined",
      "Highly Recommended for Students/Travelers",
      "Multi-Dose Lifelong Immunity Course",
      "Clinical Suitability Check",
      "Certified Dosing Entries"
    ]
  },
  {
    slug: "hepatitis-a-vaccine",
    title: "Hepatitis A Vaccine",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80",
    desc: "Protects against Hepatitis A, commonly spread through contaminated food and water while travelling.",
    duration: "15 Mins",
    features: [
      "Contaminated Food/Water Pathogen Protection",
      "Two-Dose Schedule for Lifetime Immunity",
      "Highly Recommended for Tropics",
      "Minimal Side Effects",
      "Post-Vaccination Advice"
    ]
  },
  {
    slug: "hepatitis-b-vaccine",
    title: "Hepatitis B Vaccine",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
    desc: "Recommended for travellers at increased risk of exposure through healthcare, work, or extended stays abroad.",
    duration: "15 Mins",
    features: [
      "Blood-Borne Pathogen Defense",
      "Three-Dose Standard Protocol",
      "Essential for Long Stays/Healthcare Workers",
      "Pre-Vaccination Status Review",
      "Registered Pharmacist Administered"
    ]
  },
  {
    slug: "japanese-encephalitis-vaccine",
    title: "Japanese Encephalitis Vaccine",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "Protection against a mosquito-borne viral infection found in parts of Asia and the Western Pacific.",
    duration: "15 Mins",
    features: [
      "Mosquito-Borne Brain Infection Shield",
      "2-Dose Primary Vaccination Series",
      "Highly Recommended for Rural Stays in Asia",
      "Detailed Bug Protection Advice",
      "Certification Provided"
    ]
  },
  {
    slug: "meningitis-acwy-vaccine",
    title: "Meningitis ACWY Vaccine",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=600&q=80",
    desc: "Required for travel to certain countries and recommended for pilgrims attending Hajj and Umrah.",
    duration: "15 Mins",
    features: [
      "Protects Against 4 Meningococcal Strains",
      "Official Hajj/Umrah Certificate Included",
      "Mandatory for Certain University Visas",
      "Provides 5 Years of Immunity",
      "Safe Clinical Delivery"
    ]
  },
  {
    slug: "meningitis-vaccine",
    title: "Meningitis Vaccine",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=600&q=80",
    desc: "Provides protection against serious meningococcal disease for eligible travellers.",
    duration: "15 Mins",
    features: [
      "Meningococcal Disease Prevention",
      "Fast Antibody Production",
      "Recommended for High-Risk Regions",
      "Accredited Pharmacist Injection",
      "Detailed Travel Care Guidance"
    ]
  },
  {
    slug: "rabies-vaccine",
    title: "Rabies Vaccine",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Recommended for travellers visiting high-risk areas or those likely to come into contact with animals.",
    duration: "15 Mins",
    features: [
      "Pre-Exposure Rabies Defense Program",
      "3-Dose Standard Injection Course",
      "Highly Critical for Remote Wilderness Travel",
      "Simplifies Emergency Post-Bite Therapy",
      "WHO-Validated Delivery"
    ]
  },
  {
    slug: "tick-borne-encephalitis-vaccine",
    title: "Tick-Borne Encephalitis Vaccine",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80",
    desc: "Protection against viral infections transmitted by tick bites in parts of Europe and Asia.",
    duration: "15 Mins",
    features: [
      "Central Nervous System Virus Defense",
      "Recommended for Forest/Outdoor Activities",
      "Course of 2 to 3 Injections",
      "Tick Removal/Bite Prevention Tips",
      "Safe Clinical Administration"
    ]
  },
  {
    slug: "typhoid-vaccine",
    title: "Typhoid Vaccine",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "Helps protect against typhoid fever, particularly when travelling to areas with poor sanitation.",
    duration: "15 Mins",
    features: [
      "Salmonella Typhi Prevention",
      "Injectable or Oral Course Availability",
      "3 Years of Active Protection",
      "Essential for Developing Countries",
      "Food & Water Safety Counseling"
    ]
  },
  {
    slug: "yellow-fever-vaccine",
    title: "Yellow Fever Vaccine",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1500835595300-478db374780d?w=600&q=80",
    desc: "Official Yellow Fever vaccination with certification available for countries where proof of vaccination is required.",
    duration: "20 Mins",
    features: [
      "Official WHO ICVP Certificate Issued",
      "Lifetime Immunity with Single Dose",
      "Mandatory Entry Requirement for Select Countries",
      "Certified Yellow Fever Centre Oversight",
      "Travel Health Risk Consulting"
    ]
  },
  {
    slug: "malaria-tablets",
    title: "Malaria Tablets",
    cat: "Travel Prevention",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=600&q=80",
    desc: "Expert travel consultation with personalised malaria prevention advice and prescription of suitable antimalarial medication based on your destination.",
    duration: "15 Mins",
    features: [
      "Personalised Antimalarial Prescription",
      "Destination-Specific Drug Matching",
      "Complete Side-Effect/Dosing Advice",
      "Mosquito Bite Prevention Education",
      "No GP Prescription Required"
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
    content: "Address: West Chemist, 4 Kingsley Park Terrace, Northampton, NN2 7HG. Phone: (01604) 713297. Email: info@westchemist.co.uk. Opening Hours: Monday - Friday: 8.30am-6.30pm, Saturday: 9am - 2.00pm, Sunday: 9am-12pm.",
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

    // 1. Delete obsolete services
    const allDbServices = await Service.find();
    for (const dbSrv of allDbServices) {
      const stillExists = defaultServices.some(ds => ds.slug === dbSrv.slug);
      if (!stillExists) {
        await dbSrv.deleteOne();
        console.log(`🗑️ [Database Migration] Deleted obsolete service: ${dbSrv.title}`);
      }
    }

    // 2. Insert or Update all defaultServices
    for (const srv of defaultServices) {
      const exists = await Service.findOne({ slug: srv.slug });
      if (exists) {
        exists.title = srv.title;
        exists.cat = srv.cat;
        exists.parentCategory = srv.parentCategory;
        exists.img = srv.img;
        exists.desc = srv.desc;
        exists.duration = srv.duration;
        exists.features = srv.features;
        if (typeof srv.color !== 'undefined') exists.color = srv.color;
        if (typeof srv.onHome !== 'undefined') exists.onHome = srv.onHome;
        await exists.save();
        console.log(`🔄 [Database Migration] Updated service: ${srv.title}`);
      } else {
        await Service.create(srv);
        console.log(`💎 [Database Migration] Seeded new service: ${srv.title}`);
      }
    }

    // 3. Make sure all categories & parentCategory match defaultServices
    const updatedServices = await Service.find();
    for (const srv of updatedServices) {
      const template = defaultServices.find(ds => ds.slug === srv.slug);
      if (template) {
        srv.cat = template.cat;
        srv.parentCategory = template.parentCategory;
        await srv.save();
      }
    }
    console.log(" [Database Migration] Restored detailed categories and populated parentCategory.");

    const pageCount = await PageContent.countDocuments();
    if (pageCount === 0) {
      await PageContent.insertMany(defaultPages);
      console.log(` [Database Seeding] Successfully seeded ${defaultPages.length} default page contents.`);
    }

    // Ensure clinic-hours document exists
    let clinicHours = await PageContent.findOne({ key: 'clinic-hours' });
    if (!clinicHours) {
      await PageContent.create({
        key: 'clinic-hours',
        title: 'Clinic Opening Hours',
        content: 'Monday - Friday: 8.30am-6.30pm\nSaturday: 9am - 2.00pm\nSunday: 9am-12pm',
        section: 'general',
        metadata: {
          mon_fri: '8.30am-6.30pm',
          sat: '9am - 2.00pm',
          sun: '9am-12pm'
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
