const { Employee, InsOuts, db, ScheduleDetails, Schedule, Team } = require('../../db/models');
const { createReportEntryByEvent, createReportEntriesByRange, remapScheduleObject } = require('../../util');

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


        const schedule = await ScheduleDetails.find({
            where: {
                work_date: day,
            }
        });

        // all records during this day by given user
        const inOutRecords = await InsOuts.findAll({
            where: {
                employee_id: id
            },
            date: {
                $between: [ start, end ]
            }
        });

        const remappedSchedule = remapScheduleObject(schedule);

        // avoid inOutRecords[0] error
        if (inOutRecords.length) {
            return res.send([]);
        }

        // do this steps only if there are more than 0 records
        const fullPairs = inOutRecords.length / 2;
        const lastInRecord = inOutRecords.length % 2;
        let result = [];
        if(fullPairs < 1) {
            // handle single in
            result = result.concat(createReportEntryByEvent(inOutRecords[0], remappedSchedule));
        } else {
            for(let i = 0; i < inOutRecords.length - 1; i+= 2) {
                const inRecord = inOutRecords[i];
                const outRecord =inOutRecords[i + 1];
                result = result.concat(createReportEntriesByRange(inRecord.date, outRecord.date, remappedSchedule));
            }
            // plus handle single in (the last one);
            if (lastInRecord !== 0) {
                result = result.concat(createReportEntryByEvent(inOutRecords[inOutRecords.length - 1], remappedSchedule));
            }
        }

        res.send(result);
    }
    catch(error) {
        next(error);
    }
};

module.exports = {
    employeeStatisticsByDayGET,
    employeeByIdDelete,
    employeeByIdGET,
    employeeListGET,
    employeeUpdateById,
    employeeCreatePOST,
    inOutRecordsByUserIdGET,
};
