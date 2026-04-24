const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Gym } = require('../mongodb-schemas');

dotenv.config({ path: '../.env' });

const cleanData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gym_db');
        console.log('MongoDB Connected for cleaning...');

        const gyms = await Gym.find({});
        console.log(`Found ${gyms.length} gyms. Starting cleanup...`);

        const seen = new Set();
        let deletedCount = 0;
        let updatedCount = 0;

        for (const gym of gyms) {
            // 1. Remove Duplicates (Name + City)
            const identifier = `${gym.name.toLowerCase().trim()}-${gym.address.city.toLowerCase().trim()}`;
            if (seen.has(identifier)) {
                await Gym.deleteOne({ _id: gym._id });
                deletedCount++;
                continue;
            }
            seen.add(identifier);

            // 2. Normalize Fields
            let changed = false;
            
            // Normalize Website
            if (gym.website === undefined || gym.website === null) {
                gym.website = "";
                changed = true;
            }

            // Normalize Pricing (ensure it's a number)
            if (gym.pricing && gym.pricing.monthlyMembership) {
                const price = parseFloat(gym.pricing.monthlyMembership);
                if (!isNaN(price) && gym.pricing.monthlyMembership !== price) {
                    gym.pricing.monthlyMembership = price;
                    changed = true;
                }
            }

            if (changed) {
                await gym.save();
                updatedCount++;
            }
        }

        console.log('Cleanup Complete:');
        console.log(`- Deleted duplicates: ${deletedCount}`);
        console.log(`- Updated records: ${updatedCount}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
};

cleanData();
