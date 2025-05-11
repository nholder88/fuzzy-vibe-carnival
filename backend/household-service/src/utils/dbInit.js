const { Client } = require('pg');
const { Sequelize } = require('sequelize');
const config = process.env.NODE_ENV === 'test'
    ? require('../config/test')
    : require('../config/database');

async function initializeDatabase() {
    // Create a client to connect to the default postgres database
    const client = new Client({
        host: config.host,
        port: config.port,
        user: config.username,
        password: config.password,
        database: 'postgres'
    });

    try {
        await client.connect();

        // Check if the database exists
        const result = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = '${config.database}'`
        );

        if (result.rowCount === 0) {
            // Create the database
            await client.query(`CREATE DATABASE ${config.database}`);
            console.log(`Database ${config.database} created successfully`);
        } else {
            console.log(`Database ${config.database} already exists`);
        }
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    } finally {
        await client.end();
    }

    // Initialize Sequelize connection
    const sequelize = new Sequelize(config);
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully');
        return sequelize;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
}

module.exports = initializeDatabase; 