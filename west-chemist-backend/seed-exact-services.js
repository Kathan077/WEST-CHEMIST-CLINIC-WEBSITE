// Load environment variables first
require('dotenv').config();

const mongoose = require('mongoose');
const Service = require('./models/Service');
const Category = require('./models/Category');

const exactServices = [
  // --- Private Services ---
  {
    slug: "period-delay",
    title: "Period delay service",
    cat: "Women's Health",
    parentCategory: "Private Services",
    img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=600&q=80",
    desc: "Discreet consultation and same-day prescription medication (Norethisterone) to safely postpone your period for holidays, special events, or travel.",
    duration: "15 Mins",
    features: [
      "Private consultation with trained practitioners",
      "Assessment of suitability",
      "Direct prescription issued if safe",
      "Tailored administration guidance"
    ],
    color: "#4B2D71",
    onHome: true
  },
  // --- Weight Loss Services ---
  {
    slug: "mounjaro",
    title: "Mounjaro Injections",
    cat: "Weight Loss",
    parentCategory: "Weight Loss",
    img: "/images/mounjaro_pen.png",
    desc: "Breakthrough once-weekly dual GIP & GLP-1 injection clinically proven to deliver up to 20.9% average weight reduction with continuous guidance from trained practitioners.",
    duration: "45 Mins",
    features: [
      "Once-weekly subcutaneous injection",
      "Dual hormone GIP/GLP-1 activation",
      "Average weight reduction up to 20.9%",
      "Dosage titration led by trained practitioners"
    ],
    color: "#4338ca",
    onHome: true
  },
  {
    slug: "wegovy",
    title: "Wegovy Injections",
    cat: "Weight Loss",
    parentCategory: "Weight Loss",
    img: "/images/wegovy_pen.png",
    desc: "Clinically proven once-weekly semaglutide injection that mimics natural fullness hormones to curb appetite and control portions, supported by trained practitioners.",
    duration: "30 Mins",
    features: [
      "Once-weekly subcutaneous injection",
      "Mimics natural satiety GLP-1 hormone",
      "Average weight loss of 15% of body weight",
      "Comprehensive lifestyle & nutritional support"
    ],
    color: "#1a6b5c",
    onHome: true
  },
  {
    slug: "wegovy-pills",
    title: "Wegovy Pills",
    cat: "Weight Loss",
    parentCategory: "Weight Loss",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "Convenient daily oral GLP-1 tablet therapy providing effective appetite regulation and steady weight reduction for patients preferring a needle-free option under trained practitioners.",
    duration: "15 Mins",
    features: [
      "Daily oral capsule option",
      "Regulates appetite & food intake",
      "PHARMACY health & BMI monitoring",
      "In-clinic prescribing & dispensing"
    ],
    color: "#b45309",
    onHome: true
  },
  {
    slug: "ear-wax-removal",
    title: "Ear Wax Removal service",
    cat: "Pharmaceutical Ear Care",
    parentCategory: "Private Services",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
    desc: "Gentle, water-free microsuction performed under HD video otoscopy for instant, safe relief from earwax build-up, blocked ears, and muffled hearing.",
    duration: "30 Mins",
    features: [
      "High-definition video otoscopy review",
      "Gentle water-free microsuction method",
      "Accredited PHARMACY practitioners",
      "Immediate pressure and hearing relief"
    ],
    color: "#FF6B35",
    onHome: true
  },
  {
    slug: "cryotherapy",
    title: "Cryotherapy service",
    cat: "Pharmaceutical Dermatology",
    parentCategory: "Private Services",
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
    desc: "Targeted sub-zero cryotherapy for fast, pain-free removal of stubborn warts, verrucas, and skin tags — restoring clear skin with no downtime.",
    duration: "15 Mins",
    features: [
      "Precise PHARMACY-grade freezing pens",
      "Effective skin lesion removal",
      "Minimal downtime and scarring risk",
      "Dermatological tissue suitability checks"
    ],
    color: "#2D5A27",
    onHome: true
  },
  {
    slug: "travel-clinic",
    title: "Travel Clinic",
    cat: "Travel Health & Vaccinations",
    parentCategory: "Private Services",
    img: "https://images.unsplash.com/photo-1500835595300-478db374780d?w=600&q=80",
    desc: "Personalised destination health assessments, travel vaccinations, and prescription antimalarials to ensure complete protection for your upcoming journey.",
    duration: "30 Mins",
    features: [
      "Individualized itinerary risk assessment",
      "Complete vaccine portfolio in-stock",
      "Official certification and booklets",
      "Malaria prophylaxis options detailed"
    ],
    color: "#4B2D71",
    onHome: true
  },

  // --- NHS Services ---
  {
    slug: "nhs-ear-ache-1-17",
    title: "Ear Ache treatment and advice for 1-17 year old",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
    desc: "Free NHS PHARMACY otoscopic ear assessment and prescription treatment (if indicated) for children aged 1 to 17 under Pharmacy First.",
    duration: "15-20 Mins",
    features: [
      "Otoscope ear inspection by trained practitioners",
      "Symptom and fever scoring",
      "NHS fully funded diagnostic check",
      "Antibiotics dispensed if criteria met"
    ]
  },
  {
    slug: "nhs-impetigo",
    title: "Impetigo Treatment",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "Fast clinical assessment and prescription antibiotics or creams to clear bacterial skin sores without a GP appointment.",
    duration: "15 Mins",
    features: [
      "Private skin assessment",
      "Topical or oral prescription antibiotics",
      "NHS Pharmacy First fully funded",
      "Contagion advice and prevention guidelines"
    ]
  },
  {
    slug: "nhs-infected-insect-bites",
    title: "Infected Insect bites treatment",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=600&q=80",
    desc: "Clinical review to treat secondary bacterial bite infections, with rapid prescription antibiotics to prevent spreading.",
    duration: "15 Mins",
    features: [
      "Local skin swelling and infection review",
      "Antihistamine and pain management tips",
      "Prescription antibiotics where indicated",
      "NHS Pharmacy First funded service"
    ]
  },
  {
    slug: "nhs-shingles",
    title: "Shingles treatment",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "Urgent clinical assessment and prescription antiviral medication to halt rash progression and relieve nerve pain.",
    duration: "15 Mins",
    features: [
      "Urgent PHARMACY rash evaluation",
      "Prescription antivirals within key window",
      "Neuralgia risk prevention advice",
      "NHS Pharmacy First funded service"
    ]
  },
  {
    slug: "nhs-sinusitis",
    title: "Sinusitis treatment",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
    desc: "Expert evaluation for persistent sinus pain and congestion, providing prescription sprays or antibiotics for fast relief.",
    duration: "15 Mins",
    features: [
      "Sinus pressure and symptom duration check",
      "Nasal spray and steroid option assessment",
      "Antibiotic treatments if PHARMACYly indicated",
      "NHS Pharmacy First funded service"
    ]
  },
  {
    slug: "nhs-sore-throat",
    title: "Sore Throat treatment",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80",
    desc: "Clinical FeverPAIN throat assessment with immediate prescription antibiotics dispensed for confirmed bacterial infections.",
    duration: "10 Mins",
    features: [
      "FeverPAIN diagnostic score assessment",
      "PHARMACY swab verification if needed",
      "Direct antibiotic prescribing if positive",
      "NHS Pharmacy First funded service"
    ]
  },
  {
    slug: "nhs-uti",
    title: "Urinary Tract infection treatment service",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=600&q=80",
    desc: "Confidential same-day assessment and prescription antibiotic treatment for uncomplicated cystitis in women aged 16–64.",
    duration: "15 Mins",
    features: [
      "Confidential urine sample evaluation",
      "Diagnostics by trained practitioners",
      "Immediate antibiotic dispensing if suitable",
      "NHS Pharmacy First fully funded"
    ]
  },
  {
    slug: "nhs-blood-pressure",
    title: "Blood pressure testing",
    cat: "NHS Advanced Care",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&q=80",
    desc: "Free NHS cardiovascular check in a private room, with on-the-spot readings and free 24-hour ambulatory monitoring.",
    duration: "10 Mins",
    features: [
      "Validated PHARMACY sphygmomanometers",
      "Lifestyle and heart health guidance",
      "Direct GP integration for elevated levels",
      "Fully funded NHS screening service"
    ]
  },
  {
    slug: "nhs-contraception",
    title: "Contraception and Emergency contraception service",
    cat: "NHS Advanced Care",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=600&q=80",
    desc: "Free NHS emergency hormonal contraception (morning after pill) and routine oral contraception consultation and supply.",
    duration: "15 Mins",
    features: [
      "Confidential sexual health consultation",
      "Emergency contraceptive pill options",
      "Routine pill supply and check-ups",
      "Fully funded NHS advanced service"
    ]
  },
  {
    slug: "nhs-flu-vaccination",
    title: "NHS and Private Seasonal Flu vaccination service",
    cat: "Immunization Care",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Protect yourself against seasonal influenza with our professional NHS-funded and private flu vaccination services.",
    duration: "10 Mins",
    features: [
      "Quadrivalent seasonal vaccines",
      "Free NHS vaccine for eligible cohorts",
      "Rapid private vaccination option",
      "Delivery by trained practitioners"
    ]
  },
  {
    slug: "nhs-covid-vaccination",
    title: "NHS and Private Covid Vaccination service",
    cat: "Immunization Care",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Stay protected against COVID-19 with the latest booster vaccinations, available for eligible NHS groups and private bookings.",
    duration: "10 Mins",
    features: [
      "Latest approved covid vaccine variants",
      "NHS and private vaccine slots",
      "Safe, sterile PHARMACY environment",
      "Administration by trained practitioners"
    ]
  },
  {
    slug: "nhs-meningitis-b",
    title: "NHS and Private Meningitis B vaccination service",
    cat: "Immunization Care",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=600&q=80",
    desc: "Effective immunization safeguarding against Group B meningococcal disease, available for childhood schedule booster or private requests.",
    duration: "15 Mins",
    features: [
      "High-efficacy meningococcal B defense",
      "Pediatric and adult pharmaceutical care",
      "NHS scheduling and private bookings",
      "Post-vaccine counseling and advice"
    ]
  },

  // --- Travel Clinic Vaccines ---
  {
    slug: "travel-chikungunya",
    title: "Chikungunya",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Single-dose vaccine protecting against mosquito-borne Chikungunya virus, preventing debilitating joint pain and fever in endemic tropical destinations.",
    duration: "15 Mins",
    features: [
      "Advanced immunization formulation",
      "Single-dose injection protocol",
      "Fever and joint pain protection details",
      "Mosquito bite avoidance advice"
    ]
  },
  {
    slug: "travel-cholera",
    title: "Cholera",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?w=600&q=80",
    desc: "Drinkable oral vaccine (Dukoral) providing vital protection against cholera and severe traveler's diarrhea in areas with compromised water sanitation.",
    duration: "10 Mins",
    features: [
      "Needle-free drinkable oral vaccine",
      "Protects against Vibrio cholerae",
      "Cross-protection for ETEC travelers diarrhea",
      "2-dose standard schedule"
    ]
  },
  {
    slug: "travel-dengue-fever",
    title: "Dengue fever",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Modern 2-dose vaccine (Qdenga) protecting against all four mosquito-borne dengue virus strains in tropical travel destinations.",
    duration: "15 Mins",
    features: [
      "Living attenuated dengue vaccine option",
      "2-dose schedule for travel preparation",
      "Mitigates severe dengue hemorrhagic risks",
      "Comprehensive tropical safety tips"
    ]
  },
  {
    slug: "travel-dtp",
    title: "DTP",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Combined 3-in-1 booster vaccine reinforcing 10-year active immunity against tetanus, diphtheria, and polio before traveling abroad.",
    duration: "15 Mins",
    features: [
      "3-in-1 combined routine booster",
      "10-year active immunization coverage",
      "Highly recommended for sanitation risk travel",
      "Official immunization book records"
    ]
  },
  {
    slug: "travel-mmr",
    title: "MMR",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "Combined booster vaccine closing immunity gaps and safeguarding against highly contagious measles outbreaks during international travel.",
    duration: "15 Mins",
    features: [
      "Combined vaccine formulation",
      "Essential protection for group travel",
      "Fills childhood immunization gaps",
      "Delivery by trained practitioners"
    ]
  },
  {
    slug: "travel-hepatitis-a",
    title: "Hepatitis A",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80",
    desc: "Fast-acting pre-travel vaccine protecting against contaminated food and water, providing long-lasting immunity for up to 25 years with a booster.",
    duration: "15 Mins",
    features: [
      "Highly effective travel vaccine",
      "Provides rapid protective antibodies",
      "Long-term booster schedule available",
      "Food and water safety recommendations"
    ]
  },
  {
    slug: "travel-hepatitis-b",
    title: "Hepatitis B",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
    desc: "Essential protective vaccine series safeguarding against blood and fluid transmission for extended stays, healthcare work, and adventure travel abroad.",
    duration: "15 Mins",
    features: [
      "3-dose standard immunization series",
      "Provides lifetime immunity",
      "Crucial for high-risk occupations and procedures",
      "Professional safety check"
    ]
  },
  {
    slug: "travel-japanese-encephalitis",
    title: "Japanese encephalitis",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "2-dose vaccine providing reliable defense against mosquito-borne encephalitis for travellers spending time in rural and agricultural parts of Asia.",
    duration: "20 Mins",
    features: [
      "2-dose primary series",
      "Recommended for rice-paddy and rural zone travel",
      "Guards against viral mosquito encephalitis",
      "Expert safety advice"
    ]
  },
  {
    slug: "travel-meningitis-acwy",
    title: "Meningitis ACWY",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=600&q=80",
    desc: "Official quadrivalent vaccine with stamped certification required for Hajj, Umrah pilgrimages, and international university admissions.",
    duration: "20 Mins",
    features: [
      "Official certificate issued for visa purposes",
      "Protects against strains A, C, W, Y",
      "Fast, high-potency conjugate vaccine",
      "Complies with international health requests"
    ]
  },
  {
    slug: "travel-meningitis",
    title: "Meningitis",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=600&q=80",
    desc: "Specialist meningococcal vaccination providing robust defense against invasive bacterial meningitis strains before international group travel.",
    duration: "15 Mins",
    features: [
      "Strengthens meningococcal immunity",
      "Recommended for students entering halls",
      "Clean PHARMACY injection",
      "Official vaccine booklet records"
    ]
  },
  {
    slug: "travel-rabies",
    title: "Rabies",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "3-dose preventative immunization course protecting against the fatal rabies virus in high-risk regions with stray animal and wildlife exposure.",
    duration: "20 Mins",
    features: [
      "3-dose pre-exposure vaccination protocol",
      "Essential for bat/mammal interaction risks",
      "Reduces urgent post-bite medical needs",
      "Full post-bite emergency guidance"
    ]
  },
  {
    slug: "travel-tick-borne-encephalitis",
    title: "Tick-borne encephalitis",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80",
    desc: "Specialist preventative vaccine protecting against tick bites in rural forests, woodlands, and hiking trails across Central and Eastern Europe.",
    duration: "20 Mins",
    features: [
      "Guards against TBE virus",
      "Highly recommended for forestry/camping",
      "Standard and rapid course plans",
      "Tick removal and check education"
    ]
  },
  {
    slug: "travel-typhoid",
    title: "Typhoid",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "High-efficacy single-dose immunization protecting against food- and water-borne typhoid bacteria across South Asia, Africa, and South America.",
    duration: "15 Mins",
    features: [
      "Injectable single-dose protection",
      "3-year active typhoid immunity",
      "Essential pre-travel vaccine setup",
      "Administered by travel health experts"
    ]
  },
  {
    slug: "travel-yellow-fever",
    title: "Yellow fever",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Official single-dose yellow fever vaccination with mandatory WHO certificate (ICVP), providing lifelong immunity for international border entry.",
    duration: "20 Mins",
    features: [
      "Certified Yellow Fever Centre administration",
      "Official ICVP certificate card provided",
      "Lifetime immunity validation",
      "Mandatory for many tropical countries"
    ]
  },
  {
    slug: "travel-malaria-tablets",
    title: "Malaria tablets",
    cat: "Travel Medication",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=600&q=80",
    desc: "Clinical consultation and prescription antimalarial tablets (such as Atovaquone/Proguanil or Doxycycline) matched to your destination's risk profile.",
    duration: "15 Mins",
    features: [
      "PHARMACY choice of suitable antimalarials",
      "Calculated dosing matching travel timeline",
      "Side effect profile overview",
      "Direct dispensing of prophylaxis medication"
    ]
  }
];

const seedExactServices = async () => {
  try {
    // 1. Connect to DB
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      throw new Error('MONGODB_URI is not defined in the environment variables.');
    }
    console.log(`🔌 Connecting to MongoDB for seeding exact services...`);
    await mongoose.connect(connStr);
    console.log(`📡 MongoDB connected successfully.`);

    // 2. Ensure Categories Exist
    console.log(`📂 Seeding parent categories...`);
    const defaultCategories = [
      { name: "NHS Services (Pharmacy First)", slug: "nhs-services-pharmacy-first" },
      { name: "Private Services", slug: "private-services" },
      { name: "Travel Clinic", slug: "travel-clinic" }
    ];
    const deleteCatCount = await Category.deleteMany({});
    console.log(`   🗑️ Cleared ${deleteCatCount.deletedCount} existing categories from database.`);

    for (const cat of defaultCategories) {
      await Category.create(cat);
      console.log(`   ✅ Created category: ${cat.name}`);
    }

    // 3. Insert Services
    console.log(`📦 Seeding exact requested services...`);
    // Delete existing services to guarantee exactly these are shown
    const deleteCount = await Service.deleteMany({});
    console.log(`   🗑️ Cleared ${deleteCount.deletedCount} existing services from database.`);

    const insertResult = await Service.insertMany(exactServices);
    console.log(`   🎉 Successfully seeded ${insertResult.length} exact services into MongoDB!`);

    mongoose.connection.close();
    console.log(`🔌 Mongoose connection closed cleanly.`);
  } catch (error) {
    console.error(`❌ Error seeding exact services:`, error.message);
    process.exit(1);
  }
};

seedExactServices();

