const { Household } = require('../models');

async function seedHousehold() {
    try {
        // Create a household with ID 1
        await Household.create({
            id: 1,
            name: 'Default Household',
            address: '123 Main Street',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('Household seed completed successfully');
    } catch (error) {
        console.error('Error seeding household:', error);
    }
}

module.exports = seedHousehold; 