const { Schedule, ScheduleDetails } = require('../../db/models');

const scheduleListGET = async (req, res, next) => {
    try {
        const scheduleList = await Schedule.findAll();
        res.send(scheduleList);
    } catch (error) {
        next(error);
    }
};

const scheduleCreatePOST = async (req, res, next) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.send(schedule);
  } catch(error) {
      next(error);
  }
};

const scheduleByIdGET = async (req, res, next) => {
    try {
        const { id } = req.params;
        const schedule = await Schedule.findById(id);
        schedule ? res.send(schedule) : next();
    } catch (error) {
        next(error);
    }
};

const scheduleUpdateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [ affectedCount, affectedRows ]= await Schedule.update(req.body, { where: { id } });
        if(affectedCount < 1) {
            return next();
        }
        const updatedSchedule = await Schedule.findById(id);
        res.send(updatedSchedule);
    } catch (error) {
        next(error);
    }
};

const scheduleByIdDelete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [ affectedCount, affectedRows ]= await Schedule.update(req.body, { where: { id } });
        if(affectedCount < 1) {
            return next();
        }
        const updatedSchedule = await Schedule.findById(id);
        res.send(updatedSchedule);
    } catch (error) {
        next(error);
    }
};

const scheduleDetailsGET = async (req, res, next) => {
    // it should have better error handling: bad date and so on...
    try {
        const { id } = req.params;
        let { start, end } = req.query;

        start = start && start.split('-').join(' ');
        end = end && end.split('-').join(' ');

        const work_date = (start && end) ? { $between: [new Date(start), new Date(end)] } : null;

        const scheduleDetailsList = await ScheduleDetails.findAll({
            where: {
                schedule_id: id,
                work_date
            }
        });
        res.send(scheduleDetailsList);
    } catch(error) {
        next(error);
    }
};

module.exports = {
    scheduleDetailsGET,
    scheduleByIdDelete,
    scheduleByIdGET,
    scheduleListGET,
    scheduleUpdateById,
    scheduleCreatePOST,
};
