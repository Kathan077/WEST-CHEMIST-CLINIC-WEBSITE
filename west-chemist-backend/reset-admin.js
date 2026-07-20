/**
 * reset-admin.js
 * Run this script once to reset the admin account in the database.
 * Usage: node reset-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const MONGODB_URI = process.env.MONGODB_URI;

async function resetAdmin() {
  console.log('🔗 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected.\n');

  // Delete all existing admin documents
  const deleted = await Admin.deleteMany({});
  console.log(`🗑️  Deleted ${deleted.deletedCount} existing admin record(s).`);

  // Create a fresh admin — bcrypt hashing is handled by the pre-save hook
  const newAdmin = await Admin.create({
    username: 'admin',
    email: 'admin@westchemist.com',
    password: 'adminpassword123'
  });

  console.log('\n💎 New admin account created successfully:');
  console.log('   👤 Username : admin');
  console.log('   📧 Email    : admin@westchemist.com');
  console.log('   🔑 Password : adminpassword123');
  console.log(`   🆔 ID       : ${newAdmin._id}\n`);

  await mongoose.disconnect();
  console.log('🔌 Disconnected. Done!');
}

resetAdmin().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
