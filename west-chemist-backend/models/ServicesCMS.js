const mongoose = require('mongoose');

const ServicesCMSSchema = new mongoose.Schema(
  {
    hero: {
      tag: {
        type: String,
        default: 'Clinical Pharmacy & Healthcare Hub'
      },
      title: {
        type: String,
        default: 'Expert Clinical Care,'
      },
      highlight: {
        type: String,
        default: 'Personalised'
      },
      titleSuffix: {
        type: String,
        default: 'for You'
      },
      desc: {
        type: String,
        default: 'From NHS Pharmacy First treatments and travel immunisations to private clinical consultations, our trained practitioners deliver fast, evidence-based healthcare tailored to your wellbeing.'
      },
      badge1: {
        type: String,
        default: 'Trained Clinical Practitioners'
      },
      badge2: {
        type: String,
        default: 'Same-Day Consultations & Walk-Ins'
      },
      card1Title: {
        type: String,
        default: 'Travel & Vaccinations'
      },
      card1Desc: {
        type: String,
        default: 'Complete immunisation clinic'
      },
      card2Title: {
        type: String,
        default: 'Trained Practitioners'
      },
      card2Desc: {
        type: String,
        default: 'NHS & Private consultations'
      },
      image: {
        type: String,
        default: '/images/service-hero.png'
      }
    },
    sectionHeaders: {
      nhs: {
        eyebrow: {
          type: String,
          default: 'Official NHS Healthcare Partner'
        },
        title: {
          type: String,
          default: 'NHS Pharmacy First Services'
        },
        desc: {
          type: String,
          default: 'Get convenient access to NHS-funded clinical consultations and eligible treatments for selected common conditions through our Pharmacy First service. Our trained pharmacy team can assess your symptoms, provide professional advice, and recommend appropriate treatment, helping you access care without always needing a GP appointment.'
        },
        logo: {
          type: String,
          default: '/images/nhs-logo.svg'
        }
      },
      privateServices: {
        eyebrow: {
          type: String,
          default: 'Private Healthcare'
        },
        title: {
          type: String,
          default: 'Personalised Pharmacy Solutions'
        },
        desc: {
          type: String,
          default: 'Specialist ear care, medical dermatology, women\'s health, and travel protection — premium private clinical treatments delivered by trained practitioners.'
        }
      },
      travelClinic: {
        eyebrow: {
          type: String,
          default: 'Health Abroad'
        },
        title: {
          type: String,
          default: 'Travel Clinic'
        },
        desc: {
          type: String,
          default: 'Destination-specific travel health advice and essential vaccinations for your safety abroad. Book a private consultation with our travel health experts.'
        }
      }
    },
    benefits: {
      eyebrow: {
        type: String,
        default: 'Excellence in Care'
      },
      title: {
        type: String,
        default: 'Why Choose Our Pharmacy?'
      },
      subtitle: {
        type: String,
        default: 'We combine pharmaceutical expertise with patient-first convenience.'
      },
      items: [
        {
          title: { type: String, default: 'Trained Practitioners' },
          desc: { type: String, default: 'Our team consists of highly trained healthcare professionals ready to provide expert advice.' },
          icon: { type: String, default: 'practitioner' }
        },
        {
          title: { type: String, default: 'Digital Scripts' },
          desc: { type: String, default: 'Secure and accurate prescription management for reliable medication support.' },
          icon: { type: String, default: 'script' }
        },
        {
          title: { type: String, default: 'Private Consultation' },
          desc: { type: String, default: 'Discuss your health in complete confidence in our dedicated private consultation rooms.' },
          icon: { type: String, default: 'shield' }
        }
      ]
    },
    faqs: {
      title: {
        type: String,
        default: 'Frequently Asked Questions'
      },
      subtitle: {
        type: String,
        default: 'Answers to common queries about our pharmacy services.'
      },
      items: [
        {
          q: { type: String, default: 'Do I need a GP referral for Pharmacy First services?' },
          a: { type: String, default: 'No, you can walk in or book directly for Pharmacy First conditions. We can assess and treat you without needing to see your GP first.' }
        },
        {
          q: { type: String, default: 'Are the vaccinations suitable for children?' },
          a: { type: String, default: 'We offer various vaccinations for adults and children. Please contact us or check individual service details for specific age requirements.' }
        },
        {
          q: { type: String, default: 'Is the weight loss program medically supervised?' },
          a: { type: String, default: 'Yes, our weight loss programs are supervised by trained practitioners who will monitor your progress and provide professional guidance.' }
        },
        {
          q: { type: String, default: 'How long does a typical consultation take?' },
          a: { type: String, default: 'Most consultations take between 10 to 20 minutes, depending on the complexity of the service and your individual health needs.' }
        }
      ]
    },
    cta: {
      title: {
        type: String,
        default: 'Ready to take the next step?'
      },
      btnText: {
        type: String,
        default: 'Book Now'
      },
      btnUrl: {
        type: String,
        default: '/book-appointment'
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ServicesCMS', ServicesCMSSchema);
