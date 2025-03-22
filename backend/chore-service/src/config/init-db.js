const fs = require('fs');
const path = require('path');
const { pool } = require('./database');

/**
 * Initialize the database with required schema
 */
async function initializeDatabase() {
    try {
        console.log('Initializing database...');

        // Read the schema SQL file
        const schemaPath = path.join(__dirname, '..', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Execute the schema SQL
        await pool.query(schemaSql);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

module.exports = { initializeDatabase }; 