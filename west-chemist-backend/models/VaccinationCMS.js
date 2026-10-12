const mongoose = require('mongoose');

const VaccinationCMSSchema = new mongoose.Schema(
  {
    hero: {
      pillBadge: {
        type: String,
        default: 'Travel & Routine Pharmacy Services'
      },
      titlePrefix: {
        type: String,
        default: 'Pharmacy '
      },
      titleHighlight: {
        type: String,
        default: 'Vaccination Services'
      },
      leadText: {
        type: String,
        default: 'Protect your health at home and abroad. West Chemist offers professional, pharmacist-administered travel vaccines, routine immunisations, and seasonal wellness support in a modern, trusted environment.'
      },
      primaryBtnText: {
        type: String,
        default: 'Book Consultation'
      },
      primaryBtnLink: {
        type: String,
        default: '/book-appointment'
      },
      secondaryBtnText: {
        type: String,
        default: 'Explore Vaccines'
      },
      card1Badge: {
        type: String,
        default: 'World Health Approved'
      },
      card1Title: {
        type: String,
        default: 'Travel Health Service'
      },
      card1Desc: {
        type: String,
        default: 'Yellow Fever, Rabies, Hep A & B, Meningitis ACWY. Certified travel immunisation with official certificates.'
      },
      card2Badge: {
        type: String,
        default: 'NHS & Private'
      },
      card2Title: {
        type: String,
        default: 'Seasonal Wellness'
      },
      card2Desc: {
        type: String,
        default: 'Flu and COVID-19 vaccination program to protect your family and workplace during winter seasons.'
      },
      card3Badge: {
        type: String,
        default: 'Schedule Support'
      },
      card3Title: {
        type: String,
        default: 'Routine Immunisations'
      },
      card3Desc: {
        type: String,
        default: 'Shingles, Chickenpox, HPV, and Pneumonia. Keep your PHARMACY vaccine record up to date under pharmacist care.'
      }
    },
    gridHeader: {
      badge: {
        type: String,
        default: 'Our Protocols'
      },
      title: {
        type: String,
        default: 'Premium Vaccinations'
      },
      desc: {
        type: String,
        default: 'Discover our comprehensive suite of advanced PHARMACY immunizations.'
      }
    },
    process: {
      eyebrow: {
        type: String,
        default: 'Pharmacy Protocol'
      },
      title: {
        type: String,
        default: 'Seamless Immunity.'
      },
      lead: {
        type: String,
        default: "Getting protected shouldn't be complicated. Our 3-step streamlined PHARMACY process ensures you get the right vaccines, fast."
      },
      steps: [
        {
          number: { type: String, default: '01' },
          title: { type: String, default: 'PHARMACY Consultation' },
          description: { type: String, default: 'Review your travel itinerary, medical history, and risk factors with our qualified pharmacists to determine the exact vaccines you need.' }
        },
        {
          number: { type: String, default: '02' },
          title: { type: String, default: 'Secure Administration' },
          description: { type: String, default: 'Receive your vaccinations in our sterile, private PHARMACY rooms. We use advanced, painless techniques to ensure maximum comfort.' }
        },
        {
          number: { type: String, default: '03' },
          title: { type: String, default: 'Certification & Aftercare' },
          description: { type: String, default: 'Get immediate official documentation, including Yellow Fever certificates, along with professional advice on managing any minor side effects.' }
        }
      ]
    },
    faqs: {
      eyebrow: {
        type: String,
        default: 'PHARMACY Knowledge'
      },
      title: {
        type: String,
        default: 'Vaccination FAQ.'
      },
      lead: {
        type: String,
        default: 'Clear answers to your most pressing questions regarding travel immunity and routine PHARMACY protection.'
      },
      items: [
        {
          question: { type: String, default: 'When should I book my travel vaccinations?' },
          answer: { type: String, default: 'We strongly recommend booking your consultation at least 6-8 weeks before your departure. Some vaccines require multiple doses spread across several weeks to build full immunity.' }
        },
        {
          question: { type: String, default: 'Are your vaccines authentic and approved?' },
          answer: { type: String, default: 'Absolutely. All our vaccines are strictly sourced from licensed UK medical wholesalers, fully MHRA approved, and administered by highly trained, registered pharmacy professionals.' }
        },
        {
          question: { type: String, default: 'Do I need a prescription from my GP first?' },
          answer: { type: String, default: 'No. Our pharmacy operates a fully comprehensive service. Our qualified pharmacists are authorized to pharmacy assess your needs and prescribe the necessary vaccines directly during your consultation.' }
        },
        {
          question: { type: String, default: 'How does the travel consultation work?' },
          answer: { type: String, default: 'During your consultation, our qualified pharmacist will review your medical history, immunization records, and travel itinerary to create a personalized travel health plan tailored to your destination.' }
        }
      ]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('VaccinationCMS', VaccinationCMSSchema);
