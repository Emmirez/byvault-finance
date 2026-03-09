// src/scripts/fixExistingUsersBankDetails.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple possible paths for .env file
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

if (!envLoaded) {
  console.log('⚠️ Could not load .env file, using process.env');
}

const fixExistingUsersBankDetails = async () => {
  try {
    console.log('='.repeat(50));
    console.log('🔧 FIXING BANK DETAILS FOR EXISTING USERS');
    console.log('='.repeat(50));

    // Get MongoDB URI
    const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
    
    console.log('MongoDB URI found:', MONGODB_URI ? '✅ Yes' : '❌ No');
    
    if (!MONGODB_URI) {
      throw new Error('MongoDB URI not found in environment variables');
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users total`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of users) {
      try {
        console.log(`\n👤 Processing user: ${user.email || user._id}`);
        
        let needsUpdate = false;
        const oldBankDetails = user.bankDetails ? { ...user.bankDetails } : null;
        
        // Initialize bankDetails if it doesn't exist
        if (!user.bankDetails) {
          user.bankDetails = {};
          console.log('  - Initializing bankDetails object');
          needsUpdate = true;
        }

        // Set default values for missing fields
        if (!user.bankDetails.bankName) {
          user.bankDetails.bankName = "Byvault Finance Bank";
          console.log('  - Adding bankName: Byvault Finance Bank');
          needsUpdate = true;
        }
        
        if (!user.bankDetails.accountName) {
          user.bankDetails.accountName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
          console.log(`  - Adding accountName: ${user.bankDetails.accountName}`);
          needsUpdate = true;
        }
        
        if (!user.bankDetails.accountNumber) {
          user.bankDetails.accountNumber = user.accountId?.toString() || '';
          console.log(`  - Adding accountNumber: ${user.bankDetails.accountNumber}`);
          needsUpdate = true;
        }
        
        if (!user.bankDetails.routingNumber) {
          user.bankDetails.routingNumber = "021000021";
          console.log('  - Adding routingNumber: 021000021');
          needsUpdate = true;
        }
        
        if (!user.bankDetails.swiftCode) {
          user.bankDetails.swiftCode = "BYVAUS33";
          console.log('  - Adding swiftCode: BYVAUS33');
          needsUpdate = true;
        }
        
        // Always set iban if it doesn't exist (even if empty)
        if (user.bankDetails.iban === undefined) {
          user.bankDetails.iban = '';
          console.log('  - Adding iban field');
          needsUpdate = true;
        }
        
        if (!user.bankDetails.bankAddress) {
          user.bankDetails.bankAddress = "800 Nicollet Mall Minneapolis, MN 55304 United States";
          console.log('  - Adding bankAddress');
          needsUpdate = true;
        }

        if (needsUpdate) {
          await user.save({ validateBeforeSave: false });
          updated++;
          console.log(`  ✅ Updated user: ${user.email || user._id}`);
          console.log('  📋 New bank details:', user.bankDetails);
        } else {
          skipped++;
          console.log(`  ⏭️ Skipped user: ${user.email || user._id} - Already has complete bank details`);
          if (oldBankDetails) {
            console.log('  📋 Existing bank details:', oldBankDetails);
          }
        }
      } catch (userError) {
        errors++;
        console.error(`  ❌ Error processing user ${user.email || user._id}:`, userError.message);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 FIX COMPLETED!');
    console.log('📊 SUMMARY:');
    console.log(`   Total users: ${users.length}`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️ Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log('='.repeat(50));
    
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing bank details:', error);
    process.exit(1);
  }
};

fixExistingUsersBankDetails();