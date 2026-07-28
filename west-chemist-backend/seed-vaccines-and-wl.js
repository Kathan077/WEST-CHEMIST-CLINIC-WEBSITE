require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

const defaultServices = [
  // --- Weight Loss ---
  {
    slug: 'mounjaro',
    title: 'Mounjaro Injections',
    cat: 'Weight Loss',
    parentCategory: 'Weight Loss',
    desc: 'The latest innovation in weight management. A once-weekly injection that acts as a dual GIP and GLP-1 receptor agonist, regulating appetite and slowing digestion for high-efficacy outcomes.',
    duration: '45 Mins',
    features: ['Once-weekly subcutaneous injection', 'Dual hormone GIP/GLP-1 activation', 'Average weight reduction up to 20.9%', 'Full pharmacist-led dosage titration'],
    img: '/images/mounjaro_pen.png',
    color: '#4338ca',
    onHome: true
  },
  {
    slug: 'wegovy',
    title: 'Wegovy Injections',
    cat: 'Weight Loss',
    parentCategory: 'Weight Loss',
    desc: 'A highly trusted, clinically-proven weekly injection. Mimics the GLP-1 hormone to curb hunger, increase fullness, and support portion control under medical guidance.',
    duration: '30 Mins',
    features: ['Once-weekly subcutaneous injection', 'Mimics natural satiety GLP-1 hormone', 'Average weight loss of 15% of body weight', 'Comprehensive lifestyle & nutritional support'],
    img: '/images/wegovy_pen.png',
    color: '#1a6b5c',
    onHome: true
  },
  {
    slug: 'wegovy-pills',
    title: 'Wegovy Pills',
    cat: 'Weight Loss',
    parentCategory: 'Weight Loss',
    desc: 'Oral weight management medication providing appetite regulation and weight loss support for patients preferring tablets over injections.',
    duration: '15 Mins',
    features: ['Daily oral capsule option', 'Regulates appetite & food intake', 'Clinical health & BMI monitoring', 'In-clinic prescribing & dispensing'],
    img: 'https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80',
    color: '#b45309',
    onHome: true
  },
  // --- Vaccinations ---
  {
    title: "Meningitis",
    slug: "vaccine-meningitis",
    desc: "General meningococcal defense boosting your immune response before international study or travel.",
    img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=600&q=80",
    cat: "Vaccination Care",
    parentCategory: "Vaccination Services",
    duration: "15 Mins",
    features: ["Private travel consultation", "Protects against multiple strains", "Required for Hajj and Umrah (ACWY)", "Certified vaccination certificate provided"],
    color: '#4B2D71',
    onHome: true
  },
  {
    title: "Meningitis B Vaccination",
    slug: "nhs-meningitis-b",
    desc: "Highly effective protection against Meningococcal Group B bacteria, recommended for children and young adults.",
    img: "https://images.unsplash.com/photo-1550572017-ed200f5e6399?w=600&q=80",
    cat: "NHS & Private Vaccination",
    parentCategory: "Vaccination Services",
    duration: "15 Mins",
    features: ["Protects against invasive MenB disease", "Recommended for students and toddlers", "Multi-dose schedule for maximum cover", "In-clinic professional administration"],
    color: '#4B2D71',
    onHome: true
  },
  {
    title: "Chickenpox",
    slug: "chickenpox-vaccine",
    desc: "Varicella vaccine providing long-term active immunity against chickenpox and reducing shingles risk later in life.",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    cat: "Routine Immunization",
    parentCategory: "Vaccination Services",
    duration: "15 Mins",
    features: ["Prevents chickenpox infection", "Highly recommended for adults who haven't had it", "Two doses spaced for lifetime defense", "Saves time off work/school"],
    color: '#4B2D71',
    onHome: true
  },
  {
    title: "Chikungunya Vaccine",
    slug: "vaccine-chikungunya",
    desc: "Advanced single-dose protection against the mosquito-borne Chikungunya virus in tropical regions.",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    cat: "Vaccination Care",
    parentCategory: "Vaccination Services",
    duration: "15 Mins",
    features: ["Single-dose travel vaccination", "Highly effective travel protection", "Recommended for tropical destinations", "Expert pharmacist pre-travel assessment"],
    color: '#4B2D71',
    onHome: true
  },
  {
    title: "Shingles",
    slug: "nhs-shingles",
    desc: "Protect yourself against shingles and post-herpetic neuralgia with our professional shingles vaccination.",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    cat: "NHS & Private Services",
    parentCategory: "Vaccination Services",
    duration: "15 Mins",
    features: ["Protects against painful shingles flare-ups", "Reduces risk of chronic nerve pain", "Non-live vaccine suitable for older adults", "Fast, private in-clinic scheduling"],
    color: '#4B2D71',
    onHome: true
  },
  {
    title: "HPV",
    slug: "hpv-vaccine",
    desc: "Gardasil 9 vaccine protecting against nine high-risk strains of HPV-associated cancers and genital warts.",
    img: "https://images.unsplash.com/photo-1579154236594-c199f3768fb9?w=600&q=80",
    cat: "Specialist Immunization",
    parentCategory: "Vaccination Services",
    duration: "15 Mins",
    features: ["Gardasil 9 high-protection vaccine", "Guards against cervical & other cancers", "Recommended for adolescents and young adults", "Professional clinical settings"],
    color: '#4B2D71',
    onHome: true
  },
  {
    title: "Rabies",
    slug: "vaccine-rabies",
    desc: "Essential pre-exposure rabies vaccine protocol for travel to remote, high-risk or animal-dense areas.",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
    cat: "Vaccination Care",
    parentCategory: "Vaccination Services",
    duration: "15 Mins",
    features: ["Pre-exposure vaccine course", "Protects against fatal rabies virus", "Recommended for remote outdoor travel", "Complete post-travel safety guidance"],
    color: '#4B2D71',
    onHome: true
  },
  {
    title: "Hepatitis",
    slug: "vaccine-hepatitis-b",
    desc: "High-potency protection against Hepatitis B virus, recommended for travel, healthcare workers, and high-risk groups.",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    cat: "Vaccination Care",
    parentCategory: "Vaccination Services",
    duration: "15 Mins",
    features: ["Highly effective viral hepatitis defense", "Essential for medical & aid travel", "Multi-dose course for long term cover", "Antibody check advice provided"],
    color: '#4B2D71',
    onHome: true
  },
  {
    title: "Typhoid",
    slug: "vaccine-typhoid",
    desc: "Critical protection against typhoid fever, highly recommended for travel to South Asia, Africa, and South America.",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    cat: "Vaccination Care",
    parentCategory: "Vaccination Services",
    duration: "15 Mins",
    features: ["Protects against food/water-borne typhoid", "Highly recommended for tropical regions", "Single-injection or oral options", "Lasts up to 3 years"],
    color: '#4B2D71',
    onHome: true
  },
  {
    title: "Japanese Encephalitis",
    slug: "vaccine-japanese-encephalitis",
    desc: "Secure protection against Japanese Encephalitis virus spread by infected mosquitoes in rural Asia.",
    img: "https://images.unsplash.com/photo-1584308919139-332c34f370d5?w=600&q=80",
    cat: "Vaccination Care",
    parentCategory: "Vaccination Services",
    duration: "15 Mins",
    features: ["Protects against mosquito-borne encephalitis", "Recommended for rural travel in Asia", "Two-dose schedule for maximum shield", "Pre-travel safety advice included"],
    color: '#4B2D71',
    onHome: true
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    for (const service of defaultServices) {
      const existing = await Service.findOne({ slug: service.slug });
      if (existing) {
        console.log(`Service with slug '${service.slug}' already exists. Updating it...`);
        await Service.updateOne({ slug: service.slug }, service);
      } else {
        console.log(`Service with slug '${service.slug}' not found. Creating it...`);
        await Service.create(service);
      }
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
