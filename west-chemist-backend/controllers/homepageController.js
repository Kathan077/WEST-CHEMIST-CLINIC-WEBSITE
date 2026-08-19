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
      desc: 'Expert pharmaceutical care and professional health advice — all in one trusted pharmacy.',
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
      desc: 'Walk in for travel vaccination advice and protect yourself before your next trip.',
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
    { number: '98%', label: 'Satisfaction' }
  ],
  aboutSection: {
    title: 'Empowering Your Wellness Journey',
    subtitle: 'YOUR TRUSTED COMMUNITY PHARMACY',
    desc: 'xperienced pharmacists and professional pharmacy staff across Northampton and East London are here to support you and your family through all stages of life.',
    image: '/images/about-pharmacist.jpg',
    features: [
      { icon: 'award', title: '20+ Years Experience', desc: 'Over two decades of trusted healthcare experience across Northampton & East London.' },
      { icon: 'users', title: 'Dedicated Pharmacy Team', desc: 'Qualified pharmacists and healthcare staff committed to your family’s well-being.' },
      { icon: 'check-square', title: 'Timely Prescriptions', desc: 'Fast, reliable prescription dispensing and professional pharmacy services.' }
    ],
    ctaText: 'Learn More About Us',
    ctaUrl: '/about',
    secondaryCtaText: 'Contact Us',
    secondaryCtaUrl: '/contact'
  },
  servicesSection: {
    title: 'Pharmacy Services We Offer',
    subtitle: 'WEST CHEMIST PHARMACY HUB',
    desc: 'Access a wide range of NHS and private services designed to keep you and your family healthy. Book in advance or walk in today.'
  },
  howItWorks: {
    title: 'Your Health Journey Made Simple',
    subtitle: 'HOW WE SERVE YOU',
    desc: 'Get expert advice and pharmacy services in three straightforward steps.',
    steps: [
      { stepNumber: '01', title: 'Choose Your Service', desc: 'Select from our wide range of pharmacy services including vaccinations, health checks, and weight management.', icon: 'search' },
      { stepNumber: '02', title: 'Book an Appointment', desc: 'Pick a convenient date and time using our real-time calendar and securely verify your details.', icon: 'cal' },
      { stepNumber: '03', title: 'Visit the Pharmacy', desc: 'Visit our welcoming location for your private consultation with our professional pharmacy team.', icon: 'home' }
    ]
  },
  testimonials: {
    title: 'What Our Patients Say',
    subtitle: 'TRUSTED COMMUNITY PHARMACY',
    desc: 'Discover why thousands of patients trust West Chemist for their pharmaceutical care needs.',
    reviews: [
      { name: 'Sarah Jenkins', role: 'Northampton Resident', text: 'The travel vaccination service was incredibly fast and professional. The pharmacist answered all my questions and made me feel completely at ease.', rating: 5, avatar: '/images/reviews/sarah.jpg' },
      { name: 'David Thompson', role: 'Patient', text: 'I have been using their medication and health consultation services for over a year. The convenience of booking appointments online and tracking my tickets is phenomenal.', rating: 5, avatar: '/images/reviews/david.jpg' },
      { name: 'Emma Wilson', role: 'Weight Loss Client', text: 'The guided weight management program has completely changed my life. The team is supportive, highly competent, and always professional.', rating: 5, avatar: '/images/reviews/emma.jpg' }
    ]
  },
  appointmentCta: {
    title: 'Guided Weight Management',
    subtitle: 'TRANSFORM YOUR HEALTH',
    desc: 'Are you looking to achieve and maintain a healthy weight? Our pharmacy team provides safe, professional weight management support tailored to you. We offer expert advice, progress tracking, and regulation-compliant guidance.',
    image: '/images/e0dc23d6-3cb0-4a6a-9076-058313605f8d.png',
    ctaText: 'Start Weight Loss Program',
    ctaUrl: '/weight-loss',
    bullets: [
      'Personalized expert support',
      'In-person consultations available at our pharmacy',
      'Flexible appointment options, including evening slots'
    ]
  },
  footerCta: {
    title: 'Ready to take the next step?',
    ctaText: 'Book Now',
    ctaUrl: '/book-appointment'
  },
  seoSettings: {
    metaTitle: 'West Chemist — Expert Pharmaceutical & Health Services',
    metaDescription: 'West Chemist offers expert pharmaceutical care, travel vaccinations, weight loss programs, and health advice.',
    metaKeywords: 'pharmacy, travel health, vaccinations, Northampton, weight loss, health check',
    canonicalUrl: process.env.FRONTEND_URL || 'https://west-chemist-clinic-website.vercel.app/',
    logoUrl: '/images/ddfd45c4-3070-498a-9e4e-68f1fb48ad3e.png',
    ogTitle: 'West Chemist — Expert Pharmaceutical & Health Services',
    ogDescription: 'West Chemist offers expert pharmaceutical care, travel vaccinations, weight loss programs, and health advice.',
    ogImage: '/images/0a198cad-eabf-40b6-81dc-45dbd61ed432.png'
  }
};

// @desc    Get homepage configuration (Public)
// @route   GET /api/homepage
// @access  Public
const getHomepageContent = async (req, res) => {
  try {
    let cms = await HomepageCMS.findOne({ key: 'main' });
    if (!cms) {
      cms = await HomepageCMS.create(DEFAULT_HOMEPAGE_CONTENT);
      console.log('🌱 Homepage CMS content successfully auto-seeded!');
    } else {
      // Perform automated migration on existing CMS document if needed
      let updated = false;
      if (cms.aboutSection) {
        cms.aboutSection.subtitle = 'YOUR TRUSTED COMMUNITY PHARMACY';
        cms.aboutSection.desc = 'With over two decades of dedicated community service, West Chemist specializes in the timely provision of prescription medicines, travel health, and comprehensive patient care. We understand that managing health and medications can feel daunting  our team of experienced pharmacists and professional pharmacy staff across Northampton and East London are here to support you and your family through all stages of life.';
        cms.aboutSection.image = '/images/about-pharmacist.jpg';
        cms.aboutSection.features = [
          { icon: 'award', title: '20+ Years Experience', desc: 'Over two decades of trusted healthcare experience across Northampton & East London.' },
          { icon: 'users', title: 'Dedicated Pharmacy Team', desc: 'Qualified pharmacists and healthcare staff committed to your family’s well-being.' },
          { icon: 'check-square', title: 'Timely Prescriptions', desc: 'Fast, reliable prescription dispensing and professional pharmacy services.' }
        ];
        cms.markModified('aboutSection');
        updated = true;
      }
      if (cms.appointmentCta) {
        cms.appointmentCta.desc = 'Are you looking to achieve and maintain a healthy weight? Our pharmacy team provides safe, professional weight management support tailored to you. We offer expert advice, progress tracking, and regulation-compliant guidance.';
        cms.appointmentCta.bullets = [
          'Personalized expert support',
          'In-person consultations available at our pharmacy',
          'Flexible appointment options, including evening slots'
        ];
        cms.markModified('appointmentCta');
        updated = true;
      }
      if (cms.seoSettings?.metaTitle?.includes('West Chemist Clinic')) {
        cms.seoSettings.metaTitle = cms.seoSettings.metaTitle.replace(/West Chemist Clinic/g, 'West Chemist');
        cms.seoSettings.metaDescription = cms.seoSettings.metaDescription.replace(/West Chemist Clinic/g, 'West Chemist').replace(/specialist health advice/g, 'expert health advice');
        cms.seoSettings.ogTitle = cms.seoSettings.ogTitle.replace(/West Chemist Clinic/g, 'West Chemist');
        cms.seoSettings.ogDescription = cms.seoSettings.ogDescription.replace(/West Chemist Clinic/g, 'West Chemist').replace(/specialist health advice/g, 'expert health advice');
        updated = true;
      }
      if (updated) {
        await cms.save();
      }
    }
    
    res.status(200).json({
      success: true,
      data: cms
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
