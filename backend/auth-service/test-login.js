const { Client } = require('pg');

async function testUsers() {
    const client = new Client({
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DB || 'auth_service',
    });

    try {
        await client.connect();
        console.log('Connected to database');

        // Update users with householdId = '1'
        await client.query('UPDATE users SET "householdId" = $1 WHERE email IN ($2, $3)', ['1', 'test@example.com', 'admin@example.com']);
        console.log('Updated users with householdId = 1');

        // Verify the changes
        const result = await client.query('SELECT id, email, "firstName", "lastName", "isVerified", "householdId" FROM users');
        console.log('Users in database:');
        console.log(result.rows);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

testUsers(); 