const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const HouseholdMember = sequelize.define('household_member', {
        household_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true
        },
        role: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                isIn: {
                    args: [['admin', 'member']],
                    msg: "Role must be either 'admin' or 'member'"
                }
            }
        }
    }, {
        tableName: 'household_members',
        timestamps: false,
        underscored: true
    });

    return HouseholdMember;
}; 