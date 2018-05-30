module.exports = (sequelize, type) => {
    return sequelize.define('scheduleDetails', {
        work_date: {
            type: type.DATE,
            allowNull: false,
        },
        start_work_hour: {
            type: type.INTEGER,
            allowNull: false,
        },
        end_work_hour: {
            type: type.INTEGER,
            allowNull: false,
        },
        start_break_hour: {
            type: type.INTEGER,
            allowNull: false,
        },
        end_break_hour: {
            type: type.INTEGER,
            allowNull: false,
        },
        is_holiday: {
            type: type.BOOLEAN,
            defaultValue: false,
        },
        is_weekend: {
            type: type.BOOLEAN,
            defaultValue: false,
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['schedule_id', 'work_date']
            }
        ]
    }, {
        underscored: true
    })
};