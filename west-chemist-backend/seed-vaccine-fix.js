require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

const vaccineFixes = [
  { slug: "travel-meningitis", title: "Meningitis" },
  { slug: "nhs-meningitis-b", title: "Meningitis B Vaccination" },
  { slug: "chickenpox-vaccine", title: "Chickenpox" },
  { slug: "travel-chikungunya", title: "Chikungunya Vaccine" },
  { slug: "nhs-shingles", title: "Shingles" },
  { slug: "hpv-vaccine", title: "HPV" },
  { slug: "travel-rabies", title: "Rabies" },
  { slug: "travel-hepatitis-b", title: "Hepatitis" },
  { slug: "travel-typhoid", title: "Typhoid" },
  { slug: "travel-japanese-encephalitis", title: "Japanese Encephalitis" }
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    for (const v of vaccineFixes) {
      console.log(`Setting '${v.slug}' parentCategory to 'Vaccination Services' and title to '${v.title}'...`);
      await Service.updateOne(
        { slug: v.slug },
        { 
          $set: { 
            parentCategory: "Vaccination Services",
            title: v.title
          } 
        }
      );
    }

    console.log('Vaccinations updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating vaccines:', error);
    process.exit(1);
  }
}

run();
