module.exports = (sequelize, type) => {
    return sequelize.define('insOuts', {
        date: {
            type: type.DATE,
            allowNull: false,
        },
        type: {
            type: type.STRING,
            allowNull: false,
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['employee_id', 'date']
            }
        ]
    }, {
        underscored: true
    })
};