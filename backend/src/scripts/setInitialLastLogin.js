// src/scripts/setInitialLastLogin.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple paths to find .env file
const possiblePaths = [
  path.join(__dirname, '../../.env'), // project root
  path.join(__dirname, '../.env'),    // src folder
  path.join(__dirname, '.env')        // scripts folder
];

let envLoaded = false;
for (const envPath of possiblePaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    console.log(`✅ Loaded .env from: ${envPath}`);
    envLoaded = true;
    break;
  }
}

const setInitialLastLogin = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
    
    console.log('MongoDB URI found:', MONGODB_URI ? '✅ Yes' : '❌ No');
    
    if (!MONGODB_URI) {
      throw new Error('MongoDB URI not found in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} total users`);

    let updated = 0;
    let fixed = 0;
    let errors = 0;

    for (const user of users) {
      try {
        console.log(`\n👤 Processing user: ${user.email}`);
        
        // Check if bankDetails is a string and fix it
        if (user.bankDetails && typeof user.bankDetails === 'string') {
          console.log('  ⚠️ bankDetails is a string, fixing...');
          try {
            const parsedBankDetails = JSON.parse(user.bankDetails);
            user.bankDetails = parsedBankDetails;
            console.log('  ✅ Fixed bankDetails (converted string to object)');
            fixed++;
          } catch (parseError) {
            console.error('  ❌ Failed to parse bankDetails string:', parseError.message);
            // Set default bank details if parsing fails
            user.bankDetails = {
              bankName: "Byvault Finance Bank",
              accountName: user.name || `${user.firstName} ${user.lastName}`.trim(),
              accountNumber: user.accountId?.toString() || '',
              routingNumber: "021000021",
              swiftCode: "BYVAUS33",
              iban: "",
              bankAddress: "800 Nicollet Mall Minneapolis, MN 55304 United States"
            };
            console.log('  ✅ Set default bank details');
            fixed++;
          }
        }

        // Set lastLogin if it doesn't exist
        if (!user.lastLogin) {
          // Set a random date within the last 30 days
          const randomDays = Math.floor(Math.random() * 30);
          const randomDate = new Date();
          randomDate.setDate(randomDate.getDate() - randomDays);
          
          user.lastLogin = randomDate;
          console.log(`  ✅ Set lastLogin to: ${randomDate.toLocaleDateString()}`);
          updated++;
        }

        // Save the user with validation bypass
        await user.save({ validateBeforeSave: false });
        
      } catch (userError) {
        errors++;
        console.error(`❌ Error processing user ${user.email}:`, userError.message);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 MIGRATION COMPLETED!');
    console.log('📊 SUMMARY:');
    console.log(`   Total users: ${users.length}`);
    console.log(`   ✅ LastLogin updated: ${updated}`);
    console.log(`   🔧 BankDetails fixed: ${fixed}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('='.repeat(50));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
};

setInitialLastLogin();