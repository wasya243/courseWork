const Sequelize = require('sequelize');

const ScheduleModel = require('./Schedule');
const DepartmentModel = require('./Department');
const ScheduleDetailsModel = require('./ScheduleDetails');
const EmployeeModel = require('./Employee');
const JobTitleModel = require('./Titles');
const InsOutsModel = require('./InsOuts');
const OrganizationModel = require('./Organization');

const { DatabaseManager } = require('../database-manager');

//---should-reside-within-env-variables-->
const DATABASE_NAME = 'todos-dev';
const USERNAME = 'postgres';
const DIALECT = 'postgres';
const DB_PASSWORD = 'armagedon123456';
const HOST = '127.0.0.1';
//--------------------------------------->

const db = new DatabaseManager(DATABASE_NAME, USERNAME, DB_PASSWORD, HOST, DIALECT).connect();

const Department = DepartmentModel(db, Sequelize);
const Schedule = ScheduleModel(db, Sequelize);
const ScheduleDetails = ScheduleDetailsModel(db, Sequelize);
const Employee = EmployeeModel(db, Sequelize);
const JobTitle = JobTitleModel(db, Sequelize);
const InsOuts = InsOutsModel(db, Sequelize);
const Organization = OrganizationModel(db, Sequelize);

//---through-model---------------------->
const Team = db.define('teams', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});
//-------------------------------------->

//---through-model---------------------->
const PersonalSchedules = db.define('personalSchedules', {}, {
    indexes: [
        {
            unique: true,
            fields: ['employee_id']
        }
    ]
}, {
    underscored: true
});
//-------------------------------------->

//---through-model---------------------->
const ScheduleExceptions = db.define('scheduleExceptions', {
    work_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    start_work_hour: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    end_work_hour: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    start_break_hour: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    end_break_hour: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    is_holiday: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    is_weekend: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    is_vacation: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    is_absence: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    is_change_of_schedule: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }
}, {
        indexes: [
            {
                unique: true,
                fields: ['employee_id', 'schedule_details_id']
            }
        ]
    }, {
    underscored: true
});
//-------------------------------------->

//---define-associations---------------->
// Department.belongsToMany(Schedule, { through: { model: Team, unique: false, allowNull: false }, onDelete: 'CASCADE' });
// Schedule.belongsToMany(Department, { through: { model: Team, unique: false, allowNull: true } });
// i wrote this way instead of what you can see above as it is the only way to allow null values for foreign key
Department.hasMany(Team, { foreignKey: { name: 'department_id', allowNull: false }, onDelete: 'CASCADE' });
Team.belongsTo(Schedule, { foreignKey: { name: 'schedule_id' } });
Schedule.hasMany(PersonalSchedules, { foreignKey: { name: 'schedule_id', allowNull: false } });
PersonalSchedules.belongsTo(Employee, { foreignKey: { name: 'employee_id', allowNull: false } });
Schedule.hasMany(Team, { foreignKey: { name: 'schedule_id' } });
//--i-am-not-sure-about-on-cascade
Schedule.hasMany(ScheduleDetails, { foreignKey: { name: 'schedule_id', allowNull: false }, onDelete: 'CASCADE' } );
ScheduleDetails.belongsTo(Schedule, { foreignKey: { name: 'schedule_id' } });
Team.hasMany(Employee, { foreignKey: { name: 'team_id', allowNull: false }, onDelete: 'CASCADE' });
Employee.belongsTo(Team);
//--i-am-not-sure-about-on-cascade
JobTitle.hasMany(Employee, { foreignKey: { name: 'title_id', allowNull: false }, onDelete: 'CASCADE' } );
Employee.belongsTo(JobTitle, { foreignKey: { name: 'title_id' } });
Employee.hasMany(InsOuts, { foreignKey: { name: 'employee_id',  allowNull: false }, onDelete: 'CASCADE' } );
InsOuts.belongsTo(Employee, { foreignKey: { name: 'employee_id' } });
ScheduleDetails.belongsToMany(Employee, {
    through: { model: ScheduleExceptions },
    foreignKey: 'employee_id',
});
Employee.belongsToMany(ScheduleDetails,
    { through: { model: ScheduleExceptions },
    foreignKey: 'schedule_details_id',
});
Organization.hasMany(Department, { foreignKey: { name: 'organization_id', allowNull: false }, onDelete: 'CASCADE' });
Department.belongsTo(Organization, { foreignKey: { name: 'organization_id' } });
//-------------------------------------->

db.sync({ force: false })
    .then(() => {
        console.log(`Database & tables created!`);
    })
    .catch(error => {
        console.error(`Error while creating tables ${error}`);
    });

module.exports = {
    PersonalSchedules,
    Department,
    Schedule,
    Team,
    ScheduleDetails,
    Employee,
    JobTitle,
    InsOuts,
    ScheduleExceptions,
    Organization,
    db,
};


