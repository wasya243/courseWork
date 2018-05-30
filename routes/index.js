const schedule = require('./schedule');
const team = require('./team');
const department = require('./department');
const scheduleDetails = require('./scheduleDetails');
const insOuts = require('./insOuts');
const jobTitles = require('./jobTitles');
const employee = require('./employee');
const scheduleExceptions = require('./scheduleExceptions');
const organization = require('./organization');

const applyRoutes = (app) => {
    app.use('/', schedule);
    app.use('/', team);
    app.use('/', department);
    app.use('/', scheduleDetails);
    app.use('/', jobTitles);
    app.use('/', insOuts);
    app.use('/', employee);
    app.use('/', scheduleExceptions);
    app.use('/', organization);
};

module.exports = {
    applyRoutes,
    schedule,
    team,
    department,
    insOuts,
    jobTitles,
    scheduleDetails,
    employee,
    scheduleExceptions,
    organization,
};