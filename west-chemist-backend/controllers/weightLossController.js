const WeightLossCMS = require('../models/WeightLossCMS');

const DEFAULT_ROWS = [
  {
    parameter: "Active Ingredient",
    col1: "Tirzepatide",
    col2: "Semaglutide",
    badge1: "",
    badge2: ""
  },
  {
    parameter: "Drug Class / Mechanism",
    col1: "Dual GIP & GLP-1 Receptor Agonist",
    col2: "GLP-1 Receptor Agonist",
    badge1: "",
    badge2: ""
  },
  {
    parameter: "Administration",
    col1: "Once-weekly injection",
    col2: "Once-weekly injection",
    badge1: "",
    badge2: ""
  },
  {
    parameter: "Average Weight Loss Efficacy",
    col1: "Up to 20.9%",
    col2: "Up to 15%",
    badge1: "accent",
    badge2: "purple"
  },
  {
    parameter: "Starting Dose",
    col1: "2.5 mg weekly for 4 weeks",
    col2: "0.25 mg weekly for 4 weeks",
    badge1: "",
    badge2: ""
  },
  {
    parameter: "Maintenance Doses",
    col1: "5mg, 7.5mg, 10mg, 12.5mg, 15mg weekly",
    col2: "2.4 mg weekly",
    badge1: "",
    badge2: ""
  },
  {
    parameter: "Eligibility (BMI)",
    col1: "BMI ≥ 30, or ≥ 27 with complications",
    col2: "BMI ≥ 30, or ≥ 27 with complications",
    badge1: "",
    badge2: ""
  }
];

const DEFAULT_STEPS = [
  {
    stepNumber: "1",
    title: "Book Appointment",
    desc: "Book a private consultation slot with our qualified pharmacist online."
  },
  {
    stepNumber: "2",
    title: "PHARMACY Review",
    desc: "Complete an in-person weight, BMI assessment, and medical history review."
  },
  {
    stepNumber: "3",
    title: "Prescribe & Dispense",
    desc: "If suitable, our pharmacist issues your prescription and dispenses the medication immediately."
  },
  {
    stepNumber: "4",
    title: "Ongoing Reviews",
    desc: "Monthly follow-ups to track weight loss, manage dosage increases, and side effects."
  }
];

const DEFAULT_FAQS = [
  {
    question: "How do Mounjaro and Wegovy differ?",
    answer: "Wegovy (semaglutide) acts as a GLP-1 receptor agonist, mimicking the body's natural satiety hormone to regulate appetite. Mounjaro (tirzepatide) is a dual GIP and GLP-1 receptor agonist, targeting two metabolic pathways. PHARMACY studies show Mounjaro generally yields slightly higher average weight reduction, but both are exceptionally effective options."
  },
  {
    question: "Do I need a GP referral to start the Weight Loss program?",
    answer: "No GP referral is required. Our GPhC-registered PHARMACY pharmacists perform full PHARMACY assessments, prescribe, and dispense the appropriate medication directly within our pharmacy as part of our private weight management service."
  },
  {
    question: "Who is eligible for the Weight Loss injections?",
    answer: "Generally, individuals with a BMI (Body Mass Index) of 30 or above are eligible. Alternatively, individuals with a BMI of 27 or above who have weight-related health conditions (such as high blood pressure, type 2 diabetes, or high cholesterol) may also qualify after a PHARMACY consultation."
  },
  {
    question: "What are the common side effects of these treatments?",
    answer: "Most side effects are mild to moderate and occur during the initial dosage titration phases. They commonly include nausea, diarrhea, vomiting, constipation, and mild stomach discomfort. Our pharmacists provide detailed advice and custom plans to manage and minimize these side effects."
  },
  {
    question: "How are the injections administered and what is the schedule?",
    answer: "Both Wegovy and Mounjaro are administered as a simple once-weekly subcutaneous injection using pre-filled pens (usually in the abdomen, thigh, or upper arm). You will be fully trained on how to self-administer safely. The dosage starts low and is gradually increased monthly to allow your body to adjust."
  }
];

// @desc    Get Weight Loss CMS content
// @route   GET /api/weight-loss/cms
// @access  Public
const getWeightLossCMS = async (req, res) => {
  try {
    let cms = await WeightLossCMS.findOne({ key: 'main' });
    if (!cms) {
      // Seed default record if none exists
      cms = await WeightLossCMS.create({
        key: 'main',
        hero: {
          tag: 'Pharmacy Service',
          title: 'PHARMACYly Supervised',
          highlight: 'Weight Loss Program',
          desc: 'Achieve safe, sustainable weight reduction with next-generation medical treatments under professional PHARMACY supervision. We offer tailored Wegovy and Mounjaro programs designed for your biology.',
          btn1Text: 'Book Private Consultation',
          btn1Url: '/book-appointment?service=Weight%20Loss%20Clinic',
          btn2Text: 'Compare Treatments',
          btn2Url: '#comparison'
        },
        treatmentsHeader: {
          subtitle: 'PHARMACY Treatments',
          title: 'Our Weight Management Options',
          desc: 'We provide MHRA-approved medications and comprehensive health coaching to support your metabolic health journey.'
        },
        comparisonTable: {
          subtitle: 'Head to Head',
          title: 'Mounjaro vs Wegovy Comparison',
          desc: 'Compare the features, mechanism, and efficacy of the leading medical weight management treatments.',
          col1Name: 'Parameter',
          col2Name: 'Mounjaro® (Tirzepatide)',
          col3Name: 'Wegovy® (Semaglutide)',
          rows: DEFAULT_ROWS
        },
        howItWorks: {
          subtitle: 'Your Journey',
          title: 'How Our Weight Loss Program Works',
          desc: 'A simple, secure, and pharmacist-led process to help you get started safely.',
          steps: DEFAULT_STEPS
        },
        faqs: {
          subtitle: 'Support',
          title: 'Frequently Asked Questions',
          desc: 'Find clear, direct answers about our private weight loss management services.',
          items: DEFAULT_FAQS
        },
        cta: {
          eyebrow: 'Start Today',
          title: 'Ready to Begin Your Weight Loss Journey?',
          desc: 'Take control of your health. Book an in-person PHARMACY assessment today with our professional team.',
          btnText: 'Book Your Consultation Now',
          btnUrl: '/book-appointment?service=Weight%20Loss%20Clinic',
          note: 'Subject to PHARMACY suitability assessment. Patients must be aged 18 or over.'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: cms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving weight loss content',
      error: error.message
    });
  }
};

// @desc    Update Weight Loss CMS content
// @route   PUT /api/weight-loss/cms
// @access  Private/Admin
const updateWeightLossCMS = async (req, res) => {
  try {
    let cms = await WeightLossCMS.findOne({ key: 'main' });
    if (!cms) {
      cms = new WeightLossCMS({ key: 'main' });
    }

    const {
      hero,
      treatmentsHeader,
      comparisonTable,
      howItWorks,
      faqs,
      cta
    } = req.body;

    if (hero) cms.hero = { ...cms.hero?.toObject?.() || cms.hero || {}, ...hero };
    if (treatmentsHeader) cms.treatmentsHeader = { ...cms.treatmentsHeader?.toObject?.() || cms.treatmentsHeader || {}, ...treatmentsHeader };
    if (comparisonTable) cms.comparisonTable = { ...cms.comparisonTable?.toObject?.() || cms.comparisonTable || {}, ...comparisonTable };
    if (howItWorks) cms.howItWorks = { ...cms.howItWorks?.toObject?.() || cms.howItWorks || {}, ...howItWorks };
    if (faqs) cms.faqs = { ...cms.faqs?.toObject?.() || cms.faqs || {}, ...faqs };
    if (cta) cms.cta = { ...cms.cta?.toObject?.() || cms.cta || {}, ...cta };

    cms.markModified('hero');
    cms.markModified('treatmentsHeader');
    cms.markModified('comparisonTable');
    cms.markModified('howItWorks');
    cms.markModified('faqs');
    cms.markModified('cta');

    await cms.save();

    res.status(200).json({
      success: true,
      message: 'Weight loss content updated successfully',
      data: cms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating weight loss content',
      error: error.message
    });
  }
};

module.exports = {
  getWeightLossCMS,
  updateWeightLossCMS
};
