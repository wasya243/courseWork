module.exports = (sequelize, type) => {
    return sequelize.define('titles', {
        title: {
            type: type.STRING,
            allowNull: false,
        },
        salary_per_hour: {
            type: type.INTEGER,
            allowNull: false,
        }
    },{
        indexes: [
            {
                unique: true,
                fields: ['title']
            }
        ]
    }, {
        underscored: true
    })
};
