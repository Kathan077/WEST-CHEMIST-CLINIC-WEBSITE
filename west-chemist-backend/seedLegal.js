const mongoose = require('mongoose');
require('dotenv').config();
const PageContent = require('./models/PageContent');
const { PRIVACY_POLICY, TERMS_OF_SERVICE } = require('./config/legalContents');

async function seedLegal() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const privacyKeys = ['privacy_policy', 'privacy-policy'];
    for (const key of privacyKeys) {
      await PageContent.findOneAndUpdate(
        { key },
        {
          $set: {
            key,
            title: PRIVACY_POLICY.title,
            content: PRIVACY_POLICY.content,
            section: PRIVACY_POLICY.section,
            metadata: PRIVACY_POLICY.metadata
          }
        },
        { upsert: true, new: true }
      );
      console.log(`Updated/Seeded ${key}`);
    }

    const termsKeys = ['terms_and_conditions', 'terms-and-conditions', 'terms-conditions'];
    for (const key of termsKeys) {
      await PageContent.findOneAndUpdate(
        { key },
        {
          $set: {
            key,
            title: TERMS_OF_SERVICE.title,
            content: TERMS_OF_SERVICE.content,
            section: TERMS_OF_SERVICE.section,
            metadata: TERMS_OF_SERVICE.metadata
          }
        },
        { upsert: true, new: true }
      );
      console.log(`Updated/Seeded ${key}`);
    }

    console.log('All legal contents seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding legal contents:', err);
    process.exit(1);
  }
}

seedLegal();
