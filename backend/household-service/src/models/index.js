const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;
const dbName = process.env.DB_NAME || 'homeorganization';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Import models
const Household = require('./household')(sequelize);
const HouseholdMember = require('./householdMember')(sequelize);

// Define associations
Household.hasMany(HouseholdMember, { foreignKey: 'household_id' });
HouseholdMember.belongsTo(Household, { foreignKey: 'household_id' });

module.exports = {
    sequelize,
    Household,
    HouseholdMember
}; 