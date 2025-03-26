const { Sequelize } = require('sequelize');
const config = require('../config/database');
const { Client } = require('pg');

async function initializeDatabase() {
    const env = process.env.NODE_ENV || 'development';
    const dbConfig = config[env];

    // Connect to postgres to create database if it doesn't exist
    const client = new Client({
        user: dbConfig.username,
        password: dbConfig.password,
        host: dbConfig.host,
        port: dbConfig.port,
        database: 'postgres' // Connect to default postgres database
    });

    try {
        await client.connect();

        // Check if database exists
        const checkDb = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = '${dbConfig.database}'`
        );

        if (checkDb.rows.length === 0) {
            console.log(`Database ${dbConfig.database} does not exist. Creating...`);
            // Create the database
            await client.query(`CREATE DATABASE ${dbConfig.database}`);
            console.log(`Database ${dbConfig.database} created successfully`);
        } else {
            console.log(`Database ${dbConfig.database} already exists`);
        }
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    } finally {
        await client.end();
    }

    // Initialize Sequelize connection
    const sequelize = new Sequelize(dbConfig);
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully');

        // Sync all models
        await sequelize.sync();
        console.log('Database models synchronized successfully');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
}

module.exports = initializeDatabase; 