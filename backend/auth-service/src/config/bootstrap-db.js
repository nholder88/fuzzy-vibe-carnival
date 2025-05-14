const { Client } = require('pg');

const dbName = process.env.POSTGRES_DB || 'auth_service';
const config = {
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
    database: 'postgres', // connect to default db to create new one
};

async function ensureDatabase() {
    const client = new Client(config);
    try {
        await client.connect();
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);
        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database "${dbName}" created.`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }
    } catch (err) {
        console.error('Error checking/creating database:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

ensureDatabase(); 