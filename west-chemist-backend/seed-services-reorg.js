require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

const alignedServices = [
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
    cat: "Weight Loss",
    parentCategory: "Private Services",
    img: "https://images.unsplash.com/photo-1505751172107-160bf2a35368?w=600&q=80",
    desc: "Integrative health monitoring for patients on our medical weight management programs. Includes regular check-ins, side-effect profiling, dosage updates, and nutritional habit coaching.",
    duration: "15 Mins",
    features: [
      "Monthly face-to-face PHARMACY reviews",
      "Body composition and BMI tracking",
      "Side effect management & mitigation",
      "In-clinic prescribing and repeat dispensing"
    ],
    color: "#1a6b5c",
    onHome: true
  },
  {
    slug: "ear-wax-removal",
    title: "Ear Wax Removal service",
    cat: "PHARMACY Ear Care",
    parentCategory: "Private Services",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
    desc: "Safe and effective ear wax removal using gentle microsuction techniques performed by qualified PHARMACY specialists.",
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
    cat: "PHARMACY Dermatology",
    parentCategory: "Private Services",
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
    desc: "Professional freezing treatments for rapid and safe removal of warts, verrucae, skin tags, and benign skin lesions.",
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
    desc: "Free NHS PHARMACY otoscopic ear assessment and prescription treatment (if indicated) for children aged 1 to 17 under Pharmacy First.",
    duration: "15-20 Mins",
    features: [
      "Otoscope ear inspection by pharmacist",
      "Symptom and fever scoring",
      "NHS fully funded diagnostic check",
      "Antibiotics dispensed if criteria met"
    ],
    color: "#005EB8"
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
    ],
    color: "#005EB8"
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
    ],
    color: "#005EB8"
  },
  {
    slug: "nhs-shingles",
    title: "Shingles treatment",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "Free NHS PHARMACY assessment and rapid antiviral prescribing (if appropriate) for shingles to reduce pain and complications.",
    duration: "15 Mins",
    features: [
      "Urgent PHARMACY rash evaluation",
      "Prescription antivirals within key window",
      "Neuralgia risk prevention advice",
      "NHS Pharmacy First funded service"
    ],
    color: "#005EB8"
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
      "Antibiotic treatments if PHARMACYly indicated",
      "NHS Pharmacy First funded service"
    ],
    color: "#005EB8"
  },
  {
    slug: "nhs-sore-throat",
    title: "Sore Throat treatment",
    cat: "NHS Pharmacy First",
    parentCategory: "NHS Services (Pharmacy First)",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80",
    desc: "Free NHS FeverPAIN evaluation and PHARMACY throat swabs, with prescribing of antibiotics for confirmed bacterial sore throats.",
    duration: "10 Mins",
    features: [
      "FeverPAIN diagnostic score assessment",
      "PHARMACY swab verification if needed",
      "Direct antibiotic prescribing if positive",
      "NHS Pharmacy First funded service"
    ],
    color: "#005EB8"
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
    ],
    color: "#005EB8"
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
      "Validated PHARMACY sphygmomanometers",
      "Lifestyle and heart health guidance",
      "Direct GP integration for elevated levels",
      "Fully funded NHS screening service"
    ],
    color: "#005EB8"
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
    ],
    color: "#005EB8"
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
    ],
    color: "#005EB8"
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
      "Certified pharmacist administration"
    ],
    color: "#005EB8"
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
      "Pediatric and adult PHARMACY care",
      "NHS scheduling and private bookings",
      "Post-vaccine counseling and advice"
    ],
    color: "#005EB8"
  },

  // --- Travel Clinic ---
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
    ],
    color: "#4B2D71"
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
    ],
    color: "#4B2D71"
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
    ],
    color: "#4B2D71"
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
    ],
    color: "#4B2D71"
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
    ],
    color: "#4B2D71"
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
    ],
    color: "#4B2D71"
  },
  {
    slug: "travel-hepatitis-b",
    title: "Hepatitis B",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?w=600&q=80",
    desc: "Prevent blood-borne viral Hepatitis B infection, recommended for long-term travel or PHARMACY exposure.",
    duration: "15 Mins",
    features: [
      "3-dose standard immunization series",
      "Provides lifetime immunity",
      "Crucial for high-risk occupations and procedures",
      "Professional safety check"
    ],
    color: "#4B2D71"
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
    ],
    color: "#4B2D71"
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
    ],
    color: "#4B2D71"
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
      "Clean PHARMACY injection",
      "Official vaccine booklet records"
    ],
    color: "#4B2D71"
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
    ],
    color: "#4B2D71"
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
    ],
    color: "#4B2D71"
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
      "Protects against food/water-borne typhoid",
      "Highly recommended for tropical regions",
      "Single-injection or oral options",
      "Lasts up to 3 years"
    ],
    color: "#4B2D71"
  },
  {
    slug: "travel-yellow-fever",
    title: "Yellow fever",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80",
    desc: "Mandatory yellow fever vaccination and official yellow certificate for travel to tropical Africa and South America.",
    duration: "15 Mins",
    features: [
      "Single-dose live attenuated vaccine",
      "Official WHO Yellow Book certificate issued",
      "Required for entry into many nations",
      "Valid for the life of the traveler"
    ],
    color: "#4B2D71"
  },
  {
    slug: "travel-malaria-tablets",
    title: "Malaria tablets",
    cat: "Travel Immunization",
    parentCategory: "Travel Clinic",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    desc: "Private consultation and prescription for malaria prevention medication tailored to your specific destination.",
    duration: "15 Mins",
    features: [
      "Expert travel risk profile review",
      "Atovaquone/Proguanil (Malarone) prescribing",
      "Doxycycline and Lariam options",
      "Titration and side effect assessment"
    ],
    color: "#4B2D71"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Delete any old duplicate or incorrect entries to prevent double data
    console.log('Deleting duplicate meningitis-b-vaccination-service...');
    await Service.deleteMany({ slug: 'meningitis-b-vaccination-service' });

    for (const service of alignedServices) {
      const existing = await Service.findOne({ slug: service.slug });
      if (existing) {
        console.log(`Updating service '${service.slug}' to align with user list...`);
        await Service.updateOne({ slug: service.slug }, service);
      } else {
        console.log(`Creating service '${service.slug}'...`);
        await Service.create(service);
      }
    }

    console.log('Database reorganization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error organizing database:', error);
    process.exit(1);
  }
}

seed();

