const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const dotenv = require('dotenv');
const { Gym, User } = require('../mongodb-schemas');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const SAMPLE_OWNER_EMAIL = 'admin@gymproject.com';
const FACILITIES_ENUM = [
    'cardio_machines',
    'weight_machines',
    'free_weights',
    'swimming_pool',
    'sauna',
    'steam_room',
    'yoga_studio',
    'group_classes',
    'personal_training',
    'locker_rooms',
    'parking',
    'cafe',
    'pro_shop',
    'basketball_court',
    'indoor_track'
];

// Helper to extract state from address
function extractState(fullAddress) {
    // Common Indian states list for matching
    const states = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
        'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
        'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
        'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh'
    ];

    if (!fullAddress) return 'Unknown';

    // 1. Try to find a state name directly in the string (case insensitive)
    const addressLower = fullAddress.toLowerCase();
    for (const state of states) {
        if (addressLower.includes(state.toLowerCase())) {
            // Return capitalized version
            return state;
        }
    }

    // 2. Fallback: Try to grab word before zip code (6 digits)
    const zipMatch = fullAddress.match(/\b([A-Za-z\s]+)\s*[,-]?\s*\d{6}\b/);
    if (zipMatch && zipMatch[1]) {
        return zipMatch[1].trim();
    }

    return 'Unknown';
}

const seedGyms = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gym_project');
        console.log('MongoDB Connected.');

        // 1. Get or Create Owner
        let owner = await User.findOne({ email: SAMPLE_OWNER_EMAIL });
        if (!owner) {
            console.log('Creating seed owner...');
            owner = await User.create({
                name: 'Seed Admin',
                email: SAMPLE_OWNER_EMAIL,
                password: 'password123', // In a real app, hash this
                phone: '0000000000',
                role: 'gymOwner',
                location: { city: 'SeedCity', state: 'SeedState', zipCode: '000000' }
            });
        }
        console.log(`Using Owner: ${owner.email} (${owner._id})`);

        // 2. Read Excel
        const excelPath = path.join(__dirname, 'Gym Discovery Platform.xlsx');
        if (!require('fs').existsSync(excelPath)) {
            throw new Error(`Excel file not found at ${excelPath}`);
        }

        const workbook = xlsx.readFile(excelPath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log(`Found ${data.length} rows in Excel.`);

        let insertedCount = 0;
        let skippedCount = 0;
        const statsPerCity = {};

        for (const row of data) {
            const name = row['Gym Name'];
            const city = row['City'];
            const contact = row['Contact Number (if available)'];
            const fullAddress = row['Full Address'];
            const facilitiesRaw = row['Facilities (comma-separated)'];

            if (!name || !city) {
                console.log('Skipping row missing name or city:', row);
                continue; // Skip invalid rows
            }

            // Deduplicate
            const exists = await Gym.findOne({
                name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'), // Case insensitive
                'address.city': new RegExp(`^${city.trim()}$`, 'i')
            });

            if (exists) {
                skippedCount++;
                continue;
            }

            // Map Facilities
            let facilities = [];
            if (facilitiesRaw) {
                facilities = facilitiesRaw.split(',')
                    .map(f => f.trim().toLowerCase().replace(/ /g, '_')) // Attempt basic normalization
                    .filter(f => FACILITIES_ENUM.includes(f));       // Validate against enum
            }

            // Construct Gym Object
            const gymData = {
                ownerId: owner._id,
                name: name.trim(),
                description: 'A premium fitness facility offering various amenities to help you achieve your fitness goals.',
                address: {
                    street: fullAddress || 'Address not provided',
                    city: city.trim(),
                    state: extractState(fullAddress),
                    zipCode: (fullAddress && fullAddress.match(/\d{6}/)) ? fullAddress.match(/\d{6}/)[0] : '000000'
                },
                phone: contact ? String(contact) : 'Not Provided',
                facilities: facilities,
                // These fields are passed for completeness but will be ignored by strict schema
                // if they are not defined in the schema
                area: row['Area / Locality'],
                mapsLink: row['Google Maps Link'],
                source: row['Data Source (Google Maps / Justdial / Official Website)']
            };

            await Gym.create(gymData);
            insertedCount++;

            // Stats
            statsPerCity[city] = (statsPerCity[city] || 0) + 1;
        }

        console.log('\n========================================');
        console.log('SEEDING COMPLETE');
        console.log('========================================');
        console.log(`Total Processed: ${data.length}`);
        console.log(`Inserted: ${insertedCount}`);
        console.log(`Skipped (Duplicate): ${skippedCount}`);
        console.log('\nStats by City:');
        console.table(statsPerCity);

        process.exit(0);

    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedGyms();
