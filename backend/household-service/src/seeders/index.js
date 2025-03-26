const seedHousehold = require('./householdSeed');

async function runSeeds() {
    try {
        await seedHousehold();
        console.log('All seeds completed successfully');
    } catch (error) {
        console.error('Error running seeds:', error);
    }
}

module.exports = runSeeds; 