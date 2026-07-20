const HomepageCMS = require('../models/HomepageCMS');

// Default seeded data template
const DEFAULT_HOMEPAGE_CONTENT = {
  key: 'main',
  heroSlides: [
    {
      badge: 'Expert Healthcare',
      badgeIcon: 'stethoscope',
      words1: ['Your', 'Health,'],
      words2: ['Our', 'Priority.'],
      desc: 'Expert pharmaceutical care and specialist health advice — all in one trusted clinic.',
      cta: 'Book an Appointment',
      ctaUrl: '/book-appointment',
      secondaryCta: 'Our Services',
      secondaryCtaUrl: '/services',
      image: '/images/0a198cad-eabf-40b6-81dc-45dbd61ed432.png',
      fallback: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=90',
      overlay: ['rgba(15,4,40,0.70)', 'rgba(15,4,40,0.20)']
    },
    {
      badge: 'Travel Vaccinations',
      badgeIcon: 'globe',
      words1: ['Worry-Free', 'Travel'],
      words2: ['Starts', 'Here.'],
      desc: 'Walk in for specialist travel vaccination advice and protect yourself before your next trip.',
      cta: 'Explore Vaccines',
      ctaUrl: '/services',
      secondaryCta: 'Our Services',
      secondaryCtaUrl: '/services',
      image: '/images/8df30593-83e5-4551-ab3b-4b82c1684d55.png',
      fallback: 'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=1400&q=90',
      overlay: ['rgba(4,25,20,0.70)', 'rgba(4,25,20,0.20)']
    },
    {
      badge: 'Weight Loss Programs',
      badgeIcon: 'flame',
      words1: ['Transform', 'Your'],
      words2: ['Life', 'Today.'],
      desc: 'Personalised medically-guided weight loss programs designed to give you lasting results.',
      cta: 'Get Started',
      ctaUrl: '/services',
      secondaryCta: 'Our Services',
      secondaryCtaUrl: '/services',
      image: '/images/e0dc23d6-3cb0-4a6a-9076-058313605f8d.png',
      fallback: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1400&q=90',
      overlay: ['rgba(4,12,40,0.70)', 'rgba(4,12,40,0.20)']
    }
  ],
  heroStats: [
    { number: '2K+', label: 'Happy Patients' },
    { number: '15+', label: 'Years Experience' },
    { number: '98%', label: 'Satisfaction' }
  ],
  aboutSection: {
    title: 'Empowering Your Wellness Journey',
    subtitle: 'ABOUT WEST CHEMIST CLINIC',
    desc: 'At West Chemist Clinic, we are dedicated to providing the highest standard of pharmaceutical care and clinical services. With over 15 years of serving our community, our team of experienced pharmacists and healthcare practitioners offers expert guidance tailored to your unique needs.',
    image: '/images/8df30593-83e5-4551-ab3b-4b82c1684d55.png',
    yearsExperience: '15+',
    experienceLabel: 'Years of clinical excellence serving WA communities.',
    features: [
      { icon: 'award', title: 'Accredited Excellence', desc: 'GPhC registered pharmacy with fully certified NHS clinical specialists.' },
      { icon: 'shield', title: 'Safe & Regulated Care', desc: 'Highest safety standards with robust identity verification protocols.' },
      { icon: 'clock', title: 'Walk-In & Booking Ease', desc: 'Get fast, hassle-free care when you need it most with flexible appointments.' }
    ],
    ctaText: 'Learn More About Us',
    ctaUrl: '/about',
    secondaryCtaText: 'Contact Us',
    secondaryCtaUrl: '/contact'
  },
  servicesSection: {
    title: 'Clinical Services We Offer',
    subtitle: 'WEST CHEMIST CLINICAL HUB',
    desc: 'Access a wide range of NHS and private services designed to keep you and your family healthy. Book in advance or walk in today.'
  },
  howItWorks: {
    title: 'Your Health Journey Made Simple',
    subtitle: 'HOW WE SERVE YOU',
    desc: 'Get expert advice and clinical services in three straightforward steps.',
    steps: [
      { stepNumber: '01', title: 'Choose Your Service', desc: 'Select from our wide range of clinical services including vaccinations, health checks, and weight management.', icon: 'search' },
      { stepNumber: '02', title: 'Book an Appointment', desc: 'Pick a convenient date and time using our real-time calendar and securely verify your identity details.', icon: 'cal' },
      { stepNumber: '03', title: 'Attend the Clinic', desc: 'Visit our welcoming WA location for your private consultation with our professional clinical team.', icon: 'home' }
    ]
  },
  testimonials: {
    title: 'What Our Patients Say',
    subtitle: 'TRUSTED COMMUNITY CLINIC',
    desc: 'Discover why thousands of patients trust West Chemist for their clinical healthcare needs.',
    reviews: [
      { name: 'Sarah Jenkins', role: 'Northampton Resident', text: 'The travel vaccination clinic was incredibly fast and professional. The pharmacist answered all my questions and made me feel completely at ease.', rating: 5, avatar: '/images/reviews/sarah.jpg' },
      { name: 'David Thompson', role: 'Diabetes Patient', text: 'I have been using their health monitoring services for over a year. The convenience of booking appointments online and tracking my tickets is phenomenal.', rating: 5, avatar: '/images/reviews/david.jpg' },
      { name: 'Emma Wilson', role: 'Weight Loss Client', text: 'The guided weight management program has completely changed my life. The team is supportive, highly competent, and always professional.', rating: 5, avatar: '/images/reviews/emma.jpg' }
    ]
  },
  appointmentCta: {
    title: 'Guided Weight Management',
    subtitle: 'TRANSFORM YOUR HEALTH',
    desc: 'Are you looking to achieve and maintain a healthy weight? Our clinical team provides safe, medically supervised weight loss programs tailored to you. We offer professional advice, progress tracking, and regulation-compliant guidance.',
    image: '/images/e0dc23d6-3cb0-4a6a-9076-058313605f8d.png',
    ctaText: 'Start Weight Loss Program',
    ctaUrl: '/weight-loss',
    bullets: [
      'Personalized expert support',
      'In-person or secure online consultations available',
      'Flexible appointment options, including evening slots'
    ]
  },
  footerCta: {
    title: 'Ready to take the next step?',
    ctaText: 'Book Now',
    ctaUrl: '/book-appointment'
  },
  seoSettings: {
    metaTitle: 'West Chemist Clinic — Expert Pharmaceutical & Health Services',
    metaDescription: 'West Chemist Clinic offers expert pharmaceutical care, travel vaccinations, weight loss programs, and specialist health advice in WA.',
    metaKeywords: 'pharmacy, clinic, travel clinic, vaccinations, Northampton, weight loss, health check',
    canonicalUrl: 'http://localhost:3000/',
    logoUrl: '/images/ddfd45c4-3070-498a-9e4e-68f1fb48ad3e.png',
    ogTitle: 'West Chemist Clinic — Expert Pharmaceutical & Health Services',
    ogDescription: 'West Chemist Clinic offers expert pharmaceutical care, travel vaccinations, weight loss programs, and specialist health advice in WA.',
    ogImage: '/images/0a198cad-eabf-40b6-81dc-45dbd61ed432.png'
  }
};

// @desc    Get homepage configuration (Public)
// @route   GET /api/homepage
// @access  Public
const getHomepageContent = async (req, res) => {
  try {
    let content = await HomepageCMS.findOne({ key: 'main' });
    
    // Auto-seed if not found
    if (!content) {
      content = await HomepageCMS.create(DEFAULT_HOMEPAGE_CONTENT);
      console.log('🌱 Homepage CMS content successfully auto-seeded!');
    }
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching homepage contents',
      error: error.message
    });
  }
};

// @desc    Update homepage configuration (Admin/Private)
// @route   PUT /api/homepage
// @access  Private/Admin
const updateHomepageContent = async (req, res) => {
  try {
    let content = await HomepageCMS.findOne({ key: 'main' });
    
    if (!content) {
      content = new HomepageCMS({ key: 'main' });
    }
    
    // Assign fields
    if (req.body.heroSlides) content.heroSlides = req.body.heroSlides;
    if (req.body.heroStats) content.heroStats = req.body.heroStats;
    if (req.body.aboutSection) content.aboutSection = req.body.aboutSection;
    if (req.body.servicesSection) content.servicesSection = req.body.servicesSection;
    if (req.body.howItWorks) content.howItWorks = req.body.howItWorks;
    if (req.body.testimonials) content.testimonials = req.body.testimonials;
    if (req.body.appointmentCta) content.appointmentCta = req.body.appointmentCta;
    if (req.body.footerCta) content.footerCta = req.body.footerCta;
    if (req.body.seoSettings) content.seoSettings = req.body.seoSettings;
    
    await content.save();
    
    res.status(200).json({
      success: true,
      message: 'Homepage CMS content successfully updated and published!',
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating homepage contents',
      error: error.message
    });
  }
};

// @desc    Re-seed homepage configuration (Admin/Private)
// @route   POST /api/homepage/seed
// @access  Private/Admin
const seedHomepageContent = async (req, res) => {
  try {
    const { section } = req.query;

    if (section) {
      let content = await HomepageCMS.findOne({ key: 'main' });
      if (!content) {
        content = await HomepageCMS.create(DEFAULT_HOMEPAGE_CONTENT);
      }

      switch (section) {
        case 'hero':
          content.heroSlides = DEFAULT_HOMEPAGE_CONTENT.heroSlides;
          content.heroStats = DEFAULT_HOMEPAGE_CONTENT.heroStats;
          break;
        case 'about':
          content.aboutSection = DEFAULT_HOMEPAGE_CONTENT.aboutSection;
          break;
        case 'services':
          content.servicesSection = DEFAULT_HOMEPAGE_CONTENT.servicesSection;
          break;
        case 'how':
          content.howItWorks = DEFAULT_HOMEPAGE_CONTENT.howItWorks;
          break;
        case 'testimonials':
          content.testimonials = DEFAULT_HOMEPAGE_CONTENT.testimonials;
          break;
        case 'weightLossCta':
          content.appointmentCta = DEFAULT_HOMEPAGE_CONTENT.appointmentCta;
          break;
        case 'seo':
          content.seoSettings = DEFAULT_HOMEPAGE_CONTENT.seoSettings;
          break;
        default:
          return res.status(400).json({
            success: false,
            message: `Invalid section '${section}' specified for reset`
          });
      }

      await content.save();
      return res.status(200).json({
        success: true,
        message: `Homepage CMS section "${section}" reset successfully!`,
        data: content
      });
    }

    await HomepageCMS.deleteOne({ key: 'main' });
    const content = await HomepageCMS.create(DEFAULT_HOMEPAGE_CONTENT);
    
    res.status(200).json({
      success: true,
      message: 'Homepage CMS configurations re-seeded successfully!',
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error re-seeding homepage contents',
      error: error.message
    });
  }
};

module.exports = {
  getHomepageContent,
  updateHomepageContent,
  seedHomepageContent
};
