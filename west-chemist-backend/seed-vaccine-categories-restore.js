require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

const nhsVaccines = ['nhs-meningitis-b', 'nhs-shingles'];
const travelVaccines = [
  'travel-chikungunya',
  'travel-hepatitis-b',
  'travel-japanese-encephalitis',
  'travel-meningitis',
  'travel-rabies',
  'travel-typhoid'
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    for (const slug of nhsVaccines) {
      console.log(`Setting '${slug}' parentCategory to 'NHS Services (Pharmacy First)'...`);
      await Service.updateOne({ slug }, { $set: { parentCategory: "NHS Services (Pharmacy First)" } });
    }

    for (const slug of travelVaccines) {
      console.log(`Setting '${slug}' parentCategory to 'Travel Clinic'...`);
      await Service.updateOne({ slug }, { $set: { parentCategory: "Travel Clinic" } });
    }

    console.log('Database categories restored successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating vaccines:', error);
    process.exit(1);
  }
}

run();
