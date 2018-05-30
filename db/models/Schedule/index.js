module.exports = (sequelize, type) => {
    return sequelize.define('schedules', {
        name: {
            type: type.STRING,
            allowNull: false,
        }
    }, {
        underscored: true
    })
};
