module.exports = (sequelize, type) => {
    return sequelize.define('employees', {
        first_name: {
            type: type.STRING,
            allowNull: false,
        },
        last_name: {
            type: type.STRING,
            allowNull: false,
        },
        date_birth: {
            type: type.DATE,
            allowNull: false,
        },
    }, {
        underscored: true
    });
};
