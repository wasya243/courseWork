const { Employee, InsOuts, db, ScheduleDetails, Schedule, Team, ScheduleExceptions } = require('../../db/models');
const {
    createRecord,
    getControlPoints,
    getRangeNameByTime,
    getReportByMultipleRecords,
    getReportBySingleRecord,
    processReports,
    getControlPointsBySingleRecord,
    remapScheduleObject,
} = require('../../util');

const employeeListGET = async (req, res, next) => {
    try {
        const employeeList = await Employee.findAll();
        res.send(employeeList);
    } catch (error) {
        next(error);
    }
};

const employeeCreatePOST = async (req, res, next) => {
    try {
        const employee = await Employee.create(req.body);
        res.send(employee);
    } catch(error) {
        next(error);
    }
};

const employeeByIdGET = async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT *
            FROM employees
            JOIN titles on employees.title_id=titles.id
            WHERE employees.id=${id}
        `;
        const [results, metadata] = await db.query(query);
        res.send(results);
    } catch (error) {
        next(error);
    }
};

const employeeUpdateById = async (req, res, next) => {
    try {
         const { id } = req.params;
         const [ affectedCount, affectedRows ]= await Employee.update(req.body, { where: { id } });
         if(affectedCount < 1) {
             return next();
         }
         const updatedEmployee = await Employee.findById(id);
         res.send(updatedEmployee);
    } catch (error) {
        next(error);
    }
};

const employeeByIdDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const employeeToDelete = await Employee.findById(id);
        if(!employeeToDelete) {
            return next();
        }
        await employeeToDelete.destroy();
        res.send(employeeToDelete);
    }
    catch(error) {
        next(error);
    }
};

const inOutRecordsByUserIdGET = async (req, res, next) => {
  try {
      const { id } = req.params;
      const listOfInOutRecords = await InsOuts.findAll({
          where: { employee_id: id }
      });
      res.send(listOfInOutRecords);
  } catch(error) {
      next(error);
  }
};

//I should think about a better name for this method, 'cause user id gets passed along with day
const employeeStatisticsByDayGET = async (req, res, next) => {
    // it should have better error handling: bad date and so on...
    try {
        const { id } = req.params;
        let { day } = req.query;

        day = day && day.split('-').join(' ');
        day = day && new Date(day);

        // to find all entries that falls within this day
        const start = new Date(`${day} 00:00:00`);
        const end = new Date(`${day} 23:59:59`);

        const employee = await Employee.find({
            where: {
                id,
            }
        });

        const team = await Team.find({
            where: {
                id: employee.team_id,
            }
        });

        const schedule = await Schedule.find({
            where: {
                id: team.schedule_id,
            }
        });

        let scheduleDetails = await ScheduleDetails.find({
            where: {
                schedule_id: schedule.id,
                work_date: day,
            }
        });

        const scheduleExceptions = await ScheduleExceptions.find({
            where: {
                employee_id: id,
                schedule_details_id: scheduleDetails.id,
                work_date: day,
            }
        });

        // check if we found something
        if(scheduleExceptions) {
            scheduleDetails = scheduleExceptions;
        }

        // all records during this day by given user
        const inOutRecords = await InsOuts.findAll({
            where: {
                employee_id: id
            },
            date: {
                $between: [ start, end ]
            }
        });

        const remappedSchedule = remapScheduleObject(scheduleDetails);

        // avoid inOutRecords[0] error
        if (inOutRecords.length === 0) {
            return res.send([]);
        }

        // do this steps only if there are more than 0 records

        let result = [];

        if(inOutRecords.length === 1) {
            result = getReportBySingleRecord(inOutRecords[0], getControlPointsBySingleRecord, getRangeNameByTime, createRecord, remappedSchedule);
        } else {
            // a little bit of magic
            result = getReportByMultipleRecords(inOutRecords, getControlPoints, getRangeNameByTime, createRecord, remappedSchedule);
            result.notAbscenceRanges = processReports(result.notAbscenceRanges, createRecord, 'DailyBreak', remappedSchedule);
        }

        res.send(result);
    }
    catch(error) {
        next(error);
    }
};

const employeeCurrentStatusGET = async (req, res, next) => {
    try {
        const { id } = req.params;
        //find a better way to do this
        const currentDate = new Date();
        const currentYear = currentDate.getUTCFullYear();
        const currentMonth = currentDate.getUTCMonth() + 1;
        const currentDay = currentDate.getUTCDate();

        //find a better way to do this
        const start = new Date(`${currentYear} ${currentMonth} ${currentDay} 00:00:00`);
        const end = new Date(`${currentYear} ${currentMonth} ${currentDay} 23:59:59`);

        const inOutRecords = await InsOuts.findAll({
            where: {
                employee_id: id,
                date: {
                    $between: [ start, end ]
                }
            },

        });

        //I had not time, so in future is should be done in more good looking way
        let status = {};

        if(inOutRecords.length === 0) {
            status.message = 'Not At Work'
        } else {
            const lastEntry = inOutRecords[0];
            lastEntry.type === 'In'
                ? status.message = 'At work'
                : status.message = 'Not At Work';
        }

        res.send(status);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    employeeCurrentStatusGET,
    employeeStatisticsByDayGET,
    employeeByIdDelete,
    employeeByIdGET,
    employeeListGET,
    employeeUpdateById,
    employeeCreatePOST,
    inOutRecordsByUserIdGET,
};
