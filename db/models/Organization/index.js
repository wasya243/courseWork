module.exports = (sequelize, type) => {
    return sequelize.define('organizations', {
        name: {
            type: type.STRING,
            allowNull: false,
        }
    }, {
        underscored: true
    })
};
