require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');
    const count = await Category.countDocuments();
    if (count === 0) {
      const defaultCategories = [
        { name: "NHS Services (Pharmacy First)", slug: "nhs-services-pharmacy-first" },
        { name: "Private Services", slug: "private-services" },
        { name: "Travel Clinic", slug: "travel-clinic" }
      ];
      await Category.insertMany(defaultCategories);
      console.log('Successfully seeded default categories.');
    } else {
      console.log(`Already has ${count} categories.`);
    }
    await mongoose.disconnect();
    console.log('Disconnected.');
  } catch (err) {
    console.error('Error seeding categories:', err);
    process.exit(1);
  }
};

run();
