const { Sequelize } = require('sequelize');
const { Client } = require('pg');

const config = {
    development: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'household_dev',
        dialect: 'postgres',
        logging: false
    },
    test: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'homeorganization_test',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false
    },
    production: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
};

const sequelize = new Sequelize(config[process.env.NODE_ENV || 'development']);

async function initializeDatabase() {
    const env = process.env.NODE_ENV || 'development';
    const dbConfig = config[env];

    // Create a client to connect to the default postgres database
    const client = new Client({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.username,
        password: dbConfig.password,
        database: 'postgres'
    });

    try {
        await client.connect();

        // Check if the database exists
        const result = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = '${dbConfig.database}'`
        );

        if (result.rowCount === 0) {
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

    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully');
        return sequelize;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
}

module.exports = {
    config,
    sequelize,
    initializeDatabase
}; 