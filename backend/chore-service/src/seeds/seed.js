const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function seedChores() {
    try {
        const seedSQL = fs.readFileSync(path.join(__dirname, 'chores.sql'), 'utf8');
        await pool.query(seedSQL);
        console.log('Successfully seeded chores data');
    } catch (error) {
        console.error('Error seeding chores:', error);
    } finally {
        await pool.end();
    }
}

seedChores(); 