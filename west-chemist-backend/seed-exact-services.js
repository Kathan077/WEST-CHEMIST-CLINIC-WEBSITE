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
    desc: "Professional private consultation and prescription for delaying your period, ideal for holidays, exams, or special events.",
    duration: "15 Mins",
    features: [
      "Private clinician consultation",
      "Assessment of suitability",
      "Direct prescription issued if safe",
      "Tailored administration guidance"
    ],
    color: "#4B2D71",
    onHome: true
  },
  {
    slug: "weight-loss-management",
    title: "Weight loss management service",
    cat: "Medical Weight Loss",
    parentCategory: "Private Services",
    img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80",
    desc: "Clinical guidance and treatment plans including Wegovy (semaglutide) injections for effective and safe weight loss management.",
    duration: "30 Mins",
    features: [
      "Once-weekly injection options",
      "Clinically proven GLP-1 hormone therapy",
      "Continuous health and weight monitoring",
      "Appetite regulation and nutritional guidance"
    ],
    color: "#008473",
    onHome: true
  },
  {
    slug: "ear-wax-removal",
    title: "Ear Wax Removal service",
    cat: "Clinical Ear Care",
    parentCategory: "Private Services",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
    desc: "Safe and effective ear wax removal using gentle microsuction techniques performed by qualified clinical specialists.",
    duration: "30 Mins",
    features: [
      "High-definition video otoscopy review",
      "Gentle water-free microsuction method",
      "Accredited clinical practitioners",
      "Immediate pressure and hearing relief"
    ],
    color: "#FF6B35",
    onHome: true
  },
  {
    slug: "cryotherapy",
    title: "Cryotherapy service",
    cat: "Clinical Dermatology",
    parentCategory: "Private Services",
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
    desc: "Professional freezing treatments for rapid and safe removal of warts, verrucae, skin tags, and benign skin lesions.",
    duration: "15 Mins",
    features: [
      "Precise clinical-grade freezing pens",
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
    desc: "Destination-specific travel risk assessments, routine travel vaccinations, malaria prophylaxis, and certified health advice.",
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
    desc: "Free NHS clinical otoscopic ear assessment and prescription treatment (if indicated) for children aged 1 to 17 under Pharmacy First.",
    duration: "15-20 Mins",
    features: [
      "Otoscope ear inspection by pharmacist",
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
    desc: "Free NHS assessment and prescription treatment for impetigo, a common contagious bacterial skin infection.",
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
    desc: "Free NHS assessment and prescription antibiotic treatment for infected insect or spider bites.",
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
    desc: "Free NHS clinical assessment and rapid antiviral prescribing (if appropriate) for shingles to reduce pain and complications.",
    duration: "15 Mins",
    features: [
      "Urgent clinical rash evaluation",
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
    desc: "Free NHS assessment and relief for nasal congestion and facial pain caused by acute sinusitis, including prescription options.",
    duration: "15 Mins",
    features: [
      "Sinus pressure and symptom duration check",
      "Nasal spray and steroid option assessment",
      "Antibiotic treatments if clinically indicated",
      "NHS Pharmacy First funded service"
    ]
  },
  {
    slug: "nhs-sore-throat",
    title: "Sore Throat treatment",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80",
    desc: "Free NHS FeverPAIN evaluation and clinical throat swabs, with prescribing of antibiotics for confirmed bacterial sore throats.",
    duration: "10 Mins",
    features: [
      "FeverPAIN diagnostic score assessment",
      "Clinical swab verification if needed",
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
    desc: "Free NHS Pharmacy First private consultation and prescription antibiotic treatment for uncomplicated UTIs in women aged 16-64.",
    duration: "15 Mins",
    features: [
      "Confidential urine sample evaluation",
      "Accredited pharmacist diagnostics",
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
    desc: "Free NHS cardiovascular blood pressure checks and ambulatory monitoring to identify and prevent hypertension risks.",
    duration: "10 Mins",
    features: [
      "Validated clinical sphygmomanometers",
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
      "Qualified immunizing pharmacists"
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
      "Safe, sterile clinical environment",
      "Certified pharmacist administration"
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
      "Pediatric and adult clinical care",
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
    desc: "Vaccination against the mosquito-borne Chikungunya virus, recommended for travelers heading to active transmission areas.",
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
    desc: "Drinkable oral cholera vaccine providing defense against cholera and ETEC traveler's diarrhea.",
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
    desc: "Protection against the Dengue virus transmitted by mosquitoes, recommended for high-risk or frequent travelers.",
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
    desc: "Booster vaccination ensuring protection against Diphtheria, Tetanus, and Polio.",
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
    desc: "Protect against Measles, Mumps, and Rubella before embarking on international travel.",
    duration: "15 Mins",
    features: [
      "Combined vaccine formulation",
      "Essential protection for group travel",
      "Fills childhood immunization gaps",
      "Certified nurse/pharmacist delivery"
    ]
  },
  {
    slug: "travel-hepatitis-a",
    title: "Hepatitis A",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80",
    desc: "Shield yourself against Hepatitis A, a food and water-borne viral infection.",
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
    desc: "Prevent blood-borne viral Hepatitis B infection, recommended for long-term travel or clinical exposure.",
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
    desc: "Secure protection against Japanese Encephalitis, recommended for rural or outdoor stays in Asia.",
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
    desc: "Mandatory Hajj, Umrah, and student travel vaccination against four deadly strains of meningitis.",
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
    desc: "General meningococcal defense boosting your immune response before international study or travel.",
    duration: "15 Mins",
    features: [
      "Strengthens meningococcal immunity",
      "Recommended for students entering halls",
      "Clean clinical injection",
      "Official vaccine booklet records"
    ]
  },
  {
    slug: "travel-rabies",
    title: "Rabies",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    desc: "Essential pre-exposure immunization against rabies for travel to remote or animal-dense areas.",
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
    desc: "Critical vaccine defense against Tick-Borne Encephalitis for outdoor activities in European forests.",
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
    desc: "Protection against typhoid fever, highly recommended for travel to South Asia and Africa.",
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
    desc: "Critical yellow fever vaccination, complete with official International Certificate of Vaccination (ICVP).",
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
    desc: "Clinical consulting and prescription of malaria prophylaxis tablets (Atovaquone/Proguanil, Doxycycline, Lariam) for travel to malaria-endemic zones.",
    duration: "15 Mins",
    features: [
      "Clinical choice of suitable antimalarials",
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
